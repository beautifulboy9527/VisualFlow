import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Hexagon, 
  Zap, 
  Image as ImageIcon, 
  Sparkles, 
  ArrowRight, 
  Globe,
  ShoppingBag,
  Store,
  Video,
  Star,
  Play,
  Layers,
  Wand2,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Generation',
    description: 'Multi-agent system analyzes your product and creates perfect marketing visuals in seconds.',
  },
  {
    icon: ImageIcon,
    title: 'Native Text Rendering',
    description: '96%+ text accuracy with Nano Banana Pro technology. No more blurry or distorted text.',
  },
  {
    icon: Globe,
    title: 'Multi-Platform Ready',
    description: 'Optimized outputs for Amazon A+, Shopify, TikTok Shop, and more e-commerce platforms.',
  },
  {
    icon: Layers,
    title: 'One-Click Export',
    description: 'Batch export all assets with proper naming and formats for each platform.',
  },
  {
    icon: Wand2,
    title: 'Smart Copy Generation',
    description: 'AI generates compelling product copy, headlines, and CTAs automatically.',
  },
  {
    icon: Download,
    title: 'Brand Consistency',
    description: 'Maintain your visual identity across all generated assets with brand presets.',
  },
];

const platforms = [
  { icon: ShoppingBag, name: 'Amazon', color: 'text-warning' },
  { icon: Store, name: 'Shopify', color: 'text-success' },
  { icon: Video, name: 'TikTok', color: 'text-destructive' },
];

const stats = [
  { value: '20s', label: 'Generation Time' },
  { value: '96%+', label: 'Text Accuracy' },
  { value: '99.5%', label: 'Uptime' },
  { value: '10K+', label: 'Images Generated' },
];

