import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
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
  DollarSign
} from 'lucide-react';
import { mockClients, mockStats, getStatusLabel, getStatusColor } from '../mock';
import { Link } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

const AdminDashboard = () => {
  const [clients, setClients] = useState(mockClients);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    weddingDate: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateClient = (e) => {
    e.preventDefault();
    
    if (newClient.name && newClient.email && newClient.weddingDate) {
      const client = {
        id: String(clients.length + 1),
        ...newClient,
        status: 'active',
        albumId: `album-${newClient.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().getFullYear()}`,
        createdAt: new Date().toISOString().split('T')[0],
        googleDriveConnected: false,
        customization: {
          primaryColor: '#D4AF37',
          secondaryColor: '#F5E6A3',
          mainPhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
          welcomeMessage: 'Queridos amigos e familiares, compartilhem conosco os momentos especiais do nosso grande dia!',
          thankYouMessage: 'Obrigado por fazer parte da nossa história de amor!'
        }
      };
      
      setClients([...clients, client]);
      setNewClient({ name: '', email: '', weddingDate: '' });
      setIsDialogOpen(false);
      
      toast({
        title: "Cliente criado com sucesso!",
        description: `${client.name} foi adicionado ao sistema.`
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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
              <Link to="/site-management">
                <Button variant="outline" className="text-amber-700 border-amber-300">
                  <Settings className="w-4 h-4 mr-2" />
                  Gerenciar Site
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="text-amber-700 border-amber-300">
                  Ver Site
                </Button>
              </Link>
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
                  <p className="text-sm font-medium text-amber-600">Ativos Este Mês</p>
                  <p className="text-2xl font-bold text-amber-900">{mockStats.activeThisMonth}</p>
                </div>
                <Calendar className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clients Management */}
        <Card className="border-amber-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-amber-900">Gerenciar Clientes</CardTitle>
                <CardDescription className="text-amber-600">
                  Visualize e gerencie todos os clientes e seus álbuns
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
                      <Label htmlFor="name" className="text-amber-800">Nome do Casal</Label>
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
                      <Label htmlFor="weddingDate" className="text-amber-800">Data do Casamento</Label>
                      <Input
                        id="weddingDate"
                        type="date"
                        value={newClient.weddingDate}
                        onChange={(e) => setNewClient({...newClient, weddingDate: e.target.value})}
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
                  <TableHead className="text-amber-800">Data do Casamento</TableHead>
                  <TableHead className="text-amber-800">Google Drive</TableHead>
                  <TableHead className="text-amber-800">Status</TableHead>
                  <TableHead className="text-amber-800">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium text-amber-900">{client.name}</TableCell>
                    <TableCell className="text-amber-700">{client.email}</TableCell>
                    <TableCell className="text-amber-700">{formatDate(client.weddingDate)}</TableCell>
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
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {client.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Link to={`/client/${client.id}`}>
                          <Button size="sm" variant="outline" className="text-amber-700 border-amber-300">
                            <Settings className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                        </Link>
                        <Link to={`/album/${client.albumId}`}>
                          <Button size="sm" variant="outline" className="text-amber-700 border-amber-300">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Ver Álbum
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;