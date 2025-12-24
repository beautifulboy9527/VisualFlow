import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  LayoutGrid, 
  Megaphone, 
  Smartphone, 
  FileText,
  Gift,
  Check,
  ChevronDown,
  ChevronUp,
  Settings2,
  Sparkles,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export interface OutputModuleSize {
  width: number;
  height: number;
  isCustom?: boolean;
}

export interface OutputModule {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  icon: React.ElementType;
  defaultSize: OutputModuleSize;
  credits: number;
  aspectRatio: string;
}

const defaultModules: OutputModule[] = [
  {
    id: 'main_kv',
    name: 'Main KV',
    nameCn: '主图KV',
    description: 'Hero image for product listing',
    icon: ImageIcon,
    defaultSize: { width: 1500, height: 1500 },
    credits: 2,
    aspectRatio: '1:1',
  },
  {
    id: 'banner',
    name: 'Banner',
    nameCn: '横幅广告',
    description: 'Wide promotional banner',
    icon: LayoutGrid,
    defaultSize: { width: 1920, height: 600 },
    credits: 2,
    aspectRatio: '16:5',
  },
  {
    id: 'promo',
    name: 'Promo Poster',
    nameCn: '促销海报',
    description: 'Sales & promotional design',
    icon: Megaphone,
    defaultSize: { width: 1080, height: 1920 },
    credits: 2,
    aspectRatio: '9:16',
  },
  {
    id: 'social',
    name: 'Social Media',
    nameCn: '社交媒体',
    description: 'Instagram, TikTok, Facebook',
    icon: Smartphone,
    defaultSize: { width: 1080, height: 1080 },
    credits: 1,
    aspectRatio: '1:1',
  },
  {
    id: 'detail',
    name: 'Detail Image',
    nameCn: '细节图',
    description: 'Product feature highlight',
    icon: FileText,
    defaultSize: { width: 1500, height: 1500 },
    credits: 1,
    aspectRatio: '1:1',
  },
  {
    id: 'aplus',
    name: 'A+ Content',
    nameCn: 'A+页面',
    description: 'Amazon enhanced brand content',
    icon: Gift,
    defaultSize: { width: 970, height: 600 },
    credits: 2,
    aspectRatio: '970:600',
  },
];

interface ModuleWithCustomSize extends OutputModule {
  customSize?: OutputModuleSize;
}

interface OutputModuleSelectorProps {
  selectedModules: string[];
  onToggleModule: (moduleId: string) => void;
  moduleSizes: Record<string, OutputModuleSize>;
  onSizeChange: (moduleId: string, size: OutputModuleSize) => void;
  agentMode?: boolean;
  onAgentModeChange?: (enabled: boolean) => void;
}

export const OutputModuleSelector: React.FC<OutputModuleSelectorProps> = ({
  selectedModules,
  onToggleModule,
  moduleSizes,
  onSizeChange,
  agentMode = false,
  onAgentModeChange,
}) => {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const totalCredits = defaultModules
    .filter(m => selectedModules.includes(m.id))
    .reduce((sum, m) => sum + m.credits, 0);

  const getModuleSize = (module: OutputModule): OutputModuleSize => {
    return moduleSizes[module.id] || module.defaultSize;
  };

  const handleSizeChange = (moduleId: string, field: 'width' | 'height', value: number) => {
    const currentSize = moduleSizes[moduleId] || defaultModules.find(m => m.id === moduleId)?.defaultSize || { width: 1000, height: 1000 };
    onSizeChange(moduleId, {
      ...currentSize,
      [field]: Math.max(100, Math.min(4096, value)),
      isCustom: true,
    });
  };

  const resetToDefault = (moduleId: string) => {
    const module = defaultModules.find(m => m.id === moduleId);
    if (module) {
      onSizeChange(moduleId, { ...module.defaultSize, isCustom: false });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Agent Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Output Modules</h3>
          <span className="text-xs text-foreground-muted px-2 py-0.5 rounded-full bg-secondary">
            {selectedModules.length} selected
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-foreground-muted">{totalCredits} credits</span>
        </div>
      </div>

      {/* Agent Mode Toggle */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Agent Mode</p>
            <p className="text-xs text-foreground-muted">AI auto-select modules & sizes</p>
          </div>
        </div>
        <Switch
          checked={agentMode}
          onCheckedChange={onAgentModeChange}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      {/* Module Grid */}
      <div className="space-y-2">
        {defaultModules.map((module) => {
          const isSelected = selectedModules.includes(module.id);
          const isExpanded = expandedModule === module.id;
          const currentSize = getModuleSize(module);
          const Icon = module.icon;

          return (
            <div
              key={module.id}
              className={cn(
                'rounded-xl transition-all duration-300 overflow-hidden',
                'border',
                isSelected
                  ? 'bg-primary/5 border-primary/30 shadow-sm'
                  : 'bg-card/30 border-border/30 hover:border-border/50'
              )}
            >
              {/* Module Header - Click to Select */}
              <div
                className={cn(
                  'flex items-center gap-3 p-3 cursor-pointer transition-colors',
                  isSelected && 'bg-primary/5'
                )}
                onClick={() => onToggleModule(module.id)}
              >
                {/* Selection Checkbox */}
                <div className={cn(
                  'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all',
                  isSelected
                    ? 'bg-primary border-primary'
                    : 'border-border/60 bg-background/50'
                )}>
                  {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>

                {/* Icon */}
                <div className={cn(
                  'p-2 rounded-lg transition-colors',
                  isSelected ? 'bg-primary/20' : 'bg-secondary/50'
                )}>
                  <Icon className={cn(
                    'h-4 w-4',
                    isSelected ? 'text-primary' : 'text-foreground-muted'
                  )} />
                </div>

                {/* Module Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn(
                      'font-medium text-sm',
                      isSelected ? 'text-foreground' : 'text-foreground-secondary'
                    )}>
                      {module.nameCn}
                    </p>
                    <span className="text-xs text-foreground-muted">{module.name}</span>
                  </div>
                  <p className="text-xs text-foreground-muted truncate">
                    {currentSize.width} × {currentSize.height}
                    {currentSize.isCustom && (
                      <span className="ml-1 text-primary">(custom)</span>
                    )}
                  </p>
                </div>

                {/* Credits */}
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    isSelected ? 'bg-primary/20 text-primary' : 'bg-secondary text-foreground-muted'
                  )}>
                    {module.credits}c
                  </span>

                  {/* Expand Button - Stop Propagation */}
                  {isSelected && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedModule(isExpanded ? null : module.id);
                      }}
                      className={cn(
                        'p-1.5 rounded-lg transition-all hover:bg-primary/10',
                        isExpanded && 'bg-primary/10'
                      )}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-primary" />
                      ) : (
                        <Settings2 className="h-4 w-4 text-foreground-muted hover:text-primary" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Size Editor */}
              {isSelected && isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-primary/10 bg-primary/5 animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium text-primary">Custom Size</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-foreground-muted">Width (px)</label>
                      <Input
                        type="number"
                        value={currentSize.width}
                        onChange={(e) => handleSizeChange(module.id, 'width', parseInt(e.target.value) || 0)}
                        className="h-9 text-sm bg-background/80"
                        min={100}
                        max={4096}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-foreground-muted">Height (px)</label>
                      <Input
                        type="number"
                        value={currentSize.height}
                        onChange={(e) => handleSizeChange(module.id, 'height', parseInt(e.target.value) || 0)}
                        className="h-9 text-sm bg-background/80"
                        min={100}
                        max={4096}
                      />
                    </div>
                  </div>

                  {currentSize.isCustom && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => resetToDefault(module.id)}
                      className="mt-3 text-xs text-foreground-muted hover:text-primary h-7"
                    >
                      Reset to {module.defaultSize.width} × {module.defaultSize.height}
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { defaultModules as modules };
