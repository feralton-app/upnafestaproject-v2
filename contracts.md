# UpnaFesta - Contratos de API e Integração

## 1. API Contracts

### 1.1 Authentication & Admin
- `POST /api/auth/login` - Autenticação de administrador
- `POST /api/auth/logout` - Logout
- `GET /api/admin/stats` - Estatísticas do sistema

### 1.2 Client Management
- `POST /api/clients` - Criar novo cliente (admin)
- `GET /api/clients` - Listar todos os clientes (admin)
- `GET /api/clients/:id` - Obter dados específicos do cliente
- `PUT /api/clients/:id` - Atualizar dados do cliente
- `DELETE /api/clients/:id` - Excluir cliente

### 1.3 Album Management  
- `GET /api/albums/:albumId` - Obter dados do álbum público
- `PUT /api/albums/:albumId/customization` - Atualizar customização
- `DELETE /api/albums/:albumId` - Excluir álbum (cliente)

### 1.4 Payment System
- `POST /api/payments/upload-proof` - Upload de comprovante de pagamento
- `GET /api/payments/pending` - Listar pagamentos pendentes (admin)
- `POST /api/payments/approve/:clientId` - Aprovar pagamento (admin)
- `POST /api/payments/reject/:clientId` - Rejeitar pagamento (admin)

### 1.5 File Upload System
- `POST /api/upload/:albumId` - Upload de fotos/vídeos dos convidados
- `GET /api/uploads/:albumId` - Listar uploads do álbum

### 1.6 Google Drive Integration
- `POST /api/google/connect` - Conectar conta Google Drive
- `GET /api/google/status/:clientId` - Status da conexão

### 1.7 Notifications
- `GET /api/notifications/:clientId` - Obter notificações do cliente
- `PUT /api/notifications/:id/read` - Marcar notificação como lida

### 1.8 Site Management
- `GET /api/site-config` - Obter configurações do site
- `PUT /api/site-config` - Atualizar configurações (admin)

## 2. Dados Mockados vs Backend Real

### 2.1 Mock Data atualmente implementado:
- **mockClients**: Clientes com diferentes status de pagamento
- **mockSiteConfig**: Configurações da página principal
- **mockStats**: Estatísticas do sistema
- **mockPaymentMethods**: Métodos de pagamento disponíveis
- **mockTestimonials**: Depoimentos de clientes
- **mockUploads**: Uploads de exemplo

### 2.2 Será substituído por:
- **MariaDB Tables**: 
  - `clients` - Dados dos clientes
  - `albums` - Álbuns e customizações
  - `uploads` - Registros de uploads
  - `notifications` - Sistema de notificações
  - `payments` - Histórico de pagamentos
  - `site_configs` - Configurações do sistema
  - `google_tokens` - Tokens do Google Drive (criptografados)

## 3. Backend Implementation Plan

### 3.1 Database Schema (MariaDB)
```sql
-- Tabela de configurações do sistema
CREATE TABLE site_configs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  key_name VARCHAR(100) UNIQUE,
  value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de clientes
CREATE TABLE clients (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  wedding_date DATE,
  status ENUM('pending_payment', 'payment_sent', 'approved', 'rejected') DEFAULT 'pending_payment',
  album_id VARCHAR(100) UNIQUE,
  payment_status ENUM('pending', 'pending_review', 'confirmed', 'rejected') DEFAULT 'pending',
  google_drive_connected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payment_date TIMESTAMP NULL,
  approval_date TIMESTAMP NULL
);

-- Tabela de customizações de álbuns
CREATE TABLE album_customizations (
  album_id VARCHAR(100) PRIMARY KEY,
  primary_color VARCHAR(7) DEFAULT '#8B4513',
  secondary_color VARCHAR(7) DEFAULT '#DEB887',
  main_photo TEXT,
  welcome_message TEXT,
  thank_you_message TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (album_id) REFERENCES clients(album_id) ON DELETE CASCADE
);

-- Tabela de uploads
CREATE TABLE uploads (
  id VARCHAR(50) PRIMARY KEY,
  album_id VARCHAR(100),
  filename VARCHAR(255),
  uploaded_by VARCHAR(100),
  file_size BIGINT,
  file_type VARCHAR(50),
  google_drive_file_id VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (album_id) REFERENCES clients(album_id) ON DELETE CASCADE
);

-- Tabela de notificações
CREATE TABLE notifications (
  id VARCHAR(50) PRIMARY KEY,
  client_id VARCHAR(50),
  title VARCHAR(200),
  message TEXT,
  type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
  read_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Tabela de tokens Google (criptografados)
CREATE TABLE google_tokens (
  client_id VARCHAR(50) PRIMARY KEY,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  folder_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);
```

