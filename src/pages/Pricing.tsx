import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/SEOHead';
import { Logo, LogoIcon } from '@/components/layout/Logo';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { 
  Check, 
  Sparkles, 
  Zap, 
  Crown,
  ArrowRight,
  Globe,
  Home
} from 'lucide-react';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: { zh: string; en: string };
  price: { zh: string; en: string };
  period: { zh: string; en: string };
  credits: { zh: string; en: string };
  description: { zh: string; en: string };
  features: { zh: string; en: string }[];
  highlight?: boolean;
  icon: React.ElementType;
  gradient: string;
}

const plans: PricingPlan[] = [
  {
    id: 'free',
    name: { zh: '免费版', en: 'Free' },
    price: { zh: '¥0', en: '$0' },
    period: { zh: '/月', en: '/month' },
    credits: { zh: '10 积分/月', en: '10 credits/month' },
    description: { zh: '体验 AI 设计能力', en: 'Experience AI design power' },
    features: [
      { zh: '每月 10 次生成', en: '10 generations per month' },
      { zh: '基础视觉风格', en: 'Basic visual styles' },
      { zh: '标准分辨率输出', en: 'Standard resolution output' },
      { zh: '社区支持', en: 'Community support' },
    ],
    icon: Sparkles,
    gradient: 'from-slate-500/10 to-slate-600/5',
  },
  {
    id: 'pro',
    name: { zh: '专业版', en: 'Pro' },
    price: { zh: '¥99', en: '$15' },
    period: { zh: '/月', en: '/month' },
    credits: { zh: '200 积分/月', en: '200 credits/month' },
    description: { zh: '适合独立卖家和小团队', en: 'Perfect for sellers and small teams' },
    features: [
      { zh: '每月 200 次生成', en: '200 generations per month' },
      { zh: '全部视觉风格', en: 'All visual styles' },
      { zh: '高清分辨率输出', en: 'HD resolution output' },
      { zh: '优先客服支持', en: 'Priority support' },
      { zh: '批量生成', en: 'Batch generation' },
      { zh: '自定义 Logo 水印', en: 'Custom logo watermark' },
    ],
    highlight: true,
    icon: Zap,
    gradient: 'from-primary/15 to-accent/10',
  },
  {
    id: 'enterprise',
    name: { zh: '企业版', en: 'Enterprise' },
    price: { zh: '¥499', en: '$79' },
    period: { zh: '/月', en: '/month' },
    credits: { zh: '无限积分', en: 'Unlimited credits' },
    description: { zh: '大型团队和品牌方', en: 'For large teams and brands' },
    features: [
      { zh: '无限生成次数', en: 'Unlimited generations' },
      { zh: '全部视觉风格 + 定制', en: 'All styles + custom' },
      { zh: '超清分辨率输出', en: '4K resolution output' },
      { zh: '专属客户经理', en: 'Dedicated account manager' },
      { zh: 'API 接口访问', en: 'API access' },
      { zh: '品牌定制服务', en: 'Brand customization' },
      { zh: '团队协作功能', en: 'Team collaboration' },
    ],
    icon: Crown,
    gradient: 'from-amber-500/10 to-orange-500/5',
  },
];

