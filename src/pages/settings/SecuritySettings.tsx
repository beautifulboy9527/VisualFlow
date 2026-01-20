import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield, Key, History, AlertTriangle, Save, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SecuritySettings: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, signOut } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
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

    if (passwords.new.length < 6) {
      toast({
        title: language === 'zh' ? '密码太短' : 'Password too short',
        description: language === 'zh' ? '密码至少需要 6 个字符' : 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      });

      if (error) {
        toast({
          title: language === 'zh' ? '更新失败' : 'Update Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setPasswords({ current: '', new: '', confirm: '' });
        toast({
          title: language === 'zh' ? '密码已更新' : 'Password Updated',
          description: language === 'zh' ? '您的密码已成功更改' : 'Your password has been changed successfully',
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOutAllDevices = async () => {
    await signOut();
    toast({
      title: language === 'zh' ? '已登出所有设备' : 'Signed Out',
      description: language === 'zh' ? '您已从所有设备登出' : 'You have been signed out from all devices',
    });
    navigate('/auth');
  };

  const handleDeleteAccount = () => {
    toast({
      title: language === 'zh' ? '功能开发中' : 'Coming Soon',
      description: language === 'zh' ? '账户删除功能即将上线' : 'Account deletion feature is coming soon',
    });
  };

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
          {/* Current Account Info */}
          {user && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-sm font-medium text-foreground-muted mb-2">
                {language === 'zh' ? '当前账户' : 'Current Account'}
              </h3>
              <p className="text-foreground font-medium">{user.email}</p>
            </div>
          )}

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
              disabled={isSaving || !passwords.new}
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

          {/* Session Management */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-foreground-muted" />
              <h2 className="text-base font-medium text-foreground">
                {language === 'zh' ? '会话管理' : 'Session Management'}
              </h2>
            </div>
            
            <p className="text-sm text-foreground-muted">
              {language === 'zh' 
                ? '登出所有设备将结束您在所有设备上的会话' 
                : 'Signing out of all devices will end your sessions on all devices'}
            </p>
            
            <Button 
              variant="outline" 
              onClick={handleSignOutAllDevices}
            >
              {language === 'zh' ? '登出所有设备' : 'Sign Out All Devices'}
            </Button>
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
            
            <Button 
              variant="outline" 
              onClick={handleDeleteAccount}
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              {language === 'zh' ? '删除账户' : 'Delete Account'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;