import React, { useState } from 'react';
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
  ToggleRight
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
  const { toast } = useToast();

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
          <TabsList className="grid w-full grid-cols-5 bg-amber-100">
            <TabsTrigger value="content" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Type className="w-4 h-4 mr-2" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="images" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Image className="w-4 h-4 mr-2" />
              Imagens
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
        </Tabs>
      </div>
    </div>
  );
};

export default SiteManagement;