import React, { useState } from 'react';
import { Check, ChevronDown, Sparkles, Settings2, ShoppingBag, ShoppingCart, Music, Camera, BookOpen, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Platform with sub-categories (e.g., Amazon Listing vs A+)
export interface PlatformCategory {
  id: string;
  name: string;
  nameZh: string;
  description: string;
}

export interface PlatformModule {
  id: string;
  name: string;
  nameZh: string;
  defaultSize: { width: number; height: number };
  aspectRatio: string;
  category?: string;
}

export interface Platform {
  id: string;
  name: string;
  nameZh: string;
  icon: React.ReactNode;
  categories?: PlatformCategory[];
  modules: PlatformModule[];
}

export const platformsConfig: Platform[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    nameZh: 'Amazon',
    icon: <Box className="h-4 w-4" />,
    categories: [
      { id: 'listing', name: 'Listing Images', nameZh: '主图+副图', description: 'Main & Sub Images' },
      { id: 'aplus', name: 'A+ Content', nameZh: 'A+页面模块', description: 'Enhanced Brand Content' },
      { id: 'brand_story', name: 'Brand Story', nameZh: '品牌故事', description: 'Brand Storytelling' },
    ],
    modules: [
      { id: 'main_image', name: 'Main Image', nameZh: '主图', defaultSize: { width: 2000, height: 2000 }, aspectRatio: '1:1', category: 'listing' },
      { id: 'sub_1', name: 'Sub Image 1', nameZh: '副图1', defaultSize: { width: 2000, height: 2000 }, aspectRatio: '1:1', category: 'listing' },
      { id: 'sub_2', name: 'Sub Image 2', nameZh: '副图2', defaultSize: { width: 2000, height: 2000 }, aspectRatio: '1:1', category: 'listing' },
      { id: 'sub_3', name: 'Sub Image 3', nameZh: '副图3', defaultSize: { width: 2000, height: 2000 }, aspectRatio: '1:1', category: 'listing' },
      { id: 'sub_4', name: 'Sub Image 4', nameZh: '副图4', defaultSize: { width: 2000, height: 2000 }, aspectRatio: '1:1', category: 'listing' },
      { id: 'sub_5', name: 'Sub Image 5', nameZh: '副图5', defaultSize: { width: 2000, height: 2000 }, aspectRatio: '1:1', category: 'listing' },
      { id: 'sub_6', name: 'Sub Image 6', nameZh: '副图6', defaultSize: { width: 2000, height: 2000 }, aspectRatio: '1:1', category: 'listing' },
      { id: 'aplus_banner', name: 'A+ Banner', nameZh: 'A+横幅', defaultSize: { width: 970, height: 600 }, aspectRatio: '970:600', category: 'aplus' },
      { id: 'aplus_compare', name: 'Comparison', nameZh: '对比图', defaultSize: { width: 970, height: 600 }, aspectRatio: '970:600', category: 'aplus' },
      { id: 'aplus_feature', name: 'Features', nameZh: '特性展示', defaultSize: { width: 970, height: 300 }, aspectRatio: '970:300', category: 'aplus' },
      { id: 'brand_hero', name: 'Brand Hero', nameZh: '品牌主图', defaultSize: { width: 1464, height: 625 }, aspectRatio: '1464:625', category: 'brand_story' },
      { id: 'brand_card', name: 'Brand Card', nameZh: '品牌卡片', defaultSize: { width: 362, height: 453 }, aspectRatio: '362:453', category: 'brand_story' },
    ],
  },
  {
    id: 'shopify',
    name: 'Shopify',
    nameZh: 'Shopify',
    icon: <ShoppingBag className="h-4 w-4" />,
    modules: [
      { id: 'hero', name: 'Hero Banner', nameZh: '主横幅', defaultSize: { width: 1920, height: 800 }, aspectRatio: '12:5' },
      { id: 'product', name: 'Product Image', nameZh: '产品图', defaultSize: { width: 1024, height: 1024 }, aspectRatio: '1:1' },
      { id: 'collection', name: 'Collection', nameZh: '系列图', defaultSize: { width: 1600, height: 900 }, aspectRatio: '16:9' },
      { id: 'product_card', name: 'Product Card', nameZh: '产品卡', defaultSize: { width: 600, height: 600 }, aspectRatio: '1:1' },
    ],
  },
  {
    id: 'tiktok',
    name: 'TikTok Shop',
    nameZh: 'TikTok Shop',
    icon: <Music className="h-4 w-4" />,
    modules: [
      { id: 'video_cover', name: 'Video Cover', nameZh: '视频封面', defaultSize: { width: 1080, height: 1920 }, aspectRatio: '9:16' },
      { id: 'product_main', name: 'Product Main', nameZh: '产品主图', defaultSize: { width: 800, height: 800 }, aspectRatio: '1:1' },
      { id: 'detail_1', name: 'Detail 1', nameZh: '细节图1', defaultSize: { width: 800, height: 800 }, aspectRatio: '1:1' },
      { id: 'detail_2', name: 'Detail 2', nameZh: '细节图2', defaultSize: { width: 800, height: 800 }, aspectRatio: '1:1' },
    ],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    nameZh: 'Instagram',
    icon: <Camera className="h-4 w-4" />,
    modules: [
      { id: 'post', name: 'Post', nameZh: '帖子', defaultSize: { width: 1080, height: 1080 }, aspectRatio: '1:1' },
      { id: 'story', name: 'Story', nameZh: '故事', defaultSize: { width: 1080, height: 1920 }, aspectRatio: '9:16' },
      { id: 'reels', name: 'Reels Cover', nameZh: 'Reels封面', defaultSize: { width: 1080, height: 1920 }, aspectRatio: '9:16' },
      { id: 'carousel', name: 'Carousel', nameZh: '轮播图', defaultSize: { width: 1080, height: 1080 }, aspectRatio: '1:1' },
    ],
  },
  {
    id: 'xiaohongshu',
    name: 'Xiaohongshu',
    nameZh: '小红书',
    icon: <BookOpen className="h-4 w-4" />,
    modules: [
      { id: 'cover', name: 'Cover', nameZh: '封面图', defaultSize: { width: 1242, height: 1660 }, aspectRatio: '3:4' },
      { id: 'detail_1', name: 'Detail 1', nameZh: '详情图1', defaultSize: { width: 1242, height: 1660 }, aspectRatio: '3:4' },
      { id: 'detail_2', name: 'Detail 2', nameZh: '详情图2', defaultSize: { width: 1242, height: 1660 }, aspectRatio: '3:4' },
      { id: 'detail_3', name: 'Detail 3', nameZh: '详情图3', defaultSize: { width: 1242, height: 1660 }, aspectRatio: '3:4' },
    ],
  },
];

