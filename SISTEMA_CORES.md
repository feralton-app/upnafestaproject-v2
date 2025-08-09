# 🎨 Sistema de Cores Persistente - UpnaFesta

## 📋 Visão Geral

Sistema completo de personalização de cores que permite modificar toda a identidade visual do site público e área do cliente, com persistência total no banco de dados MariaDB.

## ✨ Funcionalidades

### 🎨 **Personalização Completa**
- **18+ configurações de cor** organizadas em 6 seções
- **Interface intuitiva** com color picker e input hex
- **Preview em tempo real** das alterações
- **Aplicação instantânea** via CSS dinâmico

### 💾 **Persistência Total**
- **Banco MariaDB**: Todas as cores salvas na tabela `site_colors`
- **Carregamento automático**: Cores aplicadas em todas as páginas
- **Versionamento**: Sistema mantém histórico de configurações
- **Backup automático**: Incluído nos scripts de restauração

### 🌐 **Aplicação Global**
- **Site público**: Homepage e todas as páginas públicas
- **Área do cliente**: Dashboard, abas, formulários
- **Área administrativa**: Site Management, configurações
- **Elementos dinâmicos**: Botões, headers, textos, bordas

## 🏗️ Arquitetura

### **Backend (FastAPI + MariaDB)**
```python
# Modelo de dados
class SiteColors(Base):
    primary = Column(String(7))      # Cor primária
    secondary = Column(String(7))    # Cor secundária  
    accent = Column(String(7))       # Cor de destaque
    background = Column(String(7))   # Fundo principal
    # ... mais 15 configurações
```

### **Endpoints API**
- `GET /api/admin/site-colors` - Buscar cores ativas
- `POST /api/admin/site-colors` - Salvar nova configuração
- `PUT /api/admin/site-colors/{id}` - Atualizar existente

### **Frontend (React + CSS Variables)**
```javascript
// Hook personalizado para carregar cores
const { colors, applyColors } = useSiteColors();

// Aplicação via CSS Variables
document.documentElement.style.setProperty('--color-primary', '#FF6B35');
```

## 🎨 Seções de Cores

### **1. Cores Principais**
- **Primária**: Cor principal da marca
- **Secundária**: Cor de apoio/complementar  
- **Destaque**: Cor para elementos importantes

### **2. Cores de Fundo**
- **Principal**: Fundo geral das páginas
- **Superfície/Cards**: Fundo de cards e modais
- **Header**: Fundo do cabeçalho

### **3. Cores de Texto**
- **Principal**: Texto normal/corpo
- **Secundário**: Texto de apoio/subtítulos
- **Header**: Texto do cabeçalho

### **4. Cores de Botões**
- **Principal**: Botões primários/CTAs
- **Secundário**: Botões secundários
- **Hover**: Estado de hover/interação

### **5. Cores de Status**
- **Sucesso**: Mensagens de sucesso (verde)
- **Aviso**: Alertas e avisos (amarelo)
- **Erro**: Mensagens de erro (vermelho)

### **6. Outras Cores**
- **Bordas**: Bordas de elementos
- **Links**: Cor dos links
- **Borda Inputs**: Bordas dos campos de entrada

## 🚀 Como Usar

### **1. Acesso à Configuração**
```
http://localhost:3000/admin/site-management
→ Aba "Cores do Site"
```

### **2. Personalizar Cores**
1. **Selecionar cor**: Use o color picker ou digite hex
2. **Visualizar**: Mudanças aplicadas em tempo real
3. **Salvar**: Clique em "Aplicar e Salvar Cores"
4. **Confirmar**: Toast de confirmação aparece

### **3. Restaurar Padrão**
- Clique em "Restaurar Padrão" 
- Cores voltam aos valores originais
- Clique em "Aplicar e Salvar" para confirmar

## 🔧 Aspectos Técnicos

### **Persistência no Banco**
```sql
CREATE TABLE site_colors (
    id VARCHAR(36) PRIMARY KEY,
    primary VARCHAR(7) DEFAULT '#8B4513',
    secondary VARCHAR(7) DEFAULT '#DEB887',
    -- ... outros campos
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME,
    updated_at DATETIME
);
```

### **Carregamento Automático**
```javascript
// App.js - Carrega cores globalmente
import { useSiteColors } from './hooks/use-site-colors';

function App() {
    useSiteColors(); // Aplica cores automaticamente
    return <Routes>...</Routes>;
}
```

### **CSS Dinâmico**
```css
/* Variáveis CSS aplicadas dinamicamente */
:root {
    --color-primary: #8B4513;    /* Atualizado via JS */
    --color-secondary: #DEB887;  /* Atualizado via JS */
}

/* Elementos usando as variáveis */
.bg-amber-600 {
    background-color: var(--color-primary) !important;
}
```

## 🧪 Testes e Validação

### **Teste Manual**
1. Altere cores na aba "Cores do Site"
2. Navegue para outras páginas
3. Verifique aplicação consistente
4. Refresh da página - cores devem persistir

### **Teste Automático**
```bash
# Script de teste completo
cd /app && ./test_color_system.sh
```

### **Validação API**
```bash
# Verificar cores ativas
curl http://localhost:8001/api/admin/site-colors

# Salvar nova configuração
curl -X POST http://localhost:8001/api/admin/site-colors \
  -H "Content-Type: application/json" \
  -d '{"primary": "#FF6B35", "secondary": "#4ECDC4"}'
```

## 📊 Status de Implementação

### ✅ **Implementado**
- ✅ Modelo de dados completo (MariaDB)
- ✅ API endpoints funcionais (FastAPI)
- ✅ Interface de administração (React)
- ✅ Hook de carregamento automático
- ✅ CSS dinâmico com variáveis
- ✅ Aplicação em todas as páginas
- ✅ Sistema de persistência
- ✅ Scripts de restauração atualizados

### 🎯 **Funcionando 100%**
- 🎨 Personalização completa de cores
- 💾 Persistência no banco de dados
- 🔄 Carregamento automático
- 🌐 Aplicação global
- 📱 Interface responsiva
- 🔧 Sistema de backup/restauração

## 💡 Próximas Melhorias Possíveis

1. **Temas Pré-definidos**: Criar templates de cores
2. **Preview ao Vivo**: Mostrar site em iframe durante edição  
3. **Export/Import**: Salvar/carregar esquemas de cores
4. **Modo Escuro**: Toggle para tema escuro automático
5. **Gradientes**: Suporte a cores gradientes
6. **Validação**: Verificar contraste de acessibilidade

---

## 🎉 Conclusão

O sistema de cores está **100% funcional** e permite personalização completa da identidade visual do UpnaFesta, com persistência total e aplicação global em todas as páginas.