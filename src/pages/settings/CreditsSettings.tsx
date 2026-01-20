import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Zap, Check, TrendingUp, Calendar, Gift } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

const CreditsSettings: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const currentCredits = 100;
  const usedThisMonth = 50;

  const plans = [
    {
      id: 'free',
      name: language === 'zh' ? '免费版' : 'Free',
      price: language === 'zh' ? '¥0' : '$0',
      period: language === 'zh' ? '/月' : '/mo',
      credits: 50,
      features: [
        language === 'zh' ? '每月 50 积分' : '50 credits/month',
        language === 'zh' ? '基础 AI 分析' : 'Basic AI analysis',
        language === 'zh' ? '标准分辨率输出' : 'Standard resolution',
      ],
      current: true,
    },
    {
      id: 'pro',
      name: language === 'zh' ? '专业版' : 'Pro',
      price: language === 'zh' ? '¥99' : '$14.99',
      period: language === 'zh' ? '/月' : '/mo',
      credits: 500,
      features: [
        language === 'zh' ? '每月 500 积分' : '500 credits/month',
        language === 'zh' ? '高级 AI 分析' : 'Advanced AI analysis',
        language === 'zh' ? '高分辨率输出' : 'High resolution',
        language === 'zh' ? '优先生成队列' : 'Priority queue',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: language === 'zh' ? '企业版' : 'Enterprise',
      price: language === 'zh' ? '¥299' : '$49.99',
      period: language === 'zh' ? '/月' : '/mo',
      credits: 2000,
      features: [
        language === 'zh' ? '每月 2000 积分' : '2000 credits/month',
        language === 'zh' ? '全部 AI 功能' : 'All AI features',
        language === 'zh' ? '4K 分辨率输出' : '4K resolution',
        language === 'zh' ? 'API 访问' : 'API access',
        language === 'zh' ? '专属客服支持' : 'Priority support',
      ],
    },
  ];

  const usageHistory = [
    { date: language === 'zh' ? '今天' : 'Today', credits: 8, action: language === 'zh' ? '生成 2 张 KV' : 'Generated 2 KVs' },
    { date: language === 'zh' ? '昨天' : 'Yesterday', credits: 12, action: language === 'zh' ? '生成 3 张 KV' : 'Generated 3 KVs' },
    { date: language === 'zh' ? '3 天前' : '3 days ago', credits: 16, action: language === 'zh' ? '生成 4 张 KV' : 'Generated 4 KVs' },
    { date: language === 'zh' ? '1 周前' : '1 week ago', credits: 14, action: language === 'zh' ? '生成 3 张 KV + 分析' : 'Generated 3 KVs + analysis' },
  ];

  return (
    <div className="min-h-screen bg-mesh">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate('/settings')} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          {language === 'zh' ? '返回设置' : 'Back to Settings'}
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {language === 'zh' ? '积分与套餐' : 'Credits & Plans'}
            </h1>
            <p className="text-sm text-foreground-muted">
              {language === 'zh' ? '管理您的积分余额和订阅' : 'Manage your credits and subscription'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Current Balance */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-foreground-muted mb-1">
                  {language === 'zh' ? '当前余额' : 'Current Balance'}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-bold text-foreground">{currentCredits}</span>
                  <span className="text-foreground-muted">{language === 'zh' ? '积分' : 'credits'}</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <Zap className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-foreground-muted" />
                  <span className="text-sm text-foreground-muted">
                    {language === 'zh' ? '本月已用' : 'Used this month'}
                  </span>
                </div>
                <p className="text-xl font-bold text-foreground">{usedThisMonth}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-foreground-muted" />
                  <span className="text-sm text-foreground-muted">
                    {language === 'zh' ? '重置日期' : 'Resets on'}
                  </span>
                </div>
                <p className="text-xl font-bold text-foreground">
                  {language === 'zh' ? '2月1日' : 'Feb 1'}
                </p>
              </div>
            </div>
          </div>

          {/* Plans */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
              {language === 'zh' ? '套餐选择' : 'Available Plans'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "relative p-5 rounded-xl border-2 transition-all duration-200",
                    plan.popular 
                      ? "border-primary bg-gradient-to-br from-primary/5 to-transparent shadow-lg" 
                      : plan.current
                        ? "border-primary/50 bg-primary/5"
                        : "border-border hover:border-primary/30"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      {language === 'zh' ? '最受欢迎' : 'Most Popular'}
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                    <div className="flex items-baseline mt-1">
                      <span className="text-2xl font-display font-bold text-foreground">{plan.price}</span>
                      <span className="text-foreground-muted text-sm">{plan.period}</span>
                    </div>
                    <p className="text-sm text-foreground-muted mt-1">
                      {plan.credits} {language === 'zh' ? '积分/月' : 'credits/mo'}
                    </p>
                  </div>
                  
                  <ul className="space-y-2 mb-5">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-foreground-muted">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={plan.current ? "outline" : plan.popular ? "generate" : "default"}
                    className="w-full"
                    disabled={plan.current}
                  >
                    {plan.current 
                      ? (language === 'zh' ? '当前套餐' : 'Current Plan')
                      : (language === 'zh' ? '升级' : 'Upgrade')}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Usage History */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
              {language === 'zh' ? '使用记录' : 'Usage History'}
            </h2>
            
            <div className="space-y-3">
              {usageHistory.map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                >
                  <div>
                    <p className="font-medium text-foreground text-sm">{item.action}</p>
                    <p className="text-xs text-foreground-muted">{item.date}</p>
                  </div>
                  <span className="text-sm font-medium text-foreground-muted">
                    -{item.credits} {language === 'zh' ? '积分' : 'credits'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Promo */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">
                  {language === 'zh' ? '邀请好友赚积分' : 'Invite Friends, Earn Credits'}
                </h3>
                <p className="text-sm text-foreground-muted">
                  {language === 'zh' 
                    ? '每邀请一位好友，您和好友都能获得 50 积分奖励' 
                    : 'Both you and your friend get 50 credits for each referral'}
                </p>
              </div>
              <Button variant="generate">
                {language === 'zh' ? '邀请好友' : 'Invite Friends'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditsSettings;