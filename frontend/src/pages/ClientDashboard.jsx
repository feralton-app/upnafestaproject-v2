import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Camera, 
  Palette, 
  Heart, 
  QrCode, 
  ExternalLink, 
  Upload, 
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  Bell,
  Copy,
  LogOut,
  KeyRound,
  Plus,
  Trash2,
  Link as LinkIcon,
  FolderOpen,
  Unlink,
  Edit,
  Settings
} from 'lucide-react';
import { mockClients, getStatusLabel, getStatusColor, generateMockQRCode, mockPaymentMethods } from '../mock';
import { useToast } from '../hooks/use-toast';

const ClientDashboard = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const client = mockClients.find(c => c.id === clientId);
  const [selectedAlbumId, setSelectedAlbumId] = useState(client?.albums[0]?.id || null);
  const selectedAlbum = client?.albums?.find(a => a.id === selectedAlbumId);
  
  const [customization, setCustomization] = useState(selectedAlbum?.customization || {});
  const [paymentProof, setPaymentProof] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showGoogleDialog, setShowGoogleDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteAlbumDialog, setShowDeleteAlbumDialog] = useState(false);
  const [showCreateAlbumDialog, setShowCreateAlbumDialog] = useState(false);
  const [showImageUploadDialog, setShowImageUploadDialog] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ name: '', eventDate: '' });
  const [googleConfig, setGoogleConfig] = useState({
    account: client?.googleAccount || '',
    folderId: selectedAlbum?.googleFolderId || ''
  });
  const [newPassword, setNewPassword] = useState({ current: '', new: '', confirm: '' });
  const { toast } = useToast();

  if (!client) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <Card className="border-amber-200">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-amber-900 mb-2">Cliente não encontrado</h2>
            <p className="text-amber-600 mb-4">O cliente solicitado não existe no sistema.</p>
            <Link to="/login">
              <Button className="bg-amber-600 hover:bg-amber-700">Voltar ao Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Link copiado para a área de transferência."
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logout realizado!",
      description: "Você foi desconectado com sucesso."
    });
    navigate('/');
  };

  const connectGoogleDrive = () => {
    // Simulate Google OAuth2 flow
    window.open('https://accounts.google.com/oauth/authorize?client_id=mock&redirect_uri=mock&scope=drive', '_blank', 'width=500,height=600');
    
    // Simulate OAuth success after 3 seconds
    setTimeout(() => {
      toast({
        title: "Google Drive conectado!",
        description: `Conectado à conta ${googleConfig.account || 'usuario@gmail.com'}`
      });
      setShowGoogleDialog(false);
    }, 3000);
  };

  const disconnectGoogleDrive = () => {
    toast({
      title: "Google Drive desconectado!",
      description: "Sua conta foi desconectada com sucesso."
    });
    setGoogleConfig({ account: '', folderId: '' });
  };

  const changePassword = () => {
    if (newPassword.current && newPassword.new && newPassword.new === newPassword.confirm) {
      toast({
        title: "Senha alterada!",
        description: "Sua senha foi alterada com sucesso."
      });
      setShowPasswordDialog(false);
      setNewPassword({ current: '', new: '', confirm: '' });
    } else {
      toast({
        title: "Erro ao alterar senha",
        description: "Verifique se as senhas coincidem.",
        variant: "destructive"
      });
    }
  };

  const createAlbum = () => {
    if (newAlbum.name && newAlbum.eventDate && client.albums.length < client.albumLimit && client.status === 'approved') {
      toast({
        title: "Álbum criado!",
        description: `Álbum "${newAlbum.name}" criado com sucesso!`
      });
      setShowCreateAlbumDialog(false);
      setNewAlbum({ name: '', eventDate: '' });
    } else if (client.status !== 'approved') {
      toast({
        title: "Pagamento pendente",
        description: "Você precisa ter o pagamento aprovado para criar álbuns.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Limite atingido ou dados incompletos",
        description: "Verifique se preencheu todos os campos e se não atingiu o limite de álbuns.",
        variant: "destructive"
      });
    }
  };

  const deleteAlbum = () => {
    toast({
      title: "Álbum excluído!",
      description: "A página de upload foi removida. As fotos no Google Drive permanecem intactas."
    });
    setShowDeleteAlbumDialog(false);
  };

  const saveCustomization = () => {
    toast({
      title: "Personalização salva!",
      description: "As alterações foram aplicadas ao seu álbum."
    });
  };

  const uploadPaymentProof = () => {
    if (paymentProof) {
      toast({
        title: "Comprovante enviado!",
        description: "Seu comprovante está sendo analisado."
      });
      setShowPaymentDialog(false);
    }
  };

  const uploadImage = (type) => {
    // Simulate image upload
    toast({
      title: "Imagem enviada!",
      description: "Sua imagem foi carregada com sucesso."
    });
    setShowImageUploadDialog(false);
  };

  const canCreateAlbum = client.status === 'approved' && client.albums.length < client.albumLimit;
  const albumUrl = selectedAlbum ? `${window.location.origin}/album/${selectedAlbum.id}` : '';
  const qrCodeUrl = selectedAlbum ? generateMockQRCode(selectedAlbum.id) : '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-amber-600" />
              <div>
                <h1 className="text-2xl font-bold text-amber-900">Meus Álbuns</h1>
                <p className="text-amber-600">{client.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {client.notifications?.filter(n => !n.read).length > 0 && (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  <Bell className="w-3 h-3 mr-1" />
                  {client.notifications.filter(n => !n.read).length} nova(s)
                </Badge>
              )}
              <Badge className={getStatusColor(client.status)}>
                {getStatusLabel(client.status)}
              </Badge>
              
              {/* Google Drive Status */}
              <Dialog open={showGoogleDialog} onOpenChange={setShowGoogleDialog}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={client.googleDriveConnected ? "text-green-700 border-green-300" : "text-blue-700 border-blue-300"}
                  >
                    <LinkIcon className="w-3 h-3 mr-1" />
                    {client.googleDriveConnected ? 'Google Conectado' : 'Conectar Google'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-amber-900">
                      {client.googleDriveConnected ? 'Gerenciar Google Drive' : 'Conectar Google Drive'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {client.googleDriveConnected ? (
                      <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-green-900">Conta Conectada</p>
                              <p className="text-sm text-green-700">{client.googleAccount}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="googleFolder" className="text-amber-800">ID da Pasta do Google Drive</Label>
                          <Input
                            id="googleFolder"
                            value={googleConfig.folderId}
                            onChange={(e) => setGoogleConfig({...googleConfig, folderId: e.target.value})}
                            placeholder="1A2B3C4D5E6F7G8H9I0J"
                            className="border-amber-300"
                          />
                          <p className="text-xs text-amber-600 mt-1">
                            ID da pasta onde as fotos deste álbum serão armazenadas
                          </p>
                        </div>

                        <div className="flex space-x-2">
                          <Button onClick={connectGoogleDrive} className="flex-1 bg-amber-600 hover:bg-amber-700">
                            <Settings className="w-4 h-4 mr-2" />
                            Atualizar Configuração
                          </Button>
                          <Button 
                            onClick={disconnectGoogleDrive} 
                            variant="destructive"
                            className="flex-1"
                          >
                            <Unlink className="w-4 h-4 mr-2" />
                            Desconectar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-amber-700">
                          Conecte sua conta do Google Drive para que as fotos dos convidados sejam salvas automaticamente.
                        </p>
                        
                        <div>
                          <Label htmlFor="googleAccount" className="text-amber-800">Conta Google</Label>
                          <Input
                            id="googleAccount"
                            value={googleConfig.account}
                            onChange={(e) => setGoogleConfig({...googleConfig, account: e.target.value})}
                            placeholder="seu.email@gmail.com"
                            className="border-amber-300"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="googleFolder" className="text-amber-800">ID da Pasta do Google Drive</Label>
                          <Input
                            id="googleFolder"
                            value={googleConfig.folderId}
                            onChange={(e) => setGoogleConfig({...googleConfig, folderId: e.target.value})}
                            placeholder="1A2B3C4D5E6F7G8H9I0J"
                            className="border-amber-300"
                          />
                          <p className="text-xs text-amber-600 mt-1">
                            Crie uma pasta no Google Drive e cole o ID aqui
                          </p>
                        </div>

                        <Button onClick={connectGoogleDrive} className="w-full bg-amber-600 hover:bg-amber-700">
                          <FolderOpen className="w-4 h-4 mr-2" />
                          Conectar Google Drive
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              
              {/* Reset Password */}
              <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-blue-700 border-blue-300">
                    <KeyRound className="w-3 h-3 mr-1" />
                    Alterar Senha
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-amber-900">Alterar Senha</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword" className="text-amber-800">Senha Atual</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={newPassword.current}
                        onChange={(e) => setNewPassword({...newPassword, current: e.target.value})}
                        className="border-amber-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword" className="text-amber-800">Nova Senha</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword.new}
                        onChange={(e) => setNewPassword({...newPassword, new: e.target.value})}
                        className="border-amber-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="text-amber-800">Confirmar Nova Senha</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={newPassword.confirm}
                        onChange={(e) => setNewPassword({...newPassword, confirm: e.target.value})}
                        className="border-amber-300"
                      />
                    </div>
                    <Button onClick={changePassword} className="w-full bg-amber-600 hover:bg-amber-700">
                      <KeyRound className="w-4 h-4 mr-2" />
                      Alterar Senha
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              {/* Logout */}
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-700 border-red-300">
                <LogOut className="w-3 h-3 mr-1" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment Status Alerts */}
        <div className="mb-8 space-y-4">
          {client.status === 'pending_payment' && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Pagamento necessário!</strong> Realize o pagamento para poder criar álbuns.
                <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                  <DialogTrigger asChild>
                    <Button className="ml-4 bg-yellow-600 hover:bg-yellow-700 text-white">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Realizar Pagamento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-amber-900">Realizar Pagamento</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-amber-900">R$ 99,90</p>
                        <p className="text-amber-600">Pagamento único por conta</p>
                      </div>
                      
                      {mockPaymentMethods.map(method => (
                        <Card key={method.id} className="border-amber-200">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{method.icon}</span>
                              <div className="flex-1">
                                <h4 className="font-semibold text-amber-900">{method.name}</h4>
                                <p className="text-sm text-amber-600">{method.description}</p>
                              </div>
                            </div>
                            {method.id === 'pix' && (
                              <div className="mt-3 p-3 bg-amber-50 rounded text-center">
                                <p className="text-sm text-amber-800 mb-2">Chave PIX:</p>
                                <p className="font-mono text-sm break-all">{method.details.key}</p>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="mt-2"
                                  onClick={() => copyToClipboard(method.details.key)}
                                >
                                  <Copy className="w-3 h-3 mr-1" />
                                  Copiar
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                      
                      <div className="space-y-2">
                        <Label htmlFor="payment-proof">Enviar Comprovante</Label>
                        <Input
                          id="payment-proof"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => setPaymentProof(e.target.files[0])}
                          className="border-amber-300"
                        />
                      </div>
                      
                      <Button 
                        className="w-full bg-amber-600 hover:bg-amber-700"
                        onClick={uploadPaymentProof}
                        disabled={!paymentProof}
                      >
                        Enviar Comprovante
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </AlertDescription>
            </Alert>
          )}

          {client.status === 'payment_sent' && (
            <Alert className="border-blue-200 bg-blue-50">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Comprovante em análise.</strong> Aguardando aprovação do pagamento.
              </AlertDescription>
            </Alert>
          )}

          {client.status === 'approved' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Pagamento aprovado!</strong> Você pode criar até {client.albumLimit} álbum(ns).
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Albums Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Albums List */}
          <div className="lg:col-span-1">
            <Card className="border-amber-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-amber-900">Meus Álbuns</CardTitle>
                  {canCreateAlbum && (
                    <Dialog open={showCreateAlbumDialog} onOpenChange={setShowCreateAlbumDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                          <Plus className="w-3 h-3 mr-1" />
                          Criar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-amber-900">Criar Novo Álbum</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="albumName" className="text-amber-800">Nome do Álbum</Label>
                            <Input
                              id="albumName"
                              value={newAlbumName}
                              onChange={(e) => setNewAlbumName(e.target.value)}
                              placeholder="Ex: Casamento Principal"
                              className="border-amber-300"
                            />
                          </div>
                          <Button onClick={createAlbum} className="w-full bg-amber-600 hover:bg-amber-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Criar Álbum
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <CardDescription className="text-amber-600">
                  {client.albums.length}/{client.albumLimit} álbuns criados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {client.albums.length === 0 ? (
                  <div className="text-center py-8">
                    <Camera className="w-12 h-12 text-amber-300 mx-auto mb-4" />
                    <p className="text-amber-500 mb-4">Nenhum álbum criado</p>
                    {canCreateAlbum && (
                      <Button 
                        onClick={() => setShowCreateAlbumDialog(true)}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Primeiro Álbum
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {client.albums.map((album) => (
                      <div 
                        key={album.id}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          selectedAlbumId === album.id 
                            ? 'border-amber-500 bg-amber-50' 
                            : 'border-amber-200 hover:border-amber-300'
                        }`}
                        onClick={() => setSelectedAlbumId(album.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-amber-900">{album.name}</h4>
                            <p className="text-sm text-amber-600">Status: {album.status}</p>
                          </div>
                          <Badge variant="secondary" className={album.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {album.status === 'active' ? 'Ativo' : 'Pendente'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Album Details */}
          <div className="lg:col-span-2">
            {selectedAlbum ? (
              <Tabs defaultValue="share" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-amber-100">
                  <TabsTrigger value="share" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                    Compartilhar
                  </TabsTrigger>
                  <TabsTrigger value="customize" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                    Personalizar
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                    Configurações
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="share" className="mt-6">
                  <Card className="border-amber-200">
                    <CardHeader>
                      <CardTitle className="text-amber-900">Compartilhar Álbum</CardTitle>
                      <CardDescription className="text-amber-600">
                        Compartilhe este álbum com seus convidados
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedAlbum.status === 'active' ? (
                        <>
                          <div>
                            <Label className="text-amber-800">Link do Álbum</Label>
                            <div className="flex mt-1">
                              <Input
                                value={albumUrl}
                                readOnly
                                className="border-amber-300"
                              />
                              <Button
                                variant="outline"
                                className="ml-2 text-amber-700 border-amber-300"
                                onClick={() => copyToClipboard(albumUrl)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="text-center">
                            <Label className="text-amber-800">QR Code</Label>
                            <div className="mt-2">
                              <img
                                src={qrCodeUrl}
                                alt="QR Code do álbum"
                                className="mx-auto border border-amber-200 rounded"
                              />
                            </div>
                          </div>

                          <Link to={`/album/${selectedAlbum.id}`}>
                            <Button className="w-full bg-amber-600 hover:bg-amber-700">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Visualizar Álbum
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <QrCode className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                          <p className="text-amber-500">Álbum ainda não está ativo</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="customize" className="mt-6">
                  <Card className="border-amber-200">
                    <CardHeader>
                      <CardTitle className="text-amber-900">Personalizar Álbum</CardTitle>
                      <CardDescription className="text-amber-600">
                        Customize a aparência do seu álbum
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="primaryColor" className="text-amber-800">Cor Principal</Label>
                          <Input
                            id="primaryColor"
                            type="color"
                            value={customization.primaryColor || '#8B4513'}
                            onChange={(e) => setCustomization(prev => ({...prev, primaryColor: e.target.value}))}
                            className="h-10 border-amber-300"
                          />
                        </div>
                        <div>
                          <Label htmlFor="secondaryColor" className="text-amber-800">Cor Secundária</Label>
                          <Input
                            id="secondaryColor"
                            type="color"
                            value={customization.secondaryColor || '#DEB887'}
                            onChange={(e) => setCustomization(prev => ({...prev, secondaryColor: e.target.value}))}
                            className="h-10 border-amber-300"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label htmlFor="mainPhoto" className="text-amber-800">Foto Principal</Label>
                          <Dialog open={showImageUploadDialog} onOpenChange={setShowImageUploadDialog}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-amber-700 border-amber-300">
                                <Upload className="w-3 h-3 mr-1" />
                                Upload
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="text-amber-900">Upload de Imagem</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  className="border-amber-300"
                                />
                                <Button onClick={() => uploadImage('main')} className="w-full bg-amber-600 hover:bg-amber-700">
                                  <Upload className="w-4 h-4 mr-2" />
                                  Enviar Imagem
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <Input
                          id="mainPhoto"
                          value={customization.mainPhoto || ''}
                          onChange={(e) => setCustomization(prev => ({...prev, mainPhoto: e.target.value}))}
                          placeholder="https://exemplo.com/foto.jpg ou faça upload"
                          className="border-amber-300"
                        />
                      </div>

                      <div>
                        <Label htmlFor="welcomeMessage" className="text-amber-800">Mensagem de Boas-vindas</Label>
                        <Textarea
                          id="welcomeMessage"
                          value={customization.welcomeMessage || ''}
                          onChange={(e) => setCustomization(prev => ({...prev, welcomeMessage: e.target.value}))}
                          placeholder="Deixe uma mensagem especial para seus convidados"
                          className="border-amber-300"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="thankYouMessage" className="text-amber-800">Mensagem de Agradecimento</Label>
                        <Textarea
                          id="thankYouMessage"
                          value={customization.thankYouMessage || ''}
                          onChange={(e) => setCustomization(prev => ({...prev, thankYouMessage: e.target.value}))}
                          placeholder="Mensagem que aparece após o envio das fotos"
                          className="border-amber-300"
                          rows={2}
                        />
                      </div>

                      <Button
                        onClick={saveCustomization}
                        className="w-full bg-amber-600 hover:bg-amber-700"
                      >
                        Salvar Personalização
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                  <Card className="border-amber-200">
                    <CardHeader>
                      <CardTitle className="text-amber-900">Configurações do Álbum</CardTitle>
                      <CardDescription className="text-amber-600">
                        Gerencie as configurações avançadas
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Google Drive for this album */}
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-2">Google Drive deste Álbum</h4>
                        <div className="space-y-2">
                          <Label htmlFor="albumFolder" className="text-amber-800">ID da Pasta (específica para este álbum)</Label>
                          <Input
                            id="albumFolder"
                            value={selectedAlbum.googleFolderId || ''}
                            onChange={(e) => {
                              // Update album specific folder
                            }}
                            placeholder="1A2B3C4D5E6F7G8H9I0J"
                            className="border-amber-300"
                          />
                          <p className="text-xs text-amber-600">
                            Deixe vazio para usar a pasta padrão da conta
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-amber-200 pt-4">
                        <h4 className="font-semibold text-amber-900 mb-2">Zona de Perigo</h4>
                        <Dialog open={showDeleteAlbumDialog} onOpenChange={setShowDeleteAlbumDialog}>
                          <DialogTrigger asChild>
                            <Button variant="destructive" className="w-full">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir Este Álbum
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="text-amber-900">Confirmar Exclusão do Álbum</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p className="text-amber-700">
                                Esta ação removerá permanentemente a página de upload deste álbum.
                              </p>
                              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <div className="flex items-center">
                                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                  <div>
                                    <p className="text-sm font-medium text-green-900">Suas fotos estão seguras</p>
                                    <p className="text-sm text-green-700">As fotos já enviadas pelos convidados permanecem no seu Google Drive</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setShowDeleteAlbumDialog(false)}>
                                  Cancelar
                                </Button>
                                <Button variant="destructive" onClick={deleteAlbum}>
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Excluir Álbum
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="border-amber-200">
                <CardContent className="p-12 text-center">
                  <Camera className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-amber-900 mb-2">Selecione um álbum</h3>
                  <p className="text-amber-600 mb-6">
                    Escolha um álbum na lista ao lado para ver suas configurações
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Recent Notifications */}
        {client.notifications?.length > 0 && (
          <Card className="mt-8 border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notificações Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {client.notifications.slice(0, 3).map(notification => (
                  <div 
                    key={notification.id}
                    className={`p-3 rounded-lg border ${notification.read ? 'bg-gray-50' : 'bg-amber-50 border-amber-200'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-amber-900">{notification.title}</h4>
                        <p className="text-sm text-amber-700 mt-1">{notification.message}</p>
                      </div>
                      <span className="text-xs text-amber-500">{notification.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;