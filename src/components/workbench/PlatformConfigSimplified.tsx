import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronRight, Sparkles, Clock, Star, Package, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useUserPreferences, SelectedModule } from '@/hooks/useUserPreferences';
import { toast } from 'sonner';
import { platformsConfig, aspectRatioOptions, PlatformModule } from './PlatformConfig';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PlatformConfigSimplifiedProps {
  selectedPlatform: string | null;
  onSelectPlatform: (platformId: string) => void;
  selectedModules: SelectedModule[];
  onUpdateModules: (modules: SelectedModule[]) => void;
  isAgentMode?: boolean;
}

export const PlatformConfigSimplified: React.FC<PlatformConfigSimplifiedProps> = ({
  selectedPlatform,
  onSelectPlatform,
  selectedModules,
  onUpdateModules,
  isAgentMode = false,
}) => {
  const { language } = useLanguage();
  const { preferences, hasPreviousConfig, saveLastConfig, isLoading } = useUserPreferences();
  const [showModuleDetails, setShowModuleDetails] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const currentPlatform = platformsConfig.find(p => p.id === selectedPlatform);

  // Auto-load previous config on first render if available
  useEffect(() => {
    if (!isLoading && hasPreviousConfig && !selectedPlatform && preferences.last_platform) {
      // Don't auto-apply, just show the option
    }
  }, [isLoading, hasPreviousConfig, selectedPlatform, preferences.last_platform]);

  // One-click suite: select platform and all its modules
  const handleQuickSuite = (platformId: string) => {
    onSelectPlatform(platformId);
    const platform = platformsConfig.find(p => p.id === platformId);
    if (platform) {
      const allModules = platform.modules.map(m => ({
        id: m.id,
        name: language === 'zh' ? m.nameZh : m.name,
        aspectRatio: m.aspectRatio,
      }));
      onUpdateModules(allModules);
      setShowModuleDetails(false);
      
      // Save to preferences in background
      saveLastConfig(platformId, allModules);
      
      toast.success(
        language === 'zh' 
          ? `已选择「${platform.nameZh}」全套 ${allModules.length} 张图` 
          : `Selected ${platform.name} suite (${allModules.length} images)`,
        { duration: 2000 }
      );
    }
  };

  // Restore last configuration
  const handleRestoreLastConfig = () => {
    if (preferences.last_platform && preferences.last_modules.length > 0) {
      onSelectPlatform(preferences.last_platform);
      onUpdateModules(preferences.last_modules);
      setShowModuleDetails(false);
      
      const platform = platformsConfig.find(p => p.id === preferences.last_platform);
      toast.success(
        language === 'zh' 
          ? `已恢复上次配置：${platform?.nameZh || preferences.last_platform}` 
          : `Restored: ${platform?.name || preferences.last_platform}`,
        { duration: 2000 }
      );
    }
  };

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

  const handleSelectAllModules = (categoryId?: string) => {
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
      {/* Previous Config Restore - Only show if available */}
      {hasPreviousConfig && !selectedPlatform && (
        <button
          onClick={handleRestoreLastConfig}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
            "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30",
            "hover:border-primary/50 hover:shadow-md group"
          )}
        >
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground text-sm">
                {language === 'zh' ? '继续上次' : 'Continue Last'}
              </span>
              <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                {language === 'zh' ? '智能记忆' : 'AI Memory'}
              </span>
            </div>
            <span className="text-xs text-foreground-muted truncate block">
              {platformsConfig.find(p => p.id === preferences.last_platform)?.nameZh || preferences.last_platform}
              {' • '}
              {preferences.last_modules.length} {language === 'zh' ? '张图' : 'images'}
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-foreground-muted group-hover:text-primary transition-colors shrink-0" />
        </button>
      )}

      {/* Quick Suite Section - Pixifield Inspired */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-foreground-secondary">
              {language === 'zh' ? '选择平台' : 'Choose Platform'}
            </span>
          </div>
          <span className="text-[10px] text-foreground-muted">
            {language === 'zh' ? '点击即生成全套' : 'Click for full suite'}
          </span>
        </div>
        
        {/* Platform Cards Grid */}
        <div className="grid grid-cols-2 gap-2">
          {platformsConfig.map((platform) => {
            const isSelected = selectedPlatform === platform.id;
            const isFrequent = preferences.frequent_platforms.includes(platform.id);
            
            return (
              <button
                key={platform.id}
                onClick={() => handleQuickSuite(platform.id)}
                className={cn(
                  "relative flex items-center gap-2.5 p-3 rounded-xl transition-all duration-300 border text-left group",
                  isSelected
                    ? "bg-primary/10 border-primary/50 shadow-md"
                    : "bg-card/50 border-border/30 hover:border-primary/40 hover:bg-card/80"
                )}
              >
                {/* Frequent indicator */}
                {isFrequent && !isSelected && (
                  <Star className="absolute top-1.5 right-1.5 h-3 w-3 text-amber-400 fill-amber-400" />
                )}
                
                <span className={cn(
                  "transition-colors shrink-0",
                  isSelected ? "text-primary" : "text-foreground-muted group-hover:text-primary"
                )}>
                  {platform.icon}
                </span>
                
                <div className="flex flex-col min-w-0 flex-1">
                  <span className={cn(
                    "font-medium text-sm whitespace-nowrap",
                    isSelected ? "text-foreground" : "text-foreground-secondary"
                  )}>
                    {language === 'zh' ? platform.nameZh : platform.name}
                  </span>
                  <span className="text-[10px] text-foreground-muted">
                    {platform.modules.length} {language === 'zh' ? '张图' : 'imgs'}
                  </span>
                </div>
                
                {isSelected && (
                  <Check className="h-4 w-4 text-primary shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Module Details (Expandable) - Only show when platform selected */}
      {currentPlatform && (
        <div className="space-y-2">
          <button
            onClick={() => setShowModuleDetails(!showModuleDetails)}
            className={cn(
              "w-full flex items-center justify-between p-2.5 rounded-lg transition-colors",
              "bg-secondary/30 hover:bg-secondary/50 border border-border/30"
            )}
          >
            <div className="flex items-center gap-2">
              <Settings2 className="h-3.5 w-3.5 text-foreground-muted" />
              <span className="text-xs font-medium text-foreground-secondary">
                {language === 'zh' ? '调整模块' : 'Customize Modules'}
              </span>
              <span className="text-xs text-primary">
                ({selectedModules.length}/{currentPlatform.modules.length})
              </span>
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 text-foreground-muted transition-transform",
              showModuleDetails && "rotate-180"
            )} />
          </button>

          {showModuleDetails && (
            <div className="p-3 rounded-xl border border-border/50 bg-card/30 space-y-3">
              {/* Quick actions */}
              <div className="flex items-center justify-end gap-2 text-xs">
                <button
                  onClick={() => handleSelectAllModules()}
                  className="text-primary hover:text-primary-hover"
                >
                  {language === 'zh' ? '全选' : 'All'}
                </button>
                <span className="text-foreground-muted">/</span>
                <button
                  onClick={() => onUpdateModules([])}
                  className="text-foreground-muted hover:text-foreground-secondary"
                >
                  {language === 'zh' ? '清空' : 'Clear'}
                </button>
              </div>

              {/* Categorized modules */}
              {currentPlatform.categories ? (
                <div className="space-y-2">
                  {currentPlatform.categories.map(category => {
                    const categoryModules = groupedModules[category.id] || [];
                    const selectedCount = categoryModules.filter(m => 
                      selectedModules.some(sm => sm.id === m.id)
                    ).length;
                    const isExpanded = expandedCategory === category.id;
                    
                    return (
                      <div key={category.id} className="rounded-lg border border-border/40 overflow-hidden">
                        <button
                          onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                          className={cn(
                            "w-full flex items-center justify-between p-2.5 text-left transition-colors",
                            isExpanded ? "bg-primary/5" : "hover:bg-secondary/30"
                          )}
                        >
                          <span className="text-sm font-medium text-foreground">
                            {language === 'zh' ? category.nameZh : category.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                              {selectedCount}/{categoryModules.length}
                            </span>
                            <ChevronDown className={cn(
                              "h-3.5 w-3.5 text-foreground-muted transition-transform",
                              isExpanded && "rotate-180"
                            )} />
                          </div>
                        </button>
                        
                        {isExpanded && (
                          <div className="p-2 pt-1 border-t border-border/30 space-y-1.5">
                            {categoryModules.map(module => (
                              <ModuleRow
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
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-1.5">
                  {currentPlatform.modules.map(module => (
                    <ModuleRow
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
      )}

      {/* Selection Summary */}
      {selectedPlatform && selectedModules.length > 0 && !showModuleDetails && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
          <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="text-xs text-foreground-secondary flex-1">
            {language === 'zh' 
              ? `将生成 ${selectedModules.length} 张图片`
              : `Will generate ${selectedModules.length} images`}
          </span>
        </div>
      )}
    </div>
  );
};

// Compact module row component
interface ModuleRowProps {
  module: PlatformModule;
  isSelected: boolean;
  selectedModule?: SelectedModule;
  onToggle: () => void;
  onAspectRatioChange: (ratio: string) => void;
  language: 'zh' | 'en';
}

const ModuleRow: React.FC<ModuleRowProps> = ({
  module,
  isSelected,
  selectedModule,
  onToggle,
  onAspectRatioChange,
  language,
}) => {
  const currentRatio = selectedModule?.aspectRatio || module.aspectRatio;
  
  return (
    <div className={cn(
      "flex items-center gap-2 p-2 rounded-lg transition-colors",
      isSelected
        ? "bg-primary/5 border border-primary/30"
        : "bg-card/30 border border-transparent hover:border-border/30"
    )}>
      <button
        onClick={onToggle}
        className={cn(
          "w-4 h-4 rounded flex items-center justify-center border transition-all shrink-0",
          isSelected
            ? "bg-primary border-primary"
            : "bg-card border-border/60 hover:border-primary/40"
        )}
      >
        {isSelected && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
      </button>
      
      <span className={cn(
        "text-xs flex-1",
        isSelected ? "text-foreground font-medium" : "text-foreground-secondary"
      )}>
        {language === 'zh' ? module.nameZh : module.name}
      </span>
      
      {isSelected ? (
        <Select value={currentRatio} onValueChange={onAspectRatioChange}>
          <SelectTrigger className="h-6 w-auto min-w-[60px] text-[10px] bg-background/60 border-border/40 px-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-50">
            {aspectRatioOptions.map(opt => (
              <SelectItem key={opt.id} value={opt.id} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <span className="text-[10px] text-foreground-muted">
          {module.aspectRatio}
        </span>
      )}
    </div>
  );
};

export default PlatformConfigSimplified;
