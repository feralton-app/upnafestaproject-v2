#!/bin/bash

# Script de restauração rápida - Use este após hibernação
echo "🚀 RESTAURAÇÃO RÁPIDA UPNAFESTA"

# Matar processos MariaDB órfãos
pkill -f mysql 2>/dev/null || true
sleep 1

# Iniciar MariaDB
mkdir -p /run/mysqld
chown mysql:mysql /run/mysqld 2>/dev/null || true
mysqld --user=mysql --skip-grant-tables --datadir=/var/lib/mysql > /dev/null 2>&1 &
sleep 3

# Criar database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS upnafesta;" 2>/dev/null

# Restaurar dados com Python
echo "📊 Restaurando dados..."
cd /app/backend && python3 /app/restore_data.py

# Reiniciar serviços
echo "🔄 Reiniciando serviços..."
supervisorctl restart all > /dev/null 2>&1
sleep 3

# Teste rápido
echo "🔍 Teste rápido..."
if curl -s http://localhost:8001/api/clients/1 | grep -q "Ana"; then
    echo "✅ SUCESSO! Aplicação funcionando"
    echo "🌐 Acesse: http://localhost:3000/client/1"
else
    echo "⚠️  Execute o script completo: ./restore_app.sh"
fi