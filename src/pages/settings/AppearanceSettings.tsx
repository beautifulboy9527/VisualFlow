import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Palette, Sun, Moon, Monitor, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Logo } from '@/components/layout/Logo';
import { cn } from '@/lib/utils';

const AppearanceSettings: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [accentColor, setAccentColor] = useState<string>('cyan');

  const themes = [
    { id: 'light' as const, name: language === 'zh' ? '浅色' : 'Light', icon: Sun },
    { id: 'dark' as const, name: language === 'zh' ? '深色' : 'Dark', icon: Moon },
    { id: 'system' as const, name: language === 'zh' ? '跟随系统' : 'System', icon: Monitor },
  ];

  const accentColors = [
    { id: 'cyan', name: language === 'zh' ? '青色' : 'Cyan', color: 'hsl(185 75% 50%)' },
    { id: 'blue', name: language === 'zh' ? '蓝色' : 'Blue', color: 'hsl(220 75% 55%)' },
    { id: 'purple', name: language === 'zh' ? '紫色' : 'Purple', color: 'hsl(270 75% 55%)' },
    { id: 'green', name: language === 'zh' ? '绿色' : 'Green', color: 'hsl(150 70% 45%)' },
    { id: 'orange', name: language === 'zh' ? '橙色' : 'Orange', color: 'hsl(25 90% 55%)' },
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
            <Palette className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {language === 'zh' ? '外观设置' : 'Appearance'}
            </h1>
            <p className="text-sm text-foreground-muted">
              {language === 'zh' ? '自定义应用外观和主题' : 'Customize the app look and feel'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
              {language === 'zh' ? '主题模式' : 'Theme Mode'}
            </h2>
            
            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme) => {
                const Icon = theme.icon;
                const isSelected = selectedTheme === theme.id;
                
                return (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={cn(
                      "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                      isSelected 
                        ? "border-primary bg-primary/5 shadow-md" 
                        : "border-border hover:border-primary/50 hover:bg-secondary/30"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 p-0.5 rounded-full bg-primary">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                    <div className={cn(
                      "p-3 rounded-lg",
                      isSelected ? "bg-primary/10" : "bg-secondary/50"
                    )}>
                      <Icon className={cn(
                        "h-6 w-6",
                        isSelected ? "text-primary" : "text-foreground-muted"
                      )} />
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      isSelected ? "text-primary" : "text-foreground"
                    )}>
                      {theme.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent Color */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
              {language === 'zh' ? '主题色' : 'Accent Color'}
            </h2>
            
            <div className="flex flex-wrap gap-3">
              {accentColors.map((color) => {
                const isSelected = accentColor === color.id;
                
                return (
                  <button
                    key={color.id}
                    onClick={() => setAccentColor(color.id)}
                    className={cn(
                      "relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 transition-all duration-200",
                      isSelected 
                        ? "border-foreground/30 bg-secondary/50 shadow-md" 
                        : "border-border hover:border-foreground/20 hover:bg-secondary/30"
                    )}
                  >
                    <div 
                      className="w-5 h-5 rounded-full shadow-sm"
                      style={{ backgroundColor: color.color }}
                    />
                    <span className={cn(
                      "text-sm",
                      isSelected ? "font-medium text-foreground" : "text-foreground-muted"
                    )}>
                      {color.name}
                    </span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-foreground ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
            
            <p className="text-xs text-foreground-muted">
              {language === 'zh' 
                ? '主题色用于按钮、链接和重点元素' 
                : 'Accent color is used for buttons, links, and highlights'}
            </p>
          </div>

          {/* Preview */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">
              {language === 'zh' ? '预览' : 'Preview'}
            </h2>
            
            <div className="p-6 rounded-xl bg-background border border-border/50 space-y-4">
              <div className="flex items-center justify-between">
                <Logo size="sm" />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    {language === 'zh' ? '取消' : 'Cancel'}
                  </Button>
                  <Button variant="generate" size="sm">
                    {language === 'zh' ? '确认' : 'Confirm'}
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <div className="flex-1 h-2 rounded-full bg-primary/20" />
                <div className="w-1/3 h-2 rounded-full bg-primary" />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className="aspect-square rounded-lg bg-secondary/50 border border-border/50"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;