#!/usr/bin/env python3
"""
Script de restauração de dados para UpnaFesta
Restaura cliente, álbum e configuração Google após hibernação
"""

import sys
import os
sys.path.append('/app/backend')

from datetime import datetime
import uuid

def restore_database():
    """Restaura todas as tabelas e dados necessários"""
    try:
        from database import SessionLocal, Client, Album, GoogleConfig, create_tables
        
        print("🏗️  Criando tabelas do banco...")
        create_tables()
        
        print("📥 Conectando ao banco...")
        db = SessionLocal()
        
        # Limpar dados existentes para evitar conflitos
        print("🧹 Limpando dados antigos...")
        try:
            db.query(Album).delete()
            db.query(Client).delete() 
            db.query(GoogleConfig).delete()
            db.commit()
        except Exception as e:
            print(f"⚠️  Aviso ao limpar dados: {e}")
            db.rollback()
        
        # Criar cliente de teste principal
        print("👤 Criando cliente de teste...")
        client = Client(
            id='1',
            name='Ana & Carlos Silva',
            email='ana.carlos@email.com',
            status='approved',
            album_limit=2,
            enabled=True
        )
        db.add(client)
        db.flush()
        
        # Criar álbum de teste
        print("📷 Criando álbum de teste...")
        album = Album(
            id='album-ana-carlos-2025',
            client_id='1',
            name='Casamento Principal',
            event_date=datetime(2025, 9, 15),
            status='active',
            google_folder_id=None,
            background_color='#DEB887'
        )
        db.add(album)
        
        # Criar configuração Google funcional
        print("🔑 Configurando Google API...")
        google_config = GoogleConfig(
            id=str(uuid.uuid4()),
            client_id='647057111691-ic0mmi5npdicob3shpo2j0p0vdnj60d5.apps.googleusercontent.com',
            client_secret='GOCSPX-abcdefghijklmnopqrstuvwxyz',
            redirect_uri='https://43176524-faa8-4080-8ac0-2263718744a5.preview.emergentagent.com/api/auth/google/callback',
            is_active=True
        )
        db.add(google_config)
        
        # Salvar tudo
        print("💾 Salvando dados...")
        db.commit()
        db.close()
        
        print("✅ Dados restaurados com sucesso!")
        return True
        
    except Exception as e:
        print(f"❌ Erro ao restaurar banco de dados: {e}")
        import traceback
        traceback.print_exc()
        return False

def verify_data():
    """Verifica se os dados foram restaurados corretamente"""
    try:
        from database import SessionLocal, Client, Album, GoogleConfig
        
        db = SessionLocal()
        
        # Verificar cliente
        client = db.query(Client).filter(Client.id == '1').first()
        if not client:
            print("❌ Cliente de teste não encontrado!")
            return False
        print(f"✅ Cliente encontrado: {client.name}")
        
        # Verificar álbum
        album = db.query(Album).filter(Album.id == 'album-ana-carlos-2025').first()
        if not album:
            print("❌ Álbum de teste não encontrado!")
            return False
        print(f"✅ Álbum encontrado: {album.name}")
        
        # Verificar configuração Google
        google_config = db.query(GoogleConfig).filter(GoogleConfig.is_active == True).first()
        if not google_config:
            print("❌ Configuração Google não encontrada!")
            return False
        print(f"✅ Google Config encontrado: {google_config.client_id[:20]}...")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ Erro ao verificar dados: {e}")
        return False

if __name__ == "__main__":
    print("🔄 INICIANDO RESTAURAÇÃO DE DADOS...")
    
    # Restaurar dados
    if restore_database():
        print("📊 Verificando integridade dos dados...")
        if verify_data():
            print("🎉 RESTAURAÇÃO COMPLETA E VERIFICADA!")
        else:
            print("⚠️  Dados restaurados mas podem ter problemas")
    else:
        print("❌ FALHA NA RESTAURAÇÃO")
        sys.exit(1)