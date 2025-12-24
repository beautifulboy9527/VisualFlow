import React, { useState, useRef } from 'react';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/hooks/useLanguage';

export type LogoPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
export type LogoStyle = 'original' | 'white' | 'black';

export interface LogoConfig {
  file: File | null;
  preview: string | null;
  include: boolean;
  position: LogoPosition;
  style: LogoStyle;
}

interface LogoSettingsProps {
  config: LogoConfig;
  onChange: (config: LogoConfig) => void;
}

const positions: { id: LogoPosition; label: { zh: string; en: string } }[] = [
  { id: 'top-left', label: { zh: '左上', en: 'TL' } },
  { id: 'top-right', label: { zh: '右上', en: 'TR' } },
  { id: 'bottom-left', label: { zh: '左下', en: 'BL' } },
  { id: 'bottom-right', label: { zh: '右下', en: 'BR' } },
  { id: 'center', label: { zh: '居中', en: 'C' } },
];

const styles: { id: LogoStyle; label: { zh: string; en: string }; color: string }[] = [
  { id: 'original', label: { zh: '原色', en: 'Original' }, color: 'bg-gradient-primary' },
  { id: 'white', label: { zh: '白色', en: 'White' }, color: 'bg-foreground' },
  { id: 'black', label: { zh: '黑色', en: 'Black' }, color: 'bg-foreground-secondary' },
];

export const LogoSettings: React.FC<LogoSettingsProps> = ({ config, onChange }) => {
  const { language, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      onChange({ ...config, file, preview, include: true });
    }
  };

  const handleRemove = () => {
    if (config.preview) {
      URL.revokeObjectURL(config.preview);
    }
    onChange({ ...config, file: null, preview: null });
  };

  return (
    <div className="space-y-4">
      {/* Logo Upload */}
      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        
        {config.preview ? (
          <div className="relative group">
            <div className="h-16 rounded-lg border border-border/50 bg-card/50 flex items-center gap-3 p-3">
              <div className="h-10 w-10 rounded-md bg-secondary/50 flex items-center justify-center overflow-hidden">
                <img 
                  src={config.preview} 
                  alt="Logo preview" 
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground truncate block">
                  {config.file?.name || 'Logo'}
                </span>
                <span className="text-xs text-foreground-muted">
                  {language === 'zh' ? '已上传' : 'Uploaded'}
                </span>
              </div>
              <button
                onClick={handleRemove}
                className="p-1.5 rounded-md hover:bg-secondary text-foreground-muted hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-16 rounded-lg border border-dashed border-border/50 bg-card/30 hover:bg-card/50 hover:border-primary/30 transition-all flex items-center justify-center gap-2 text-foreground-muted hover:text-foreground"
          >
            <Upload className="h-4 w-4" />
            <span className="text-sm">{language === 'zh' ? '上传 Logo' : 'Upload Logo'}</span>
          </button>
        )}
      </div>

      {/* Include Logo Toggle */}
      {config.preview && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/30">
          <span className="text-sm text-foreground">
            {language === 'zh' ? '图片包含 Logo' : 'Include in images'}
          </span>
          <Switch
            checked={config.include}
            onCheckedChange={(include) => onChange({ ...config, include })}
          />
        </div>
      )}

      {/* Position & Style (only show when logo is uploaded and included) */}
      {config.preview && config.include && (
        <div className="space-y-3">
          {/* Position Grid */}
          <div className="space-y-2">
            <span className="text-xs text-foreground-muted">
              {language === 'zh' ? '位置' : 'Position'}
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {positions.map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => onChange({ ...config, position: pos.id })}
                  className={cn(
                    "py-1.5 rounded-md text-xs font-medium transition-all",
                    config.position === pos.id
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "bg-card border border-border/30 text-foreground-secondary hover:border-border"
                  )}
                >
                  {language === 'zh' ? pos.label.zh : pos.label.en}
                </button>
              ))}
            </div>
          </div>

          {/* Style Options */}
          <div className="space-y-2">
            <span className="text-xs text-foreground-muted">
              {language === 'zh' ? '样式' : 'Style'}
            </span>
            <div className="flex gap-2">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => onChange({ ...config, style: style.id })}
                  className={cn(
                    "flex-1 py-1.5 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5",
                    config.style === style.id
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "bg-card border border-border/30 text-foreground-secondary hover:border-border"
                  )}
                >
                  <div className={cn("w-2.5 h-2.5 rounded-full", style.color)} />
                  {language === 'zh' ? style.label.zh : style.label.en}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
