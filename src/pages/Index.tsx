import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Hexagon, 
  Zap, 
  Image as ImageIcon, 
  Sparkles, 
  ArrowRight, 
  Check,
  Globe,
  ShoppingBag,
  Store,
  Video,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Generation',
    description: 'Advanced multi-agent system analyzes your product and creates perfect marketing visuals in seconds.',
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
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary">
              <Hexagon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground tracking-tight">
              PixMiller
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-foreground-secondary hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-foreground-secondary hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="text-sm text-foreground-secondary hover:text-foreground transition-colors">
              Reviews
            </a>
          </nav>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Link to="/workbench">
              <Button size="sm">
                Get Started
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-dot-pattern opacity-50" />
        
        <div className="container mx-auto px-6 py-24 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light border border-primary/20 text-sm text-primary mb-6 animate-fade-in">
              <Zap className="h-4 w-4" />
              AI-Powered Visual Generation
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-slide-up">
              Create stunning
              <span className="text-primary"> e-commerce visuals </span>
              in seconds
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg text-foreground-secondary max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              PixMiller is the AI workbench that transforms your product photos into 
              professional marketing images with perfect text rendering and brand consistency.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/workbench">
                <Button variant="generate" size="xl">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Try Workbench Free
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                View Examples
              </Button>
            </div>
            
            {/* Platform badges */}
            <div className="flex items-center justify-center gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <span className="text-sm text-foreground-muted">Optimized for:</span>
              {platforms.map(({ icon: Icon, name, color }) => (
                <div key={name} className="flex items-center gap-2 text-foreground-secondary">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <span className="text-sm font-medium">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-3 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-1">{value}</p>
                <p className="text-sm text-foreground-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Professional results, zero design skills needed
            </h2>
            <p className="text-foreground-secondary max-w-2xl mx-auto">
              Our multi-agent AI system handles everything from product analysis to 
              final rendering, delivering consistent, brand-ready visuals every time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <div 
                key={title}
                className="p-6 rounded-lg border border-border bg-card hover:shadow-precision-md hover:border-border-hover transition-all duration-200"
              >
                <div className="p-3 rounded-md bg-primary-light w-fit mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-foreground-secondary leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Three steps to perfect visuals
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Upload', desc: 'Drop your product image' },
              { step: '2', title: 'Customize', desc: 'Add text and choose style' },
              { step: '3', title: 'Generate', desc: 'Get 4 professional images' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-md bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Loved by e-commerce sellers
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map(({ quote, author, role, avatar }) => (
              <div 
                key={author}
                className="p-6 rounded-lg border border-border bg-card"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-foreground mb-4">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-semibold">
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
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to transform your product images?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join thousands of e-commerce sellers who are already creating stunning visuals with PixMiller.
          </p>
          <Link to="/workbench">
            <Button 
              size="xl" 
              className="bg-background text-foreground hover:bg-background/90"
            >
              Start Creating for Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary">
                <Hexagon className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">PixMiller</span>
            </div>
            
            <p className="text-sm text-foreground-muted">
              © 2025 PixMiller. AI-powered visual generation for e-commerce.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
