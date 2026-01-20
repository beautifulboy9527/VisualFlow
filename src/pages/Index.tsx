import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Globe,
  ShoppingBag,
  Store,
  Video,
  Wand2,
  MousePointer,
  Zap,
  Layers,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Logo, LogoLetter } from '@/components/layout/Logo';

const Index = () => {
  const { language, setLanguage, t } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const platforms = [
    { icon: ShoppingBag, name: 'Amazon' },
    { icon: Store, name: 'Shopify' },
    { icon: Video, name: 'TikTok' },
  ];

  const stats = [
    { value: '20s', label: t('home.stat1.label') },
    { value: '96%', label: t('home.stat2.label') },
    { value: '10K+', label: t('home.stat3.label') },
  ];

  const features = [
    { 
      icon: MousePointer, 
      title: t('home.feature1.title'), 
      desc: t('home.feature1.desc'),
      gradient: 'from-primary/10 to-primary/5'
    },
    { 
      icon: Wand2, 
      title: t('home.feature2.title'), 
      desc: t('home.feature2.desc'),
      gradient: 'from-accent/10 to-accent/5'
    },
    { 
      icon: Zap, 
      title: t('home.feature3.title'), 
      desc: t('home.feature3.desc'),
      gradient: 'from-primary/10 to-accent/5'
    },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Liquid Glass Background Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Main gradient orb following mouse - Cyan/Teal theme */}
        <div 
          className="absolute w-[800px] h-[800px] rounded-full transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x - 400,
            top: mousePosition.y - 400,
            background: 'radial-gradient(circle, hsl(185 75% 50% / 0.15) 0%, hsl(160 70% 45% / 0.08) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        
        {/* Static ambient orbs - Cyan/Teal colors */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-radial from-primary/10 via-primary/5 to-transparent blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-radial from-accent/10 via-transparent to-transparent blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-gradient-radial from-primary/5 to-transparent blur-2xl animate-float" style={{ animationDelay: '3s' }} />
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Minimal Header */}
        <header className="fixed top-0 left-0 right-0 z-50">
          <div className="container mx-auto px-6">
            <div className="h-20 flex items-center justify-between">
              <Logo size="md" showText={true} />
              
              <div className="flex items-center gap-3">
                {/* Language Toggle */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={toggleLanguage}
                  className="text-foreground-secondary hover:text-foreground gap-1.5"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-xs">{language === 'zh' ? 'EN' : '中'}</span>
                </Button>
                
                <Link to="/workbench">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-foreground-secondary hover:text-foreground hover:bg-transparent gap-2 group"
                  >
                    {t('home.start')}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section - Ultra Minimal */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Floating badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-xl border border-border/30 text-xs text-foreground-secondary mb-12 animate-fade-in">
              <Bot className="h-3.5 w-3.5 text-primary" />
              <span>{t('home.badge')}</span>
              <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">v2.0</span>
            </div>
            
            {/* Main headline - Clean typography */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-foreground leading-[0.95] mb-8 animate-slide-up tracking-tight">
              {t('home.headline1')}
              <br />
              <span className="text-gradient-primary">{t('home.headline2')}</span>
              <br />
              {t('home.headline3')}
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-foreground-secondary max-w-lg mx-auto mb-12 animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
              {t('home.subtitle')}
            </p>
            
            {/* CTA - Single prominent button */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/workbench">
                <Button 
                  size="xl" 
                  className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-10 h-14 text-base font-medium shadow-lg group"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <Sparkles className={`h-5 w-5 mr-2 transition-all ${isHovering ? 'scale-110' : ''}`} />
                  {t('home.startCreating')}
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            
            {/* Platform indicators - Minimal */}
            <div className="flex items-center justify-center gap-8 mt-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {platforms.map(({ icon: Icon, name }) => (
                <div key={name} className="flex items-center gap-2 text-foreground-muted hover:text-foreground-secondary transition-colors">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Section - Minimal Cards */}
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {features.map(({ icon: Icon, title, desc, gradient }, index) => (
                <div 
                  key={title}
                  className={cn(
                    'group relative p-8 rounded-3xl border border-border/30 bg-gradient-to-b',
                    gradient,
                    'hover:border-border/50 transition-all duration-500',
                    'animate-fade-in'
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-card/80 backdrop-blur flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-foreground-muted">{desc}</p>
                  
                  {/* Step number */}
                  <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-card/50 flex items-center justify-center text-sm font-medium text-foreground-muted">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section - Clean horizontal */}
        <section className="py-20 px-6 border-y border-border/20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-16 md:gap-24">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-4xl md:text-5xl font-display font-bold text-foreground mb-1">{value}</p>
                  <p className="text-sm text-foreground-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-8">
              <Layers className="h-5 w-5 text-primary" />
              <span className="text-sm text-foreground-secondary">{t('home.humanInLoop')}</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
              {t('home.ctaTitle')}
            </h2>
            
            <Link to="/workbench">
              <Button 
                size="lg" 
                className="bg-gradient-primary text-primary-foreground hover:opacity-90 rounded-full px-8 shadow-primary"
              >
                {t('home.ctaButton')}
              </Button>
            </Link>
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="py-8 px-6 border-t border-border/20">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <LogoLetter size={24} />
              <span className="text-sm text-foreground-muted">VisualFlow © 2025</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-foreground-muted">
              <a href="#" className="hover:text-foreground transition-colors">{t('home.privacy')}</a>
              <a href="#" className="hover:text-foreground transition-colors">{t('home.terms')}</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

// Helper function
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default Index;
