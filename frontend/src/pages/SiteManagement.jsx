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

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6 mt-6">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Configuração de Preços</CardTitle>
                <CardDescription className="text-amber-600">
                  Defina o preço e os recursos incluídos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="price" className="text-amber-800">Preço</Label>
                  <Input
                    id="price"
                    value={siteConfig.pricing?.price || ''}
                    onChange={(e) => handleConfigChange('pricing', 'price', e.target.value)}
                    className="border-amber-300"
                    placeholder="R$ 99,90"
                  />
                </div>

                <div>
                  <Label htmlFor="priceDescription" className="text-amber-800">Descrição do Preço</Label>
                  <Input
                    id="priceDescription"
                    value={siteConfig.pricing?.description || ''}
                    onChange={(e) => handleConfigChange('pricing', 'description', e.target.value)}
                    className="border-amber-300"
                    placeholder="Pagamento único por álbum"
                  />
                </div>

                <div>
                  <Label className="text-amber-800">Recursos Incluídos</Label>
                  <div className="mt-2 space-y-2">
                    {siteConfig.pricing?.features?.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...(siteConfig.pricing?.features || [])];
                            newFeatures[index] = e.target.value;
                            handleConfigChange('pricing', 'features', newFeatures);
                          }}
                          className="border-amber-300"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            const newFeatures = (siteConfig.pricing?.features || []).filter((_, i) => i !== index);
                            handleConfigChange('pricing', 'features', newFeatures);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => {
                        const newFeatures = [...(siteConfig.pricing?.features || []), ''];
                        handleConfigChange('pricing', 'features', newFeatures);
                      }}
                      className="w-full border-amber-300 text-amber-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Recurso
                    </Button>
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