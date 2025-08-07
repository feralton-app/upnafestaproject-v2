// Mock data for UpnaFesta - Wedding Photo Sharing Platform

export const mockClients = [
  {
    id: '1',
    name: 'Ana & Carlos Silva',
    email: 'ana.carlos@email.com',
    weddingDate: '2025-09-15',
    status: 'approved', // 'pending_payment', 'payment_sent', 'approved', 'rejected'
    albumId: 'album-ana-carlos-2025',
    albumLimit: 1,
    createdAt: '2025-01-10',
    paymentDate: '2025-01-12',
    approvalDate: '2025-01-13',
    googleDriveConnected: true,
    googleFolderId: '1A2B3C4D5E6F7G8H9I0J',
    paymentStatus: 'confirmed',
    enabled: true,
    customization: {
      primaryColor: '#8B4513',
      secondaryColor: '#DEB887',
      mainPhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      welcomeMessage: 'Queridos amigos e familiares, compartilhem conosco os momentos especiais do nosso grande dia!',
      thankYouMessage: 'Obrigado por fazer parte da nossa história de amor!'
    },
    notifications: [
      {
        id: '1',
        title: 'Pagamento Aprovado!',
        message: 'Seu pagamento foi confirmado e seu álbum está ativo.',
        type: 'success',
        date: '2025-01-13',
        read: true
      },
      {
        id: '2',
        title: 'Álbum Criado',
        message: 'Seu álbum foi criado com sucesso. Aguardando confirmação do pagamento.',
        type: 'info',
        date: '2025-01-10',
        read: true
      }
    ]
  },
  {
    id: '2', 
    name: 'Mariana & João Santos',
    email: 'mari.joao@email.com',
    weddingDate: '2025-11-20',
    status: 'payment_sent',
    albumId: 'album-mari-joao-2025',
    albumLimit: 2,
    createdAt: '2025-02-05',
    paymentDate: '2025-02-06',
    googleDriveConnected: false,
    paymentStatus: 'pending_review',
    enabled: true,
    customization: {
      primaryColor: '#8B4513',
      secondaryColor: '#DEB887',
      mainPhoto: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80',
      welcomeMessage: 'Celebre conosco este momento único!',
      thankYouMessage: 'Cada foto é uma lembrança preciosa. Obrigado!'
    },
    notifications: [
      {
        id: '3',
        title: 'Comprovante Recebido',
        message: 'Recebemos seu comprovante de pagamento. Em análise.',
        type: 'warning',
        date: '2025-02-06',
        read: false
      },
      {
        id: '4',
        title: 'Álbum Criado',
        message: 'Seu álbum foi criado. Por favor, realize o pagamento para ativação.',
        type: 'info',
        date: '2025-02-05',
        read: true
      }
    ]
  },
  {
    id: '3', 
    name: 'Sofia & Ricardo Lima',
    email: 'sofia.ricardo@email.com',
    weddingDate: '2025-08-10',
    status: 'pending_payment',
    albumId: 'album-sofia-ricardo-2025',
    albumLimit: 1,
    createdAt: '2025-02-08',
    googleDriveConnected: false,
    paymentStatus: 'pending',
    enabled: true,
    customization: {
      primaryColor: '#D4AF37',
      secondaryColor: '#F5E6A3',
      mainPhoto: 'https://images.unsplash.com/photo-1594736797933-d0802ba42407?w=800&q=80',
      welcomeMessage: 'Venham celebrar conosco!',
      thankYouMessage: 'Vocês são especiais para nós!'
    },
    notifications: [
      {
        id: '5',
        title: 'Álbum Criado - Pagamento Necessário',
        message: 'Seu álbum foi criado! Para ativá-lo, realize o pagamento de R$ 99,90.',
        type: 'warning',
        date: '2025-02-08',
        read: false
      }
    ]
  }
];

export const mockUploads = [
  {
    id: '1',
    albumId: 'album-ana-carlos-2025',
    filename: 'cerimonia_001.jpg',
    uploadedBy: 'Tia Maria',
    uploadDate: '2025-01-15',
    size: '2.5MB',
    type: 'image/jpeg'
  },
  {
    id: '2',
    albumId: 'album-ana-carlos-2025', 
    filename: 'festa_video_001.mp4',
    uploadedBy: 'Primo Pedro',
    uploadDate: '2025-01-15',
    size: '15.2MB',
    type: 'video/mp4'
  }
];

