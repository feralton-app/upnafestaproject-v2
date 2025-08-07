import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Camera, Mail, Lock, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.email === 'admin@upnafesta.com' && formData.password === 'admin123') {
      toast({
        title: "Login de administrador realizado!",
        description: "Bem-vindo ao painel administrativo"
      });
      navigate('/admin/dashboard');
    } else {
      toast({
        title: "Credenciais inválidas",
        description: "Email ou senha de administrador incorretos",
        variant: "destructive"
      });
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
            <Shield className="h-8 w-8 text-amber-600" />
            <Camera className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl text-amber-900">
            Acesso Administrativo
          </CardTitle>
          <CardDescription className="text-amber-600">
            Área restrita para administradores do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-amber-800">Email do Administrador</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-amber-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@upnafesta.com"
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
                  placeholder="Sua senha de administrador"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 border-amber-300 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Shield className="w-4 h-4 mr-2" />
              Acessar Painel Administrativo
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-amber-600 hover:text-amber-800 text-sm">
              ← Voltar para página inicial
            </Link>
          </div>

          {/* Credentials info for demo */}
          <div className="mt-6 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="text-sm font-semibold text-amber-800 mb-2">Credenciais de Demonstração:</h4>
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

export default AdminLogin;