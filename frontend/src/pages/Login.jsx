import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Camera, Mail, Lock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { mockClients } from '../mock';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Mock login - check if admin
      if (formData.email === 'admin@upnafesta.com' && formData.password === 'admin123') {
        toast({
          title: "Login de administrador realizado!",
          description: "Bem-vindo ao painel administrativo"
        });
        navigate('/admin');
      } else if (formData.email && formData.password) {
        // Client login
        const client = mockClients.find(c => c.email === formData.email);
        if (client) {
          toast({
            title: "Login realizado com sucesso!",
            description: `Bem-vindo de volta, ${client.name.split('&')[0].trim()}!`
          });
          navigate(`/client/${client.id}`);
        } else {
          toast({
            title: "Credenciais inválidas",
            description: "Email ou senha incorretos",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Erro no login",
          description: "Por favor, preencha todos os campos",
          variant: "destructive"
        });
      }
    } else {
      // Mock registration - create new client account
      if (formData.email && formData.password && formData.name && formData.password === formData.confirmPassword) {
        const newClientId = String(mockClients.length + 1);
        toast({
          title: "Conta criada com sucesso!",
          description: "Sua conta foi criada. Você será direcionado para seu painel."
        });
        // In real app, would create client and redirect to their dashboard
        navigate(`/client/${newClientId}`);
      } else {
        toast({
          title: "Erro no cadastro",
          description: "Por favor, verifique todos os campos",
          variant: "destructive"
        });
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-amber-200 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Camera className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold text-amber-800">UpnaFesta</span>
          </div>
          <CardTitle className="text-2xl text-amber-900">
            {isLogin ? 'Entrar na sua conta' : 'Criar nova conta'}
          </CardTitle>
          <CardDescription className="text-amber-600">
            {isLogin 
              ? 'Acesse seu painel de álbum ou área administrativa' 
              : 'Comece a coletar fotos do seu casamento'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-amber-800">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-amber-500" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 border-amber-300 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-amber-800">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-amber-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 border-amber-300 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-amber-800">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-amber-500" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Sua senha"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 border-amber-300 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-amber-800">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-amber-500" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 border-amber-300 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-amber-600">
              {isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-amber-800 font-semibold hover:underline"
              >
                {isLogin ? 'Cadastre-se' : 'Faça login'}
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-amber-600 hover:text-amber-800 text-sm">
              ← Voltar para início
            </Link>
          </div>

          {/* Admin credentials info */}
          <div className="mt-6 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="text-sm font-semibold text-amber-800 mb-2">Acesso Administrativo:</h4>
            <p className="text-xs text-amber-700">
              <strong>Email:</strong> admin@upnafesta.com<br />
              <strong>Senha:</strong> admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;