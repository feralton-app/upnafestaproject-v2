import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Heart, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { mockClients } from '../mock';
import { useToast } from '../hooks/use-toast';

const GuestUpload = () => {
  const { albumId } = useParams();
  const client = mockClients.find(c => c.albumId === albumId);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [guestInfo, setGuestInfo] = useState({ name: '', comment: '' });
  const [showUploadForm, setShowUploadForm] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB limit
      
      if (!isImage && !isVideo) {
        toast({
          title: "Tipo de arquivo não suportado",
          description: "Por favor, envie apenas fotos (JPG, PNG) ou vídeos (MP4, MOV).",
          variant: "destructive"
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} é muito grande. Limite: 100MB`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const startUpload = () => {
    if (guestInfo.name.trim()) {
      setShowUploadForm(true);
    } else {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe seu nome para continuar.",
        variant: "destructive"
      });
    }
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Simulate completion
    setTimeout(() => {
      setUploading(false);
      setUploadComplete(true);
      toast({
        title: "Upload concluído!",
        description: `${files.length} arquivo(s) enviado(s) com sucesso.`
      });
    }, 500);
  };

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Álbum não encontrado</h2>
            <p className="text-gray-600">Este link não é válido ou o álbum não existe.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (client.status !== 'approved') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Álbum ainda não ativo</h2>
            <p className="text-gray-600">Este álbum ainda não foi ativado pelos noivos.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { primaryColor, secondaryColor, mainPhoto, welcomeMessage, thankYouMessage } = client.customization;
  
  // Create gradient style
  const gradientStyle = {
    background: `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})`
  };

  if (uploadComplete) {
    return (
      <div className="min-h-screen" style={gradientStyle}>
        <div className="flex items-center justify-center min-h-screen px-4">
          <Card className="max-w-md mx-auto bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                <img
                  src={mainPhoto}
                  alt={client.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{client.name}</h1>
              <p className="text-gray-600 mb-6">
                {new Date(client.weddingDate).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Fotos enviadas com sucesso!</h2>
                <p className="text-gray-600 mb-4">{thankYouMessage}</p>
              </div>

              <Button 
                onClick={() => {
                  setUploadComplete(false);
                  setShowUploadForm(false);
                  setFiles([]);
                  setUploadProgress(0);
                  setGuestInfo({ name: '', comment: '' });
                }}
                variant="outline"
                className="text-gray-700 border-gray-300"
              >
                Enviar mais fotos
              </Button>
              
              <p className="text-xs text-gray-500 mt-6">
                Obrigado por fazer parte do nosso dia especial! 💕<br />
                <span className="text-gray-400">Desenvolvido por UpnaFesta © 2025</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={gradientStyle}>
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <Card className="max-w-lg mx-auto bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative mb-4">
                <img
                  src={mainPhoto}
                  alt={client.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{backgroundColor: primaryColor}}>
                  <Heart className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{client.name}</h1>
              <p className="text-gray-600 mb-4">
                {new Date(client.weddingDate).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              
              <p className="text-gray-700 text-sm leading-relaxed">
                {welcomeMessage}
              </p>
            </div>

            {/* Upload Section */}
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Enviar Fotos e Vídeos</h3>
                  <p className="text-sm text-gray-500">Selecione ou arraste seus arquivos aqui!</p>
                </div>

                {/* File Drop Zone */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-amber-500 bg-amber-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Clique aqui ou arraste seus arquivos
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Fotos (JPG, PNG) e Vídeos (MP4, MOV) são aceitos
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleChange}
                    className="hidden"
                    id="fileInput"
                  />
                  <label
                    htmlFor="fileInput"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Selecionar Arquivos
                  </label>
                </div>

                {/* Selected Files */}
                {files.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Arquivos selecionados ({files.length})
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            {file.type.startsWith('image/') ? (
                              <span className="text-green-500">📷</span>
                            ) : (
                              <span className="text-blue-500">🎬</span>
                            )}
                            <span className="text-sm text-gray-700 truncate max-w-48">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 p-1 h-auto"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {uploading && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Enviando arquivos...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}

                {/* Upload Button */}
                <Button
                  onClick={uploadFiles}
                  disabled={files.length === 0 || uploading}
                  className="w-full mt-6 text-white"
                  style={{backgroundColor: primaryColor}}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  {uploading ? 'Enviando...' : 'Enviar com Amor'}
                </Button>
              </CardContent>
            </Card>

            <p className="text-xs text-center text-gray-500 mt-6">
              Obrigado por fazer parte do nosso dia especial! 💕<br />
              <span className="text-gray-400">Desenvolvido por UpnaFesta © 2025</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuestUpload;