import React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Monitor, Smartphone, Square, RectangleHorizontal, RectangleVertical } from 'lucide-react';

interface SizePreset {
  id: string;
  label: string;
  width: number;
  height: number;
  icon: React.ElementType;
  platform?: string;
}

const presets: SizePreset[] = [
  { id: '1:1', label: '1:1', width: 1500, height: 1500, icon: Square, platform: 'Amazon' },
  { id: '9:16', label: '9:16', width: 1080, height: 1920, icon: RectangleVertical, platform: 'TikTok' },
  { id: '16:9', label: '16:9', width: 1920, height: 1080, icon: RectangleHorizontal, platform: 'Banner' },
  { id: '4:5', label: '4:5', width: 1080, height: 1350, icon: Smartphone, platform: 'Instagram' },
  { id: '3:4', label: '3:4', width: 1500, height: 2000, icon: Monitor, platform: 'Pinterest' },
];

interface CustomSizeInputProps {
  width: number;
  height: number;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
  selectedPreset: string | null;
  onPresetSelect: (preset: SizePreset) => void;
}

export const CustomSizeInput: React.FC<CustomSizeInputProps> = ({
  width,
  height,
  onWidthChange,
  onHeightChange,
  selectedPreset,
  onPresetSelect,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Output Size</h3>
        <span className="text-xs text-foreground-muted">{width} × {height}</span>
      </div>

      {/* Presets */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {presets.map((preset) => {
          const Icon = preset.icon;
          const isSelected = selectedPreset === preset.id;

          return (
            <button
              key={preset.id}
              onClick={() => onPresetSelect(preset)}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[64px]',
                'border text-center',
                isSelected
                  ? 'bg-primary/10 border-primary/50 text-primary'
                  : 'bg-card/50 border-border/50 hover:border-primary/30 text-foreground-muted'
              )}
            >
              <Icon className={cn('h-5 w-5', isSelected && 'text-primary')} />
              <span className="text-xs font-medium">{preset.label}</span>
              {preset.platform && (
                <span className="text-[10px] opacity-60">{preset.platform}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Size Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs text-foreground-muted">Width (px)</label>
          <Input
            type="number"
            value={width}
            onChange={(e) => onWidthChange(Math.max(100, parseInt(e.target.value) || 0))}
            className="h-9"
            min={100}
            max={4096}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-foreground-muted">Height (px)</label>
          <Input
            type="number"
            value={height}
            onChange={(e) => onHeightChange(Math.max(100, parseInt(e.target.value) || 0))}
            className="h-9"
            min={100}
            max={4096}
          />
        </div>
      </div>
    </div>
  );
};

export { presets };
