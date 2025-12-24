import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  icon: string;
  description: string;
  preview?: string;
}

export interface LayoutStyle {
  id: LayoutStyleId;
  name: string;
  nameZh: string;
  icon: string;
}

export const visualStyles: VisualStyle[] = [
  { id: 'ai_auto', name: 'AI Auto', nameZh: 'AI自动匹配', icon: '🤖', description: '根据产品特性智能推荐' },
  { id: 'magazine', name: 'Magazine Editorial', nameZh: '杂志编辑风格', icon: '📰', description: '高级留白，大片感' },
  { id: 'watercolor', name: 'Watercolor Art', nameZh: '水彩艺术风格', icon: '🎨', description: '温暖手绘，晕染效果' },
  { id: 'tech_futuristic', name: 'Tech Futuristic', nameZh: '科技未来风格', icon: '🦾', description: '数据光效，冷色调' },
  { id: 'vintage_film', name: 'Vintage Film', nameZh: '复古胶片风格', icon: '🎞️', description: '颗粒怀旧，暖色调' },
  { id: 'minimalist_nordic', name: 'Minimalist Nordic', nameZh: '极简北欧风格', icon: '❄️', description: '几何纯净，大留白' },
  { id: 'neon_cyberpunk', name: 'Neon Cyberpunk', nameZh: '霓虹赛博风格', icon: '🌃', description: '荧光发光，暗色背景' },
  { id: 'natural_organic', name: 'Natural Organic', nameZh: '自然有机风格', icon: '🌿', description: '植物环保，大地色系' },
];

export const layoutStyles: LayoutStyle[] = [
  { id: 'ai_auto', name: 'AI Auto', nameZh: 'AI自动匹配', icon: '🤖' },
  { id: 'magazine_grid', name: 'Bold Serif + Grid', nameZh: '粗衬线+网格对齐', icon: '📰' },
  { id: 'glassmorphism', name: 'Glassmorphism', nameZh: '玻璃拟态卡片', icon: '💧' },
  { id: '3d_luxury', name: '3D Embossed Luxury', nameZh: '3D浮雕奢华', icon: '👑' },
  { id: 'handwritten', name: 'Handwritten Artistic', nameZh: '手写艺术风', icon: '✍️' },
  { id: 'neon_glow', name: 'Neon Glow', nameZh: '霓虹发光', icon: '⚡' },
  { id: 'ultra_minimal', name: 'Ultra Minimal', nameZh: '极细线条极简', icon: '📏' },
];

interface VisualStylePickerProps {
  selectedVisual: VisualStyleId;
  selectedLayout: LayoutStyleId;
  onVisualChange: (style: VisualStyleId) => void;
  onLayoutChange: (style: LayoutStyleId) => void;
  aiRecommendedVisual?: VisualStyleId;
  isAgentMode?: boolean;
}

export const VisualStylePicker: React.FC<VisualStylePickerProps> = ({
  selectedVisual,
  selectedLayout,
  onVisualChange,
  onLayoutChange,
  aiRecommendedVisual,
  isAgentMode = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Visual Style - Primary, more prominent */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground-secondary">KV 视觉风格</span>
          {aiRecommendedVisual && (
            <span className="flex items-center gap-1 text-xs text-primary">
              <Sparkles className="h-3 w-3" />
              AI推荐
            </span>
          )}
        </div>
        
        <Select value={selectedVisual} onValueChange={(v) => onVisualChange(v as VisualStyleId)}>
          <SelectTrigger className="w-full h-11 bg-card border-border/50">
            <SelectValue>
              {(() => {
                const style = visualStyles.find(s => s.id === selectedVisual);
                return style ? (
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{style.icon}</span>
                    <span className="font-medium">{style.nameZh}</span>
                    {style.id === aiRecommendedVisual && (
                      <span className="text-[10px] text-primary bg-primary/10 px-1.5 rounded">推荐</span>
                    )}
                  </span>
                ) : null;
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {visualStyles.map(style => (
              <SelectItem key={style.id} value={style.id}>
                <div className="flex items-center gap-3 py-1">
                  <span className="text-xl">{style.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{style.nameZh}</span>
                      {style.id === aiRecommendedVisual && (
                        <span className="text-[10px] text-primary bg-primary/10 px-1.5 rounded">推荐</span>
                      )}
                    </div>
                    <span className="text-xs text-foreground-muted">{style.description}</span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Layout Style - Secondary, less prominent */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground-muted">排版细节</span>
          <span className="text-[10px] text-foreground-muted bg-secondary px-1.5 py-0.5 rounded">可选微调</span>
        </div>
        
        <Select value={selectedLayout} onValueChange={(v) => onLayoutChange(v as LayoutStyleId)}>
          <SelectTrigger className="w-full h-9 bg-card/50 border-border/30 text-sm">
            <SelectValue>
              {(() => {
                const style = layoutStyles.find(s => s.id === selectedLayout);
                return style ? (
                  <span className="flex items-center gap-2 text-foreground-secondary">
                    <span>{style.icon}</span>
                    <span>{style.nameZh}</span>
                  </span>
                ) : null;
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {layoutStyles.map(style => (
              <SelectItem key={style.id} value={style.id}>
                <span className="flex items-center gap-2">
                  <span>{style.icon}</span>
                  <span>{style.nameZh}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
