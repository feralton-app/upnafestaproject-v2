import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { 
  Settings, 
  Palette, 
  Type, 
  Image, 
  DollarSign,
  Save,
  Eye,
  Upload,
  Trash2,
  Plus,
  Users,
  ToggleLeft,
  ToggleRight,
  Search,
  Paintbrush
} from 'lucide-react';
import { mockSiteConfig } from '../mock';
import { Link } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

const SiteManagement = () => {
  const [siteConfig, setSiteConfig] = useState(mockSiteConfig);
  const [newFeature, setNewFeature] = useState({ title: '', description: '', subtitle: '' });
  const [newImage, setNewImage] = useState('');
  const [newStep, setNewStep] = useState({ title: '', description: '' });
  const [newTestimonial, setNewTestimonial] = useState({ name: '', text: '', avatar: '' });
  const [showFeatureDialog, setShowFeatureDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showStepDialog, setShowStepDialog] = useState(false);
  const [showTestimonialDialog, setShowTestimonialDialog] = useState(false);
  
  // Estados para SEO
  const [seoConfig, setSeoConfig] = useState({
    title: 'UpnaFesta - Compartilhamento de Fotos para Casamentos',
    description: 'Plataforma completa para compartilhamento de fotos de casamentos com integração ao Google Drive',
    keywords: 'casamento, fotos, compartilhamento, google drive, upload, festa',
    ogTitle: 'UpnaFesta - Fotos do Seu Casamento',
    ogDescription: 'Compartilhe e receba fotos do seu casamento de forma simples e organizada',
    ogImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
    favicon: '/favicon.ico',
    robots: 'index, follow',
    canonical: 'https://upnafesta.com'
  });
  
  // Estados para cores
  const [colorConfig, setColorConfig] = useState({
    primary: '#8B4513',           // Marrom principal
    secondary: '#DEB887',         // Bege
    accent: '#D2691E',           // Laranja 
    background: '#FFF8DC',        // Fundo creme
    surface: '#FFFFFF',          // Superfície branca
    text_primary: '#2D1810',     // Texto principal escuro
    text_secondary: '#8B4513',   // Texto secundário marrom
    success: '#22C55E',          // Verde sucesso
    warning: '#F59E0B',          // Amarelo aviso
    error: '#EF4444',           // Vermelho erro
    border: '#E5E7EB',          // Borda cinza
    button_primary: '#8B4513',   // Botão principal
    button_secondary: '#DEB887', // Botão secundário
    header_bg: '#8B4513',        // Fundo header
    header_text: '#FFFFFF',      // Texto header
    input_border: '#D1D5DB',     // Borda inputs
    link_color: '#3B82F6',       // Cor links
    hover_color: '#6B3410'       // Cor hover
  });
  const [colorConfigId, setColorConfigId] = useState(null);
  
  const { toast } = useToast();

  // Carregar cores salvas do backend
  useEffect(() => {
    const loadSiteColors = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
        const response = await fetch(`${backendUrl}/api/admin/site-colors`);
        
        if (response.ok) {
          const colors = await response.json();
          setColorConfig({
            primary: colors.primary,
            secondary: colors.secondary,
            accent: colors.accent,
            background: colors.background,
            surface: colors.surface,
            text_primary: colors.text_primary,
            text_secondary: colors.text_secondary,
            success: colors.success,
            warning: colors.warning,
            error: colors.error,
            border: colors.border,
            button_primary: colors.button_primary,
            button_secondary: colors.button_secondary,
            header_bg: colors.header_bg,
            header_text: colors.header_text,
            input_border: colors.input_border,
            link_color: colors.link_color,
            hover_color: colors.hover_color
          });
          setColorConfigId(colors.id);
          
          // Aplicar cores carregadas automaticamente
          applyColors(colors);
        }
      } catch (error) {
        console.error('Erro ao carregar cores:', error);
      }
    };

    loadSiteColors();
  }, []);

  // Função para aplicar cores
  const applyColors = (colors) => {
    const root = document.documentElement;
    const colorMap = {
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      background: colors.background,
      surface: colors.surface,
      textPrimary: colors.text_primary,
      textSecondary: colors.text_secondary,
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
      border: colors.border,
      buttonPrimary: colors.button_primary,
      buttonSecondary: colors.button_secondary,
      headerBg: colors.header_bg,
      headerText: colors.header_text,
      inputBorder: colors.input_border,
      linkColor: colors.link_color,
      hoverColor: colors.hover_color
    };
    
    Object.entries(colorMap).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  };

  const handleConfigChange = (section, field, value) => {
    setSiteConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleDirectChange = (field, value) => {
    setSiteConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFeature = () => {
    if (newFeature.title && newFeature.description) {
      setSiteConfig(prev => ({
        ...prev,
        features: [...prev.features, newFeature]
      }));
      setNewFeature({ title: '', description: '', subtitle: '' });
      setShowFeatureDialog(false);
      toast({
        title: "Recurso adicionado!",
        description: "O novo recurso foi adicionado à página principal."
      });
    }
  };

  const removeFeature = (index) => {
    setSiteConfig(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
    toast({
      title: "Recurso removido",
      description: "O recurso foi removido da página principal."
    });
  };

  const addImage = () => {
    if (newImage) {
      setSiteConfig(prev => ({
        ...prev,
        heroImages: [...prev.heroImages, newImage]
      }));
      setNewImage('');
      setShowImageDialog(false);
      toast({
        title: "Imagem adicionada!",
        description: "A nova imagem foi adicionada à seção hero."
      });
    }
  };

  const addStep = () => {
    if (newStep.title && newStep.description) {
      const nextNumber = siteConfig.howItWorks.steps.length + 1;
      setSiteConfig(prev => ({
        ...prev,
        howItWorks: {
          ...prev.howItWorks,
          steps: [...prev.howItWorks.steps, { ...newStep, number: nextNumber }]
        }
      }));
      setNewStep({ title: '', description: '' });
      setShowStepDialog(false);
      toast({
        title: "Passo adicionado!",
        description: "O novo passo foi adicionado à seção Como Funciona."
      });
    }
  };

  const removeStep = (index) => {
    setSiteConfig(prev => ({
      ...prev,
      howItWorks: {
        ...prev.howItWorks,
        steps: prev.howItWorks.steps.filter((_, i) => i !== index).map((step, i) => ({
          ...step,
          number: i + 1
        }))
      }
    }));
    toast({
      title: "Passo removido",
      description: "O passo foi removido da seção Como Funciona."
    });
  };

  const addTestimonial = () => {
    if (newTestimonial.name && newTestimonial.text) {
      const testimonial = {
        ...newTestimonial,
        id: String(siteConfig.testimonials.items.length + 1),
        avatar: newTestimonial.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&q=80'
      };
      setSiteConfig(prev => ({
        ...prev,
        testimonials: {
          ...prev.testimonials,
          items: [...prev.testimonials.items, testimonial]
        }
      }));
      setNewTestimonial({ name: '', text: '', avatar: '' });
      setShowTestimonialDialog(false);
      toast({
        title: "Depoimento adicionado!",
        description: "O novo depoimento foi adicionado à página."
      });
    }
  };

  const removeTestimonial = (index) => {
    setSiteConfig(prev => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        items: prev.testimonials.items.filter((_, i) => i !== index)
      }
    }));
    toast({
      title: "Depoimento removido",
      description: "O depoimento foi removido da página."
    });
  };

  const toggleSection = (section) => {
    setSiteConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        enabled: !prev[section].enabled
      }
    }));
    toast({
      title: "Seção atualizada!",
      description: `A seção foi ${siteConfig[section].enabled ? 'desabilitada' : 'habilitada'}.`
    });
  };

  const removeImage = (index) => {
    setSiteConfig(prev => ({
      ...prev,
      heroImages: prev.heroImages.filter((_, i) => i !== index)
    }));
    toast({
      title: "Imagem removida",
      description: "A imagem foi removida da seção hero."
    });
  };

  const saveChanges = () => {
    // In real app, would save to backend
    toast({
      title: "Alterações salvas!",
      description: "As configurações do site foram atualizadas com sucesso."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Settings className="h-8 w-8 text-amber-600" />
              <div>
                <h1 className="text-2xl font-bold text-amber-900">Gerenciamento do Site</h1>
                <p className="text-amber-600">Personalize a página principal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" className="text-amber-700 border-amber-300">
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar Site
                </Button>
              </Link>
              <Link to="/admin/dashboard">
                <Button variant="outline" className="text-amber-700 border-amber-300">
                  Voltar ao Admin
                </Button>
              </Link>
              <Button 
                onClick={saveChanges}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-amber-100">
            <TabsTrigger value="content" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Type className="w-4 h-4 mr-2" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="images" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Image className="w-4 h-4 mr-2" />
              Imagens
            </TabsTrigger>
            <TabsTrigger value="colors" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Paintbrush className="w-4 h-4 mr-2" />
              Cores do Site
            </TabsTrigger>
            <TabsTrigger value="seo" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Search className="w-4 h-4 mr-2" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Recursos
            </TabsTrigger>
            <TabsTrigger value="how-it-works" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Como Funciona
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Depoimentos
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6 mt-6">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Textos da Página Principal</CardTitle>
                <CardDescription className="text-amber-600">
                  Personalize os textos exibidos na página inicial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="siteName" className="text-amber-800">Nome do Site</Label>
                  <Input
                    id="siteName"
                    value={siteConfig.siteName}
                    onChange={(e) => handleDirectChange('siteName', e.target.value)}
                    className="border-amber-300"
                  />
                </div>

                <div>
                  <Label htmlFor="heroTitle" className="text-amber-800">Título Principal</Label>
                  <Textarea
                    id="heroTitle"
                    value={siteConfig.heroTitle}
                    onChange={(e) => handleDirectChange('heroTitle', e.target.value)}
                    className="border-amber-300"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="heroSubtitle" className="text-amber-800">Subtítulo</Label>
                  <Textarea
                    id="heroSubtitle"
                    value={siteConfig.heroSubtitle}
                    onChange={(e) => handleDirectChange('heroSubtitle', e.target.value)}
                    className="border-amber-300"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6 mt-6">
            <Card className="border-amber-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-amber-900">Imagens da Seção Hero</CardTitle>
                    <CardDescription className="text-amber-600">
                      Gerencie as imagens exibidas na parte superior da página
                    </CardDescription>
                  </div>
                  <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-amber-600 hover:bg-amber-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Imagem
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-amber-900">Adicionar Nova Imagem</DialogTitle>
                        <DialogDescription className="text-amber-600">
                          Adicione uma nova imagem à seção hero
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="imageUrl" className="text-amber-800">URL da Imagem</Label>
                          <Input
                            id="imageUrl"
                            value={newImage}
                            onChange={(e) => setNewImage(e.target.value)}
                            placeholder="https://exemplo.com/imagem.jpg"
                            className="border-amber-300"
                          />
                        </div>
                        <Button 
                          onClick={addImage} 
                          className="w-full bg-amber-600 hover:bg-amber-700"
                          disabled={!newImage}
                        >
                          Adicionar Imagem
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {siteConfig.heroImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Hero image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-amber-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeImage(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6 mt-6">
            <Card className="border-amber-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-amber-900">Recursos da Plataforma</CardTitle>
                    <CardDescription className="text-amber-600">
                      Gerencie os recursos exibidos na página principal
                    </CardDescription>
                  </div>
                  <Dialog open={showFeatureDialog} onOpenChange={setShowFeatureDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-amber-600 hover:bg-amber-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Recurso
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-amber-900">Adicionar Novo Recurso</DialogTitle>
                        <DialogDescription className="text-amber-600">
                          Adicione um novo recurso à seção de recursos
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="featureTitle" className="text-amber-800">Título</Label>
                          <Input
                            id="featureTitle"
                            value={newFeature.title}
                            onChange={(e) => setNewFeature({...newFeature, title: e.target.value})}
                            className="border-amber-300"
                          />
                        </div>
                        <div>
                          <Label htmlFor="featureDescription" className="text-amber-800">Descrição</Label>
                          <Textarea
                            id="featureDescription"
                            value={newFeature.description}
                            onChange={(e) => setNewFeature({...newFeature, description: e.target.value})}
                            className="border-amber-300"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="featureSubtitle" className="text-amber-800">Subtítulo</Label>
                          <Input
                            id="featureSubtitle"
                            value={newFeature.subtitle}
                            onChange={(e) => setNewFeature({...newFeature, subtitle: e.target.value})}
                            className="border-amber-300"
                          />
                        </div>
                        <Button 
                          onClick={addFeature} 
                          className="w-full bg-amber-600 hover:bg-amber-700"
                          disabled={!newFeature.title || !newFeature.description}
                        >
                          Adicionar Recurso
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {siteConfig.features.map((feature, index) => (
                    <Card key={index} className="border-amber-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 space-y-2">
                            <Input
                              value={feature.title}
                              onChange={(e) => {
                                const newFeatures = [...siteConfig.features];
                                newFeatures[index].title = e.target.value;
                                setSiteConfig(prev => ({...prev, features: newFeatures}));
                              }}
                              className="font-semibold border-amber-300"
                            />
                            <Textarea
                              value={feature.description}
                              onChange={(e) => {
                                const newFeatures = [...siteConfig.features];
                                newFeatures[index].description = e.target.value;
                                setSiteConfig(prev => ({...prev, features: newFeatures}));
                              }}
                              className="border-amber-300"
                              rows={2}
                            />
                            <Input
                              value={feature.subtitle}
                              onChange={(e) => {
                                const newFeatures = [...siteConfig.features];
                                newFeatures[index].subtitle = e.target.value;
                                setSiteConfig(prev => ({...prev, features: newFeatures}));
                              }}
                              className="text-sm border-amber-300"
                              placeholder="Subtítulo opcional"
                            />
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFeature(index)}
                            className="ml-4"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* How It Works Tab */}
          <TabsContent value="how-it-works" className="space-y-6 mt-6">
            <Card className="border-amber-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-amber-900 flex items-center">
                      {siteConfig.howItWorks.enabled ? (
                        <ToggleRight className="w-5 h-5 mr-2 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 mr-2 text-gray-400" />
                      )}
                      Como Funciona
                    </CardTitle>
                    <CardDescription className="text-amber-600">
                      Configure a seção que explica como funciona o processo
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={siteConfig.howItWorks.enabled ? "destructive" : "default"}
                      onClick={() => toggleSection('howItWorks')}
                      className={siteConfig.howItWorks.enabled ? "" : "bg-green-600 hover:bg-green-700"}
                    >
                      {siteConfig.howItWorks.enabled ? 'Desabilitar' : 'Habilitar'}
                    </Button>
                    <Dialog open={showStepDialog} onOpenChange={setShowStepDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-amber-600 hover:bg-amber-700" disabled={!siteConfig.howItWorks.enabled}>
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Passo
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-amber-900">Adicionar Novo Passo</DialogTitle>
                          <DialogDescription className="text-amber-600">
                            Adicione um novo passo à seção Como Funciona
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="stepTitle" className="text-amber-800">Título</Label>
                            <Input
                              id="stepTitle"
                              value={newStep.title}
                              onChange={(e) => setNewStep({...newStep, title: e.target.value})}
                              className="border-amber-300"
                            />
                          </div>
                          <div>
                            <Label htmlFor="stepDescription" className="text-amber-800">Descrição</Label>
                            <Textarea
                              id="stepDescription"
                              value={newStep.description}
                              onChange={(e) => setNewStep({...newStep, description: e.target.value})}
                              className="border-amber-300"
                              rows={3}
                            />
                          </div>
                          <Button 
                            onClick={addStep} 
                            className="w-full bg-amber-600 hover:bg-amber-700"
                            disabled={!newStep.title || !newStep.description}
                          >
                            Adicionar Passo
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="howItWorksTitle" className="text-amber-800">Título da Seção</Label>
                    <Input
                      id="howItWorksTitle"
                      value={siteConfig.howItWorks.title}
                      onChange={(e) => setSiteConfig(prev => ({
                        ...prev,
                        howItWorks: { ...prev.howItWorks, title: e.target.value }
                      }))}
                      className="border-amber-300"
                      disabled={!siteConfig.howItWorks.enabled}
                    />
                  </div>
                  <div>
                    <Label htmlFor="howItWorksSubtitle" className="text-amber-800">Subtítulo</Label>
                    <Input
                      id="howItWorksSubtitle"
                      value={siteConfig.howItWorks.subtitle}
                      onChange={(e) => setSiteConfig(prev => ({
                        ...prev,
                        howItWorks: { ...prev.howItWorks, subtitle: e.target.value }
                      }))}
                      className="border-amber-300"
                      disabled={!siteConfig.howItWorks.enabled}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-amber-800">Passos</Label>
                  {siteConfig.howItWorks.steps.map((step, index) => (
                    <Card key={index} className="border-amber-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {step.number}
                              </div>
                              <Input
                                value={step.title}
                                onChange={(e) => {
                                  const newSteps = [...siteConfig.howItWorks.steps];
                                  newSteps[index].title = e.target.value;
                                  setSiteConfig(prev => ({
                                    ...prev,
                                    howItWorks: { ...prev.howItWorks, steps: newSteps }
                                  }));
                                }}
                                className="font-semibold border-amber-300"
                                disabled={!siteConfig.howItWorks.enabled}
                              />
                            </div>
                            <Textarea
                              value={step.description}
                              onChange={(e) => {
                                const newSteps = [...siteConfig.howItWorks.steps];
                                newSteps[index].description = e.target.value;
                                setSiteConfig(prev => ({
                                  ...prev,
                                  howItWorks: { ...prev.howItWorks, steps: newSteps }
                                }));
                              }}
                              className="border-amber-300"
                              rows={2}
                              disabled={!siteConfig.howItWorks.enabled}
                            />
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeStep(index)}
                            className="ml-4"
                            disabled={!siteConfig.howItWorks.enabled}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-6 mt-6">
            <Card className="border-amber-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-amber-900 flex items-center">
                      {siteConfig.testimonials.enabled ? (
                        <ToggleRight className="w-5 h-5 mr-2 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 mr-2 text-gray-400" />
                      )}
                      Depoimentos
                    </CardTitle>
                    <CardDescription className="text-amber-600">
                      Configure os depoimentos dos casais clientes
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={siteConfig.testimonials.enabled ? "destructive" : "default"}
                      onClick={() => toggleSection('testimonials')}
                      className={siteConfig.testimonials.enabled ? "" : "bg-green-600 hover:bg-green-700"}
                    >
                      {siteConfig.testimonials.enabled ? 'Desabilitar' : 'Habilitar'}
                    </Button>
                    <Dialog open={showTestimonialDialog} onOpenChange={setShowTestimonialDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-amber-600 hover:bg-amber-700" disabled={!siteConfig.testimonials.enabled}>
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Depoimento
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-amber-900">Adicionar Novo Depoimento</DialogTitle>
                          <DialogDescription className="text-amber-600">
                            Adicione um novo depoimento de casal à página
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="testimonialName" className="text-amber-800">Nome do Casal</Label>
                            <Input
                              id="testimonialName"
                              value={newTestimonial.name}
                              onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                              placeholder="Ex: Ana & João"
                              className="border-amber-300"
                            />
                          </div>
                          <div>
                            <Label htmlFor="testimonialText" className="text-amber-800">Depoimento</Label>
                            <Textarea
                              id="testimonialText"
                              value={newTestimonial.text}
                              onChange={(e) => setNewTestimonial({...newTestimonial, text: e.target.value})}
                              placeholder="Digite o depoimento do casal..."
                              className="border-amber-300"
                              rows={4}
                            />
                          </div>
                          <div>
                            <Label htmlFor="testimonialAvatar" className="text-amber-800">URL da Foto (Opcional)</Label>
                            <Input
                              id="testimonialAvatar"
                              value={newTestimonial.avatar}
                              onChange={(e) => setNewTestimonial({...newTestimonial, avatar: e.target.value})}
                              placeholder="https://exemplo.com/foto.jpg"
                              className="border-amber-300"
                            />
                          </div>
                          <Button 
                            onClick={addTestimonial} 
                            className="w-full bg-amber-600 hover:bg-amber-700"
                            disabled={!newTestimonial.name || !newTestimonial.text}
                          >
                            Adicionar Depoimento
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="testimonialsTitle" className="text-amber-800">Título da Seção</Label>
                    <Input
                      id="testimonialsTitle"
                      value={siteConfig.testimonials.title}
                      onChange={(e) => setSiteConfig(prev => ({
                        ...prev,
                        testimonials: { ...prev.testimonials, title: e.target.value }
                      }))}
                      className="border-amber-300"
                      disabled={!siteConfig.testimonials.enabled}
                    />
                  </div>
                  <div>
                    <Label htmlFor="testimonialsSubtitle" className="text-amber-800">Subtítulo</Label>
                    <Input
                      id="testimonialsSubtitle"
                      value={siteConfig.testimonials.subtitle}
                      onChange={(e) => setSiteConfig(prev => ({
                        ...prev,
                        testimonials: { ...prev.testimonials, subtitle: e.target.value }
                      }))}
                      className="border-amber-300"
                      disabled={!siteConfig.testimonials.enabled}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-amber-800">Depoimentos</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {siteConfig.testimonials.items.map((testimonial, index) => (
                      <Card key={testimonial.id} className="border-amber-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <Input
                                value={testimonial.name}
                                onChange={(e) => {
                                  const newTestimonials = [...siteConfig.testimonials.items];
                                  newTestimonials[index].name = e.target.value;
                                  setSiteConfig(prev => ({
                                    ...prev,
                                    testimonials: { ...prev.testimonials, items: newTestimonials }
                                  }));
                                }}
                                className="font-semibold border-amber-300"
                                disabled={!siteConfig.testimonials.enabled}
                              />
                            </div>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeTestimonial(index)}
                              disabled={!siteConfig.testimonials.enabled}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <Textarea
                            value={testimonial.text}
                            onChange={(e) => {
                              const newTestimonials = [...siteConfig.testimonials.items];
                              newTestimonials[index].text = e.target.value;
                              setSiteConfig(prev => ({
                                ...prev,
                                testimonials: { ...prev.testimonials, items: newTestimonials }
                              }));
                            }}
                            className="border-amber-300 mb-2"
                            rows={3}
                            disabled={!siteConfig.testimonials.enabled}
                          />
                          <Input
                            value={testimonial.avatar}
                            onChange={(e) => {
                              const newTestimonials = [...siteConfig.testimonials.items];
                              newTestimonials[index].avatar = e.target.value;
                              setSiteConfig(prev => ({
                                ...prev,
                                testimonials: { ...prev.testimonials, items: newTestimonials }
                              }));
                            }}
                            placeholder="URL da foto"
                            className="border-amber-300 text-sm"
                            disabled={!siteConfig.testimonials.enabled}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-6 mt-6">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Personalização de Cores</CardTitle>
                <CardDescription className="text-amber-600">
                  Configure todas as cores do site público e área do cliente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Cores Principais */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-amber-900">Cores Principais</h3>
                    
                    <div>
                      <Label htmlFor="colorPrimary" className="text-amber-800">Cor Primária</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="colorPrimary"
                          type="color"
                          value={colorConfig.primary}
                          onChange={(e) => setColorConfig(prev => ({...prev, primary: e.target.value}))}
                          className="w-16 h-10 border-amber-300"
                        />
                        <Input
                          value={colorConfig.primary}
                          onChange={(e) => setColorConfig(prev => ({...prev, primary: e.target.value}))}
                          className="border-amber-300"
                          placeholder="#8B4513"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="colorSecondary" className="text-amber-800">Cor Secundária</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="colorSecondary"
                          type="color"
                          value={colorConfig.secondary}
                          onChange={(e) => setColorConfig(prev => ({...prev, secondary: e.target.value}))}
                          className="w-16 h-10 border-amber-300"
                        />
                        <Input
                          value={colorConfig.secondary}
                          onChange={(e) => setColorConfig(prev => ({...prev, secondary: e.target.value}))}
                          className="border-amber-300"
                          placeholder="#DEB887"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="colorAccent" className="text-amber-800">Cor de Destaque</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="colorAccent"
                          type="color"
                          value={colorConfig.accent}
                          onChange={(e) => setColorConfig(prev => ({...prev, accent: e.target.value}))}
                          className="w-16 h-10 border-amber-300"
                        />
                        <Input
                          value={colorConfig.accent}
                          onChange={(e) => setColorConfig(prev => ({...prev, accent: e.target.value}))}
                          className="border-amber-300"
                          placeholder="#D2691E"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cores de Fundo */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-amber-900">Cores de Fundo</h3>
                    
                    <div>
                      <Label htmlFor="colorBackground" className="text-amber-800">Fundo Principal</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="colorBackground"
                          type="color"
                          value={colorConfig.background}
                          onChange={(e) => setColorConfig(prev => ({...prev, background: e.target.value}))}
                          className="w-16 h-10 border-amber-300"
                        />
                        <Input
                          value={colorConfig.background}
                          onChange={(e) => setColorConfig(prev => ({...prev, background: e.target.value}))}
                          className="border-amber-300"
                          placeholder="#FFF8DC"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="colorSurface" className="text-amber-800">Superfície/Cards</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="colorSurface"
                          type="color"
                          value={colorConfig.surface}
                          onChange={(e) => setColorConfig(prev => ({...prev, surface: e.target.value}))}
                          className="w-16 h-10 border-amber-300"
                        />
                        <Input
                          value={colorConfig.surface}
                          onChange={(e) => setColorConfig(prev => ({...prev, surface: e.target.value}))}
                          className="border-amber-300"
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="colorHeaderBg" className="text-amber-800">Fundo Header</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="colorHeaderBg"
                          type="color"
                          value={colorConfig.headerBg}
                          onChange={(e) => setColorConfig(prev => ({...prev, headerBg: e.target.value}))}
                          className="w-16 h-10 border-amber-300"
                        />
                        <Input
                          value={colorConfig.headerBg}
                          onChange={(e) => setColorConfig(prev => ({...prev, headerBg: e.target.value}))}
                          className="border-amber-300"
                          placeholder="#8B4513"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cores de Texto */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-amber-900">Cores de Texto</h3>
                    
                    <div>
                      <Label htmlFor="colorTextPrimary" className="text-amber-800">Texto Principal</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="colorTextPrimary"
                          type="color"
                          value={colorConfig.textPrimary}
                          onChange={(e) => setColorConfig(prev => ({...prev, textPrimary: e.target.value}))}
                          className="w-16 h-10 border-amber-300"
                        />
                        <Input
                          value={colorConfig.textPrimary}
                          onChange={(e) => setColorConfig(prev => ({...prev, textPrimary: e.target.value}))}
                          className="border-amber-300"
                          placeholder="#2D1810"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="colorTextSecondary" className="text-amber-800">Texto Secundário</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="colorTextSecondary"
                          type="color"
                          value={colorConfig.textSecondary}
                          onChange={(e) => setColorConfig(prev => ({...prev, textSecondary: e.target.value}))}
                          className="w-16 h-10 border-amber-300"
                        />
                        <Input
                          value={colorConfig.textSecondary}
                          onChange={(e) => setColorConfig(prev => ({...prev, textSecondary: e.target.value}))}
                          className="border-amber-300"
                          placeholder="#8B4513"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="colorHeaderText" className="text-amber-800">Texto Header</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="colorHeaderText"
                          type="color"
                          value={colorConfig.headerText}
                          onChange={(e) => setColorConfig(prev => ({...prev, headerText: e.target.value}))}
                          className="w-16 h-10 border-amber-300"
                        />
                        <Input
                          value={colorConfig.headerText}
                          onChange={(e) => setColorConfig(prev => ({...prev, headerText: e.target.value}))}
                          className="border-amber-300"
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cores de Botões */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-amber-900">Cores de Botões</h3>
                    
                    <div>
                      <Label htmlFor="colorButtonPrimary" className="text-amber-800">Botão Principal</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="colorButtonPrimary"
                          type="color"
                          value={colorConfig.buttonPrimary}
                          onChange={(e) => setColorConfig(prev => ({...prev, buttonPrimary: e.target.value}))}
                          className="w-16 h-10 border-amber-300"
                        />
                        <Input
                          value={colorConfig.buttonPrimary}
                          onChange={(e) => setColorConfig(prev => ({...prev, buttonPrimary: e.target.value}))}
                          className="border-amber-300"
                          placeholder="#8B4513"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="colorButtonSecondary" className="text-amber-800">Botão Secundário</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="colorButtonSecondary"
                          type="color"
                          value={colorConfig.buttonSecondary}
                          onChange={(e) => setColorConfig(prev => ({...prev, buttonSecondary: e.target.value}))}
                          className="w-16 h-10 border-amber-300"
                        />
                        <Input
                          value={colorConfig.buttonSecondary}
                          onChange={(e) => setColorConfig(prev => ({...prev, buttonSecondary: e.target.value}))}
                          className="border-amber-300"
                          placeholder="#DEB887"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="colorHover" className="text-amber-800">Cor Hover</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="colorHover"
                          type="color"
                          value={colorConfig.hoverColor}
                          onChange={(e) => setColorConfig(prev => ({...prev, hoverColor: e.target.value}))}
                          className="w-16 h-10 border-amber-300"
                        />
                        <Input
                          value={colorConfig.hoverColor}
                          onChange={(e) => setColorConfig(prev => ({...prev, hoverColor: e.target.value}))}
                          className="border-amber-300"
                          placeholder="#6B3410"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cores de Status */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-amber-900">Cores de Status</h3>
                    
                    <div>
                      <Label htmlFor="colorSuccess" className="text-amber-800">Sucesso</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="colorSuccess"
                          type="color"
                          value={colorConfig.success}
                          onChange={(e) => setColorConfig(prev => ({...prev, success: e.target.value}))}
                          className="w-16 h-10 border-amber-300"
                        />
                        <Input
                          value={colorConfig.success}
                          onChange={(e) => setColorConfig(prev => ({...prev, success: e.target.value}))}
                          className="border-amber-300"
                          placeholder="#22C55E"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="colorWarning" className="text-amber-800">Aviso</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="colorWarning"
                          type="color"
                          value={colorConfig.warning}
                          onChange={(e) => setColorConfig(prev => ({...prev, warning: e.target.value}))}
                          className="w-16 h-10 border-amber-300"
                        />
                        <Input
                          value={colorConfig.warning}
                          onChange={(e) => setColorConfig(prev => ({...prev, warning: e.target.value}))}
                          className="border-amber-300"
                          placeholder="#F59E0B"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="colorError" className="text-amber-800">Erro</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="colorError"
                          type="color"
                          value={colorConfig.error}
                          onChange={(e) => setColorConfig(prev => ({...prev, error: e.target.value}))}
                          className="w-16 h-10 border-amber-300"
                        />
                        <Input
                          value={colorConfig.error}
                          onChange={(e) => setColorConfig(prev => ({...prev, error: e.target.value}))}
                          className="border-amber-300"
                          placeholder="#EF4444"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Outras Cores */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-amber-900">Outras Cores</h3>
                    
                    <div>
                      <Label htmlFor="colorBorder" className="text-amber-800">Bordas</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="colorBorder"
                          type="color"
                          value={colorConfig.border}
                          onChange={(e) => setColorConfig(prev => ({...prev, border: e.target.value}))}
                          className="w-16 h-10 border-amber-300"
                        />
                        <Input
                          value={colorConfig.border}
                          onChange={(e) => setColorConfig(prev => ({...prev, border: e.target.value}))}
                          className="border-amber-300"
                          placeholder="#E5E7EB"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="colorLinks" className="text-amber-800">Links</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="colorLinks"
                          type="color"
                          value={colorConfig.linkColor}
                          onChange={(e) => setColorConfig(prev => ({...prev, linkColor: e.target.value}))}
                          className="w-16 h-10 border-amber-300"
                        />
                        <Input
                          value={colorConfig.linkColor}
                          onChange={(e) => setColorConfig(prev => ({...prev, linkColor: e.target.value}))}
                          className="border-amber-300"
                          placeholder="#3B82F6"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="colorInputBorder" className="text-amber-800">Borda Inputs</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="colorInputBorder"
                          type="color"
                          value={colorConfig.inputBorder}
                          onChange={(e) => setColorConfig(prev => ({...prev, inputBorder: e.target.value}))}
                          className="w-16 h-10 border-amber-300"
                        />
                        <Input
                          value={colorConfig.inputBorder}
                          onChange={(e) => setColorConfig(prev => ({...prev, inputBorder: e.target.value}))}
                          className="border-amber-300"
                          placeholder="#D1D5DB"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-amber-200">
                  <div className="flex space-x-4">
                    <Button 
                      onClick={() => {
                        // Reset to default colors
                        setColorConfig({
                          primary: '#8B4513',
                          secondary: '#DEB887', 
                          accent: '#D2691E',
                          background: '#FFF8DC',
                          surface: '#FFFFFF',
                          textPrimary: '#2D1810',
                          textSecondary: '#8B4513',
                          success: '#22C55E',
                          warning: '#F59E0B',
                          error: '#EF4444',
                          border: '#E5E7EB',
                          buttonPrimary: '#8B4513',
                          buttonSecondary: '#DEB887',
                          headerBg: '#8B4513',
                          headerText: '#FFFFFF',
                          cardBg: '#FFFFFF',
                          inputBorder: '#D1D5DB',
                          linkColor: '#3B82F6',
                          hoverColor: '#6B3410'
                        });
                        toast({
                          title: "Cores resetadas!",
                          description: "As cores foram restauradas para os valores padrão."
                        });
                      }}
                      variant="outline"
                      className="border-amber-300 text-amber-700"
                    >
                      Restaurar Padrão
                    </Button>
                  </div>
                  <Button 
                    onClick={async () => {
                      try {
                        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
                        
                        // Preparar dados para o backend
                        const colorsData = {
                          primary: colorConfig.primary,
                          secondary: colorConfig.secondary,
                          accent: colorConfig.accent,
                          background: colorConfig.background,
                          surface: colorConfig.surface,
                          text_primary: colorConfig.text_primary,
                          text_secondary: colorConfig.text_secondary,
                          success: colorConfig.success,
                          warning: colorConfig.warning,
                          error: colorConfig.error,
                          border: colorConfig.border,
                          button_primary: colorConfig.button_primary,
                          button_secondary: colorConfig.button_secondary,
                          header_bg: colorConfig.header_bg,
                          header_text: colorConfig.header_text,
                          input_border: colorConfig.input_border,
                          link_color: colorConfig.link_color,
                          hover_color: colorConfig.hover_color
                        };

                        // Salvar no backend
                        const response = await fetch(`${backendUrl}/api/admin/site-colors`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(colorsData),
                        });

                        if (response.ok) {
                          const savedColors = await response.json();
                          setColorConfigId(savedColors.id);
                          
                          // Aplicar cores visualmente
                          applyColors(savedColors);
                          
                          toast({
                            title: "Cores aplicadas e salvas!",
                            description: "As alterações de cores foram aplicadas ao site e salvas no servidor."
                          });
                        } else {
                          throw new Error('Erro ao salvar cores');
                        }
                      } catch (error) {
                        console.error('Erro ao salvar cores:', error);
                        toast({
                          title: "Erro ao salvar cores",
                          description: "Não foi possível salvar as alterações. Tente novamente.",
                          variant: "destructive"
                        });
                      }
                    }}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Aplicar e Salvar Cores
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-6 mt-6">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Configurações de SEO</CardTitle>
                <CardDescription className="text-amber-600">
                  Configure todas as meta tags e otimizações para buscadores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Meta Tags Básicas */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-amber-900">Meta Tags Básicas</h3>
                    
                    <div>
                      <Label htmlFor="seoTitle" className="text-amber-800">Título da Página (Title)</Label>
                      <Input
                        id="seoTitle"
                        value={seoConfig.title}
                        onChange={(e) => setSeoConfig(prev => ({...prev, title: e.target.value}))}
                        className="border-amber-300"
                        placeholder="UpnaFesta - Compartilhamento de Fotos para Casamentos"
                      />
                      <p className="text-xs text-amber-600 mt-1">Recomendado: 50-60 caracteres</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="seoDescription" className="text-amber-800">Descrição (Meta Description)</Label>
                      <Textarea
                        id="seoDescription"
                        value={seoConfig.description}
                        onChange={(e) => setSeoConfig(prev => ({...prev, description: e.target.value}))}
                        className="border-amber-300"
                        rows={3}
                        placeholder="Plataforma completa para compartilhamento de fotos de casamentos com integração ao Google Drive"
                      />
                      <p className="text-xs text-amber-600 mt-1">Recomendado: 150-160 caracteres</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="seoKeywords" className="text-amber-800">Palavras-chave</Label>
                      <Input
                        id="seoKeywords"
                        value={seoConfig.keywords}
                        onChange={(e) => setSeoConfig(prev => ({...prev, keywords: e.target.value}))}
                        className="border-amber-300"
                        placeholder="casamento, fotos, compartilhamento, google drive, upload, festa"
                      />
                      <p className="text-xs text-amber-600 mt-1">Separe por vírgulas</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="seoCanonical" className="text-amber-800">URL Canônica</Label>
                      <Input
                        id="seoCanonical"
                        value={seoConfig.canonical}
                        onChange={(e) => setSeoConfig(prev => ({...prev, canonical: e.target.value}))}
                        className="border-amber-300"
                        placeholder="https://upnafesta.com"
                      />
                    </div>
                  </div>

                  {/* Open Graph / Social Media */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-amber-900">Open Graph (Redes Sociais)</h3>
                    
                    <div>
                      <Label htmlFor="ogTitle" className="text-amber-800">Título OG</Label>
                      <Input
                        id="ogTitle"
                        value={seoConfig.ogTitle}
                        onChange={(e) => setSeoConfig(prev => ({...prev, ogTitle: e.target.value}))}
                        className="border-amber-300"
                        placeholder="UpnaFesta - Fotos do Seu Casamento"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ogDescription" className="text-amber-800">Descrição OG</Label>
                      <Textarea
                        id="ogDescription"
                        value={seoConfig.ogDescription}
                        onChange={(e) => setSeoConfig(prev => ({...prev, ogDescription: e.target.value}))}
                        className="border-amber-300"
                        rows={3}
                        placeholder="Compartilhe e receba fotos do seu casamento de forma simples e organizada"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ogImage" className="text-amber-800">Imagem OG</Label>
                      <Input
                        id="ogImage"
                        value={seoConfig.ogImage}
                        onChange={(e) => setSeoConfig(prev => ({...prev, ogImage: e.target.value}))}
                        className="border-amber-300"
                        placeholder="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80"
                      />
                      <p className="text-xs text-amber-600 mt-1">Recomendado: 1200x630px</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="favicon" className="text-amber-800">Favicon</Label>
                      <Input
                        id="favicon"
                        value={seoConfig.favicon}
                        onChange={(e) => setSeoConfig(prev => ({...prev, favicon: e.target.value}))}
                        className="border-amber-300"
                        placeholder="/favicon.ico"
                      />
                    </div>
                  </div>
                </div>

                {/* Configurações Avançadas */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-amber-900">Configurações Avançadas</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="robots" className="text-amber-800">Robots Meta Tag</Label>
                      <select
                        id="robots"
                        value={seoConfig.robots}
                        onChange={(e) => setSeoConfig(prev => ({...prev, robots: e.target.value}))}
                        className="w-full rounded-md border border-amber-300 bg-background px-3 py-2 text-sm"
                      >
                        <option value="index, follow">Index, Follow (Padrão)</option>
                        <option value="noindex, follow">No Index, Follow</option>
                        <option value="index, nofollow">Index, No Follow</option>
                        <option value="noindex, nofollow">No Index, No Follow</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-amber-900">Preview nos Buscadores</h3>
                  <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
                    <div className="space-y-2">
                      <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                        {seoConfig.title || "Título da página"}
                      </div>
                      <div className="text-green-700 text-sm">
                        {seoConfig.canonical || "https://upnafesta.com"}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {seoConfig.description || "Descrição da página aparecerá aqui..."}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-amber-200">
                  <Button 
                    onClick={() => {
                      // Generate and inject SEO meta tags
                      document.title = seoConfig.title;
                      
                      // Update or create meta tags
                      const metaTags = [
                        { name: 'description', content: seoConfig.description },
                        { name: 'keywords', content: seoConfig.keywords },
                        { name: 'robots', content: seoConfig.robots },
                        { property: 'og:title', content: seoConfig.ogTitle },
                        { property: 'og:description', content: seoConfig.ogDescription },
                        { property: 'og:image', content: seoConfig.ogImage },
                        { property: 'og:type', content: 'website' },
                        { property: 'og:url', content: seoConfig.canonical }
                      ];
                      
                      metaTags.forEach(tag => {
                        let metaElement = document.querySelector(`meta[${tag.name ? 'name' : 'property'}="${tag.name || tag.property}"]`);
                        if (!metaElement) {
                          metaElement = document.createElement('meta');
                          if (tag.name) metaElement.name = tag.name;
                          if (tag.property) metaElement.setAttribute('property', tag.property);
                          document.head.appendChild(metaElement);
                        }
                        metaElement.content = tag.content;
                      });
                      
                      // Update canonical link
                      let canonicalLink = document.querySelector('link[rel="canonical"]');
                      if (!canonicalLink) {
                        canonicalLink = document.createElement('link');
                        canonicalLink.rel = 'canonical';
                        document.head.appendChild(canonicalLink);
                      }
                      canonicalLink.href = seoConfig.canonical;
                      
                      // Update favicon
                      let faviconLink = document.querySelector('link[rel="icon"]');
                      if (!faviconLink) {
                        faviconLink = document.createElement('link');
                        faviconLink.rel = 'icon';
                        document.head.appendChild(faviconLink);
                      }
                      faviconLink.href = seoConfig.favicon;
                      
                      toast({
                        title: "SEO configurado!",
                        description: "As configurações de SEO foram aplicadas ao site."
                      });
                    }}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Aplicar SEO
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SiteManagement;