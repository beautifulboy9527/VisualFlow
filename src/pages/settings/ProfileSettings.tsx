import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, User, Camera, Save, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from '@/hooks/use-toast';

const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    displayName: 'User',
    email: 'user@example.com',
    bio: '',
    company: '',
    website: '',
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({
      title: language === 'zh' ? '已保存' : 'Saved',
      description: language === 'zh' ? '个人资料已更新' : 'Profile updated successfully',
    });
  };

  return (
    <div className="min-h-screen bg-mesh">
      <Header />
      
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate('/settings')} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('settings.back')}
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {language === 'zh' ? '个人资料' : 'Profile'}
            </h1>
            <p className="text-sm text-foreground-muted">
              {language === 'zh' ? '管理您的公开信息' : 'Manage your public information'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide mb-4">
              {language === 'zh' ? '头像' : 'Avatar'}
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-2xl font-bold text-primary-foreground">
                  {profile.displayName.charAt(0).toUpperCase()}
                </div>
                <button className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-card border border-border shadow-md hover:bg-secondary transition-colors">
                  <Camera className="h-4 w-4 text-foreground-muted" />
                </button>
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground-muted mb-2">
                  {language === 'zh' ? '上传新头像' : 'Upload a new avatar'}
                </p>
                <Button variant="outline" size="sm">
                  {language === 'zh' ? '选择图片' : 'Choose Image'}
                </Button>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
              {language === 'zh' ? '基本信息' : 'Basic Information'}
            </h2>
            
            <div className="space-y-2">
              <Label htmlFor="displayName">{language === 'zh' ? '显示名称' : 'Display Name'}</Label>
              <Input
                id="displayName"
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                placeholder={language === 'zh' ? '输入您的名称' : 'Enter your name'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{language === 'zh' ? '邮箱地址' : 'Email Address'}</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">{language === 'zh' ? '个人简介' : 'Bio'}</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder={language === 'zh' ? '简单介绍一下自己...' : 'Tell us about yourself...'}
                rows={3}
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
              {language === 'zh' ? '附加信息' : 'Additional Information'}
            </h2>
            
            <div className="space-y-2">
              <Label htmlFor="company">{language === 'zh' ? '公司/组织' : 'Company'}</Label>
              <Input
                id="company"
                value={profile.company}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                placeholder={language === 'zh' ? '您的公司名称' : 'Your company name'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">{language === 'zh' ? '个人网站' : 'Website'}</Label>
              <Input
                id="website"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          {/* Save Button */}
          <Button 
            variant="generate" 
            size="lg" 
            className="w-full"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {language === 'zh' ? '保存中...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                {language === 'zh' ? '保存更改' : 'Save Changes'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;