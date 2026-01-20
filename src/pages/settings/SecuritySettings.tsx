import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Shield, Key, Smartphone, History, AlertTriangle, Save, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from '@/hooks/use-toast';

const SecuritySettings: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleSavePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: language === 'zh' ? '密码不匹配' : 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setPasswords({ current: '', new: '', confirm: '' });
    toast({
      title: language === 'zh' ? '密码已更新' : 'Password Updated',
      description: language === 'zh' ? '您的密码已成功更改' : 'Your password has been changed successfully',
    });
  };

  const recentSessions = [
    { device: 'MacBook Pro', location: 'Shanghai, CN', time: language === 'zh' ? '当前会话' : 'Current session', current: true },
    { device: 'iPhone 15', location: 'Beijing, CN', time: language === 'zh' ? '2 小时前' : '2 hours ago', current: false },
    { device: 'Windows PC', location: 'Hangzhou, CN', time: language === 'zh' ? '昨天' : 'Yesterday', current: false },
  ];

  return (
    <div className="min-h-screen bg-mesh">
      <Header credits={100} />
      
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate('/settings')} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          {language === 'zh' ? '返回设置' : 'Back to Settings'}
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {language === 'zh' ? '安全设置' : 'Security'}
            </h1>
            <p className="text-sm text-foreground-muted">
              {language === 'zh' ? '管理您的账户安全' : 'Manage your account security'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Change Password */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-foreground-muted" />
              <h2 className="text-base font-medium text-foreground">
                {language === 'zh' ? '修改密码' : 'Change Password'}
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{language === 'zh' ? '当前密码' : 'Current Password'}</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">{language === 'zh' ? '新密码' : 'New Password'}</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{language === 'zh' ? '确认新密码' : 'Confirm New Password'}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <Button 
              variant="generate" 
              onClick={handleSavePassword}
              disabled={isSaving || !passwords.current || !passwords.new}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {language === 'zh' ? '保存中...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {language === 'zh' ? '更新密码' : 'Update Password'}
                </>
              )}
            </Button>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-foreground-muted" />
                <div>
                  <h2 className="text-base font-medium text-foreground">
                    {language === 'zh' ? '双重认证' : 'Two-Factor Authentication'}
                  </h2>
                  <p className="text-sm text-foreground-muted">
                    {language === 'zh' ? '使用手机验证码增强账户安全' : 'Add extra security with phone verification'}
                  </p>
                </div>
              </div>
              <Switch 
                checked={twoFactorEnabled} 
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>
            
            {twoFactorEnabled && (
              <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-foreground">
                  {language === 'zh' 
                    ? '双重认证已启用。登录时需要验证码。' 
                    : 'Two-factor authentication is enabled. A verification code will be required at login.'}
                </p>
              </div>
            )}
          </div>

          {/* Active Sessions */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-foreground-muted" />
              <h2 className="text-base font-medium text-foreground">
                {language === 'zh' ? '活跃会话' : 'Active Sessions'}
              </h2>
            </div>
            
            <div className="space-y-3">
              {recentSessions.map((session, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    session.current ? 'bg-primary/5 border border-primary/20' : 'bg-secondary/30'
                  }`}
                >
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {session.device}
                      {session.current && (
                        <span className="ml-2 text-xs text-primary font-medium">
                          {language === 'zh' ? '(当前)' : '(Current)'}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-foreground-muted">
                      {session.location} · {session.time}
                    </p>
                  </div>
                  {!session.current && (
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      {language === 'zh' ? '登出' : 'Sign out'}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-card rounded-xl border border-destructive/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h2 className="text-base font-medium text-destructive">
                {language === 'zh' ? '危险区域' : 'Danger Zone'}
              </h2>
            </div>
            
            <p className="text-sm text-foreground-muted mb-4">
              {language === 'zh' 
                ? '删除账户将永久移除所有数据，此操作无法撤销。' 
                : 'Deleting your account will permanently remove all data. This action cannot be undone.'}
            </p>
            
            <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10">
              {language === 'zh' ? '删除账户' : 'Delete Account'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;