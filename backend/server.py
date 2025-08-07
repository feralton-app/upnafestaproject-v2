from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from sqlalchemy.orm import Session
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime

# Import database models and services
from database import get_db, create_tables, GoogleConfig, Client, Album, GoogleToken, Notification
from google_drive_service import GoogleDriveService, get_redirect_uris_info

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection (mantendo compatibilidade)
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    try:
        create_tables()
        print("Tabelas do banco criadas com sucesso!")
    except Exception as e:
        print(f"Erro ao criar tabelas: {e}")

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Google Config Models
class GoogleConfigCreate(BaseModel):
    client_id: str
    client_secret: str

class GoogleConfigResponse(BaseModel):
    id: str
    client_id: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Client Models
class ClientCreate(BaseModel):
    name: str
    email: str
    album_limit: int = 1

class ClientResponse(BaseModel):
    id: str
    name: str
    email: str
    status: str
    album_limit: int
    enabled: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Album Models
class AlbumCreate(BaseModel):
    name: str
    event_date: datetime

class AlbumUpdate(BaseModel):
    name: Optional[str] = None
    event_date: Optional[datetime] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    main_photo: Optional[str] = None
    welcome_message: Optional[str] = None
    thank_you_message: Optional[str] = None

class AlbumResponse(BaseModel):
    id: str
    name: str
    event_date: datetime
    status: str
    google_folder_id: Optional[str]
    primary_color: str
    secondary_color: str
    main_photo: Optional[str]
    welcome_message: Optional[str]
    thank_you_message: Optional[str]
    
    class Config:
        from_attributes = True

# Original routes (mantendo compatibilidade)
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Google Cloud API Configuration (Admin only)
@api_router.post("/admin/google-config", response_model=GoogleConfigResponse)
async def create_google_config(config: GoogleConfigCreate, db_session: Session = Depends(get_db)):
    # Desativar configuração anterior
    db_session.query(GoogleConfig).filter(GoogleConfig.is_active == True).update({'is_active': False})
    
    # URL de callback fixa da aplicação (URL pública)
    base_url = os.environ.get('REACT_APP_BACKEND_URL', 'https://534474ce-4a60-4c82-af75-b8c427671bfd.preview.emergentagent.com')
    callback_url = f"{base_url}/api/auth/google/callback"
    
    # Criar nova configuração
    new_config = GoogleConfig(
        id=str(uuid.uuid4()),
        client_id=config.client_id,
        client_secret=config.client_secret,
        redirect_uri=callback_url,  # URL pública da aplicação
        is_active=True
    )
    
    db_session.add(new_config)
    db_session.commit()
    db_session.refresh(new_config)
    
    return new_config

@api_router.get("/admin/google-config", response_model=Optional[GoogleConfigResponse])
async def get_google_config(db_session: Session = Depends(get_db)):
    config = db_session.query(GoogleConfig).filter(GoogleConfig.is_active == True).first()
    return config

@api_router.get("/admin/google-redirect-uris")
async def get_google_redirect_uris():
    # Usar a URL pública da aplicação, não localhost
    base_url = os.environ.get('REACT_APP_BACKEND_URL', 'https://534474ce-4a60-4c82-af75-b8c427671bfd.preview.emergentagent.com')
    callback_url = f"{base_url}/api/auth/google/callback"
    
    return {
        "message": "Configure esta URL no Google Cloud Console",
        "callback_url": callback_url,
        "instructions": [
            "1. Acesse https://console.cloud.google.com/",
            "2. Selecione seu projeto UpnaFesta",
            "3. Vá para APIs & Services > Credentials", 
            "4. Edite suas credenciais OAuth 2.0",
            "5. Em 'Authorized redirect URIs', adicione:",
            f"   {callback_url}",
            "6. Salve as alterações"
        ]
    }

# Client Management
@api_router.post("/admin/clients", response_model=ClientResponse)
async def create_client(client_data: ClientCreate, db_session: Session = Depends(get_db)):
    new_client = Client(
        id=str(uuid.uuid4()),
        name=client_data.name,
        email=client_data.email,
        album_limit=client_data.album_limit,
        status='pending_payment',
        enabled=True
    )
    
    db_session.add(new_client)
    
    # Criar notificação
    notification = Notification(
        id=str(uuid.uuid4()),
        client_id=new_client.id,
        title='Conta Criada - Pagamento Necessário',
        message='Sua conta foi criada! Para ativá-la, realize o pagamento de R$ 99,90.',
        type='warning'
    )
    
    db_session.add(notification)
    db_session.commit()
    db_session.refresh(new_client)
    
    return new_client

@api_router.get("/admin/clients", response_model=List[ClientResponse])
async def get_all_clients(db_session: Session = Depends(get_db)):
    clients = db_session.query(Client).all()
    return clients

@api_router.get("/clients/{client_id}", response_model=ClientResponse)
async def get_client(client_id: str, db_session: Session = Depends(get_db)):
    client = db_session.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return client

