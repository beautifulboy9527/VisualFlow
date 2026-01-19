import React from 'react';
import { 
  Sparkles, 
  Palette,
  Type,
  Layers,
  Check,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { VisualStyleId, LayoutStyleId, visualStyles, layoutStyles } from './VisualStylePicker';
import { ProductAnalysis } from '@/lib/aiAnalysis';

interface AgentModeSidebarProps {
  analysis: ProductAnalysis | null;
  isAnalyzing: boolean;
  recommendedVisualStyle: VisualStyleId;
  recommendedLayoutStyle: LayoutStyleId;
  recommendedModules: { id: string; name: string; aspectRatio: string }[];
  recommendedScenes: string[];
  totalImages: number;
}

export const AgentModeSidebar: React.FC<AgentModeSidebarProps> = ({
  analysis,
  isAnalyzing,
  recommendedVisualStyle,
  recommendedLayoutStyle,
  recommendedModules,
  recommendedScenes,
  totalImages,
}) => {
  const { language } = useLanguage();
  
  const currentVisualStyle = visualStyles.find(s => s.id === recommendedVisualStyle);
  const currentLayoutStyle = layoutStyles.find(s => s.id === recommendedLayoutStyle);

  // Loading state
  if (isAnalyzing) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2.5 rounded-xl bg-gradient-primary shadow-primary-glow">
              <Sparkles className="h-4 w-4 text-primary-foreground animate-pulse" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {language === 'zh' ? 'AI 正在分析...' : 'AI analyzing...'}
            </p>
            <div className="flex gap-0.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No analysis yet
  if (!analysis) {
    return (
      <div className="rounded-2xl border border-border/30 bg-card/50 p-4 text-center">
        <div className="p-3 rounded-full bg-secondary/50 inline-flex mb-2">
          <Sparkles className="h-5 w-5 text-foreground-muted" />
        </div>
        <p className="text-xs text-foreground-muted">
          {language === 'zh' 
            ? '选择平台后，AI 将自动分析' 
            : 'After selecting platform, AI will analyze'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Status Badge */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/20">
        <div className="p-1.5 rounded-lg bg-gradient-primary">
          <MessageCircle className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <span className="text-xs font-medium text-primary">
            {language === 'zh' ? 'AI 对话模式' : 'AI Chat Mode'}
          </span>
          <p className="text-[10px] text-foreground-muted">
            {language === 'zh' ? '在主面板与 AI 讨论方案' : 'Discuss with AI in main panel'}
          </p>
        </div>
      </div>

      {/* Compact Plan Summary */}
      <div className="rounded-xl border border-border/30 bg-card/50 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground-muted">
            {language === 'zh' ? '当前方案' : 'Current Plan'}
          </span>
          <span className="text-xs text-primary font-medium">
            {analysis.confidence}%
          </span>
        </div>
        
        {/* Visual Style */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
          <Palette className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="text-xs text-foreground truncate">
            {language === 'zh' ? currentVisualStyle?.nameZh : currentVisualStyle?.name}
          </span>
        </div>
        
        {/* Layout Style */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
          <Type className="h-3.5 w-3.5 text-foreground-muted shrink-0" />
          <span className="text-xs text-foreground truncate">
            {language === 'zh' ? currentLayoutStyle?.nameZh : currentLayoutStyle?.name}
          </span>
        </div>
        
        {/* Output Count */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs text-foreground-muted">
              {language === 'zh' ? '输出' : 'Output'}
            </span>
          </div>
          <span className="text-sm font-bold text-primary">
            {totalImages} {language === 'zh' ? '张' : 'imgs'}
          </span>
        </div>
        
        {/* Content Preview */}
        <div className="pt-1">
          <div className="flex flex-wrap gap-1">
            {recommendedModules.slice(0, 2).map(module => (
              <span 
                key={module.id} 
                className="px-2 py-0.5 text-[10px] rounded-md bg-primary/10 text-primary"
              >
                {module.name}
              </span>
            ))}
            {recommendedScenes.slice(0, 2).map(scene => (
              <span 
                key={scene} 
                className="px-2 py-0.5 text-[10px] rounded-md bg-secondary text-foreground-muted"
              >
                {scene}
              </span>
            ))}
            {(recommendedModules.length + recommendedScenes.length) > 4 && (
              <span className="px-2 py-0.5 text-[10px] rounded-md bg-secondary text-foreground-muted">
                +{(recommendedModules.length + recommendedScenes.length) - 4}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Color Palette */}
      {analysis.colorPalette && (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-card/50">
          <span className="text-xs text-foreground-muted">
            {language === 'zh' ? '配色' : 'Colors'}
          </span>
          <div className="flex items-center gap-1">
            <div 
              className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
              style={{ backgroundColor: analysis.colorPalette.primary }}
            />
            <div 
              className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
              style={{ backgroundColor: analysis.colorPalette.secondary }}
            />
            <div 
              className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
              style={{ backgroundColor: analysis.colorPalette.accent }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
