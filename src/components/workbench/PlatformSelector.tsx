import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Platform {
  id: string;
  name: string;
  icon: string;
  modules: {
    id: string;
    name: string;
    size: { width: number; height: number };
    aspectRatio: string;
  }[];
}

export const platforms: Platform[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    icon: '📦',
    modules: [
      { id: 'main_kv', name: 'Main Image', size: { width: 2000, height: 2000 }, aspectRatio: '1:1' },
      { id: 'detail_1', name: 'Detail 1', size: { width: 2000, height: 2000 }, aspectRatio: '1:1' },
      { id: 'detail_2', name: 'Detail 2', size: { width: 2000, height: 2000 }, aspectRatio: '1:1' },
      { id: 'aplus', name: 'A+ Content', size: { width: 970, height: 600 }, aspectRatio: '970:600' },
    ],
  },
  {
    id: 'shopify',
    name: 'Shopify',
    icon: '🛒',
    modules: [
      { id: 'hero', name: 'Hero Banner', size: { width: 1920, height: 800 }, aspectRatio: '12:5' },
      { id: 'product', name: 'Product', size: { width: 1024, height: 1024 }, aspectRatio: '1:1' },
      { id: 'collection', name: 'Collection', size: { width: 1600, height: 900 }, aspectRatio: '16:9' },
    ],
  },
  {
    id: 'tiktok',
    name: 'TikTok Shop',
    icon: '🎵',
    modules: [
      { id: 'video_cover', name: 'Video Cover', size: { width: 1080, height: 1920 }, aspectRatio: '9:16' },
      { id: 'product_card', name: 'Product Card', size: { width: 800, height: 800 }, aspectRatio: '1:1' },
    ],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    modules: [
      { id: 'post', name: 'Post', size: { width: 1080, height: 1080 }, aspectRatio: '1:1' },
      { id: 'story', name: 'Story', size: { width: 1080, height: 1920 }, aspectRatio: '9:16' },
      { id: 'reels', name: 'Reels Cover', size: { width: 1080, height: 1920 }, aspectRatio: '9:16' },
    ],
  },
  {
    id: 'xiaohongshu',
    name: '小红书',
    icon: '📕',
    modules: [
      { id: 'cover', name: 'Cover', size: { width: 1242, height: 1660 }, aspectRatio: '3:4' },
      { id: 'detail', name: 'Detail', size: { width: 1242, height: 1660 }, aspectRatio: '3:4' },
    ],
  },
  {
    id: 'custom',
    name: 'Custom',
    icon: '✨',
    modules: [],
  },
];

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onTogglePlatform: (platformId: string) => void;
  isAgentMode?: boolean;
  onAgentRecommend?: () => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatforms,
  onTogglePlatform,
  isAgentMode = false,
  onAgentRecommend,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Target Platforms</h3>
        {isAgentMode && (
          <button
            onClick={onAgentRecommend}
            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            <Sparkles className="h-3 w-3" />
            AI Recommend
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          
          return (
            <button
              key={platform.id}
              onClick={() => onTogglePlatform(platform.id)}
              className={cn(
                "relative flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-300",
                "border",
                isSelected
                  ? "bg-primary/10 border-primary/40 shadow-sm"
                  : "bg-card/50 border-border/30 hover:border-primary/30 hover:bg-card"
              )}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-primary-foreground" />
                </div>
              )}
              
              <span className="text-xl">{platform.icon}</span>
              <span className={cn(
                "text-xs font-medium transition-colors",
                isSelected ? "text-foreground" : "text-foreground-muted"
              )}>
                {platform.name}
              </span>
              
              {platform.id !== 'custom' && (
                <span className="text-[10px] text-foreground-muted">
                  {platform.modules.length} sizes
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected modules preview */}
      {selectedPlatforms.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-secondary/30 border border-border/30">
          <p className="text-xs font-medium text-foreground-muted mb-2">
            Auto-configured outputs:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {selectedPlatforms.flatMap(platformId => {
              const platform = platforms.find(p => p.id === platformId);
              if (!platform) return [];
              return platform.modules.map(mod => (
                <span
                  key={`${platformId}-${mod.id}`}
                  className="px-2 py-0.5 rounded-md bg-card text-xs text-foreground-secondary border border-border/30"
                >
                  {mod.name} ({mod.aspectRatio})
                </span>
              ));
            })}
          </div>
        </div>
      )}
    </div>
  );
};
