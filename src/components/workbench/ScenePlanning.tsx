import React from 'react';
import { Check, Image, Eye, Lightbulb, Sparkles, Star, FileText, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type SceneType = 
  | 'main_kv'
  | 'lifestyle'
  | 'craftsmanship'
  | 'detail_1'
  | 'detail_2'
  | 'detail_3'
  | 'reviews'
  | 'brand_story'
  | 'specs'
  | 'usage_guide';

interface Scene {
  id: SceneType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const scenes: Scene[] = [
  { id: 'main_kv', label: 'Main KV', description: 'Hero product visual', icon: <Image className="h-3.5 w-3.5" /> },
  { id: 'lifestyle', label: 'Lifestyle', description: 'Usage scene', icon: <Eye className="h-3.5 w-3.5" /> },
  { id: 'craftsmanship', label: 'Craft/Tech', description: 'Concept visualization', icon: <Lightbulb className="h-3.5 w-3.5" /> },
  { id: 'detail_1', label: 'Detail 01', description: 'Product details', icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: 'detail_2', label: 'Detail 02', description: 'Material texture', icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: 'detail_3', label: 'Detail 03', description: 'Functional details', icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: 'reviews', label: 'Reviews', description: 'User testimonials', icon: <Star className="h-3.5 w-3.5" /> },
  { id: 'brand_story', label: 'Brand Story', description: 'Color inspiration', icon: <BookOpen className="h-3.5 w-3.5" /> },
  { id: 'specs', label: 'Specs', description: 'Product specifications', icon: <FileText className="h-3.5 w-3.5" /> },
  { id: 'usage_guide', label: 'Usage Guide', description: 'Usage precautions', icon: <FileText className="h-3.5 w-3.5" /> },
];

interface ScenePlanningProps {
  selectedScenes: SceneType[];
  onToggleScene: (scene: SceneType) => void;
  onSelectAll: () => void;
}

export const ScenePlanning: React.FC<ScenePlanningProps> = ({
  selectedScenes,
  onToggleScene,
  onSelectAll,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xxs font-medium text-foreground-muted uppercase tracking-wide">
          Scene Planning
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSelectAll}
          className="h-6 text-xs text-primary hover:text-primary-hover"
        >
          {selectedScenes.length === scenes.length ? 'Deselect all' : 'Select all'}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {scenes.map((scene) => {
          const isSelected = selectedScenes.includes(scene.id);
          return (
            <button
              key={scene.id}
              onClick={() => onToggleScene(scene.id)}
              className={`
                relative flex items-center gap-2 p-2.5 rounded-lg text-left
                transition-all duration-200 border
                ${isSelected
                  ? 'bg-primary-light border-primary/30 text-foreground'
                  : 'bg-card border-border hover:border-border-hover hover:bg-secondary/50 text-foreground-secondary'
                }
              `}
            >
              {/* Icon */}
              <div className={`
                flex-shrink-0 p-1.5 rounded-md
                ${isSelected ? 'bg-primary/10 text-primary' : 'bg-secondary text-foreground-muted'}
              `}>
                {scene.icon}
              </div>

              {/* Label */}
              <span className="text-xs font-medium truncate flex-1">
                {scene.label}
              </span>

              {/* Check indicator */}
              {isSelected && (
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                  <Check className="h-2.5 w-2.5 text-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};