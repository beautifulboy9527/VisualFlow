import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { User, Bell, CreditCard, Shield, Palette, ChevronRight, ArrowLeft, Globe } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/hooks/useLanguage';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const settingsSections = [
    {
      title: t('settings.account'),
      items: [
        { icon: <User className="h-5 w-5" />, label: t('settings.profile'), description: t('settings.profileDesc') },
        { icon: <Shield className="h-5 w-5" />, label: t('settings.security'), description: t('settings.securityDesc') },
      ]
    },
    {
      title: t('settings.preferences'),
      items: [
        { icon: <Bell className="h-5 w-5" />, label: t('settings.notifications'), description: t('settings.notificationsDesc'), toggle: true },
        { icon: <Palette className="h-5 w-5" />, label: t('settings.appearance'), description: t('settings.appearanceDesc') },
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
        { icon: <CreditCard className="h-5 w-5" />, label: t('settings.creditsPlans'), description: t('settings.creditsPlansDesc') },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-mesh">
      <Header credits={100} />
      
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('settings.back')}
        </Button>

        <h1 className="text-2xl font-display font-bold text-foreground mb-8">{t('settings.title')}</h1>

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
                    className={`w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors text-left
                      ${idx !== section.items.length - 1 ? 'border-b border-border' : ''}`}
                    onClick={() => {
                      if (item.languageToggle) {
                        setLanguage(language === 'zh' ? 'en' : 'zh');
                      }
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-secondary text-foreground-secondary">
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
                      <span className="text-sm font-medium text-primary">
                        {language === 'zh' ? '中文' : 'English'}
                      </span>
                    ) : (
                      <ChevronRight className="h-5 w-5 text-foreground-muted" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;