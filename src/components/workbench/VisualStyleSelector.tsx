import React from 'react';
import { Sparkles, Newspaper, Palette, Cpu, Film, Snowflake, Zap, Leaf } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type VisualStyle = 
  | 'ai_auto'
  | 'magazine'
  | 'watercolor'
  | 'tech_futuristic'
  | 'vintage_film'
  | 'minimalist_nordic'
  | 'neon_cyberpunk'
  | 'natural_organic';

export type LayoutStyle = 
  | 'ai_auto'
  | 'magazine_grid'
  | 'glassmorphism'
  | '3d_luxury'
  | 'handwritten_artistic'
  | 'neon_cyber'
  | 'ultra_minimal';

export type AspectRatio = 
  | '9:16'
  | '3:4'
  | '2:3'
  | '1:1'
  | '4:3'
  | '3:2'
  | '16:9'
  | '21:9';

interface VisualStyleSelectorProps {
  visualStyle: VisualStyle;
  layoutStyle: LayoutStyle;
  aspectRatio: AspectRatio;
  onVisualStyleChange: (style: VisualStyle) => void;
  onLayoutStyleChange: (style: LayoutStyle) => void;
  onAspectRatioChange: (ratio: AspectRatio) => void;
}

const visualStyles: { id: VisualStyle; label: string; icon: React.ReactNode }[] = [
  { id: 'ai_auto', label: '🤖 AI Auto-match', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'magazine', label: '📰 Magazine Editorial', icon: <Newspaper className="h-4 w-4" /> },
  { id: 'watercolor', label: '🎨 Watercolor Art', icon: <Palette className="h-4 w-4" /> },
  { id: 'tech_futuristic', label: '🦾 Tech Futuristic', icon: <Cpu className="h-4 w-4" /> },
  { id: 'vintage_film', label: '🎞️ Vintage Film', icon: <Film className="h-4 w-4" /> },
  { id: 'minimalist_nordic', label: '❄️ Minimalist Nordic', icon: <Snowflake className="h-4 w-4" /> },
  { id: 'neon_cyberpunk', label: '🌃 Neon Cyberpunk', icon: <Zap className="h-4 w-4" /> },
  { id: 'natural_organic', label: '🌿 Natural Organic', icon: <Leaf className="h-4 w-4" /> },
];

const layoutStyles: { id: LayoutStyle; label: string }[] = [
  { id: 'ai_auto', label: '🤖 AI Auto-match' },
  { id: 'magazine_grid', label: '📰 Bold Serif + Grid' },
  { id: 'glassmorphism', label: '💧 Glassmorphism' },
  { id: '3d_luxury', label: '👑 3D Embossed Luxury' },
  { id: 'handwritten_artistic', label: '✍️ Handwritten Artistic' },
  { id: 'neon_cyber', label: '⚡ Neon Cyber' },
  { id: 'ultra_minimal', label: '📏 Ultra Minimal' },
];

const aspectRatios: { id: AspectRatio; label: string }[] = [
  { id: '9:16', label: '📱 9:16 Portrait (KV)' },
  { id: '3:4', label: '🖼️ 3:4 Portrait' },
  { id: '2:3', label: '🖼️ 2:3 Portrait' },
  { id: '1:1', label: '⬛ 1:1 Square' },
  { id: '4:3', label: '🧩 4:3 Landscape' },
  { id: '3:2', label: '🧩 3:2 Landscape' },
  { id: '16:9', label: '🖥️ 16:9 Landscape' },
  { id: '21:9', label: '🎬 21:9 Ultrawide' },
];

export const VisualStyleSelector: React.FC<VisualStyleSelectorProps> = ({
  visualStyle,
  layoutStyle,
  aspectRatio,
  onVisualStyleChange,
  onLayoutStyleChange,
  onAspectRatioChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Visual Style */}
      <div className="space-y-1.5">
        <label className="text-xxs font-medium text-foreground-muted uppercase tracking-wide">
          Visual Style
        </label>
        <Select value={visualStyle} onValueChange={(v) => onVisualStyleChange(v as VisualStyle)}>
          <SelectTrigger className="w-full bg-card border-border hover:border-border-hover">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {visualStyles.map((style) => (
              <SelectItem key={style.id} value={style.id}>
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Layout Style */}
      <div className="space-y-1.5">
        <label className="text-xxs font-medium text-foreground-muted uppercase tracking-wide">
          Layout Details
        </label>
        <Select value={layoutStyle} onValueChange={(v) => onLayoutStyleChange(v as LayoutStyle)}>
          <SelectTrigger className="w-full bg-card border-border hover:border-border-hover">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {layoutStyles.map((style) => (
              <SelectItem key={style.id} value={style.id}>
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-1.5">
        <label className="text-xxs font-medium text-foreground-muted uppercase tracking-wide">
          Aspect Ratio
        </label>
        <Select value={aspectRatio} onValueChange={(v) => onAspectRatioChange(v as AspectRatio)}>
          <SelectTrigger className="w-full bg-card border-border hover:border-border-hover">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {aspectRatios.map((ratio) => (
              <SelectItem key={ratio.id} value={ratio.id}>
                {ratio.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};