export const mockSiteConfig = {
  siteName: 'UpnaFesta',
  heroTitle: 'A Forma #1 Simples & Fácil de Coletar Fotos e Vídeos de Casamento dos Seus Convidados',
  heroSubtitle: 'Mantenha cada momento privado com amigos e família no seu Google Drive™ Cloud Storage!',
  heroImages: [
    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
    'https://images.unsplash.com/photo-1594736797933-d0802ba42407?w=400&q=80'
  ],
  features: [
    {
      title: 'Coleta de Fotos Facilitada',
      description: 'Coletamos suas fotos de casamento de forma fácil e simples.',
      subtitle: 'Reviva seu grande dia através dos olhos dos seus entes queridos.'
    },
    {
      title: 'Armazenamento Seguro',
      description: 'Todas as fotos vão direto para o seu Google Drive pessoal.',
      subtitle: 'Controle total e privacidade garantida.'
    },
    {
      title: 'Sem Aplicativos',
      description: 'Seus convidados não precisam baixar nada - apenas um link!',
      subtitle: 'Acesso simples via navegador web.'
    }
  ],
  howItWorks: {
    enabled: true,
    title: 'Como Funciona',
    subtitle: '3 passos simples para coletar todas as fotos do seu casamento',
    steps: [
      {
        number: 1,
        title: 'Criar Álbum',
        description: 'Crie seu álbum e conecte com sua conta do Google Drive'
      },
      {
        number: 2,
        title: 'Compartilhar Link',
        description: 'Compartilhe o link ou QR code com seus convidados'
      },
      {
        number: 3,
        title: 'Receber Fotos',
        description: 'Todas as fotos vão automaticamente para seu Google Drive'
      }
    ]
  },
  testimonials: {
    enabled: true,
    title: 'Casais Felizes',
    subtitle: 'Veja o que nossos clientes estão dizendo',
    items: [
      {
        id: '1',
        name: 'Sofia & Ricardo',
        text: 'O UpnaFesta tornou muito fácil coletar todas as fotos do nosso casamento. Nossos convidados adoraram a simplicidade!',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&q=80'
      },
      {
        id: '2',
        name: 'Camila & Bruno',
        text: 'Recebemos mais de 500 fotos dos nossos convidados! Foi incrível ver nosso casamento pela perspectiva de todos.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
      },
      {
        id: '3',
        name: 'Amanda & Diego',
        text: 'Processo super fácil e rápido. Em poucas horas já tínhamos centenas de fotos organizadas no nosso Google Drive.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'
      }
    ]
  },
  pricing: {
    price: 'R$ 99,90',
    description: 'Pagamento único por álbum',
    features: [
      'Álbum ilimitado',
      'Upload ilimitado de fotos e vídeos',
      'Integração com Google Drive',
      'QR Code personalizado',
      'Customização completa',
      'Suporte técnico'
    ]
  }
};

export const mockTestimonials = mockSiteConfig.testimonials.items;

export const mockPaymentMethods = [
  {
    id: 'pix',
    name: 'PIX',
    description: 'Pagamento instantâneo',
    icon: '💳',
    details: {
      key: 'pagamentos@upnafesta.com.br',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
    }
  },
  {
    id: 'bank_transfer',
    name: 'Transferência Bancária',
    description: 'TED/DOC',
    icon: '🏦',
    details: {
      bank: 'Banco do Brasil',
      agency: '1234-5',
      account: '98765-4',
      holder: 'UpnaFesta Ltda'
    }
  }
];

export const generateMockQRCode = (albumId) => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${window.location.origin}/album/${albumId}`;
};

export const mockStats = {
  totalClients: 156,
  totalUploads: 12845,
  totalAlbums: 98,
  activeThisMonth: 23,
  pendingApprovals: 5,
  totalRevenue: 'R$ 15.588,20'
};

// Status helpers
export const getStatusLabel = (status) => {
  const labels = {
    'pending_payment': 'Pagamento Pendente',
    'payment_sent': 'Comprovante Enviado',
    'approved': 'Aprovado',
    'rejected': 'Rejeitado'
  };
  return labels[status] || status;
};

export const getStatusColor = (status) => {
  const colors = {
    'pending_payment': 'bg-yellow-100 text-yellow-800',
    'payment_sent': 'bg-blue-100 text-blue-800',
    'approved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};