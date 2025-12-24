import React from 'react';
import { Globe, Type } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

export type Language = 'zh' | 'en' | 'ja' | 'ko' | 'de' | 'fr' | 'es' | 'pt' | 'it' | 'ar';

export interface LanguageOption {
  id: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const languageOptions: LanguageOption[] = [
  { id: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { id: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { id: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { id: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { id: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { id: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { id: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { id: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { id: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { id: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

interface LanguageSettingsProps {
  primaryLanguage: Language;
  secondaryLanguage: Language | null;
  onPrimaryChange: (lang: Language) => void;
  onSecondaryChange: (lang: Language | null) => void;
}

export const LanguageSettings: React.FC<LanguageSettingsProps> = ({
  primaryLanguage,
  secondaryLanguage,
  onPrimaryChange,
  onSecondaryChange,
}) => {
  const { language: uiLang } = useLanguage();
  
  return (
    <div className="space-y-3">
      {/* Primary Language */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-foreground-muted" />
            <span className="text-xs font-medium text-foreground-secondary">
              {uiLang === 'zh' ? '主显示语言' : 'Primary Language'}
            </span>
          </div>
          <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">
            {uiLang === 'zh' ? '核心文案' : 'Main Copy'}
          </span>
        </div>
        <Select value={primaryLanguage} onValueChange={(v) => onPrimaryChange(v as Language)}>
          <SelectTrigger className="w-full h-9 bg-card border-border/50">
            <SelectValue>
              {(() => {
                const lang = languageOptions.find(l => l.id === primaryLanguage);
                return lang ? (
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </span>
                ) : null;
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map(lang => (
              <SelectItem key={lang.id} value={lang.id}>
                <span className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                  <span className="text-foreground-muted text-xs">({lang.name})</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Secondary Language */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Type className="h-3.5 w-3.5 text-foreground-muted" />
            <span className="text-xs font-medium text-foreground-secondary">
              {uiLang === 'zh' ? '辅助语言' : 'Secondary Language'}
            </span>
          </div>
          <span className="text-[10px] text-foreground-muted bg-secondary px-1.5 py-0.5 rounded">
            {uiLang === 'zh' ? '可选' : 'Optional'}
          </span>
        </div>
        <Select 
          value={secondaryLanguage || 'none'} 
          onValueChange={(v) => onSecondaryChange(v === 'none' ? null : v as Language)}
        >
          <SelectTrigger className="w-full h-9 bg-card border-border/50">
            <SelectValue>
              {secondaryLanguage ? (
                (() => {
                  const lang = languageOptions.find(l => l.id === secondaryLanguage);
                  return lang ? (
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </span>
                  ) : null;
                })()
              ) : (
                <span className="text-foreground-muted">
                  {uiLang === 'zh' ? '不使用辅助语言' : 'No secondary language'}
                </span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">
              <span className="text-foreground-muted">
                {uiLang === 'zh' ? '不使用辅助语言' : 'No secondary language'}
              </span>
            </SelectItem>
            {languageOptions
              .filter(l => l.id !== primaryLanguage)
              .map(lang => (
                <SelectItem key={lang.id} value={lang.id}>
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                    <span className="text-foreground-muted text-xs">({lang.name})</span>
                  </span>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Language Preview */}
      {secondaryLanguage && (
        <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
          <p className="text-xs text-foreground-muted mb-1">
            {uiLang === 'zh' ? '文字层级预览：' : 'Text preview:'}
          </p>
          <p className="text-sm font-medium text-foreground">
            {languageOptions.find(l => l.id === primaryLanguage)?.flag} {uiLang === 'zh' ? '标题文案' : 'Headline'}
            <span className="text-foreground-secondary text-xs font-normal ml-2">
              {languageOptions.find(l => l.id === secondaryLanguage)?.flag} {uiLang === 'zh' ? '副标题' : 'Subheadline'}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
