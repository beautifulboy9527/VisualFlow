import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { User, Bell, CreditCard, Shield, Palette, ChevronRight, ArrowLeft, Globe, LogOut } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/hooks/useLanguage';
import { Logo } from '@/components/layout/Logo';
import { cn } from '@/lib/utils';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const settingsSections = [
    {
      title: t('settings.account'),
      items: [
        { 
          icon: <User className="h-5 w-5" />, 
          label: t('settings.profile'), 
          description: t('settings.profileDesc'),
          path: '/settings/profile'
        },
        { 
          icon: <Shield className="h-5 w-5" />, 
          label: t('settings.security'), 
          description: t('settings.securityDesc'),
          path: '/settings/security'
        },
      ]
    },
    {
      title: t('settings.preferences'),
      items: [
        { 
          icon: <Bell className="h-5 w-5" />, 
          label: t('settings.notifications'), 
          description: t('settings.notificationsDesc'), 
          toggle: true 
        },
        { 
          icon: <Palette className="h-5 w-5" />, 
          label: t('settings.appearance'), 
          description: t('settings.appearanceDesc'),
          path: '/settings/appearance'
        },
        { 
          icon: <Globe className="h-5 w-5" />, 
          label: t('settings.language'), 
          description: t('settings.languageDesc'),
          languageToggle: true 
        },
      ]
    },
    {
      title: t('settings.billing'),
      items: [
        { 
          icon: <CreditCard className="h-5 w-5" />, 
          label: t('settings.creditsPlans'), 
          description: t('settings.creditsPlansDesc'),
          path: '/settings/credits'
        },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-mesh">
      <Header />
      
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('settings.back')}
        </Button>

        {/* Header with Logo */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <Logo size="sm" showText={false} />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">{t('settings.title')}</h1>
              <p className="text-sm text-foreground-muted">
                {language === 'zh' ? '管理您的账户和偏好设置' : 'Manage your account and preferences'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {settingsSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide mb-4">
                {section.title}
              </h2>
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                {section.items.map((item, idx) => (
                  <button
                    key={item.label}
                    className={cn(
                      "w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors text-left group",
                      idx !== section.items.length - 1 && 'border-b border-border'
                    )}
                    onClick={() => {
                      if (item.languageToggle) {
                        setLanguage(language === 'zh' ? 'en' : 'zh');
                      } else if (item.path) {
                        navigate(item.path);
                      }
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-secondary text-foreground-secondary group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-foreground-muted">{item.description}</p>
                      </div>
                    </div>
                    {item.toggle ? (
                      <Switch />
                    ) : item.languageToggle ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-primary">
                          {language === 'zh' ? '中文' : 'English'}
                        </span>
                        <ChevronRight className="h-4 w-4 text-foreground-muted" />
                      </div>
                    ) : (
                      <ChevronRight className="h-5 w-5 text-foreground-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Logout Section */}
          <div className="pt-4">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 text-foreground-muted hover:text-destructive hover:border-destructive/50"
            >
              <LogOut className="h-5 w-5" />
              {t('settings.logout')}
            </Button>
          </div>

          {/* App Info */}
          <div className="text-center pt-4 pb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <Logo size="sm" />
            </div>
            <p className="text-xs text-foreground-muted">
              {language === 'zh' ? '版本 1.0.0 · 由 AI 驱动' : 'Version 1.0.0 · Powered by AI'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;