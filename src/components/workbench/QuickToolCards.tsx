import React from 'react';
import { 
  Paintbrush, 
  ImagePlus, 
  ZoomIn, 
  Eraser,
  Wand2,
  Layers,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface QuickTool {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  icon: LucideIcon;
  gradient: string;
  comingSoon?: boolean;
}

const quickTools: QuickTool[] = [
  {
    id: 'inpainting',
    name: 'Inpainting',
    nameZh: '局部重绘',
    description: 'Edit specific areas',
    descriptionZh: '精准修改局部区域',
    icon: Paintbrush,
    gradient: 'from-violet-500/20 to-purple-500/20',
  },
  {
    id: 'scene_replace',
    name: 'Scene Replace',
    nameZh: '场景替换',
    description: 'Change backgrounds',
    descriptionZh: '一键换背景场景',
    icon: ImagePlus,
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    id: 'ai_upscale',
    name: 'AI Upscale',
    nameZh: 'AI超清',
    description: 'Enhance resolution',
    descriptionZh: '智能提升画质',
    icon: ZoomIn,
    gradient: 'from-emerald-500/20 to-green-500/20',
  },
  {
    id: 'product_swap',
    name: 'Product Swap',
    nameZh: '商品替换',
    description: 'Replace products',
    descriptionZh: '保留场景换商品',
    icon: Wand2,
    gradient: 'from-orange-500/20 to-amber-500/20',
  },
  {
    id: 'remove_bg',
    name: 'Remove BG',
    nameZh: '抠图',
    description: 'Remove background',
    descriptionZh: '智能抠图去背景',
    icon: Eraser,
    gradient: 'from-rose-500/20 to-pink-500/20',
  },
  {
    id: 'batch_generate',
    name: 'Batch Generate',
    nameZh: '批量生成',
    description: 'Multiple products',
    descriptionZh: '多产品批量处理',
    icon: Layers,
    gradient: 'from-primary/20 to-accent/20',
    comingSoon: true,
  },
];

interface QuickToolCardsProps {
  onToolSelect?: (toolId: string) => void;
  compact?: boolean;
}

export const QuickToolCards: React.FC<QuickToolCardsProps> = ({
  onToolSelect,
  compact = false,
}) => {
  const { language } = useLanguage();

  const handleToolClick = (tool: QuickTool) => {
    if (tool.comingSoon) return;
    onToolSelect?.(tool.id);
  };

  if (compact) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {quickTools.slice(0, 6).map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              disabled={tool.comingSoon}
              className={cn(
                "relative flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-300",
                "bg-card/50 border border-border/30 hover:border-primary/40 hover:bg-card/80",
                "group",
                tool.comingSoon && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                "bg-gradient-to-br",
                tool.gradient,
                "group-hover:scale-110"
              )}>
                <Icon className="h-4 w-4 text-foreground-secondary group-hover:text-primary transition-colors" />
              </div>
              <span className="text-[10px] font-medium text-foreground-secondary group-hover:text-foreground whitespace-nowrap">
                {language === 'zh' ? tool.nameZh : tool.name}
              </span>
              {tool.comingSoon && (
                <span className="absolute top-1 right-1 text-[8px] bg-primary/20 text-primary px-1 py-0.5 rounded">
                  {language === 'zh' ? '即将' : 'Soon'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {language === 'zh' ? '快捷工具' : 'Quick Tools'}
        </h3>
        <span className="text-[10px] text-foreground-muted">
          {language === 'zh' ? '独立功能模块' : 'Standalone modules'}
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {quickTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              disabled={tool.comingSoon}
              className={cn(
                "relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                "bg-card/50 border border-border/30",
                "hover:border-primary/40 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5",
                "group text-left",
                tool.comingSoon && "opacity-60 cursor-not-allowed"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all",
                "bg-gradient-to-br",
                tool.gradient,
                "group-hover:scale-110"
              )}>
                <Icon className="h-5 w-5 text-foreground-secondary group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-foreground-secondary group-hover:text-foreground truncate">
                    {language === 'zh' ? tool.nameZh : tool.name}
                  </span>
                  {tool.comingSoon && (
                    <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded shrink-0">
                      {language === 'zh' ? '即将上线' : 'Coming Soon'}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-foreground-muted truncate block">
                  {language === 'zh' ? tool.descriptionZh : tool.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickToolCards;
