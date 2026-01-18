import React from 'react';
import { Sparkles, Palette, Type, Cpu, Film, Snowflake, Zap, Leaf, Newspaper, Droplets, Crown, PenTool, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type VisualStyleId = 
  | 'ai_auto'
  | 'magazine'
  | 'watercolor'
  | 'tech_futuristic'
  | 'vintage_film'
  | 'minimalist_nordic'
  | 'neon_cyberpunk'
  | 'natural_organic';

export type LayoutStyleId = 
  | 'ai_auto'
  | 'magazine_grid'
  | 'glassmorphism'
  | '3d_luxury'
  | 'handwritten'
  | 'neon_glow'
  | 'ultra_minimal';

export interface VisualStyle {
  id: VisualStyleId;
  name: string;
  nameZh: string;
  icon: React.ReactNode;
  description: string;
  descriptionZh: string;
}

export interface LayoutStyle {
  id: LayoutStyleId;
  name: string;
  nameZh: string;
  icon: React.ReactNode;
}

export const visualStyles: VisualStyle[] = [
  { 
    id: 'ai_auto', 
    name: 'AI Auto-match', 
    nameZh: 'AI 自动匹配', 
    icon: <Sparkles className="h-4 w-4" />,
    description: 'Smart recommendation based on product',
    descriptionZh: '根据产品特性智能推荐'
  },
  { 
    id: 'magazine', 
    name: 'Magazine Editorial', 
    nameZh: '杂志编辑风格', 
    icon: <Newspaper className="h-4 w-4" />,
    description: 'Premium layout with bold typography',
    descriptionZh: '高级留白，大片感'
  },
  { 
    id: 'watercolor', 
    name: 'Watercolor Art', 
    nameZh: '水彩艺术风格', 
    icon: <Palette className="h-4 w-4" />,
    description: 'Warm hand-drawn effects',
    descriptionZh: '温暖手绘，晕染效果'
  },
  { 
    id: 'tech_futuristic', 
    name: 'Tech Futuristic', 
    nameZh: '科技未来风格', 
    icon: <Cpu className="h-4 w-4" />,
    description: 'Data visualization with cool tones',
    descriptionZh: '数据光效，冷色调'
  },
  { 
    id: 'vintage_film', 
    name: 'Vintage Film', 
    nameZh: '复古胶片风格', 
    icon: <Film className="h-4 w-4" />,
    description: 'Nostalgic grain with warm colors',
    descriptionZh: '颗粒怀旧，暖色调'
  },
  { 
    id: 'minimalist_nordic', 
    name: 'Minimalist Nordic', 
    nameZh: '极简北欧风格', 
    icon: <Snowflake className="h-4 w-4" />,
    description: 'Clean geometric with whitespace',
    descriptionZh: '几何纯净，大留白'
  },
  { 
    id: 'neon_cyberpunk', 
    name: 'Neon Cyberpunk', 
    nameZh: '霓虹赛博风格', 
    icon: <Zap className="h-4 w-4" />,
    description: 'Glowing neon on dark backgrounds',
    descriptionZh: '荧光发光，暗色背景'
  },
  { 
    id: 'natural_organic', 
    name: 'Natural Organic', 
    nameZh: '自然有机风格', 
    icon: <Leaf className="h-4 w-4" />,
    description: 'Earthy tones with botanical elements',
    descriptionZh: '植物环保，大地色系'
  },
];

export const layoutStyles: LayoutStyle[] = [
  { id: 'ai_auto', name: 'AI Auto-match', nameZh: 'AI 自动匹配', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'magazine_grid', name: 'Bold Serif + Grid', nameZh: '粗衬线 + 网格', icon: <Type className="h-4 w-4" /> },
  { id: 'glassmorphism', name: 'Glassmorphism', nameZh: '玻璃拟态卡片', icon: <Droplets className="h-4 w-4" /> },
  { id: '3d_luxury', name: '3D Embossed', nameZh: '3D 浮雕奢华', icon: <Crown className="h-4 w-4" /> },
  { id: 'handwritten', name: 'Handwritten', nameZh: '手写艺术风', icon: <PenTool className="h-4 w-4" /> },
  { id: 'neon_glow', name: 'Neon Glow', nameZh: '霓虹发光', icon: <Zap className="h-4 w-4" /> },
  { id: 'ultra_minimal', name: 'Ultra Minimal', nameZh: '极细线条极简', icon: <Minimize2 className="h-4 w-4" /> },
];

interface VisualStylePickerProps {
  selectedVisual: VisualStyleId;
  selectedLayout: LayoutStyleId;
  onVisualChange: (style: VisualStyleId) => void;
  onLayoutChange: (style: LayoutStyleId) => void;
  aiRecommendedVisual?: VisualStyleId;
  aiRecommendedLayout?: LayoutStyleId;
  isAgentMode?: boolean;
}

export const VisualStylePicker: React.FC<VisualStylePickerProps> = ({
  selectedVisual,
  selectedLayout,
  onVisualChange,
  onLayoutChange,
  aiRecommendedVisual,
  aiRecommendedLayout,
  isAgentMode = false,
}) => {
  const { language } = useLanguage();
  
  // Filter styles based on mode - Manual mode hides "AI Auto" option
  const availableVisualStyles = isAgentMode 
    ? visualStyles 
    : visualStyles.filter(s => s.id !== 'ai_auto');
  
  const availableLayoutStyles = isAgentMode 
    ? layoutStyles 
    : layoutStyles.filter(s => s.id !== 'ai_auto');

  return (
    <div className="space-y-4">
      {/* Visual Style */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground-secondary">
            {language === 'zh' ? 'KV 视觉风格' : 'Visual Style'}
          </span>
          {isAgentMode && aiRecommendedVisual && aiRecommendedVisual !== 'ai_auto' && (
            <span className="flex items-center gap-1 text-xs text-primary">
              <Sparkles className="h-3 w-3" />
              {language === 'zh' ? 'AI推荐' : 'AI'}
            </span>
          )}
          {!isAgentMode && (
            <span className="text-[10px] text-foreground-muted bg-secondary px-1.5 py-0.5 rounded">
              {language === 'zh' ? '手动选择' : 'Manual'}
            </span>
          )}
        </div>
        
        <Select value={selectedVisual} onValueChange={(v) => onVisualChange(v as VisualStyleId)}>
          <SelectTrigger className={cn(
            "w-full h-12 border-border/50",
            isAgentMode ? "bg-card" : "bg-card/80"
          )}>
            <SelectValue>
              {(() => {
                const style = visualStyles.find(s => s.id === selectedVisual);
                return style ? (
                  <span className="flex items-center gap-2.5">
                    <span className={cn(
                      "p-1 rounded-md",
                      isAgentMode && style.id === aiRecommendedVisual 
                        ? "bg-primary/10 text-primary" 
                        : "bg-secondary text-foreground-muted"
                    )}>
                      {style.icon}
                    </span>
                    <span className="font-medium">
                      {language === 'zh' ? style.nameZh : style.name}
                    </span>
                    {isAgentMode && style.id === aiRecommendedVisual && style.id !== 'ai_auto' && (
                      <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        {language === 'zh' ? '推荐' : 'Rec'}
                      </span>
                    )}
                  </span>
                ) : null;
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            {availableVisualStyles.map(style => (
              <SelectItem key={style.id} value={style.id}>
                <div className="flex items-center gap-3 py-1">
                  <span className={cn(
                    "p-1.5 rounded-lg shrink-0",
                    isAgentMode && style.id === aiRecommendedVisual 
                      ? "bg-primary/10 text-primary" 
                      : "bg-secondary text-foreground-muted"
                  )}>
                    {style.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {language === 'zh' ? style.nameZh : style.name}
                      </span>
                      {isAgentMode && style.id === aiRecommendedVisual && style.id !== 'ai_auto' && (
                        <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0">
                          {language === 'zh' ? '推荐' : 'Rec'}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-foreground-muted">
                      {language === 'zh' ? style.descriptionZh : style.description}
                    </span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Layout Style */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground-muted">
            {language === 'zh' ? '排版效果' : 'Layout Style'}
          </span>
          {isAgentMode ? (
            <span className="text-[10px] text-foreground-muted bg-secondary px-1.5 py-0.5 rounded">
              {language === 'zh' ? '可选微调' : 'Optional'}
            </span>
          ) : (
            <span className="text-[10px] text-foreground-muted bg-secondary px-1.5 py-0.5 rounded">
              {language === 'zh' ? '手动选择' : 'Manual'}
            </span>
          )}
        </div>
        
        <Select value={selectedLayout} onValueChange={(v) => onLayoutChange(v as LayoutStyleId)}>
          <SelectTrigger className="w-full h-10 bg-card/50 border-border/30 text-sm">
            <SelectValue>
              {(() => {
                const style = layoutStyles.find(s => s.id === selectedLayout);
                return style ? (
                  <span className="flex items-center gap-2.5 text-foreground-secondary">
                    <span className={cn(
                      "p-1 rounded-md",
                      isAgentMode && style.id === aiRecommendedLayout 
                        ? "bg-primary/10 text-primary" 
                        : "bg-secondary/50 text-foreground-muted"
                    )}>
                      {style.icon}
                    </span>
                    <span>{language === 'zh' ? style.nameZh : style.name}</span>
                    {isAgentMode && style.id === aiRecommendedLayout && style.id !== 'ai_auto' && (
                      <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        {language === 'zh' ? '推荐' : 'Rec'}
                      </span>
                    )}
                  </span>
                ) : null;
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            {availableLayoutStyles.map(style => (
              <SelectItem key={style.id} value={style.id}>
                <span className="flex items-center gap-2.5">
                  <span className={cn(
                    "p-1 rounded-md",
                    isAgentMode && style.id === aiRecommendedLayout 
                      ? "bg-primary/10 text-primary" 
                      : "bg-secondary/50 text-foreground-muted"
                  )}>
                    {style.icon}
                  </span>
                  <span>{language === 'zh' ? style.nameZh : style.name}</span>
                  {isAgentMode && style.id === aiRecommendedLayout && style.id !== 'ai_auto' && (
                    <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      {language === 'zh' ? '推荐' : 'Rec'}
                    </span>
                  )}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
