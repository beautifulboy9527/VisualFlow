import React, { useState } from 'react';
import { Check, Plus, X, Image, Eye, Lightbulb, Sparkles, Star, FileText, BookOpen, ShoppingBag, Award, Ruler, Camera, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

export type SceneType = 
  | 'main'
  | 'front_view'
  | 'side_view'
  | 'back_view'
  | 'white_bg'
  | 'detail_1'
  | 'detail_2'
  | 'detail_3'
  | 'lifestyle'
  | 'promo'
  | 'sale_event'
  | 'specs'
  | 'store_info'
  | string; // Allow custom types

interface Scene {
  id: SceneType;
  labelZh: string;
  labelEn: string;
  icon: React.ReactNode;
  isCustom?: boolean;
}

const defaultScenes: Scene[] = [
  { id: 'main', labelZh: '主图', labelEn: 'Main', icon: <Image className="h-3.5 w-3.5" /> },
  { id: 'front_view', labelZh: '正视图', labelEn: 'Front', icon: <Camera className="h-3.5 w-3.5" /> },
  { id: 'side_view', labelZh: '侧视图', labelEn: 'Side', icon: <Camera className="h-3.5 w-3.5" /> },
  { id: 'back_view', labelZh: '背视图', labelEn: 'Back', icon: <Camera className="h-3.5 w-3.5" /> },
  { id: 'white_bg', labelZh: '白底图', labelEn: 'White BG', icon: <Grid3X3 className="h-3.5 w-3.5" /> },
  { id: 'detail_1', labelZh: '细节图1', labelEn: 'Detail 1', icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: 'detail_2', labelZh: '细节图2', labelEn: 'Detail 2', icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: 'lifestyle', labelZh: '场景图', labelEn: 'Lifestyle', icon: <Eye className="h-3.5 w-3.5" /> },
  { id: 'promo', labelZh: '促销图', labelEn: 'Promo', icon: <ShoppingBag className="h-3.5 w-3.5" /> },
  { id: 'sale_event', labelZh: '大促图', labelEn: 'Sale', icon: <Star className="h-3.5 w-3.5" /> },
  { id: 'specs', labelZh: '规格图', labelEn: 'Specs', icon: <Ruler className="h-3.5 w-3.5" /> },
  { id: 'store_info', labelZh: '店铺资质', labelEn: 'Store', icon: <Award className="h-3.5 w-3.5" /> },
];

interface ScenePlanningProps {
  selectedScenes: SceneType[];
  onToggleScene: (scene: SceneType) => void;
  onSelectAll: () => void;
  customScenes?: Scene[];
  onAddCustomScene?: (scene: Scene) => void;
  onRemoveCustomScene?: (sceneId: string) => void;
}

export const ScenePlanning: React.FC<ScenePlanningProps> = ({
  selectedScenes,
  onToggleScene,
  onSelectAll,
  customScenes = [],
  onAddCustomScene,
  onRemoveCustomScene,
}) => {
  const { language } = useLanguage();
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customName, setCustomName] = useState('');

  const allScenes = [...defaultScenes, ...customScenes];
  const isAllSelected = selectedScenes.length === allScenes.length;

  const handleAddCustom = () => {
    if (customName.trim() && onAddCustomScene) {
      const customId = `custom_${Date.now()}`;
      onAddCustomScene({
        id: customId,
        labelZh: customName.trim(),
        labelEn: customName.trim(),
        icon: <FileText className="h-3.5 w-3.5" />,
        isCustom: true,
      });
      setCustomName('');
      setIsAddingCustom(false);
      onToggleScene(customId);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground-secondary">
          {selectedScenes.length} {language === 'zh' ? '已选' : 'selected'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSelectAll}
          className="h-6 text-xs text-primary hover:text-primary-hover px-2"
        >
          {isAllSelected 
            ? (language === 'zh' ? '取消全选' : 'Deselect') 
            : (language === 'zh' ? '全选' : 'Select All')}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {allScenes.map((scene) => {
          const isSelected = selectedScenes.includes(scene.id);
          const label = language === 'zh' ? scene.labelZh : scene.labelEn;
          
          return (
            <button
              key={scene.id}
              onClick={() => onToggleScene(scene.id)}
              className={cn(
                "relative flex items-center gap-1.5 px-2 py-2 rounded-lg text-left transition-all duration-200 border group",
                isSelected
                  ? "bg-primary/10 border-primary/30 text-foreground"
                  : "bg-card border-border/30 hover:border-border text-foreground-secondary hover:text-foreground"
              )}
            >
              {/* Icon */}
              <div className={cn(
                "flex-shrink-0 p-1 rounded",
                isSelected ? "text-primary" : "text-foreground-muted"
              )}>
                {scene.icon}
              </div>

              {/* Label */}
              <span className="text-xs font-medium truncate flex-1">
                {label}
              </span>

              {/* Check indicator */}
              {isSelected && (
                <div className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-2 w-2 text-primary-foreground" />
                </div>
              )}

              {/* Remove custom scene button */}
              {scene.isCustom && onRemoveCustomScene && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveCustomScene(scene.id);
                  }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
            </button>
          );
        })}

        {/* Add Custom Button */}
        {onAddCustomScene && !isAddingCustom && (
          <button
            onClick={() => setIsAddingCustom(true)}
            className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border border-dashed border-border/50 text-foreground-muted hover:border-primary/30 hover:text-primary transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="text-xs">{language === 'zh' ? '自定义' : 'Custom'}</span>
          </button>
        )}
      </div>

      {/* Add Custom Input */}
      {isAddingCustom && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder={language === 'zh' ? '输入场景名称' : 'Scene name'}
            className="flex-1 px-3 py-1.5 rounded-lg bg-card border border-border/50 text-sm focus:border-primary/50 focus:outline-none"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddCustom();
              if (e.key === 'Escape') setIsAddingCustom(false);
            }}
          />
          <Button size="sm" onClick={handleAddCustom} className="h-8">
            <Check className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsAddingCustom(false)} className="h-8">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export { defaultScenes };
export type { Scene };
