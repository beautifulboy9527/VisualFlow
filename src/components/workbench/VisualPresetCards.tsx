import React, { useState } from 'react';
import { Check, Sparkles, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { VisualStyleId, visualStyles } from './VisualStylePicker';

interface VisualPresetCardsProps {
  selectedStyle: VisualStyleId;
  onSelectStyle: (style: VisualStyleId) => void;
  aiRecommended?: VisualStyleId;
  showAIAuto?: boolean;
  compact?: boolean;
}

// Sample preview images for each style
const stylePreviewImages: Record<string, string> = {
  ai_auto: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop',
  magazine: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
  watercolor: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=300&fit=crop',
  tech_futuristic: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
  vintage_film: 'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=400&h=300&fit=crop',
  minimalist_nordic: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400&h=300&fit=crop',
  neon_cyberpunk: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
  natural_organic: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=400&h=300&fit=crop',
  gradient_glass: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=300&fit=crop',
  pop_color: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=300&fit=crop',
};

export const VisualPresetCards: React.FC<VisualPresetCardsProps> = ({
  selectedStyle,
  onSelectStyle,
  aiRecommended,
  showAIAuto = true,
  compact = false,
}) => {
  const { language } = useLanguage();
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null);

  const displayStyles = showAIAuto 
    ? visualStyles 
    : visualStyles.filter(s => s.id !== 'ai_auto');

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-foreground-secondary">
            {language === 'zh' ? '视觉风格' : 'Visual Style'}
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {displayStyles.slice(0, 6).map((style) => {
            const isSelected = selectedStyle === style.id;
            const isRecommended = aiRecommended === style.id;
            
            return (
              <button
                key={style.id}
                onClick={() => onSelectStyle(style.id)}
                className={cn(
                  "relative rounded-lg overflow-hidden aspect-[4/3] transition-all duration-300",
                  "ring-2",
                  isSelected 
                    ? "ring-primary shadow-lg shadow-primary/20" 
                    : "ring-transparent hover:ring-primary/40"
                )}
              >
                <img
                  src={stylePreviewImages[style.id] || stylePreviewImages.magazine}
                  alt={language === 'zh' ? style.nameZh : style.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                
                {/* Style name */}
                <span className="absolute bottom-1 left-1 right-1 text-[9px] text-white font-medium truncate">
                  {language === 'zh' ? style.nameZh : style.name}
                </span>
                
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-primary-foreground" />
                  </div>
                )}
                
                {/* AI recommended badge */}
                {isRecommended && !isSelected && (
                  <div className="absolute top-1 left-1">
                    <Wand2 className="h-3 w-3 text-amber-400" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          {language === 'zh' ? '视觉风格预设' : 'Visual Style Presets'}
        </h3>
        {aiRecommended && (
          <span className="text-[10px] text-amber-500 flex items-center gap-1">
            <Wand2 className="h-3 w-3" />
            {language === 'zh' ? 'AI 推荐' : 'AI Recommended'}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {displayStyles.map((style) => {
          const isSelected = selectedStyle === style.id;
          const isRecommended = aiRecommended === style.id;
          const isHovered = hoveredStyle === style.id;
          
          return (
            <button
              key={style.id}
              onClick={() => onSelectStyle(style.id)}
              onMouseEnter={() => setHoveredStyle(style.id)}
              onMouseLeave={() => setHoveredStyle(null)}
              className={cn(
                "relative rounded-xl overflow-hidden aspect-[4/3] transition-all duration-300 group",
                "ring-2",
                isSelected 
                  ? "ring-primary shadow-xl shadow-primary/20 scale-[1.02]" 
                  : "ring-transparent hover:ring-primary/50 hover:shadow-lg"
              )}
            >
              {/* Preview image */}
              <img
                src={stylePreviewImages[style.id] || stylePreviewImages.magazine}
                alt={language === 'zh' ? style.nameZh : style.name}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-500",
                  isHovered && "scale-110"
                )}
              />
              
              {/* Gradient overlay */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity",
                isHovered ? "opacity-100" : "opacity-80"
              )} />
              
              {/* AI Auto special effect */}
              {style.id === 'ai_auto' && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/30" />
              )}
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{style.icon}</span>
                  <span className="text-sm font-medium text-white">
                    {language === 'zh' ? style.nameZh : style.name}
                  </span>
                </div>
                <p className={cn(
                  "text-[10px] text-white/70 transition-all",
                  isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                )}>
                  {language === 'zh' ? style.descriptionZh : style.description}
                </p>
              </div>
              
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Check className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
              )}
              
              {/* AI recommended badge */}
              {isRecommended && (
                <div className={cn(
                  "absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium",
                  "bg-amber-500/90 text-white shadow-lg"
                )}>
                  <Wand2 className="h-2.5 w-2.5" />
                  {language === 'zh' ? 'AI推荐' : 'Recommended'}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VisualPresetCards;
