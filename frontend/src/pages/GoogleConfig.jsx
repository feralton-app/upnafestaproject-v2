import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { 
  Settings, 
  Cloud, 
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Copy,
  Save,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

const GoogleConfig = () => {
  const [config, setConfig] = useState({
    client_id: '',
    client_secret: ''
  });
  const [loading, setLoading] = useState(false);
  const [hasConfig, setHasConfig] = useState(false);
  const [callbackInfo, setCallbackInfo] = useState(null);
  const { toast } = useToast();

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    fetchCurrentConfig();
    fetchCallbackInfo();
  }, []);

  const fetchCurrentConfig = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/google-config`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setConfig({
            client_id: data.client_id,
            client_secret: '********' // Mascarar por segurança
          });
          setHasConfig(true);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar configuração:', error);
    }
  };

  const fetchCallbackInfo = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/google-redirect-uris`);
      if (response.ok) {
        const data = await response.json();
        setCallbackInfo(data);
      }
    } catch (error) {
      console.error('Erro ao buscar callback info:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/admin/google-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      });

      if (response.ok) {
        toast({
          title: "Configuração salva!",
          description: "As credenciais do Google Cloud API foram configuradas com sucesso."
        });
        setHasConfig(true);
      } else {
        throw new Error('Falha ao salvar configuração');
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "URI copiada para área de transferência."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link to="/admin">
                <Button variant="outline" size="sm" className="text-amber-700 border-amber-300">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Cloud className="h-8 w-8 text-amber-600" />
                <div>
                  <h1 className="text-2xl font-bold text-amber-900">Configuração Google Cloud API</h1>
                  <p className="text-amber-600">Configure as credenciais para integração com Google Drive</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {hasConfig ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Configurado
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Não Configurado
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Alert de Instruções */}
        <Alert className="border-blue-200 bg-blue-50">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Importante:</strong> Você precisa criar um projeto no Google Cloud Console e obter as credenciais OAuth 2.0 antes de configurar aqui.
            <a 
              href="https://console.cloud.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 text-blue-600 hover:text-blue-800 underline inline-flex items-center"
            >
              Abrir Google Cloud Console
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário de Configuração */}
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">Credenciais OAuth 2.0</CardTitle>
              <CardDescription className="text-amber-600">
                Insira as credenciais obtidas do Google Cloud Console
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client_id" className="text-amber-800">Client ID</Label>
                  <Input
                    id="client_id"
                    value={config.client_id}
                    onChange={(e) => setConfig({...config, client_id: e.target.value})}
                    placeholder="123456789012-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com"
                    className="border-amber-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_secret" className="text-amber-800">Client Secret</Label>
                  <Input
                    id="client_secret"
                    type="password"
                    value={config.client_secret}
                    onChange={(e) => setConfig({...config, client_secret: e.target.value})}
                    placeholder="GOCSPX-abcdefghijklmnopqrstuvwxyz"
                    className="border-amber-300"
                    required
                  />
                  {hasConfig && (
                    <p className="text-xs text-amber-600">
                      Deixe em branco para manter o valor atual
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  disabled={loading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar Configuração'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* URIs para Configurar no Google Cloud Console */}
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">URIs para Google Cloud Console</CardTitle>
              <CardDescription className="text-amber-600">
                Configure estas URIs no seu projeto do Google Cloud
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {callbackInfo && (
                <>
                  <div>
                    <Label className="text-amber-800 font-semibold">URIs de Redirecionamento Autorizadas</Label>
                    <div className="space-y-2 mt-2">
                      {callbackInfo.authorized_redirect_uris.map((uri, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={uri}
                            readOnly
                            className="text-xs border-amber-300"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(uri)}
                            className="text-amber-700 border-amber-300"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-amber-800 font-semibold">Origins JavaScript Autorizadas</Label>
                    <div className="space-y-2 mt-2">
                      {redirectUrisInfo.authorized_javascript_origins.map((origin, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={origin}
                            readOnly
                            className="text-xs border-amber-300"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(origin)}
                            className="text-amber-700 border-amber-300"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-amber-900 mb-2">Passos para Configurar:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-amber-700">
                      {redirectUrisInfo.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* API Habilitadas */}
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">APIs Necessárias</CardTitle>
            <CardDescription className="text-amber-600">
              Certifique-se de que estas APIs estão habilitadas no seu projeto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Google Drive API</p>
                  <p className="text-sm text-green-700">Para upload e gerenciamento de arquivos</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">Google OAuth2 API</p>
                  <p className="text-sm text-blue-700">Para autenticação de usuários</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoogleConfig;