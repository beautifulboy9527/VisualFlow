import React from 'react';
import { 
  Image as ImageIcon, 
  LayoutGrid, 
  Megaphone, 
  Smartphone, 
  FileText,
  Gift,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OutputModule {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  defaultSize: { width: number; height: number };
  credits: number;
}

const modules: OutputModule[] = [
  {
    id: 'main_kv',
    name: 'Main KV',
    description: 'Hero image for product listing',
    icon: ImageIcon,
    defaultSize: { width: 1500, height: 1500 },
    credits: 2,
  },
  {
    id: 'banner',
    name: 'Banner',
    description: 'Wide promotional banner',
    icon: LayoutGrid,
    defaultSize: { width: 1920, height: 600 },
    credits: 2,
  },
  {
    id: 'promo',
    name: 'Promo Poster',
    description: 'Sales & promotional design',
    icon: Megaphone,
    defaultSize: { width: 1080, height: 1350 },
    credits: 2,
  },
  {
    id: 'social',
    name: 'Social Media',
    description: 'Instagram, Facebook posts',
    icon: Smartphone,
    defaultSize: { width: 1080, height: 1080 },
    credits: 1,
  },
  {
    id: 'detail',
    name: 'Detail Image',
    description: 'Product feature highlight',
    icon: FileText,
    defaultSize: { width: 1500, height: 1500 },
    credits: 1,
  },
  {
    id: 'aplus',
    name: 'A+ Content',
    description: 'Amazon enhanced brand content',
    icon: Gift,
    defaultSize: { width: 970, height: 600 },
    credits: 2,
  },
];

interface OutputModuleSelectorProps {
  selectedModules: string[];
  onToggleModule: (moduleId: string) => void;
}

export const OutputModuleSelector: React.FC<OutputModuleSelectorProps> = ({
  selectedModules,
  onToggleModule,
}) => {
  const totalCredits = modules
    .filter(m => selectedModules.includes(m.id))
    .reduce((sum, m) => sum + m.credits, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Output Modules</h3>
        <span className="text-xs text-foreground-muted">
          {selectedModules.length} selected • {totalCredits} credits
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {modules.map((module) => {
          const isSelected = selectedModules.includes(module.id);
          const Icon = module.icon;

          return (
            <button
              key={module.id}
              onClick={() => onToggleModule(module.id)}
              className={cn(
                'relative p-4 rounded-xl text-left transition-all duration-200',
                'border hover:shadow-md',
                isSelected
                  ? 'bg-primary/10 border-primary/50 shadow-primary/10'
                  : 'bg-card/50 border-border/50 hover:border-primary/30'
              )}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}

              <div className={cn(
                'p-2 rounded-lg w-fit mb-2',
                isSelected ? 'bg-primary/20' : 'bg-secondary'
              )}>
                <Icon className={cn(
                  'h-5 w-5',
                  isSelected ? 'text-primary' : 'text-foreground-muted'
                )} />
              </div>

              <p className={cn(
                'font-medium text-sm',
                isSelected ? 'text-primary' : 'text-foreground'
              )}>
                {module.name}
              </p>
              <p className="text-xs text-foreground-muted mt-0.5">
                {module.defaultSize.width}×{module.defaultSize.height}
              </p>
              <p className="text-xs text-foreground-muted mt-1">
                {module.credits} credit{module.credits > 1 ? 's' : ''}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { modules };
