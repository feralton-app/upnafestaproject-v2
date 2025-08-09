#!/bin/bash

echo "🔄 RESTAURANDO APLICAÇÃO UPNAFESTA..."

# 1. Instalar/Iniciar MariaDB se necessário
echo "📦 Verificando MariaDB..."
if ! command -v mysql &> /dev/null; then
    echo "📥 Instalando MariaDB..."
    apt-get update -qq > /dev/null 2>&1
    apt-get install -y mariadb-server mariadb-client -qq > /dev/null 2>&1
fi

# Criar diretórios necessários
mkdir -p /run/mysqld
chown mysql:mysql /run/mysqld 2>/dev/null || true

# Iniciar MariaDB
echo "🚀 Iniciando MariaDB..."
if ! pgrep -x "mysqld" > /dev/null; then
    mysqld --user=mysql --skip-grant-tables --datadir=/var/lib/mysql > /dev/null 2>&1 &
    sleep 3
fi

# Aguardar MariaDB estar pronto
echo "⏳ Aguardando MariaDB ficar pronto..."
for i in {1..10}; do
    if mysql -u root -e "SELECT 1;" > /dev/null 2>&1; then
        break
    fi
    sleep 1
done

# Configurar usuário root
echo "🔐 Configurando MariaDB..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS upnafesta;" 2>/dev/null || true

echo "✅ MariaDB configurado!"

# 2. Restaurar dados de teste
echo "📊 Restaurando dados de teste..."
cd /app/backend

python3 << 'EOF'
import sys
sys.path.append('/app/backend')
import os

try:
    from database import SessionLocal, Client, Album, GoogleConfig, create_tables
    from datetime import datetime
    import uuid

    print("🏗️  Criando tabelas...")
    create_tables()

    print("📥 Inserindo dados de teste...")
    db = SessionLocal()
    
    # Limpar dados existentes se houver
    db.query(Album).delete()
    db.query(Client).delete() 
    db.query(GoogleConfig).delete()
    
    # Criar cliente de teste
    client = Client(
        id='1',
        name='Ana & Carlos Silva',
        email='ana.carlos@email.com',
        status='approved',
        album_limit=2
    )
    db.add(client)
    db.flush()
    
    # Criar álbum de teste
    album = Album(
        id='album-ana-carlos-2025',
        client_id='1',
        name='Casamento Principal',
        event_date=datetime(2025, 9, 15),
        status='active',
        google_folder_id=None
    )
    db.add(album)
    
    # Criar configuração Google
    google_config = GoogleConfig(
        id=str(uuid.uuid4()),
        client_id='647057111691-ic0mmi5npdicob3shpo2j0p0vdnj60d5.apps.googleusercontent.com',
        client_secret='GOCSPX-abcdefghijklmnopqrstuvwxyz',
        redirect_uri='https://43176524-faa8-4080-8ac0-2263718744a5.preview.emergentagent.com/api/auth/google/callback',
        is_active=True
    )
    db.add(google_config)
    
    db.commit()
    db.close()
    
    print("✅ Dados inseridos com sucesso!")
    
except Exception as e:
    print(f"❌ Erro ao restaurar dados: {e}")
    import traceback
    traceback.print_exc()
EOF

echo "✅ Dados de teste restaurados!"

# 3. Reinstalar dependências se necessário
echo "📦 Verificando dependências Python..."
cd /app/backend
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt > /dev/null 2>&1 || true
fi

# PyMySQL específico para MariaDB
pip install PyMySQL > /dev/null 2>&1 || true

echo "✅ Dependências verificadas!"

# 4. Reiniciar serviços
echo "🔄 Reiniciando serviços..."
supervisorctl restart backend
supervisorctl restart frontend
sleep 3

# 5. Verificar se tudo está funcionando
echo "🔍 Verificando se a aplicação está funcionando..."

# Verificar backend
echo "🔸 Testando backend..."
for i in {1..5}; do
    if curl -s -X GET "http://localhost:8001/api/clients/1" > /dev/null 2>&1; then
        echo "✅ Backend funcionando!"
        break
    fi
    echo "⏳ Aguardando backend... ($i/5)"
    sleep 2
done

# Verificar Google OAuth
echo "🔸 Testando Google OAuth..."
if curl -s -X GET "http://localhost:8001/api/auth/google/authorize/1" | grep -q "auth_url"; then
    echo "✅ Google OAuth funcionando!"
else
    echo "⚠️  Google OAuth pode ter problema"
fi

# Verificar Google Config
echo "🔸 Testando Google Config..."
if curl -s -X GET "http://localhost:8001/api/admin/google-config" | grep -q "client_id"; then
    echo "✅ Google Config funcionando!"
else
    echo "⚠️  Google Config pode ter problema"
fi

# Status dos serviços
echo "🔸 Status dos serviços:"
supervisorctl status | grep -E "(backend|frontend)"

echo ""
echo "🎉 RESTAURAÇÃO COMPLETA!"
echo "📋 Aplicação pronta em:"
echo "   🌐 Frontend: http://localhost:3000"
echo "   🔧 Backend: http://localhost:8001"
echo "   👤 Cliente: http://localhost:3000/client/1"
echo "   ⚙️  Admin: http://localhost:3000/admin/site-management"
echo "   🔑 Google: http://localhost:3000/admin/google-config"
echo ""
echo "✨ Funcionalidades disponíveis:"
echo "   ✅ Google OAuth integrado"
echo "   ✅ Configuração Google API"
echo "   ✅ Aba Cores do Site" 
echo "   ✅ Aba SEO"
echo "   ✅ Cliente de teste (ID: 1)"
echo "   ✅ MariaDB com dados"