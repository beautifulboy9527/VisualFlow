import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { User, Bell, CreditCard, Shield, Palette, ChevronRight, ArrowLeft } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: <User className="h-5 w-5" />, label: 'Profile', description: 'Manage your account details' },
        { icon: <Shield className="h-5 w-5" />, label: 'Security', description: 'Password and 2FA settings' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: <Bell className="h-5 w-5" />, label: 'Notifications', description: 'Email and push notifications', toggle: true },
        { icon: <Palette className="h-5 w-5" />, label: 'Appearance', description: 'Theme and display settings' },
      ]
    },
    {
      title: 'Billing',
      items: [
        { icon: <CreditCard className="h-5 w-5" />, label: 'Credits & Plans', description: 'View usage and upgrade' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-mesh">
      <Header credits={100} />
      
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <h1 className="text-2xl font-display font-bold text-foreground mb-8">Settings</h1>

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