#!/bin/bash

echo "🧪 TESTANDO RESTAURAÇÃO COMPLETA..."

# Simular hibernação matando MariaDB
echo "💤 Simulando hibernação (matando MariaDB)..."
pkill -f mysql > /dev/null 2>&1
sleep 2

# Restaurar com script rápido
echo "🚀 Executando restauração rápida..."
./quick_restore.sh

echo ""
echo "🔍 EXECUTANDO TESTES..."

# Teste 1: Backend funcionando
echo -n "🔸 Backend API: "
if curl -s http://localhost:8001/api/clients/1 | grep -q "Ana"; then
    echo "✅ OK"
else
    echo "❌ FALHOU"
fi

# Teste 2: Google OAuth  
echo -n "🔸 Google OAuth: "
if curl -s http://localhost:8001/api/auth/google/authorize/1 | grep -q "auth_url"; then
    echo "✅ OK"
else
    echo "❌ FALHOU"
fi

# Teste 3: Google Config
echo -n "🔸 Google Config: "
if curl -s http://localhost:8001/api/admin/google-config | grep -q "client_id"; then
    echo "✅ OK"
else
    echo "❌ FALHOU"
fi

# Teste 4: Álbuns  
echo -n "🔸 Álbuns: "
if curl -s http://localhost:8001/api/clients/1/albums | grep -q "Casamento"; then
    echo "✅ OK"
else
    echo "❌ FALHOU"
fi

echo ""
echo "🎯 TODOS OS TESTES CONCLUÍDOS!"
echo "📋 Use sempre: ./quick_restore.sh após hibernação"