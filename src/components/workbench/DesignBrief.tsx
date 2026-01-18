import React from 'react';
import { Sparkles, FileText, Layout, Type, Palette, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface DesignBriefProps {
  productName: string;
  productKeywords: string;
  platformName: string;
  platformIcon: React.ReactNode;
  visualStyleName: string;
  visualStyleIcon: React.ReactNode;
  layoutStyleName: string;
  primaryLanguage: string;
  secondaryLanguage: string | null;
  selectedModules: Array<{ id: string; name: string; aspectRatio: string }>;
  selectedScenes: string[];
  totalImages: number;
  onConfirm: () => void;
  isReady: boolean;
}

export const DesignBrief: React.FC<DesignBriefProps> = ({
  productName,
  productKeywords,
  platformName,
  platformIcon,
  visualStyleName,
  visualStyleIcon,
  layoutStyleName,
  primaryLanguage,
  secondaryLanguage,
  selectedModules,
  selectedScenes,
  totalImages,
  onConfirm,
  isReady,
}) => {
  const { language, t } = useLanguage();

  const sections = [
    {
      icon: <FileText className="h-4 w-4" />,
      label: language === 'zh' ? '产品信息' : 'Product Info',
      value: productName || '-',
      subValue: productKeywords?.split(',').slice(0, 3).join(', ') || null,
      iconElement: null,
    },
    {
      icon: <Layout className="h-4 w-4" />,
      label: language === 'zh' ? '目标平台' : 'Platform',
      value: platformName,
      subValue: `${selectedModules.length} ${language === 'zh' ? '个模块' : 'modules'}`,
      iconElement: platformIcon,
    },
    {
      icon: <Palette className="h-4 w-4" />,
      label: language === 'zh' ? '视觉风格' : 'Visual Style',
      value: visualStyleName,
      subValue: layoutStyleName,
      iconElement: visualStyleIcon,
    },
    {
      icon: <Type className="h-4 w-4" />,
      label: language === 'zh' ? '文案语言' : 'Language',
      value: primaryLanguage,
      subValue: secondaryLanguage ? `+ ${secondaryLanguage}` : null,
      iconElement: null,
    },
  ];

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/30">
        <div className="p-2 rounded-lg bg-gradient-primary shadow-primary-glow">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground">
            {language === 'zh' ? 'AI 设计方案' : 'AI Design Plan'}
          </h3>
          <p className="text-xs text-foreground-muted">
            {language === 'zh' ? '确认后开始生成' : 'Confirm to start generation'}
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-foreground">{totalImages}</span>
          <span className="text-sm text-foreground-muted ml-1">
            {language === 'zh' ? '张' : 'images'}
          </span>
        </div>
      </div>

      {/* Content Grid */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-secondary/30 border border-border/20"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-foreground-muted">{section.icon}</span>
                <span className="text-xs text-foreground-muted">{section.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {section.iconElement && (
                  <span className="text-primary shrink-0">{section.iconElement}</span>
                )}
                <p className="text-sm font-medium text-foreground truncate">
                  {section.value}
                </p>
              </div>
              {section.subValue && (
                <p className="text-xs text-foreground-secondary mt-0.5 truncate">
                  {section.subValue}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Scenes Preview */}
        <div className="p-3 rounded-xl bg-secondary/30 border border-border/20">
          <span className="text-xs text-foreground-muted block mb-2">
            {language === 'zh' ? '场景规划' : 'Scene Planning'} ({selectedScenes.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {selectedScenes.slice(0, 8).map((scene, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-md bg-card/50 border border-border/30 text-xs text-foreground-secondary"
              >
                {scene.replace('_', ' ')}
              </span>
            ))}
            {selectedScenes.length > 8 && (
              <span className="px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-xs text-primary">
                +{selectedScenes.length - 8}
              </span>
            )}
          </div>
        </div>

        {/* Module Preview */}
        <div className="p-3 rounded-xl bg-secondary/30 border border-border/20">
          <span className="text-xs text-foreground-muted block mb-2">
            {language === 'zh' ? '输出模块' : 'Output Modules'} ({selectedModules.length})
          </span>
          <div className="grid grid-cols-4 gap-2">
            {selectedModules.slice(0, 8).map((mod) => (
              <div
                key={mod.id}
                className="aspect-square rounded-lg bg-card/50 border border-border/30 flex flex-col items-center justify-center p-1.5"
              >
                <span className="text-[9px] text-foreground-secondary text-center leading-tight truncate w-full">
                  {mod.name}
                </span>
                <span className="text-[8px] text-foreground-muted mt-0.5">
                  {mod.aspectRatio}
                </span>
              </div>
            ))}
            {selectedModules.length > 8 && (
              <div className="aspect-square rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-center">
                <span className="text-xs text-primary font-medium">
                  +{selectedModules.length - 8}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Ready indicator */}
        {isReady && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-success/10 border border-success/20">
            <Check className="h-4 w-4 text-success" />
            <span className="text-sm text-success">
              {language === 'zh' ? '配置完成，可以开始生成' : 'Configuration complete, ready to generate'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
