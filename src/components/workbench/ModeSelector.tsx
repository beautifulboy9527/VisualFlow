import React from 'react';
import { ShoppingBag, Store, Video } from 'lucide-react';

export type GenerationMode = 'amazon' | 'shopify' | 'tiktok';

interface ModeSelectorProps {
  selectedMode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
}

const modes: { id: GenerationMode; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: 'amazon',
    label: 'Amazon',
    icon: <ShoppingBag className="h-4 w-4" />,
    description: 'A+ Content ready',
  },
  {
    id: 'shopify',
    label: 'Shopify',
    icon: <Store className="h-4 w-4" />,
    description: 'Brand-focused',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: <Video className="h-4 w-4" />,
    description: 'Trending styles',
  },
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  selectedMode,
  onModeChange,
}) => {
  return (
    <div className="space-y-2">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`
            w-full flex items-center gap-3 p-3 rounded-md border text-left
            transition-all duration-200 ease-out
            ${selectedMode === mode.id
              ? 'border-primary bg-primary-light text-foreground'
              : 'border-border bg-card hover:border-border-hover hover:bg-secondary/50'
            }
          `}
        >
          {/* Radio indicator */}
          <div className={`
            w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
            transition-colors duration-200
            ${selectedMode === mode.id
              ? 'border-primary'
              : 'border-border'
            }
          `}>
            {selectedMode === mode.id && (
              <div className="w-2 h-2 rounded-full bg-primary animate-scale-in" />
            )}
          </div>

          {/* Icon */}
          <div className={`
            p-1.5 rounded-md transition-colors duration-200
            ${selectedMode === mode.id
              ? 'bg-primary/10 text-primary'
              : 'bg-secondary text-foreground-muted'
            }
          `}>
            {mode.icon}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className={`
              text-sm font-medium
              ${selectedMode === mode.id ? 'text-foreground' : 'text-foreground'}
            `}>
              {mode.label}
            </p>
            <p className="text-xs text-foreground-muted truncate">
              {mode.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};