# Album Management
@api_router.post("/clients/{client_id}/albums", response_model=AlbumResponse)
async def create_album(client_id: str, album_data: AlbumCreate, db_session: Session = Depends(get_db)):
    client = db_session.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    
    if client.status != 'approved':
        raise HTTPException(status_code=400, detail="Cliente precisa ter pagamento aprovado")
    
    # Verificar limite de álbuns
    album_count = db_session.query(Album).filter(Album.client_id == client_id).count()
    if album_count >= client.album_limit:
        raise HTTPException(status_code=400, detail="Limite de álbuns atingido")
    
    new_album = Album(
        id=str(uuid.uuid4()),
        client_id=client_id,
        name=album_data.name,
        event_date=album_data.event_date,
        status='inactive'
    )
    
    db_session.add(new_album)
    db_session.commit()
    db_session.refresh(new_album)
    
    return new_album

@api_router.get("/clients/{client_id}/albums", response_model=List[AlbumResponse])
async def get_client_albums(client_id: str, db_session: Session = Depends(get_db)):
    albums = db_session.query(Album).filter(Album.client_id == client_id).all()
    return albums

@api_router.put("/clients/{client_id}/albums/{album_id}", response_model=AlbumResponse)
async def update_album(client_id: str, album_id: str, album_data: AlbumUpdate, db_session: Session = Depends(get_db)):
    album = db_session.query(Album).filter(
        Album.id == album_id,
        Album.client_id == client_id
    ).first()
    
    if not album:
        raise HTTPException(status_code=404, detail="Álbum não encontrado")
    
    # Atualizar campos fornecidos
    for field, value in album_data.dict(exclude_unset=True).items():
        setattr(album, field, value)
    
    album.updated_at = datetime.utcnow()
    db_session.commit()
    db_session.refresh(album)
    
    return album

# Google Drive Integration
@api_router.get("/auth/google/authorize/{client_id}")
async def google_authorize(client_id: str, db_session: Session = Depends(get_db)):
    client = db_session.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    
    drive_service = GoogleDriveService(db_session)
    
    try:
        # URL fixa de callback da aplicação
        base_url = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
        redirect_uri = f"{base_url}/api/auth/google/callback"
        
        auth_url, state = drive_service.get_authorization_url(client_id, redirect_uri)
        return {"auth_url": auth_url, "state": state}
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/auth/google/callback")
async def google_callback(code: str, state: str, db_session: Session = Depends(get_db)):
    drive_service = GoogleDriveService(db_session)
    
    try:
        # URL fixa de callback da aplicação
        base_url = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
        redirect_uri = f"{base_url}/api/auth/google/callback"
        
        token = drive_service.handle_oauth_callback(code, state, redirect_uri)
        
        # Redirecionar de volta para o frontend com sucesso
        client_id = state.replace('client_id:', '')
        frontend_url = base_url.replace('/api', '') if '/api' in base_url else base_url
        return RedirectResponse(f"{frontend_url}/client/{client_id}?google_connected=true")
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.delete("/clients/{client_id}/google-connection")
async def disconnect_google(client_id: str, db_session: Session = Depends(get_db)):
    drive_service = GoogleDriveService(db_session)
    success = drive_service.disconnect_client(client_id)
    
    if not success:
        raise HTTPException(status_code=400, detail="Falha ao desconectar Google Drive")
    
    return {"message": "Google Drive desconectado com sucesso"}

# File Upload for guests
@api_router.post("/albums/{album_id}/upload")
async def upload_file_to_album(
    album_id: str,
    file: UploadFile = File(...),
    guest_name: str = Form(...),
    comment: Optional[str] = Form(None),
    db_session: Session = Depends(get_db)
):
    album = db_session.query(Album).filter(Album.id == album_id).first()
    if not album:
        raise HTTPException(status_code=404, detail="Álbum não encontrado")
    
    if album.status != 'active':
        raise HTTPException(status_code=400, detail="Álbum não está ativo")
    
    drive_service = GoogleDriveService(db_session)
    
    try:
        # Ler conteúdo do arquivo
        file_content = await file.read()
        
        # Fazer upload para Google Drive
        folder_id = album.google_folder_id
        google_file_id = drive_service.upload_file(
            album.client_id,
            folder_id,
            file_content,
            file.filename,
            file.content_type
        )
        
        if not google_file_id:
            raise HTTPException(status_code=500, detail="Falha no upload para Google Drive")
        
        # Registrar upload no banco
        from database import Upload
        upload_record = Upload(
            id=str(uuid.uuid4()),
            album_id=album_id,
            filename=file.filename,
            google_file_id=google_file_id,
            uploaded_by=guest_name,
            upload_comment=comment,
            file_size=f"{len(file_content) / (1024*1024):.2f} MB",
            mime_type=file.content_type
        )
        
        db_session.add(upload_record)
        db_session.commit()
        
        return {"message": "Upload realizado com sucesso", "file_id": google_file_id}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no upload: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
