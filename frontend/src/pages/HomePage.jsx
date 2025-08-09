import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Camera, Heart, Shield, Smartphone, Users, Download } from 'lucide-react';
import { mockSiteConfig, mockTestimonials } from '../mock';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(to bottom, var(--color-background), var(--color-surface))'}}>
      {/* Navigation */}
      <nav className="backdrop-blur-sm border-b sticky top-0 z-50" style={{backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Camera className="h-8 w-8" style={{color: 'var(--color-primary)'}} />
              <span className="text-2xl font-bold" style={{color: 'var(--color-textPrimary)'}}>UpnaFesta</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="transition-colors" style={{color: 'var(--color-textSecondary)'}} onMouseOver={(e) => e.target.style.color = 'var(--color-hoverColor)'} onMouseOut={(e) => e.target.style.color = 'var(--color-textSecondary)'}>Recursos</a>
              <a href="#how-it-works" className="transition-colors" style={{color: 'var(--color-textSecondary)'}} onMouseOver={(e) => e.target.style.color = 'var(--color-hoverColor)'} onMouseOut={(e) => e.target.style.color = 'var(--color-textSecondary)'}>Como Funciona</a>
              <a href="#testimonials" className="transition-colors" style={{color: 'var(--color-textSecondary)'}} onMouseOver={(e) => e.target.style.color = 'var(--color-hoverColor)'} onMouseOut={(e) => e.target.style.color = 'var(--color-textSecondary)'}>Depoimentos</a>
              <a href="#pricing" className="transition-colors" style={{color: 'var(--color-textSecondary)'}} onMouseOver={(e) => e.target.style.color = 'var(--color-hoverColor)'} onMouseOut={(e) => e.target.style.color = 'var(--color-textSecondary)'}>Preços</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" className="border" style={{color: 'var(--color-textSecondary)', borderColor: 'var(--color-border)', backgroundColor: 'transparent'}}>
                  Entrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{color: 'var(--color-textPrimary)'}}>
              {mockSiteConfig.heroTitle}
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{color: 'var(--color-textSecondary)'}}>
              {mockSiteConfig.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/login">
                <Button size="lg" className="px-8 py-4 text-lg text-white" style={{backgroundColor: 'var(--color-buttonPrimary)'}} onMouseOver={(e) => e.target.style.backgroundColor = 'var(--color-hoverColor)'} onMouseOut={(e) => e.target.style.backgroundColor = 'var(--color-buttonPrimary)'}>
                  <Heart className="w-5 h-5 mr-2" />
                  Criar Álbum
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border px-8 py-4 text-lg"
                style={{color: 'var(--color-textSecondary)', borderColor: 'var(--color-border)', backgroundColor: 'transparent'}}
                onMouseOver={(e) => {e.target.style.backgroundColor = 'var(--color-surface)'; e.target.style.color = 'var(--color-hoverColor)'}}
                onMouseOut={(e) => {e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'var(--color-textSecondary)'}}
                onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
              >
                Ver Como Funciona
              </Button>
            </div>
          </div>

          {/* Hero Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {mockSiteConfig.heroImages.map((image, index) => (
              <div key={index} className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <img 
                  src={image} 
                  alt={`Casamento ${index + 1}`}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20" style={{backgroundColor: 'var(--color-surface)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4" style={{backgroundColor: 'var(--color-secondary)', color: 'var(--color-textPrimary)'}}>
              Recursos Principais
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{color: 'var(--color-textPrimary)'}}>
              Facilitamos a Coleta das suas Fotos de Casamento
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{color: 'var(--color-textSecondary)'}}>
              Reviva seu grande dia através dos olhos dos seus entes queridos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {mockSiteConfig.features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300" style={{borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)'}}>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: 'var(--color-secondary)'}}>
                    {index === 0 && <Camera className="w-8 h-8" style={{color: 'var(--color-primary)'}} />}
                    {index === 1 && <Shield className="w-8 h-8" style={{color: 'var(--color-primary)'}} />}
                    {index === 2 && <Smartphone className="w-8 h-8" style={{color: 'var(--color-primary)'}} />}
                  </div>
                  <h3 className="text-xl font-bold mb-4" style={{color: 'var(--color-textPrimary)'}}>{feature.title}</h3>
                  <p className="mb-4" style={{color: 'var(--color-textSecondary)'}}>{feature.description}</p>
                  <p className="text-sm font-medium" style={{color: 'var(--color-primary)'}}>{feature.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      {mockSiteConfig.howItWorks.enabled && (
        <section id="how-it-works" className="py-20" style={{background: 'linear-gradient(to bottom, var(--color-background), var(--color-surface))'}}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{color: 'var(--color-textPrimary)'}}>
                {mockSiteConfig.howItWorks.title}
              </h2>
              <p className="text-xl max-w-2xl mx-auto" style={{color: 'var(--color-textSecondary)'}}>
                {mockSiteConfig.howItWorks.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mockSiteConfig.howItWorks.steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold" style={{backgroundColor: 'var(--color-buttonPrimary)'}}>
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-4" style={{color: 'var(--color-textPrimary)'}}>{step.title}</h3>
                  <p style={{color: 'var(--color-textSecondary)'}}>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      <section id="pricing" className="py-20" style={{backgroundColor: 'var(--color-surface)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4" style={{backgroundColor: 'var(--color-secondary)', color: 'var(--color-textPrimary)'}}>
              Preço Único
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{color: 'var(--color-textPrimary)'}}>
              Preço Simples e Transparente
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{color: 'var(--color-textSecondary)'}}>
              Sem mensalidades ou surpresas. Um pagamento único por álbum.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <Card className="shadow-xl" style={{borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)'}}>
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <p className="text-5xl font-bold mb-2" style={{color: 'var(--color-textPrimary)'}}>{mockSiteConfig.pricing.price}</p>
                  <p style={{color: 'var(--color-primary)'}}>{mockSiteConfig.pricing.description}</p>
                </div>
                
                <ul className="space-y-3 mb-8 text-left">
                  {mockSiteConfig.pricing.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--color-secondary)'}}>
                        <span className="text-sm" style={{color: 'var(--color-primary)'}}>✓</span>
                      </div>
                      <span style={{color: 'var(--color-textSecondary)'}}>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/login">
                  <Button size="lg" className="w-full text-white" style={{backgroundColor: 'var(--color-buttonPrimary)'}} onMouseOver={(e) => e.target.style.backgroundColor = 'var(--color-hoverColor)'} onMouseOut={(e) => e.target.style.backgroundColor = 'var(--color-buttonPrimary)'}>
                    <Heart className="w-5 h-5 mr-2" />
                    Criar Meu Álbum
                  </Button>
                </Link>
                
                <p className="text-sm mt-4" style={{color: 'var(--color-textSecondary)'}}>
                  * Álbum fica ativo após confirmação do pagamento
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {mockSiteConfig.testimonials.enabled && (
        <section id="testimonials" className="py-20" style={{background: 'linear-gradient(to bottom, var(--color-background), var(--color-surface))'}}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{color: 'var(--color-textPrimary)'}}>
                {mockSiteConfig.testimonials.title}
              </h2>
              <p className="text-xl" style={{color: 'var(--color-textSecondary)'}}>
                {mockSiteConfig.testimonials.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockSiteConfig.testimonials.items.map((testimonial) => (
                <Card key={testimonial.id} style={{borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)'}}>
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-bold" style={{color: 'var(--color-textPrimary)'}}>{testimonial.name}</h4>
                      </div>
                    </div>
                    <p className="italic" style={{color: 'var(--color-textSecondary)'}}>"{testimonial.text}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 text-white" style={{background: `linear-gradient(to right, var(--color-buttonPrimary), var(--color-hoverColor))`}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Coletar suas Fotos de Casamento?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Crie seu álbum em menos de 2 minutos
          </p>
          <Link to="/login">
            <Button size="lg" className="px-8 py-4 text-lg font-semibold" style={{backgroundColor: 'var(--color-surface)', color: 'var(--color-primary)'}} onMouseOver={(e) => {e.target.style.backgroundColor = 'var(--color-secondary)'; e.target.style.color = 'var(--color-textPrimary)'}} onMouseOut={(e) => {e.target.style.backgroundColor = 'var(--color-surface)'; e.target.style.color = 'var(--color-primary)'}}>
              <Camera className="w-5 h-5 mr-2" />
              Começar Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12" style={{backgroundColor: 'var(--color-headerBg)', color: 'var(--color-headerText)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Camera className="h-6 w-6" />
                <span className="text-xl font-bold">UpnaFesta</span>
              </div>
              <p style={{color: 'var(--color-headerText)', opacity: 0.8}}>
                A forma mais simples de coletar fotos de casamento dos seus convidados.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Recursos</h3>
              <ul className="space-y-2" style={{color: 'var(--color-headerText)', opacity: 0.8}}>
                <li>Álbuns Ilimitados</li>
                <li>Google Drive</li>
                <li>QR Code</li>
                <li>Sem App</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Suporte</h3>
              <ul className="space-y-2" style={{color: 'var(--color-headerText)', opacity: 0.8}}>
                <li>Como Funciona</li>
                <li>FAQ</li>
                <li>Contato</li>
                <li>Tutorial</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2" style={{color: 'var(--color-headerText)', opacity: 0.8}}>
                <li>Privacidade</li>
                <li>Termos</li>
                <li>Cookies</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 text-center" style={{borderTop: `1px solid var(--color-border)`, color: 'var(--color-headerText)', opacity: 0.8}}>
            <p>&copy; 2025 UpnaFesta. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;