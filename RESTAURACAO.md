# 🔄 Scripts de Restauração - UpnaFesta

Este documento contém instruções para restaurar a aplicação UpnaFesta após hibernação ou reset do ambiente.

## 📋 Estado Funcional Atual

A aplicação está configurada com:
- ✅ **MariaDB** com dados de teste
- ✅ **Cliente de teste**: Ana & Carlos Silva (ID: 1)
- ✅ **Álbum de teste**: Casamento Principal
- ✅ **Google OAuth** configurado e funcionando
- ✅ **2 novas abas**: Cores do Site + SEO
- ✅ **Backend/Frontend** em sincronia

## 🚀 Scripts Disponíveis

### 1. Restauração Rápida (Recomendado)
```bash
cd /app && ./quick_restore.sh
```
- **Uso**: Após hibernação simples
- **Tempo**: ~10 segundos
- **O que faz**: Reinicia MariaDB, restaura dados básicos, reinicia serviços

### 2. Restauração Completa
```bash
cd /app && ./restore_app.sh
```
- **Uso**: Se a restauração rápida falhar
- **Tempo**: ~30 segundos
- **O que faz**: Reinstala MariaDB, verifica dependências, testes completos

### 3. Apenas Restaurar Dados
```bash
cd /app/backend && python3 /app/restore_data.py
```
- **Uso**: Se apenas o banco perdeu dados
- **Tempo**: ~5 segundos
- **O que faz**: Recria tabelas e insere dados de teste

## 🔍 Verificação Manual

Após executar qualquer script, teste:

1. **Backend funcionando**:
```bash
curl http://localhost:8001/api/clients/1
```

2. **Google OAuth funcionando**:
```bash
curl http://localhost:8001/api/auth/google/authorize/1
```

3. **Frontend funcionando**:
- Acesse: http://localhost:3000/client/1
- Deve mostrar "Google Conectado" no topo

## 🌐 URLs da Aplicação

Após restauração bem-sucedida:

- **🏠 Home**: http://localhost:3000
- **👤 Cliente**: http://localhost:3000/client/1  
- **⚙️ Site Management**: http://localhost:3000/admin/site-management
- **🔑 Google Config**: http://localhost:3000/admin/google-config
- **🎨 Cores do Site**: Site Management → Aba "Cores do Site"
- **🔍 SEO**: Site Management → Aba "SEO"

## 🆘 Solução de Problemas

### Se MariaDB não iniciar:
```bash
pkill -f mysql
mkdir -p /run/mysqld
chown mysql:mysql /run/mysqld
./restore_app.sh
```

### Se backend não conectar ao banco:
```bash
pip install PyMySQL
supervisorctl restart backend
```

### Se serviços não responderem:
```bash
supervisorctl restart all
sleep 5
./quick_restore.sh
```

## 📊 Dados de Teste Padrão

**Cliente**: 
- ID: `1`
- Nome: `Ana & Carlos Silva`
- Email: `ana.carlos@email.com`
- Status: `approved`

**Álbum**:
- ID: `album-ana-carlos-2025`
- Nome: `Casamento Principal`
- Data: `2025-09-15`
- Status: `active`

**Google Config**:
- Client ID: `647057111691-ic0...` (configurado)
- Redirect URI: Emergent preview URL
- Status: `ativo`

## 💡 Dicas

- Use sempre `./quick_restore.sh` primeiro
- Se der erro, use `./restore_app.sh` 
- Os scripts são idempotentes (podem ser executados múltiplas vezes)
- Todos os dados de teste são recriados a cada execução