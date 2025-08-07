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
  FolderOpen
} from 'lucide-react';
import { mockClients, getStatusLabel, getStatusColor, generateMockQRCode, mockPaymentMethods } from '../mock';
import { useToast } from '../hooks/use-toast';

const ClientDashboard = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const client = mockClients.find(c => c.id === clientId);
  const [customization, setCustomization] = useState(client?.customization || {});
  const [paymentProof, setPaymentProof] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showGoogleDialog, setShowGoogleDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteAlbumDialog, setShowDeleteAlbumDialog] = useState(false);
  const [googleFolderId, setGoogleFolderId] = useState(client?.googleFolderId || '');
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
            <Link to="/admin">
              <Button className="bg-amber-600 hover:bg-amber-700">Voltar ao Admin</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const albumUrl = `${window.location.origin}/album/${client.albumId}`;
  const qrCodeUrl = generateMockQRCode(client.albumId);

  const handleCustomizationChange = (field, value) => {
    setCustomization(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveCustomization = () => {
    // In real app, would save to backend
    toast({
      title: "Personalização salva!",
      description: "As alterações foram aplicadas ao seu álbum."
    });
  };

  const uploadPaymentProof = () => {
    if (paymentProof) {
      toast({
        title: "Comprovante enviado!",
        description: "Seu comprovante está sendo analisado. Você receberá uma notificação em breve."
      });
      setShowPaymentDialog(false);
    }
  };

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
    if (googleFolderId) {
      toast({
        title: "Google Drive conectado!",
        description: "Sua conta foi conectada com sucesso."
      });
      setShowGoogleDialog(false);
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
    toast({
      title: "Álbum criado!",
      description: "Realize o pagamento para ativar seu álbum."
    });
  };

  const deleteAlbum = () => {
    toast({
      title: "Álbum excluído!",
      description: "Seu álbum foi excluído permanentemente."
    });
    setShowDeleteAlbumDialog(false);
  };

  const isAlbumActive = client.status === 'approved';
  const canCustomize = client.status === 'approved';

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-amber-600" />
              <div>
                <h1 className="text-2xl font-bold text-amber-900">Meu Álbum</h1>
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
              
              {/* Google Drive Connection */}
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
                    <DialogTitle className="text-amber-900">Conectar Google Drive</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-amber-700">
                      Conecte sua conta do Google Drive para que as fotos dos convidados sejam salvas diretamente na sua pasta.
                    </p>
                    <div>
                      <Label htmlFor="googleFolder" className="text-amber-800">ID da Pasta do Google Drive</Label>
                      <Input
                        id="googleFolder"
                        value={googleFolderId}
                        onChange={(e) => setGoogleFolderId(e.target.value)}
                        placeholder="1A2B3C4D5E6F7G8H9I0J"
                        className="border-amber-300"
                      />
                      <p className="text-xs text-amber-600 mt-1">
                        Cole aqui o ID da pasta onde as fotos serão armazenadas
                      </p>
                    </div>
                    <Button onClick={connectGoogleDrive} className="w-full bg-amber-600 hover:bg-amber-700">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Conectar
                    </Button>
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
        {/* Status and Notifications */}
        <div className="mb-8 space-y-4">
          {client.status === 'pending_payment' && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Pagamento necessário!</strong> Seu álbum foi criado, mas precisa de pagamento para ser ativado.
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
                        <p className="text-amber-600">Pagamento único por álbum</p>
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
                <strong>Comprovante em análise.</strong> Recebemos seu comprovante e estamos analisando. 
                Você será notificado assim que aprovado.
              </AlertDescription>
            </Alert>
          )}

          {client.status === 'approved' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Álbum ativo!</strong> Seu pagamento foi aprovado e seu álbum está funcionando.
              </AlertDescription>
            </Alert>
          )}

          {/* Recent Notifications */}
          {client.notifications?.length > 0 && (
            <Card className="border-amber-200">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Album Sharing */}
          <Card className={`border-amber-200 ${!isAlbumActive && 'opacity-50'}`}>
            <CardHeader>
              <CardTitle className="text-amber-900 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Compartilhar Álbum
              </CardTitle>
              <CardDescription className="text-amber-600">
                {isAlbumActive ? 'Compartilhe com seus convidados' : 'Disponível após aprovação do pagamento'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAlbumActive && (
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

                  <Link to={`/album/${client.albumId}`}>
                    <Button className="w-full bg-amber-600 hover:bg-amber-700">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visualizar Álbum
                    </Button>
                  </Link>
                </>
              )}
              
              {!isAlbumActive && (
                <div className="text-center py-8">
                  <QrCode className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                  <p className="text-amber-500">Link e QR Code disponíveis após ativação</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customization */}
          <Card className={`border-amber-200 ${!canCustomize && 'opacity-50'}`}>
            <CardHeader>
              <CardTitle className="text-amber-900 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Personalização
              </CardTitle>
              <CardDescription className="text-amber-600">
                {canCustomize ? 'Customize a aparência do seu álbum' : 'Disponível após aprovação'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {canCustomize && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryColor" className="text-amber-800">Cor Principal</Label>
                      <Input
                        id="primaryColor"
                        type="color"
                        value={customization.primaryColor || '#8B4513'}
                        onChange={(e) => handleCustomizationChange('primaryColor', e.target.value)}
                        className="h-10 border-amber-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondaryColor" className="text-amber-800">Cor Secundária</Label>
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={customization.secondaryColor || '#DEB887'}
                        onChange={(e) => handleCustomizationChange('secondaryColor', e.target.value)}
                        className="h-10 border-amber-300"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="mainPhoto" className="text-amber-800">Foto Principal (URL)</Label>
                    <Input
                      id="mainPhoto"
                      value={customization.mainPhoto || ''}
                      onChange={(e) => handleCustomizationChange('mainPhoto', e.target.value)}
                      placeholder="https://exemplo.com/foto.jpg"
                      className="border-amber-300"
                    />
                  </div>

                  <div>
                    <Label htmlFor="welcomeMessage" className="text-amber-800">Mensagem de Boas-vindas</Label>
                    <Textarea
                      id="welcomeMessage"
                      value={customization.welcomeMessage || ''}
                      onChange={(e) => handleCustomizationChange('welcomeMessage', e.target.value)}
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
                      onChange={(e) => handleCustomizationChange('thankYouMessage', e.target.value)}
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
                </>
              )}
              
              {!canCustomize && (
                <div className="text-center py-8">
                  <Palette className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                  <p className="text-amber-500">Personalização disponível após aprovação</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Album Statistics */}
        {isAlbumActive && (
          <Card className="mt-8 border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">Estatísticas do Álbum</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-900">127</p>
                  <p className="text-amber-600">Fotos Recebidas</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-900">23</p>
                  <p className="text-amber-600">Vídeos Recebidos</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-900">45</p>
                  <p className="text-amber-600">Convidados Participaram</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;