export const aspectRatioOptions = [
  { id: '9:16', label: '9:16', labelZh: '9:16 竖版 (KV)' },
  { id: '3:4', label: '3:4', labelZh: '3:4 竖版' },
  { id: '2:3', label: '2:3', labelZh: '2:3 竖版' },
  { id: '1:1', label: '1:1', labelZh: '1:1 方形' },
  { id: '4:3', label: '4:3', labelZh: '4:3 横版' },
  { id: '3:2', label: '3:2', labelZh: '3:2 横版' },
  { id: '16:9', label: '16:9', labelZh: '16:9 横版' },
  { id: '21:9', label: '21:9', labelZh: '21:9 超宽' },
];

interface SelectedModule {
  id: string;
  name: string;
  aspectRatio: string;
  customSize?: { width: number; height: number };
}

interface PlatformConfigProps {
  selectedPlatform: string | null;
  onSelectPlatform: (platformId: string) => void;
  selectedModules: SelectedModule[];
  onUpdateModules: (modules: SelectedModule[]) => void;
  isAgentMode?: boolean;
  onAgentRecommend?: () => void;
}

export const PlatformConfig: React.FC<PlatformConfigProps> = ({
  selectedPlatform,
  onSelectPlatform,
  selectedModules,
  onUpdateModules,
  isAgentMode = false,
  onAgentRecommend,
}) => {
  const { language } = useLanguage();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  const currentPlatform = platformsConfig.find(p => p.id === selectedPlatform);

  const handleToggleModule = (module: PlatformModule) => {
    const exists = selectedModules.find(m => m.id === module.id);
    if (exists) {
      onUpdateModules(selectedModules.filter(m => m.id !== module.id));
    } else {
      onUpdateModules([...selectedModules, {
        id: module.id,
        name: language === 'zh' ? module.nameZh : module.name,
        aspectRatio: module.aspectRatio,
      }]);
    }
  };

  const handleAspectRatioChange = (moduleId: string, newRatio: string) => {
    onUpdateModules(selectedModules.map(m => 
      m.id === moduleId ? { ...m, aspectRatio: newRatio } : m
    ));
  };

  const handleSelectAll = (categoryId?: string) => {
    if (!currentPlatform) return;
    
    const modulesToAdd = currentPlatform.modules
      .filter(m => !categoryId || m.category === categoryId)
      .map(m => ({
        id: m.id,
        name: language === 'zh' ? m.nameZh : m.name,
        aspectRatio: m.aspectRatio,
      }));
    
    onUpdateModules(modulesToAdd);
  };

  const handleDeselectAll = () => {
    onUpdateModules([]);
  };

  const groupedModules = currentPlatform?.categories 
    ? currentPlatform.modules.reduce((acc, m) => {
        const cat = m.category || 'default';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(m);
        return acc;
      }, {} as Record<string, PlatformModule[]>)
    : { default: currentPlatform?.modules || [] };

  return (
    <div className="space-y-4">
      {/* Platform Selection */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-foreground-secondary">
          {language === 'zh' ? '目标平台' : 'Target Platform'}
        </span>
        
        <div className="flex flex-wrap gap-2">
          {platformsConfig.map((platform) => (
            <button
              key={platform.id}
              onClick={() => onSelectPlatform(platform.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-300 border text-sm",
                selectedPlatform === platform.id
                  ? "bg-primary/10 border-primary/40 text-foreground shadow-sm"
                  : "bg-card/50 border-border/30 text-foreground-secondary hover:border-primary/30 hover:bg-card/80"
              )}
            >
              <span className={cn(
                "transition-colors",
                selectedPlatform === platform.id ? "text-primary" : "text-foreground-muted"
              )}>
                {platform.icon}
              </span>
              <span className="font-medium whitespace-nowrap">
                {language === 'zh' ? platform.nameZh : platform.name}
              </span>
              {selectedPlatform === platform.id && (
                <Check className="h-3.5 w-3.5 text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Module Configuration */}
      {currentPlatform && (
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-foreground-secondary whitespace-nowrap">
                {language === 'zh' ? '输出模块' : 'Output Modules'} 
                <span className="text-primary ml-1">({selectedModules.length})</span>
              </span>
              {isAgentMode && (
                <span className="flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  <Sparkles className="h-2.5 w-2.5" />
                  <span className="whitespace-nowrap">{language === 'zh' ? 'AI推荐' : 'AI'}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => handleSelectAll()}
                className="text-primary hover:text-primary-hover whitespace-nowrap"
              >
                {language === 'zh' ? '全选' : 'All'}
              </button>
              <span className="text-foreground-muted">/</span>
              <button
                onClick={handleDeselectAll}
                className="text-foreground-muted hover:text-foreground-secondary whitespace-nowrap"
              >
                {language === 'zh' ? '清空' : 'Clear'}
              </button>
            </div>
          </div>

          {/* Categorized modules (for platforms like Amazon) */}
          {currentPlatform.categories ? (
            <div className="space-y-2">
              {currentPlatform.categories.map(category => {
                const categoryModules = groupedModules[category.id] || [];
                const selectedCount = categoryModules.filter(m => 
                  selectedModules.some(sm => sm.id === m.id)
                ).length;
                const isExpanded = expandedCategory === category.id;
                
                return (
                  <div key={category.id} className="rounded-xl border border-border/50 overflow-hidden bg-card/30">
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 text-left transition-colors",
                        isExpanded ? "bg-primary/5" : "hover:bg-secondary/50"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium text-foreground whitespace-nowrap">
                          {language === 'zh' ? category.nameZh : category.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {selectedCount > 0 && (
                          <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            {selectedCount}/{categoryModules.length}
                          </span>
                        )}
                        <ChevronDown className={cn(
                          "h-4 w-4 text-foreground-muted transition-transform",
                          isExpanded && "rotate-180"
                        )} />
                      </div>
                    </button>
                    
                    {isExpanded && (
                      <div className="p-3 pt-2 border-t border-border/30 space-y-2">
                        <div className="flex justify-end mb-2">
                          <button
                            onClick={() => handleSelectAll(category.id)}
                            className="text-xs text-primary hover:text-primary-hover"
                          >
                            {language === 'zh' ? '选择此类别' : 'Select All'}
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {categoryModules.map(module => (
                            <ModuleItem
                              key={module.id}
                              module={module}
                              isSelected={selectedModules.some(m => m.id === module.id)}
                              selectedModule={selectedModules.find(m => m.id === module.id)}
                              onToggle={() => handleToggleModule(module)}
                              onAspectRatioChange={(ratio) => handleAspectRatioChange(module.id, ratio)}
                              language={language}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            // Simple module grid
            <div className="grid grid-cols-2 gap-2">
              {currentPlatform.modules.map(module => (
                <ModuleItem
                  key={module.id}
                  module={module}
                  isSelected={selectedModules.some(m => m.id === module.id)}
                  selectedModule={selectedModules.find(m => m.id === module.id)}
                  onToggle={() => handleToggleModule(module)}
                  onAspectRatioChange={(ratio) => handleAspectRatioChange(module.id, ratio)}
                  language={language}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Individual module item component
interface ModuleItemProps {
  module: PlatformModule;
  isSelected: boolean;
  selectedModule?: SelectedModule;
  onToggle: () => void;
  onAspectRatioChange: (ratio: string) => void;
  language: 'zh' | 'en';
}

const ModuleItem: React.FC<ModuleItemProps> = ({
  module,
  isSelected,
  selectedModule,
  onToggle,
  onAspectRatioChange,
  language,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  
  return (
    <div className={cn(
      "relative rounded-xl border transition-all duration-200",
      isSelected
        ? "bg-primary/5 border-primary/30"
        : "bg-card/50 border-border/30 hover:border-border"
    )}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2.5 p-3 text-left"
      >
        <div className={cn(
          "w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0",
          isSelected
            ? "bg-primary border-primary"
            : "bg-card border-border"
        )}>
          {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
        </div>
        <div className="flex-1 min-w-0">
          <span className={cn(
            "text-sm font-medium block leading-tight",
            isSelected ? "text-foreground" : "text-foreground-secondary"
          )}>
            {language === 'zh' ? module.nameZh : module.name}
          </span>
          <span className="text-[10px] text-foreground-muted mt-0.5 block">
            {selectedModule?.aspectRatio || module.aspectRatio}
          </span>
        </div>
        {isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings(!showSettings);
            }}
            className="p-1.5 rounded-lg hover:bg-secondary/50 text-foreground-muted shrink-0"
          >
            <Settings2 className="h-3.5 w-3.5" />
          </button>
        )}
      </button>
      
      {/* Settings dropdown */}
      {isSelected && showSettings && (
        <div className="p-2 pt-0 border-t border-border/20">
          <Select 
            value={selectedModule?.aspectRatio || module.aspectRatio} 
            onValueChange={onAspectRatioChange}
          >
            <SelectTrigger className="h-8 text-xs bg-card border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              {aspectRatioOptions.map(opt => (
                <SelectItem key={opt.id} value={opt.id} className="text-xs">
                  {language === 'zh' ? opt.labelZh : opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
