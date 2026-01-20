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
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Logo, LogoIcon } from '@/components/layout/Logo';

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
      gradient: 'from-[hsl(185,75%,50%,0.12)] to-[hsl(160,70%,45%,0.05)]'
    },
    { 
      icon: Wand2, 
      title: t('home.feature2.title'), 
      desc: t('home.feature2.desc'),
      gradient: 'from-[hsl(195,85%,55%,0.12)] to-[hsl(175,70%,45%,0.05)]'
    },
    { 
      icon: Zap, 
      title: t('home.feature3.title'), 
      desc: t('home.feature3.desc'),
      gradient: 'from-[hsl(175,80%,48%,0.12)] to-[hsl(185,75%,50%,0.05)]'
    },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Liquid Glass Background Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Main gradient orb following mouse - Enhanced Cyan/Teal with more visible gradients */}
        <div 
          className="absolute w-[900px] h-[900px] rounded-full transition-all duration-700 ease-out"
          style={{
            left: mousePosition.x - 450,
            top: mousePosition.y - 450,
            background: 'radial-gradient(circle, hsl(185 80% 55% / 0.25) 0%, hsl(175 75% 50% / 0.15) 30%, hsl(160 70% 45% / 0.08) 50%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        
        {/* Flowing gradient layers - More visible and fluid */}
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: 'linear-gradient(135deg, hsl(185 85% 92%) 0%, transparent 40%)',
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-full h-full"
          style={{
            background: 'linear-gradient(315deg, hsl(160 75% 90%) 0%, transparent 40%)',
          }}
        />
        
        {/* Static ambient orbs - Enhanced visibility */}
        <div 
          className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full animate-float"
          style={{
            background: 'radial-gradient(circle, hsl(185 80% 55% / 0.2) 0%, hsl(175 75% 50% / 0.1) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div 
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full animate-float"
          style={{
            background: 'radial-gradient(circle, hsl(160 75% 50% / 0.2) 0%, hsl(175 70% 45% / 0.1) 40%, transparent 70%)',
            filter: 'blur(50px)',
            animationDelay: '1.5s',
          }}
        />
        <div 
          className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full animate-float"
          style={{
            background: 'radial-gradient(circle, hsl(195 85% 60% / 0.12) 0%, transparent 60%)',
            filter: 'blur(40px)',
            animationDelay: '3s',
          }}
        />
        
        {/* Subtle flowing wave accent */}
        <svg 
          className="absolute bottom-0 left-0 w-full h-64 opacity-[0.08]" 
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(185, 75%, 50%)" />
              <stop offset="50%" stopColor="hsl(175, 70%, 48%)" />
              <stop offset="100%" stopColor="hsl(160, 70%, 45%)" />
            </linearGradient>
          </defs>
          <path 
            fill="url(#waveGradient)" 
            d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,213.3C672,224,768,192,864,165.3C960,139,1056,117,1152,128C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Fixed Header with glassmorphism to prevent overlap */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/20">
          <div className="container mx-auto px-6">
            <div className="h-16 flex items-center justify-between">
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
              <Cpu className="h-3.5 w-3.5 text-primary" />
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
            
            {/* CTA - Button without left icon */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/workbench">
                <Button 
                  variant="dark"
                  size="xl" 
                  className="px-10 h-14 text-base font-medium group"
                >
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

        {/* Feature Section - Enhanced Cards with fluid hover effects */}
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {features.map(({ icon: Icon, title, desc, gradient }, index) => (
                <div 
                  key={title}
                  className={cn(
                    'group relative p-8 rounded-3xl border border-border/40 bg-gradient-to-b backdrop-blur-sm',
                    gradient,
                    'hover:border-primary/40 hover:shadow-[0_8px_40px_hsl(175,70%,45%,0.15)] transition-all duration-500',
                    'animate-fade-in overflow-hidden'
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Hover glow effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at 50% 0%, hsl(175 70% 50% / 0.08) 0%, transparent 60%)',
                    }}
                  />
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-card/80 backdrop-blur border border-border/30 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:border-primary/30 group-hover:shadow-md transition-all duration-300">
                      <Icon className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-foreground mb-2">{title}</h3>
                    <p className="text-foreground-muted leading-relaxed">{desc}</p>
                  </div>
                  
                  {/* Step number with gradient on hover */}
                  <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-card/50 backdrop-blur border border-border/20 flex items-center justify-center text-sm font-medium text-primary group-hover:bg-primary/10 group-hover:border-primary/30 transition-all">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section - Enhanced with gradient text */}
        <section className="py-24 px-6 relative">
          {/* Subtle gradient background */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, hsl(185 80% 96% / 0.5) 0%, transparent 30%, transparent 70%, hsl(160 75% 95% / 0.5) 100%)',
            }}
          />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex items-center justify-center gap-16 md:gap-24">
              {stats.map(({ value, label }, index) => (
                <div key={label} className="text-center group">
                  <p className="text-4xl md:text-5xl font-display font-bold text-gradient-primary mb-2 group-hover:scale-105 transition-transform">{value}</p>
                  <p className="text-sm text-foreground-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA - Enhanced with more informative content */}
        <section className="py-24 px-6 relative">
          {/* Subtle gradient background for CTA section */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, hsl(185 80% 95% / 0.5) 50%, transparent 100%)',
            }}
          />
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/5 border border-primary/20">
              <Layers className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground-secondary">{t('home.humanInLoop')}</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
              {t('home.ctaTitle')}
            </h2>
            
            <p className="text-lg text-foreground-muted mb-8 max-w-xl mx-auto">
              {t('home.ctaSubtitle')}
            </p>
            
            <Link to="/workbench">
              <Button 
                variant="generate"
                size="lg" 
                className="rounded-full px-10 h-14 mb-8"
              >
                {t('home.ctaButton')}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 text-sm text-foreground-muted">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-success" />
                <span>{t('home.ctaFeature1')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-success" />
                <span>{t('home.ctaFeature2')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-success" />
                <span>{t('home.ctaFeature3')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Minimal Footer - Using consistent LogoIcon */}
        <footer className="py-8 px-6 border-t border-border/20">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <LogoIcon size={20} />
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