const testimonials = [
  {
    quote: "PixMiller transformed how we create product images. What used to take hours now takes seconds.",
    author: "Sarah Chen",
    role: "E-commerce Manager",
    avatar: "S",
  },
  {
    quote: "The AI understands exactly what makes a great e-commerce image. Incredible results every time.",
    author: "Mike Johnson",
    role: "Amazon FBA Seller",
    avatar: "M",
  },
  {
    quote: "Best investment for our Shopify store. Our conversion rate increased by 40% after using PixMiller.",
    author: "Emma Davis",
    role: "DTC Brand Owner",
    avatar: "E",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Spline 3D Background */}
      <div className="fixed inset-0 z-0">
        <iframe 
          src="https://my.spline.design/liquidglass-opk6GesZcTQLlUt0AWYOnQsu-cMM/" 
          frameBorder="0" 
          width="100%" 
          height="100%"
          style={{ width: '100%', height: '100%' }}
          title="3D Background"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background pointer-events-none" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/30 glass sticky top-0 z-50">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-gradient-primary shadow-primary">
                <Hexagon className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-display font-bold text-foreground tracking-tight">
                PixMiller
              </span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-foreground-secondary hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-foreground-secondary hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="text-sm text-foreground-secondary hover:text-foreground transition-colors">
                Reviews
              </a>
            </nav>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                Sign In
              </Button>
              <Link to="/workbench">
                <Button size="sm" className="bg-gradient-primary hover:opacity-90 shadow-primary">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center">
          <div className="container mx-auto px-6 py-24 md:py-32 relative">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 text-sm text-primary mb-8 animate-fade-in shadow-glow">
                <Zap className="h-4 w-4 animate-pulse" />
                <span className="font-medium">AI Visual Generation Workbench</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-xs">v2.0</span>
              </div>
              
              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight mb-6 animate-slide-up">
                Create 
                <span className="text-gradient-primary"> stunning visuals </span>
                <br />
                with AI precision
              </h1>
              
              {/* Subheadline */}
              <p className="text-lg md:text-xl text-foreground-secondary max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Upload your product photo, AI generates complete e-commerce visual solutions —
                <span className="text-foreground font-medium"> Main KV, Banners, Social, and more</span>. One click, all platforms.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Link to="/workbench">
                  <Button variant="generate" size="xl" className="group shadow-primary animate-glow-pulse">
                    <Sparkles className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                    Start Creating — Free
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="glass border-border/50 gap-2">
                  <Play className="h-4 w-4" />
                  Watch Demo
                </Button>
              </div>
              
              {/* Platform badges */}
              <div className="flex items-center justify-center gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <span className="text-sm text-foreground-muted">Optimized for:</span>
                {platforms.map(({ icon: Icon, name, color }) => (
                  <div key={name} className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-border/30">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span className="text-sm font-medium text-foreground-secondary">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-primary/10 blur-2xl animate-float" />
          <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </section>

        {/* Stats Section */}
        <section className="relative border-y border-border/30 glass">
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center group">
                  <p className="text-3xl md:text-4xl font-display font-bold text-gradient-primary mb-1 group-hover:scale-110 transition-transform">{value}</p>
                  <p className="text-sm text-foreground-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 relative">
          <div className="absolute inset-0 bg-dot-pattern opacity-30" />
          <div className="container mx-auto px-6 relative">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 rounded-full glass border border-primary/20 text-xs text-primary font-medium mb-4">
                FEATURES
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Everything you need to create
                <span className="text-gradient-primary"> stunning product visuals</span>
              </h2>
              <p className="text-foreground-secondary max-w-2xl mx-auto">
                Our multi-agent AI system handles everything from product analysis to 
                final rendering, delivering consistent, brand-ready visuals every time.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map(({ icon: Icon, title, description }, index) => (
                <div 
                  key={title}
                  className="group p-6 rounded-xl glass border border-border/30 hover:border-primary/30 hover:shadow-glow transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-3 rounded-lg bg-gradient-primary w-fit mb-4 shadow-primary group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-foreground-secondary leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="container mx-auto px-6 relative">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 rounded-full glass border border-primary/20 text-xs text-primary font-medium mb-4">
                HOW IT WORKS
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Three steps to perfect visuals
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { step: '01', title: 'Upload', desc: 'Drop your product image and let AI analyze it', icon: ImageIcon },
                { step: '02', title: 'Configure', desc: 'Select modules, review AI-generated copy', icon: Wand2 },
                { step: '03', title: 'Generate', desc: 'One click to get all platform-ready visuals', icon: Sparkles },
              ].map(({ step, title, desc, icon: Icon }, index) => (
                <div key={step} className="text-center group relative">
                  {index < 2 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/50 to-transparent" />
                  )}
                  <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-primary shadow-primary mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="h-10 w-10 text-primary-foreground" />
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-xs font-bold text-primary">
                      {step}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-foreground-secondary">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 rounded-full glass border border-primary/20 text-xs text-primary font-medium mb-4">
                TESTIMONIALS
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Loved by e-commerce sellers
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {testimonials.map(({ quote, author, role, avatar }, index) => (
                <div 
                  key={author}
                  className="p-6 rounded-xl glass border border-border/30 hover:border-primary/20 transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 italic">"{quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold shadow-primary">
                      {avatar}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{author}</p>
                      <p className="text-sm text-foreground-muted">{role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary opacity-90" />
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="container mx-auto px-6 text-center relative">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-4">
              Ready to transform your product images?
            </h2>
            <p className="text-primary-foreground/80 mb-10 max-w-xl mx-auto text-lg">
              Join thousands of e-commerce sellers creating stunning visuals with PixMiller.
            </p>
            <Link to="/workbench">
              <Button 
                size="xl" 
                className="bg-background text-foreground hover:bg-background/90 shadow-lg font-display font-semibold"
              >
                Start Creating for Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/30 py-12 glass">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-gradient-primary shadow-primary">
                  <Hexagon className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-foreground">PixMiller</span>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-foreground-muted">
                <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                <a href="#" className="hover:text-foreground transition-colors">Contact</a>
              </div>
              
              <p className="text-sm text-foreground-muted">
                © 2025 PixMiller. AI-powered visual generation.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
