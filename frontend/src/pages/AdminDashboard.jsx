import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import { 
  Camera, 
  Plus, 
  Users, 
  Calendar, 
  Mail, 
  Settings, 
  BarChart, 
  AlertCircle,
  CheckCircle,
  ExternalLink,
  CreditCard,
  Clock,
  XCircle,
  Eye,
  DollarSign,
  Trash2,
  KeyRound,
  Shield,
  LogOut,
  UserCheck,
  Upload,
  Album,
  Cog,
  UserX,
  Edit,
  Cloud
} from 'lucide-react';
import { mockClients, mockStats, getStatusLabel, getStatusColor } from '../mock';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [clients, setClients] = useState(mockClients);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    albumLimit: 1
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleLogout = () => {
    toast({
      title: "Logout realizado!",
      description: "Saindo do painel administrativo."
    });
    navigate('/');
  };

  const toggleClientStatus = (clientId) => {
    setClients(clients.map(client => 
      client.id === clientId 
        ? { ...client, enabled: !client.enabled }
        : client
    ));
    
    const client = clients.find(c => c.id === clientId);
    toast({
      title: `Cliente ${client?.enabled ? 'desabilitado' : 'habilitado'}!`,
      description: `${client?.name} foi ${client?.enabled ? 'desabilitado' : 'habilitado'} no sistema.`
    });
  };

  const handleCreateClient = (e) => {
    e.preventDefault();
    
    if (newClient.name && newClient.email) {
      const client = {
        id: String(clients.length + 1),
        ...newClient,
        status: 'pending_payment',
        createdAt: new Date().toISOString().split('T')[0],
        googleDriveConnected: false,
        paymentStatus: 'pending',
        enabled: true,
        albums: [],
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: 'Conta Criada - Pagamento Necessário',
            message: 'Sua conta foi criada! Para ativá-la, realize o pagamento de R$ 99,90.',
            type: 'warning',
            date: new Date().toISOString().split('T')[0],
            read: false
          }
        ]
      };
      
      setClients([...clients, client]);
      setNewClient({ name: '', email: '', albumLimit: 1 });
      setIsDialogOpen(false);
      
      toast({
        title: "Cliente criado com sucesso!",
        description: `${client.name} foi adicionado. Cliente deve realizar pagamento para ativação.`
      });
    }
  };

  const approvePayment = (clientId) => {
    setClients(clients.map(client => 
      client.id === clientId 
        ? { 
            ...client, 
            status: 'approved',
            paymentStatus: 'confirmed',
            approvalDate: new Date().toISOString().split('T')[0],
            notifications: [
              ...client.notifications,
              {
                id: `notif-${Date.now()}`,
                title: 'Pagamento Aprovado!',
                message: 'Seu pagamento foi confirmado e você pode criar álbuns.',
                type: 'success',
                date: new Date().toISOString().split('T')[0],
                read: false
              }
            ]
          }
        : client
    ));
    
    const client = clients.find(c => c.id === clientId);
    toast({
      title: "Pagamento aprovado!",
      description: `${client?.name} pode agora criar álbuns.`
    });
  };

  const rejectPayment = (clientId) => {
    setClients(clients.map(client => 
      client.id === clientId 
        ? { 
            ...client, 
            status: 'rejected',
            paymentStatus: 'rejected',
            notifications: [
              ...client.notifications,
              {
                id: `notif-${Date.now()}`,
                title: 'Pagamento Rejeitado',
                message: 'Seu comprovante foi rejeitado. Por favor, envie um novo comprovante.',
                type: 'error',
                date: new Date().toISOString().split('T')[0],
                read: false
              }
            ]
          }
        : client
    ));
    
    const client = clients.find(c => c.id === clientId);
    toast({
      title: "Pagamento rejeitado",
      description: `O pagamento de ${client?.name} foi rejeitado.`
    });
  };

  const deleteClient = () => {
    setClients(clients.filter(client => client.id !== selectedClientId));
    setDeleteDialogOpen(false);
    setSelectedClientId(null);
    
    const client = clients.find(c => c.id === selectedClientId);
    toast({
      title: "Cliente excluído!",
      description: `${client?.name} foi removido do sistema.`
    });
  };

  const resetPassword = () => {
    const tempPassword = 'temp123';
    setClients(clients.map(client => 
      client.id === selectedClientId 
        ? { 
            ...client, 
            tempPassword,
            requiresPasswordReset: true,
            notifications: [
              ...client.notifications,
              {
                id: `notif-${Date.now()}`,
                title: 'Senha Resetada',
                message: `Sua senha temporária é: ${tempPassword}. Por favor, altere após o login.`,
                type: 'warning',
                date: new Date().toISOString().split('T')[0],
                read: false
              }
            ]
          }
        : client
    ));
    
    setResetPasswordDialogOpen(false);
    setSelectedClientId(null);
    
    const client = clients.find(c => c.id === selectedClientId);
    toast({
      title: "Senha resetada!",
      description: `Nova senha temporária gerada para ${client?.name}: temp123`
    });
  };

  const updateClient = () => {
    if (editingClient) {
      setClients(clients.map(client => 
        client.id === editingClient.id ? editingClient : client
      ));
      setEditDialog(false);
      setEditingClient(null);
      toast({
        title: "Cliente atualizado!",
        description: "As informações do cliente foram salvas."
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-amber-600" />
              <div>
                <h1 className="text-2xl font-bold text-amber-900">Console Administrativo</h1>
                <p className="text-amber-600">Gerencie clientes e álbuns</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/admin/google-config">
                <Button variant="outline" className="text-blue-700 border-blue-300 bg-blue-50">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar Google API
                </Button>
              </Link>
              <Link to="/admin/site-management">
                <Button variant="outline" className="text-amber-700 border-amber-300">
                  <Settings className="w-4 h-4 mr-2" />
                  Gerenciar Site
                </Button>
              </Link>
              <a href="/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="text-amber-700 border-amber-300">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Site
                </Button>
              </a>
              <Button variant="outline" onClick={handleLogout} className="text-red-700 border-red-300">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600">Total de Clientes</p>
                  <p className="text-2xl font-bold text-amber-900">{mockStats.totalClients}</p>
                </div>
                <Users className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600">Álbuns Ativos</p>
                  <p className="text-2xl font-bold text-amber-900">{mockStats.totalAlbums}</p>
                </div>
                <Camera className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600">Total de Uploads</p>
                  <p className="text-2xl font-bold text-amber-900">{mockStats.totalUploads}</p>
                </div>
                <BarChart className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600">Pagamentos Pendentes</p>
                  <p className="text-2xl font-bold text-amber-900">{mockStats.pendingApprovals}</p>
                </div>
                <CreditCard className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-amber-100">
            <TabsTrigger value="clients" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Todos os Clientes
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <CreditCard className="w-4 h-4 mr-2" />
              Aprovação de Pagamentos
            </TabsTrigger>
          </TabsList>

          {/* Clients Management */}
          <TabsContent value="clients" className="mt-6">
            <Card className="border-amber-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-amber-900">Todos os Clientes</CardTitle>
                    <CardDescription className="text-amber-600">
                      Visualize e gerencie todos os clientes
                    </CardDescription>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-amber-600 hover:bg-amber-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Cliente
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-amber-900">Criar Novo Cliente</DialogTitle>
                        <DialogDescription className="text-amber-600">
                          Adicione um novo cliente ao sistema
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateClient} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-amber-800">Nome do Cliente</Label>
                          <Input
                            id="name"
                            value={newClient.name}
                            onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                            placeholder="Ex: Ana & Carlos Silva"
                            className="border-amber-300"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-amber-800">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newClient.email}
                            onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                            placeholder="contato@email.com"
                            className="border-amber-300"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="albumLimit" className="text-amber-800">Limite de Álbuns</Label>
                          <Input
                            id="albumLimit"
                            type="number"
                            min="1"
                            max="5"
                            value={newClient.albumLimit}
                            onChange={(e) => setNewClient({...newClient, albumLimit: parseInt(e.target.value)})}
                            className="border-amber-300"
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                          Criar Cliente
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-amber-800">Cliente</TableHead>
                      <TableHead className="text-amber-800">Email</TableHead>
                      <TableHead className="text-amber-800">Álbuns</TableHead>
                      <TableHead className="text-amber-800">Limite</TableHead>
                      <TableHead className="text-amber-800">Google Drive</TableHead>
                      <TableHead className="text-amber-800">Status Pagamento</TableHead>
                      <TableHead className="text-amber-800">Status Ativo</TableHead>
                      <TableHead className="text-amber-800">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium text-amber-900">{client.name}</TableCell>
                        <TableCell className="text-amber-700">{client.email}</TableCell>
                        <TableCell className="text-amber-700">{client.albums?.length || 0}</TableCell>
                        <TableCell className="text-amber-700">{client.albumLimit || 1}</TableCell>
                        <TableCell>
                          {client.googleDriveConnected ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Conectado
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Pendente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(client.status)}>
                            {getStatusLabel(client.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className={client.enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {client.enabled ? (
                                <UserCheck className="w-3 h-3 mr-1" />
                              ) : (
                                <UserX className="w-3 h-3 mr-1" />
                              )}
                              {client.enabled ? 'Ativo' : 'Inativo'}
                            </Badge>
                            <Button
                              size="sm"
                              variant={client.enabled ? "destructive" : "default"}
                              onClick={() => toggleClientStatus(client.id)}
                              className={client.enabled ? "" : "bg-green-600 hover:bg-green-700"}
                            >
                              {client.enabled ? 'Desabilitar' : 'Habilitar'}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2 flex-wrap gap-1">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-amber-700 border-amber-300"
                              onClick={() => {
                                setEditingClient({...client});
                                setEditDialog(true);
                              }}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Editar
                            </Button>
                            <Link to={`/client/${client.id}`}>
                              <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Ver Painel
                              </Button>
                            </Link>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-purple-700 border-purple-300"
                              onClick={() => {
                                setSelectedClientId(client.id);
                                setResetPasswordDialogOpen(true);
                              }}
                            >
                              <KeyRound className="w-3 h-3 mr-1" />
                              Reset Senha
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => {
                                setSelectedClientId(client.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Excluir
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Approvals */}
          <TabsContent value="payments" className="mt-6">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Aprovação de Pagamentos</CardTitle>
                <CardDescription className="text-amber-600">
                  Analise e aprove os comprovantes de pagamento enviados pelos clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-amber-800">Cliente</TableHead>
                      <TableHead className="text-amber-800">Email</TableHead>
                      <TableHead className="text-amber-800">Data do Pagamento</TableHead>
                      <TableHead className="text-amber-800">Status Pagamento</TableHead>
                      <TableHead className="text-amber-800">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.filter(client => client.status === 'payment_sent' || client.status === 'pending_payment').map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium text-amber-900">{client.name}</TableCell>
                        <TableCell className="text-amber-700">{client.email}</TableCell>
                        <TableCell className="text-amber-700">
                          {client.paymentDate ? formatDate(client.paymentDate) : 'Não enviado'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(client.status)}>
                            {getStatusLabel(client.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {client.status === 'payment_sent' && (
                              <>
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => approvePayment(client.id)}
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Aprovar
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => rejectPayment(client.id)}
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Rejeitar
                                </Button>
                              </>
                            )}
                            {client.status === 'pending_payment' && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                <Clock className="w-3 h-3 mr-1" />
                                Aguardando
                              </Badge>
                            )}
                            <Link to={`/client/${client.id}`}>
                              <Button size="sm" variant="outline" className="text-amber-700 border-amber-300">
                                <Eye className="w-3 h-3 mr-1" />
                                Ver Detalhes
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {clients.filter(client => client.status === 'payment_sent' || client.status === 'pending_payment').length === 0 && (
                  <div className="text-center py-8">
                    <DollarSign className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                    <p className="text-amber-500">Nenhum pagamento pendente de aprovação</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Client Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-amber-900 flex items-center">
                <Trash2 className="w-5 h-5 mr-2 text-red-600" />
                Confirmar Exclusão
              </DialogTitle>
              <DialogDescription className="text-amber-600">
                Esta ação não pode ser desfeita. Todos os dados do cliente, incluindo álbuns e uploads, serão permanentemente excluídos.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={deleteClient}>
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir Cliente
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reset Password Dialog */}
        <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-amber-900 flex items-center">
                <KeyRound className="w-5 h-5 mr-2 text-blue-600" />
                Reset de Senha
              </DialogTitle>
              <DialogDescription className="text-amber-600">
                Uma senha temporária será gerada e enviada para o cliente. Ele precisará alterar a senha no próximo login.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Senha Temporária</p>
                  <p className="text-sm text-blue-700">Uma senha temporária "temp123" será criada</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setResetPasswordDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={resetPassword} className="bg-blue-600 hover:bg-blue-700">
                <KeyRound className="w-4 h-4 mr-2" />
                Gerar Nova Senha
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Client Dialog */}
        <Dialog open={editDialog} onOpenChange={setEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-amber-900 flex items-center">
                <Edit className="w-5 h-5 mr-2" />
                Editar Cliente
              </DialogTitle>
            </DialogHeader>
            {editingClient && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editName" className="text-amber-800">Nome do Cliente</Label>
                  <Input
                    id="editName"
                    value={editingClient.name}
                    onChange={(e) => setEditingClient({...editingClient, name: e.target.value})}
                    className="border-amber-300"
                  />
                </div>
                <div>
                  <Label htmlFor="editEmail" className="text-amber-800">Email</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={editingClient.email}
                    onChange={(e) => setEditingClient({...editingClient, email: e.target.value})}
                    className="border-amber-300"
                  />
                </div>
                <div>
                  <Label htmlFor="editAlbumLimit" className="text-amber-800">Limite de Álbuns</Label>
                  <Input
                    id="editAlbumLimit"
                    type="number"
                    min="1"
                    max="10"
                    value={editingClient.albumLimit || 1}
                    onChange={(e) => setEditingClient({...editingClient, albumLimit: parseInt(e.target.value)})}
                    className="border-amber-300"
                  />
                  <p className="text-xs text-amber-600 mt-1">
                    Quantidade máxima de álbuns que o cliente pode criar
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={updateClient} className="bg-amber-600 hover:bg-amber-700">
                    <Edit className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;