const creditPacks = [
  { credits: 50, price: { zh: '¥29', en: '$5' }, popular: false },
  { credits: 150, price: { zh: '¥79', en: '$12' }, popular: true },
  { credits: 500, price: { zh: '¥199', en: '$30' }, popular: false },
];

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      navigate('/auth', { state: { from: { pathname: '/pricing' } } });
      return;
    }
    // TODO: Integrate with Stripe for payment
    console.log('Selected plan:', planId);
  };

  const handleBuyCredits = (credits: number) => {
    if (!user) {
      navigate('/auth', { state: { from: { pathname: '/pricing' } } });
      return;
    }
    // TODO: Integrate with Stripe for credit purchase
    console.log('Buy credits:', credits);
  };

  return (
    <>
      <SEOHead
        title={language === 'zh' ? '价格方案 - VisualFlow' : 'Pricing - VisualFlow'}
        description={language === 'zh' 
          ? '选择适合您的AI电商设计方案。免费版、专业版、企业版，满足不同规模需求。' 
          : 'Choose the right AI e-commerce design plan for you. Free, Pro, and Enterprise plans for every need.'}
        keywords={language === 'zh' 
          ? 'VisualFlow价格, AI设计定价, 电商设计套餐, 订阅方案' 
          : 'VisualFlow pricing, AI design plans, e-commerce design packages, subscription plans'}
        lang={language}
        canonicalUrl="https://visualflow.app/pricing"
      />
      <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full animate-float"
          style={{
            background: 'radial-gradient(circle, hsl(185 80% 55% / 0.15) 0%, hsl(175 75% 50% / 0.08) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div 
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full animate-float"
          style={{
            background: 'radial-gradient(circle, hsl(160 75% 50% / 0.15) 0%, hsl(175 70% 45% / 0.08) 40%, transparent 70%)',
            filter: 'blur(50px)',
            animationDelay: '1.5s',
          }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/20">
        <div className="container mx-auto px-6">
          <div className="h-16 flex items-center justify-between">
            <button onClick={() => navigate('/')} className="group">
              <Logo size="md" showText={true} />
            </button>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon-sm"
                onClick={() => navigate('/')}
                className="text-foreground-muted hover:text-foreground"
              >
                <Home className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleLanguage}
                className="text-foreground-secondary hover:text-foreground gap-1.5"
              >
                <Globe className="h-4 w-4" />
                <span className="text-xs">{language === 'zh' ? 'EN' : '中'}</span>
              </Button>
              
              {user ? (
                <Button 
                  variant="generate"
                  size="sm"
                  onClick={() => navigate('/workbench')}
                  className="gap-2"
                >
                  {language === 'zh' ? '开始创建' : 'Start Creating'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  variant="generate"
                  size="sm"
                  onClick={() => navigate('/auth')}
                >
                  {language === 'zh' ? '登录' : 'Sign In'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 pt-24 pb-16">
        {/* Hero */}
        <section className="text-center px-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            {language === 'zh' ? '选择适合您的方案' : 'Choose Your Plan'}
          </h1>
          <p className="text-lg text-foreground-muted max-w-xl mx-auto">
            {language === 'zh' 
              ? '订阅获得每月积分，或按需购买积分包' 
              : 'Subscribe for monthly credits, or buy credit packs as needed'}
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div 
                  key={plan.id}
                  className={`relative rounded-3xl border p-8 transition-all duration-300 hover:shadow-lg ${
                    plan.highlight 
                      ? 'border-primary/50 bg-gradient-to-b from-primary/5 to-transparent shadow-[0_0_40px_hsl(175,70%,45%,0.1)]' 
                      : 'border-border/50 bg-card/50 backdrop-blur-sm hover:border-border'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      {language === 'zh' ? '最受欢迎' : 'Most Popular'}
                    </div>
                  )}
                  
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-6`}>
                    <Icon className={`h-6 w-6 ${plan.highlight ? 'text-primary' : 'text-foreground-muted'}`} />
                  </div>
                  
                  <h3 className="text-xl font-display font-semibold text-foreground mb-1">
                    {plan.name[language]}
                  </h3>
                  <p className="text-sm text-foreground-muted mb-4">{plan.description[language]}</p>
                  
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-display font-bold text-foreground">{plan.price[language]}</span>
                    <span className="text-foreground-muted">{plan.period[language]}</span>
                  </div>
                  <p className="text-sm text-primary font-medium mb-6">{plan.credits[language]}</p>
                  
                  <Button 
                    variant={plan.highlight ? 'generate' : 'outline'}
                    size="lg"
                    className="w-full mb-6"
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {language === 'zh' ? '选择方案' : 'Get Started'}
                  </Button>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground-secondary">{feature[language]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Credit Packs */}
        <section className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              {language === 'zh' ? '积分包' : 'Credit Packs'}
            </h2>
            <p className="text-foreground-muted">
              {language === 'zh' ? '按需购买，永不过期' : 'Buy as needed, never expires'}
            </p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-4">
            {creditPacks.map((pack) => (
              <div 
                key={pack.credits}
                className={`relative rounded-2xl border p-6 text-center transition-all duration-300 hover:shadow-md ${
                  pack.popular 
                    ? 'border-primary/50 bg-primary/5' 
                    : 'border-border/50 bg-card/50 hover:border-border'
                }`}
              >
                {pack.popular && (
                  <div className="absolute -top-2 right-4 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {language === 'zh' ? '超值' : 'Best Value'}
                  </div>
                )}
                
                <p className="text-3xl font-display font-bold text-foreground mb-1">
                  {pack.credits}
                </p>
                <p className="text-sm text-foreground-muted mb-4">
                  {language === 'zh' ? '积分' : 'credits'}
                </p>
                <p className="text-xl font-semibold text-foreground mb-4">
                  {pack.price[language]}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleBuyCredits(pack.credits)}
                >
                  {language === 'zh' ? '购买' : 'Buy'}
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ or Trust */}
        <section className="max-w-2xl mx-auto px-6 mt-20 text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-foreground-muted">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              <span>{language === 'zh' ? '安全支付' : 'Secure payment'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              <span>{language === 'zh' ? '随时取消' : 'Cancel anytime'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              <span>{language === 'zh' ? '7天退款' : '7-day refund'}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-border/20">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoIcon size={20} />
            <span className="text-sm text-foreground-muted">VisualFlow © 2025</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-foreground-muted">
            <a href="#" className="hover:text-foreground transition-colors">
              {language === 'zh' ? '隐私政策' : 'Privacy'}
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              {language === 'zh' ? '服务条款' : 'Terms'}
            </a>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
};

export default Pricing;
