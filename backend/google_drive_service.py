from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from googleapiclient.errors import HttpError
from google.auth.transport.requests import Request
from sqlalchemy.orm import Session
from database import GoogleConfig, GoogleToken, get_db
import uuid
import json
from datetime import datetime, timedelta
import os
from io import BytesIO
from typing import Optional, Dict, Any

class GoogleDriveService:
    def __init__(self, db: Session):
        self.db = db
        self.scopes = [
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/userinfo.email',
            'openid'
        ]
    
    def get_google_config(self) -> Optional[GoogleConfig]:
        """Obtém a configuração ativa do Google Cloud API"""
        return self.db.query(GoogleConfig).filter(
            GoogleConfig.is_active == True
        ).first()
    
    def create_oauth_flow(self, redirect_uri: str) -> Flow:
        """Cria o fluxo OAuth2 para autenticação"""
        config = self.get_google_config()
        if not config:
            raise ValueError("Google Cloud API não configurada. Configure no painel administrativo.")
        
        client_config = {
            "web": {
                "client_id": config.client_id,
                "client_secret": config.client_secret,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token"
            }
        }
        
        flow = Flow.from_client_config(
            client_config,
            scopes=self.scopes
        )
        flow.redirect_uri = redirect_uri
        return flow
    
    def get_authorization_url(self, client_id: str, redirect_uri: str) -> tuple[str, str]:
        """Gera URL de autorização OAuth2"""
        flow = self.create_oauth_flow(redirect_uri)
        
        # Incluir client_id no state para identificar o cliente após callback
        state = f"client_id:{client_id}"
        
        auth_url, state_token = flow.authorization_url(
            prompt='consent',
            state=state,
            access_type='offline'
        )
        
        return auth_url, state_token
    
    def handle_oauth_callback(self, code: str, state: str, redirect_uri: str) -> GoogleToken:
        """Processa o callback do OAuth2 e salva os tokens"""
        # Extrair client_id do state
        if not state.startswith('client_id:'):
            raise ValueError("State inválido no callback OAuth")
        
        client_id = state.replace('client_id:', '')
        
        flow = self.create_oauth_flow(redirect_uri)
        flow.fetch_token(code=code)
        
        credentials = flow.credentials
        
        # Obter email do usuário de forma mais simples
        google_email = None
        try:
            # Tentar obter informações do usuário
            service = build('oauth2', 'v2', credentials=credentials)
            user_info = service.userinfo().get().execute()
            google_email = user_info.get('email')
        except Exception as e:
            print(f"Aviso: Não foi possível obter email do usuário: {e}")
            # Continuar sem o email - não é crítico
            google_email = "email_nao_disponivel@example.com"
        
        # Desativar tokens anteriores do cliente
        self.db.query(GoogleToken).filter(
            GoogleToken.client_id == client_id,
            GoogleToken.is_active == True
        ).update({'is_active': False})
        
        # Salvar novo token
        token_data = GoogleToken(
            id=str(uuid.uuid4()),
            client_id=client_id,
            access_token=credentials.token,
            refresh_token=credentials.refresh_token,
            token_uri=credentials.token_uri,
            scopes=json.dumps(list(credentials.scopes)),
            expires_at=credentials.expiry,
            google_email=google_email,
            is_active=True
        )
        
        self.db.add(token_data)
        self.db.commit()
        self.db.refresh(token_data)
        
        return token_data
    
    def get_client_credentials(self, client_id: str) -> Optional[Credentials]:
        """Obtém credenciais válidas para um cliente"""
        token_data = self.db.query(GoogleToken).filter(
            GoogleToken.client_id == client_id,
            GoogleToken.is_active == True
        ).first()
        
        if not token_data:
            return None
        
        # Criar credenciais do Google
        credentials_info = {
            'token': token_data.access_token,
            'refresh_token': token_data.refresh_token,
            'token_uri': token_data.token_uri,
            'scopes': json.loads(token_data.scopes)
        }
        
        config = self.get_google_config()
        if config:
            credentials_info['client_id'] = config.client_id
            credentials_info['client_secret'] = config.client_secret
        
        credentials = Credentials.from_authorized_user_info(credentials_info)
        
        # Renovar token se necessário
        if not credentials.valid and credentials.refresh_token:
            credentials.refresh(Request())
            
            # Atualizar token no banco
            token_data.access_token = credentials.token
            if credentials.expiry:
                token_data.expires_at = credentials.expiry
            token_data.updated_at = datetime.utcnow()
            self.db.commit()
        
        return credentials if credentials.valid else None
    
    def create_album_folder(self, client_id: str, album_name: str, event_date: str) -> Optional[str]:
        """Cria uma pasta no Google Drive para o álbum"""
        credentials = self.get_client_credentials(client_id)
        if not credentials:
            raise ValueError("Cliente não tem Google Drive conectado")
        
        try:
            service = build('drive', 'v3', credentials=credentials)
            
            folder_name = f"{album_name} - {event_date}"
            folder_metadata = {
                'name': folder_name,
                'mimeType': 'application/vnd.google-apps.folder'
            }
            
            folder = service.files().create(body=folder_metadata, fields="id,name").execute()
            return folder.get('id')
            
        except HttpError as error:
            print(f"Erro ao criar pasta: {error}")
            return None
    
    def upload_file(self, client_id: str, folder_id: str, file_content: bytes, 
                   filename: str, mime_type: str) -> Optional[str]:
        """Faz upload de um arquivo para o Google Drive"""
        credentials = self.get_client_credentials(client_id)
        if not credentials:
            raise ValueError("Cliente não tem Google Drive conectado")
        
        try:
            service = build('drive', 'v3', credentials=credentials)
            
            # Se folder_id estiver vazio, criar pasta automaticamente
            if not folder_id or folder_id.strip() == '':
                print("DEBUG: Folder ID vazio, criando pasta automaticamente...")
                folder_id = self.create_album_folder(client_id, "UpnaFesta", "Album")
                if not folder_id:
                    raise ValueError("Falha ao criar pasta automaticamente")
                print(f"DEBUG: Pasta criada automaticamente com ID: {folder_id}")
            
            file_metadata = {
                'name': filename,
                'parents': [folder_id] if folder_id else []
            }
            
            media = MediaIoBaseUpload(
                BytesIO(file_content),
                mimetype=mime_type,
                resumable=True
            )
            
            print(f"DEBUG: Tentando upload - filename: {filename}, folder_id: {folder_id}")
            
            file = service.files().create(
                body=file_metadata,
                media_body=media,
                fields="id,name,size"
            ).execute()
            
            print(f"DEBUG: Upload sucesso - file_id: {file.get('id')}")
            return file.get('id')
            
        except HttpError as error:
            print(f"ERROR: Erro HTTP no upload: {error}")
            print(f"ERROR: Status code: {error.resp.status}")
            print(f"ERROR: Reason: {error.resp.reason}")
            raise error
        except Exception as error:
            print(f"ERROR: Erro geral no upload: {error}")
            raise error
    
    def disconnect_client(self, client_id: str) -> bool:
        """Desconecta o Google Drive de um cliente"""
        try:
            # Desativar todos os tokens do cliente
            updated = self.db.query(GoogleToken).filter(
                GoogleToken.client_id == client_id,
                GoogleToken.is_active == True
            ).update({'is_active': False, 'updated_at': datetime.utcnow()})
            
            self.db.commit()
            return updated > 0
            
        except Exception as error:
            print(f"Erro ao desconectar: {error}")
            self.db.rollback()
            return False

def get_redirect_uris_info() -> Dict[str, Any]:
    """Retorna informações sobre URIs de redirecionamento para configurar no Google Cloud Console"""
    base_url = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
    
    return {
        "message": "Configure estas URIs no Google Cloud Console",
        "authorized_redirect_uris": [
            f"{base_url}/api/auth/google/callback",
            f"{base_url}/api/auth/google/callback/",
            "http://localhost:3000/client/google-callback",  # Para desenvolvimento
            "https://seu-dominio.com/client/google-callback"  # Para produção
        ],
        "authorized_javascript_origins": [
            base_url.replace('/api', ''),
            "http://localhost:3000",  # Para desenvolvimento
            "https://seu-dominio.com"  # Para produção
        ],
        "instructions": [
            "1. Acesse https://console.cloud.google.com/",
            "2. Selecione seu projeto UpnaFesta",
            "3. Vá para APIs & Services > Credentials",
            "4. Edite suas credenciais OAuth 2.0",
            "5. Adicione as URIs listadas acima em 'Authorized redirect URIs'",
            "6. Adicione os origins em 'Authorized JavaScript origins'",
            "7. Salve as alterações"
        ]
    }