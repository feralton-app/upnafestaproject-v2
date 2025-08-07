import React, { useState, useEffect } from 'react';
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
  Settings,
  Save
} from 'lucide-react';
import { mockClients, getStatusLabel, getStatusColor, generateMockQRCode, mockPaymentMethods } from '../mock';
import { useToast } from '../hooks/use-toast';

const ClientDashboard = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  
  // Estado para dados reais do cliente
  const [realClient, setRealClient] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fallback para mock se não conseguir buscar dados reais
  const mockClient = mockClients.find(c => c.id === clientId);
  const client = realClient || mockClient;
  
  const [selectedAlbumId, setSelectedAlbumId] = useState(client?.albums[0]?.id || null);
  const selectedAlbum = client?.albums?.find(a => a.id === selectedAlbumId);
  
  // Buscar dados reais do cliente
  useEffect(() => {
    fetchClientData();
  }, [clientId]);
  
  // Verificar se foi redirecionado do Google OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('google_connected') === 'true') {
      // Remover parâmetro da URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Recarregar dados do cliente
      setTimeout(() => {
        fetchClientData();
        toast({
          title: "Google Drive conectado!",
          description: "Sua conta Google foi conectada com sucesso!"
        });
      }, 1000);
    }

    // Escutar mensagens de popup do Google OAuth
    const handleMessage = (event) => {
      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        fetchClientData();
        toast({
          title: "Google Drive conectado!",
          description: `Conectado com a conta ${event.data.email}!`
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  const fetchClientData = async () => {
    try {
      setLoading(true);
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/clients/${clientId}`);
      
      if (response.ok) {
        const clientData = await response.json();
        
        // Verificar se tem Google token ativo
        const tokenResponse = await fetch(`${backendUrl}/api/clients/${clientId}/google-status`);
        let googleDriveConnected = false;
        let googleAccount = null;
        
        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          googleDriveConnected = tokenData.connected;
          googleAccount = tokenData.email;
        }
        
        // Buscar álbuns do cliente
        const albumsResponse = await fetch(`${backendUrl}/api/clients/${clientId}/albums`);
        let albums = [];
        if (albumsResponse.ok) {
          albums = await albumsResponse.json();
        }
        
        setRealClient({
          ...clientData,
          googleDriveConnected,
          googleAccount,
          albums: albums.map(album => ({
            ...album,
            id: album.id,
            name: album.name,
            eventDate: album.event_date,
            status: album.status,
            googleFolderId: album.google_folder_id,
            customization: {
              primaryColor: album.primary_color || '#8B4513',
              secondaryColor: album.secondary_color || '#DEB887',
              mainPhoto: album.main_photo || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
              welcomeMessage: album.welcome_message || 'Queridos amigos e familiares, compartilhem conosco os momentos especiais do nosso grande dia!',
              thankYouMessage: album.thank_you_message || 'Obrigado por fazer parte da nossa história de amor!'
            }
          }))
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados do cliente:', error);
      // Usar dados mock como fallback
    } finally {
      setLoading(false);
    }
  };
  
  const [customization, setCustomization] = useState(selectedAlbum?.customization || {});
  const [paymentProof, setPaymentProof] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showGoogleDialog, setShowGoogleDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteAlbumDialog, setShowDeleteAlbumDialog] = useState(false);
  const [showCreateAlbumDialog, setShowCreateAlbumDialog] = useState(false);
  const [showImageUploadDialog, setShowImageUploadDialog] = useState(false);
  const [showTestUpload, setShowTestUpload] = useState(false);
  const [testFile, setTestFile] = useState(null);
  const [testResult, setTestResult] = useState(null);
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

  const connectGoogleDrive = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/auth/google/authorize/${clientId}`);
      
      if (response.ok) {
        const data = await response.json();
        // Abrir janela de autorização Google OAuth
        window.open(data.auth_url, '_blank', 'width=500,height=600');
        
        toast({
          title: "Redirecionando para Google",
          description: "Complete o processo de autorização na nova janela."
        });
        
        // Simular sucesso após delay (na prática, seria via callback)
        setTimeout(() => {
          toast({
            title: "Google Drive conectado!",
            description: `Conectado à conta Google com sucesso!`
          });
          setShowGoogleDialog(false);
        }, 5000);
      } else {
        throw new Error('Falha ao obter URL de autorização');
      }
    } catch (error) {
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar ao Google Drive. Verifique as configurações.",
        variant: "destructive"
      });
    }
  };

  const disconnectGoogleDrive = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/clients/${clientId}/google-connection`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast({
          title: "Google Drive desconectado!",
          description: "Sua conta foi desconectada com sucesso."
        });
        
        // Recarregar dados do cliente
        fetchClientData();
        setShowGoogleDialog(false);
      } else {
        throw new Error('Falha ao desconectar');
      }
    } catch (error) {
      toast({
        title: "Erro ao desconectar",
        description: "Não foi possível desconectar o Google Drive.",
        variant: "destructive"
      });
    }
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

  const testRealUpload = async () => {
    if (!testFile || !selectedAlbum?.googleFolderId) {
      toast({
        title: "Erro no teste",
        description: "Selecione um arquivo e defina um Folder ID primeiro.",
        variant: "destructive"
      });
      return;
    }

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const formData = new FormData();
      formData.append('file', testFile);
      formData.append('folder_id', selectedAlbum.googleFolderId);

      const response = await fetch(`${backendUrl}/api/test-upload/${clientId}`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setTestResult(result);
        
        toast({
          title: "✅ TESTE SUCESSO!",
          description: `Arquivo ${result.filename} salvo no Google Drive!`
        });
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Erro no upload');
      }
    } catch (error) {
      toast({
        title: "❌ TESTE FALHOU",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateAlbumFolderId = async (folderId) => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/clients/${clientId}/albums/${selectedAlbum.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          google_folder_id: folderId
        })
      });
      
      if (response.ok) {
        toast({
          title: "Pasta atualizada!",
          description: "ID da pasta do Google Drive foi salvo."
        });
        fetchClientData(); // Recarregar dados
      } else {
        throw new Error('Falha ao atualizar');
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o ID da pasta.",
        variant: "destructive"
      });
    }
  };

  const updateAlbumDate = async (newDate) => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/clients/${clientId}/albums/${selectedAlbum.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_date: newDate
        })
      });
      
      if (response.ok) {
        toast({
          title: "Data do álbum atualizada!",
          description: `A data do evento foi alterada para ${new Date(newDate).toLocaleDateString('pt-BR')}.`
        });
        fetchClientData(); // Recarregar dados
      } else {
        throw new Error('Falha ao atualizar');
      }
    } catch (error) {
      toast({
        title: "Erro ao atualizar data",
        description: "Não foi possível alterar a data do álbum.",
        variant: "destructive"
      });
    }
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

  const canCreateAlbum = client && client.status === 'approved' && client.albums && client.albums.length < client.albumLimit;
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
                            type="text"
                            value={googleConfig.folderId}
                            onChange={(e) => setGoogleConfig({...googleConfig, folderId: e.target.value})}
                            placeholder="1A2B3C4D5E6F7G8H9I0J ou 1BxYz-AbC_123"
                            className="border-amber-300 font-mono"
                          />
                          <p className="text-xs text-amber-600 mt-1">
                            ID da pasta onde as fotos deste álbum serão armazenadas
                          </p>
                        </div>

                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => setShowTestUpload(!showTestUpload)} 
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Teste Real Upload
                          </Button>
                          <Button 
                            onClick={() => {
                              updateAlbumFolderId(googleConfig.folderId);
                            }} 
                            className="bg-amber-600 hover:bg-amber-700"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Salvar ID da Pasta
                          </Button>
                          <Button 
                            onClick={disconnectGoogleDrive} 
                            variant="destructive"
                          >
                            <Unlink className="w-4 h-4 mr-2" />
                            Desconectar
                          </Button>
                        </div>

                        {/* Área de Teste Upload */}
                        {showTestUpload && (
                          <div className="border-t border-amber-200 pt-4 mt-4">
                            <h4 className="font-semibold text-amber-900 mb-2">🧪 Teste Real de Upload</h4>
                            <div className="space-y-3">
                              <div>
                                <Label htmlFor="testFile" className="text-amber-800">Arquivo para teste</Label>
                                <input
                                  id="testFile"
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setTestFile(e.target.files[0])}
                                  className="w-full border border-amber-300 rounded p-2"
                                />
                              </div>
                              
                              <Button 
                                onClick={testRealUpload}
                                disabled={!testFile || !selectedAlbum?.googleFolderId}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                              >
                                🚀 FAZER TESTE REAL
                              </Button>
                              
                              {testResult && (
                                <div className="bg-green-50 p-3 rounded border border-green-200">
                                  <h5 className="font-semibold text-green-900">✅ TESTE SUCESSO!</h5>
                                  <p className="text-sm text-green-700">
                                    <strong>Arquivo:</strong> {testResult.filename}<br/>
                                    <strong>Google File ID:</strong> {testResult.google_file_id}<br/>
                                    <strong>Folder ID:</strong> {testResult.folder_id}
                                  </p>
                                  <p className="text-xs text-green-600 mt-1">
                                    ✅ Arquivo salvo com sucesso no Google Drive!
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-amber-700">
                          Conecte sua conta do Google Drive para que as fotos dos convidados sejam salvas automaticamente.
                        </p>
                        
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center">
                            <LinkIcon className="w-5 h-5 text-blue-600 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-blue-900">Autorização Segura</p>
                              <p className="text-sm text-blue-700">
                                Você será redirecionado para o Google para autorizar o acesso
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button onClick={connectGoogleDrive} className="w-full bg-blue-600 hover:bg-blue-700">
                          <FolderOpen className="w-4 h-4 mr-2" />
                          Conectar Google
                        </Button>

                        <div className="mt-4">
                          <Label htmlFor="googleFolder" className="text-amber-800">ID da Pasta (opcional)</Label>
                          <Input
                            id="googleFolder"
                            value={googleConfig.folderId}
                            onChange={(e) => setGoogleConfig({...googleConfig, folderId: e.target.value})}
                            placeholder="1A2B3C4D5E6F7G8H9I0J"
                            className="border-amber-300"
                          />
                          <p className="text-xs text-amber-600 mt-1">
                            Se não informado, será criada uma pasta automaticamente
                          </p>
                        </div>
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
                              value={newAlbum.name}
                              onChange={(e) => setNewAlbum({...newAlbum, name: e.target.value})}
                              placeholder="Ex: Casamento Principal"
                              className="border-amber-300"
                            />
                          </div>
                          <div>
                            <Label htmlFor="eventDate" className="text-amber-800">Data do Evento</Label>
                            <Input
                              id="eventDate"
                              type="date"
                              value={newAlbum.eventDate}
                              onChange={(e) => setNewAlbum({...newAlbum, eventDate: e.target.value})}
                              className="border-amber-300"
                              required
                            />
                          </div>
                          <Button 
                            onClick={createAlbum} 
                            className="w-full bg-amber-600 hover:bg-amber-700"
                            disabled={!newAlbum.name || !newAlbum.eventDate}
                          >
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
                            <p className="text-xs text-amber-600">
                              {new Date(album.eventDate).toLocaleDateString('pt-BR')}
                            </p>
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
                      {/* Album Date */}
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-2">Informações do Álbum</h4>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="albumEventDate" className="text-amber-800">Data do Evento</Label>
                            <Input
                              id="albumEventDate"
                              type="date"
                              value={selectedAlbum?.eventDate ? selectedAlbum.eventDate.split('T')[0] : ''}
                              onChange={(e) => {
                                // Update album event date
                                updateAlbumDate(e.target.value);
                              }}
                              className="border-amber-300"
                            />
                            <p className="text-xs text-amber-600 mt-1">
                              Esta data aparecerá na página de upload para os convidados
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Google Drive for this album */}
                      <div className="border-t border-amber-200 pt-4">
                        <h4 className="font-semibold text-amber-900 mb-2">Google Drive deste Álbum</h4>
                        <div className="space-y-2">
                          <Label htmlFor="albumFolder" className="text-amber-800">ID da Pasta (específica para este álbum)</Label>
                          <Input
                            id="albumFolder"
                            type="text"
                            value={selectedAlbum?.googleFolderId || ''}
                            onChange={(e) => {
                              const newFolderId = e.target.value;
                              // Atualizar imediatamente com debounce
                              setTimeout(() => {
                                updateAlbumFolderId(newFolderId);
                              }, 1000);
                            }}
                            placeholder="1A2B3C4D5E6F7G8H9I0J ou 1BxYz-AbC_123_456789"
                            className="border-amber-300 font-mono"
                            maxLength={null}
                            minLength={null}
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