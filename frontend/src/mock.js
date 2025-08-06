// Mock data for UpnaFesta - Wedding Photo Sharing Platform

export const mockClients = [
  {
    id: '1',
    name: 'Ana & Carlos Silva',
    email: 'ana.carlos@email.com',
    weddingDate: '2025-09-15',
    status: 'active',
    albumId: 'album-ana-carlos-2025',
    createdAt: '2025-01-10',
    googleDriveConnected: true,
    customization: {
      primaryColor: '#D4AF37',
      secondaryColor: '#F5E6A3',
      mainPhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      welcomeMessage: 'Queridos amigos e familiares, compartilhem conosco os momentos especiais do nosso grande dia!',
      thankYouMessage: 'Obrigado por fazer parte da nossa história de amor!'
    }
  },
  {
    id: '2', 
    name: 'Mariana & João Santos',
    email: 'mari.joao@email.com',
    weddingDate: '2025-11-20',
    status: 'active',
    albumId: 'album-mari-joao-2025',
    createdAt: '2025-02-05',
    googleDriveConnected: false,
    customization: {
      primaryColor: '#8B4513',
      secondaryColor: '#DEB887',
      mainPhoto: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80',
      welcomeMessage: 'Celebre conosco este momento único!',
      thankYouMessage: 'Cada foto é uma lembrança preciosa. Obrigado!'
    }
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
  ]
};

export const mockTestimonials = [
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
  }
];

export const generateMockQRCode = (albumId) => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${window.location.origin}/album/${albumId}`;
};

export const mockStats = {
  totalClients: 156,
  totalUploads: 12845,
  totalAlbums: 98,
  activeThisMonth: 23
};