### 3.2 Business Logic
- **Payment Approval Workflow**: Automático com notificações
- **Google Drive Integration**: OAuth2 + API para upload direto
- **File Upload**: Chunked upload para arquivos grandes
- **QR Code Generation**: Dinâmico baseado na URL do álbum
- **Notification System**: Real-time para clientes

### 3.3 Security
- **JWT Authentication**: Para admin e clientes
- **Rate Limiting**: Para uploads e API calls
- **File Validation**: Tipos e tamanhos permitidos
- **HTTPS**: Obrigatório para produção
- **Token Encryption**: Google Drive tokens criptografados

## 4. Frontend & Backend Integration

### 4.1 Authentication Flow
1. Remove mock login → Implement JWT authentication
2. Store auth tokens in localStorage/httpOnly cookies
3. Protect admin routes with auth middleware

### 4.2 Real-time Updates
- WebSocket ou Server-Sent Events para notificações
- Auto-refresh de status de pagamento
- Progress tracking para uploads

### 4.3 Error Handling
- Global error boundary no React
- Proper HTTP status codes
- User-friendly error messages

### 4.4 File Upload Implementation
- Replace mock upload com chunk upload real
- Progress tracking com WebSocket
- Direct upload para Google Drive via backend proxy

## 5. AWS Deployment Architecture

### 5.1 Stateless Design
- Sessions em JWT (stateless)
- File uploads direto para Google Drive (não local storage)
- Database connection pooling
- Environment variables para configurações

### 5.2 Auto-scaling Ready
- Horizontal scaling capability
- Load balancer compatibility
- Database connection optimization
- CDN para assets estáticos

## 6. Google Drive Integration Details

### 6.1 OAuth2 Flow
```javascript
// Frontend: Redirect para Google OAuth
window.location.href = `/api/google/auth?clientId=${clientId}`;

// Backend: Handle callback e store tokens
app.get('/api/google/callback', async (req, res) => {
  const { code, state } = req.query;
  // Exchange code for tokens
  // Store encrypted tokens in database
  // Create album folder in Google Drive
});
```

### 6.2 File Upload Flow
1. Guest uploads file → Backend receives
2. Backend uploads to client's Google Drive folder
3. Store file metadata in database
4. Send notification to client
5. Update upload statistics

## 7. Testing Strategy

### 7.1 Backend Testing
- Unit tests para all API endpoints
- Integration tests para Google Drive
- Load testing para file uploads

### 7.2 Frontend Testing
- Component testing com Jest
- E2E testing com Playwright
- Payment flow testing

## 8. Production Deployment

### 8.1 Environment Variables
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `JWT_SECRET`
- `MYSQL_CONNECTION_STRING`
- `FRONTEND_URL`

### 8.2 AWS Resources Needed
- RDS MariaDB instance
- EC2 instances (auto-scaling group)
- Application Load Balancer
- CloudFront CDN
- Route 53 DNS
- AWS Secrets Manager

Esta documentação serve como blueprint completo para transformar o frontend mockado em uma aplicação full-stack production-ready.