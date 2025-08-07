from sqlalchemy import create_engine, Column, String, DateTime, Boolean, Text, Integer, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.dialects.mysql import LONGTEXT
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DATABASE_URL = os.environ.get('DATABASE_URL', 'mysql+pymysql://root:password@localhost:3306/upnafesta')

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class GoogleConfig(Base):
    """Armazena as configurações do Google Cloud API (configurado pelo admin)"""
    __tablename__ = "google_configs"
    
    id = Column(String(36), primary_key=True)  # UUID
    client_id = Column(String(255), nullable=False)
    client_secret = Column(Text, nullable=False)
    redirect_uri = Column(String(500), nullable=False)
    scopes = Column(Text, default='https://www.googleapis.com/auth/drive.file')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)

class Client(Base):
    """Clientes/usuários da plataforma"""
    __tablename__ = "clients"
    
    id = Column(String(36), primary_key=True)  # UUID
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    status = Column(String(50), default='pending_payment')  # pending_payment, payment_sent, approved, rejected
    album_limit = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    payment_date = Column(DateTime, nullable=True)
    approval_date = Column(DateTime, nullable=True)
    enabled = Column(Boolean, default=True)
    payment_status = Column(String(50), default='pending')  # pending, confirmed, rejected
    
    # Relationships
    albums = relationship("Album", back_populates="client")
    google_tokens = relationship("GoogleToken", back_populates="client")
    notifications = relationship("Notification", back_populates="client")

class Album(Base):
    """Álbuns dos clientes"""
    __tablename__ = "albums"
    
    id = Column(String(36), primary_key=True)  # UUID
    client_id = Column(String(36), ForeignKey('clients.id'), nullable=False)
    name = Column(String(255), nullable=False)
    event_date = Column(DateTime, nullable=False)
    status = Column(String(50), default='inactive')  # inactive, active
    google_folder_id = Column(String(255), nullable=True)
    
    # Customization
    primary_color = Column(String(7), default='#8B4513')
    secondary_color = Column(String(7), default='#DEB887')
    main_photo = Column(String(500), nullable=True)
    welcome_message = Column(Text, nullable=True)
    thank_you_message = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    client = relationship("Client", back_populates="albums")
    uploads = relationship("Upload", back_populates="album")

class GoogleToken(Base):
    """Tokens OAuth2 dos clientes para Google Drive"""
    __tablename__ = "google_tokens"
    
    id = Column(String(36), primary_key=True)  # UUID
    client_id = Column(String(36), ForeignKey('clients.id'), nullable=False)
    access_token = Column(LONGTEXT, nullable=False)
    refresh_token = Column(LONGTEXT, nullable=True)
    token_uri = Column(String(500), default='https://oauth2.googleapis.com/token')
    scopes = Column(Text, nullable=False)
    expires_at = Column(DateTime, nullable=True)
    google_email = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    client = relationship("Client", back_populates="google_tokens")

class Upload(Base):
    """Uploads de arquivos pelos convidados"""
    __tablename__ = "uploads"
    
    id = Column(String(36), primary_key=True)  # UUID
    album_id = Column(String(36), ForeignKey('albums.id'), nullable=False)
    filename = Column(String(255), nullable=False)
    google_file_id = Column(String(255), nullable=True)  # ID do arquivo no Google Drive
    uploaded_by = Column(String(255), nullable=False)  # Nome do convidado
    upload_comment = Column(Text, nullable=True)
    file_size = Column(String(50), nullable=True)
    mime_type = Column(String(100), nullable=True)
    
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    album = relationship("Album", back_populates="uploads")

class Notification(Base):
    """Notificações para os clientes"""
    __tablename__ = "notifications"
    
    id = Column(String(36), primary_key=True)  # UUID
    client_id = Column(String(36), ForeignKey('clients.id'), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default='info')  # info, success, warning, error
    read = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    client = relationship("Client", back_populates="notifications")

def get_db():
    """Dependency para obter sessão do banco de dados"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Função para criar as tabelas
def create_tables():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_tables()
    print("Tabelas criadas com sucesso!")