import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { MultiImageUpload, UploadedImage } from '@/components/workbench/MultiImageUpload';
import { PlatformConfigSimplified } from '@/components/workbench/PlatformConfigSimplified';
import { platformsConfig } from '@/components/workbench/PlatformConfig';
import { LanguageSettings, Language } from '@/components/workbench/LanguageSettings';
import { VisualStylePicker, VisualStyleId, LayoutStyleId, visualStyles } from '@/components/workbench/VisualStylePicker';
import { ScenePlanning, SceneType, Scene, defaultScenes } from '@/components/workbench/ScenePlanning';
import { LogoSettings, LogoConfig } from '@/components/workbench/LogoSettings';
import { DesignBrief } from '@/components/workbench/DesignBrief';
import { GenerationConfirmModal } from '@/components/workbench/GenerationConfirmModal';
import { CelebrationOverlay } from '@/components/workbench/CelebrationOverlay';
import { EnhancedResultCard } from '@/components/workbench/EnhancedResultCard';
import { HistoryPanel } from '@/components/workbench/HistoryPanel';
import { TemplatesPanel, Template } from '@/components/workbench/TemplatesPanel';
import { ImagePreviewModal } from '@/components/workbench/ImagePreviewModal';
import { AgentModePanel } from '@/components/workbench/AgentModePanel';
import { AgentModeSidebar } from '@/components/workbench/AgentModeSidebar';
import { AgentChatCanvas } from '@/components/workbench/AgentChatCanvas';
import { QuickToolCards } from '@/components/workbench/QuickToolCards';
import { InspirationGallery } from '@/components/workbench/InspirationGallery';
import { VisualPresetCards } from '@/components/workbench/VisualPresetCards';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { LanguageProvider, useLanguage } from '@/hooks/useLanguage';
import { analyzeProduct, mapAIStyleToId, ProductAnalysis } from '@/lib/aiAnalysis';
import { 
  Zap, 
  Loader2, 
  Download, 
  Sparkles, 
  Package, 
  Image as ImageIcon,
  ChevronRight,
  RotateCcw,
  Hand,
  Bot,
  Upload,
  Palette,
  Globe,
  Layers,
  ImagePlus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectedModule {
  id: string;
  name: string;
  aspectRatio: string;
}

const sampleImages = [
  { id: '1', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop', label: 'Main KV' },
  { id: '2', url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=800&fit=crop', label: 'Banner' },
  { id: '3', url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&h=800&fit=crop', label: 'Social' },
  { id: '4', url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop', label: 'Detail' },
];

const WorkbenchContent: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeView, setActiveView] = useState<'workbench' | 'history' | 'templates'>('workbench');
  const [isAgentMode, setIsAgentMode] = useState(true);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [isRefreshingPlan, setIsRefreshingPlan] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<ProductAnalysis | null>(null);
  
  // Config history for undo functionality
  const [configHistory, setConfigHistory] = useState<Array<{
    visualStyle: VisualStyleId;
    layoutStyle: LayoutStyleId;
    selectedModules: SelectedModule[];
    selectedScenes: SceneType[];
  }>>([]);
  
  // Step 1: Images
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  
  // Step 2: Product Info (AI analyzed)
  const [productName, setProductName] = useState('');
  const [productKeywords, setProductKeywords] = useState('');
  const [brandName, setBrandName] = useState('');
  
  // Step 3: Platform & Modules
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedModules, setSelectedModules] = useState<SelectedModule[]>([]);
  
  // Step 4: Scene Planning - Start empty, AI will recommend after analysis
  const [selectedScenes, setSelectedScenes] = useState<SceneType[]>([]);
  const [customScenes, setCustomScenes] = useState<Scene[]>([]);
  
  // Step 5: Visual Style
  const [visualStyle, setVisualStyle] = useState<VisualStyleId>('ai_auto');
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyleId>('ai_auto');
  const [aiRecommendedStyle, setAiRecommendedStyle] = useState<VisualStyleId | undefined>();
  const [aiRecommendedLayout, setAiRecommendedLayout] = useState<LayoutStyleId | undefined>();
  
  // Step 6: Language
  const [primaryLanguage, setPrimaryLanguage] = useState<Language>('zh');
  const [secondaryLanguage, setSecondaryLanguage] = useState<Language | null>('en');
  
  // Step 7: Logo
  const [logoConfig, setLogoConfig] = useState<LogoConfig>({
    file: null,
    preview: null,
    include: false,
    position: 'top-left',
    style: 'original',
  });
  
  // Generation states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<Array<{ id: string; url: string; isSelected?: boolean; label?: string }>>([]);
  const [credits] = useState(100);
  const [previewImage, setPreviewImage] = useState<{ url: string; id: string; index: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // AI Analysis - NOW triggered manually via "Start Analysis" button
  // No auto-trigger - user clicks button to start analysis after uploading images
  const handleStartAnalysis = useCallback(() => {
    if (uploadedImages.length > 0 && selectedPlatform && isAgentMode) {
      runAIAnalysis();
    }
  }, [uploadedImages.length, selectedPlatform, isAgentMode]);

  // Auto-recommend modules when platform is selected in Agent mode
  useEffect(() => {
    if (isAgentMode && selectedPlatform && selectedModules.length === 0) {
      const platform = platformsConfig.find(p => p.id === selectedPlatform);
      if (platform) {
        // AI recommends first 4 modules by default
        const recommendedModules = platform.modules.slice(0, 4).map(m => ({
          id: m.id,
          name: m.name,
          aspectRatio: m.aspectRatio,
        }));
        setSelectedModules(recommendedModules);
        
        toast({
          title: language === 'zh' ? 'AI 模块推荐' : 'AI Module Recommendation',
          description: language === 'zh' 
            ? `已为您推荐 ${recommendedModules.length} 个输出模块` 
            : `Recommended ${recommendedModules.length} output modules for you`,
        });
      }
    }
  }, [selectedPlatform, isAgentMode]);

  // Mode switch: Keep current configuration when switching between Agent and Manual
  useEffect(() => {
    if (!isAgentMode) {
      // Switching to Manual mode - keep the AI recommended values, just hide AI auto option
      if (visualStyle === 'ai_auto') {
        // If currently on AI auto, use the recommended style or default
        setVisualStyle(aiRecommendedStyle || 'magazine');
      }
      if (layoutStyle === 'ai_auto') {
        setLayoutStyle(aiRecommendedLayout || 'magazine_grid');
      }
    } else {
      // Switching back to Agent mode - restore AI recommendations if available
      if (aiRecommendedStyle && aiRecommendedStyle !== 'ai_auto') {
        setVisualStyle(aiRecommendedStyle);
      }
      if (aiRecommendedLayout && aiRecommendedLayout !== 'ai_auto') {
        setLayoutStyle(aiRecommendedLayout);
      }
    }
  }, [isAgentMode]);

  // Save config to history before major changes
  const saveToHistory = () => {
    setConfigHistory(prev => [...prev.slice(-9), {
      visualStyle,
      layoutStyle,
      selectedModules,
      selectedScenes,
    }]);
  };

  // Undo to previous config
  const handleUndo = () => {
    if (configHistory.length === 0) return;
    
    const lastConfig = configHistory[configHistory.length - 1];
    setVisualStyle(lastConfig.visualStyle);
    setLayoutStyle(lastConfig.layoutStyle);
    setSelectedModules(lastConfig.selectedModules);
    setSelectedScenes(lastConfig.selectedScenes);
    setConfigHistory(prev => prev.slice(0, -1));
    
    toast({
      title: language === 'zh' ? '已撤销' : 'Undone',
      description: language === 'zh' ? '已恢复到上一步配置' : 'Restored to previous configuration',
    });
  };

  const runAIAnalysis = async (isRefresh = false) => {
    if (uploadedImages.length === 0) return;
    
    if (isRefresh) {
      setIsRefreshingPlan(true);
    } else {
      setIsAIProcessing(true);
    }
    
    try {
      // Get image URLs for analysis (use previewUrl from UploadedImage)
      const imageUrls = uploadedImages
        .filter(img => img.previewUrl)
        .map(img => img.previewUrl)
        .slice(0, 4); // Limit to 4 images for API
      
      console.log('Starting AI analysis with', imageUrls.length, 'images');
      
      const result = await analyzeProduct(imageUrls, 'full');
      
      if (result.success && result.analysis) {
        const analysis = result.analysis;
        setAiAnalysis(analysis);
        
        // Apply analysis results
        // Set product name from AI
        const productNameText = language === 'zh' ? analysis.productName?.zh : analysis.productName?.en;
        setProductName(productNameText || analysis.productName?.en || '');
        
        // Set brand name
        const brandNameText = language === 'zh' ? analysis.brandName.zh : analysis.brandName.en;
        setBrandName(brandNameText || analysis.brandName.en);
        
        // Build keywords from selling points
        const keywords = analysis.sellingPoints
          .map(sp => language === 'zh' ? sp.zh : sp.en)
          .slice(0, 5)
          .join(', ');
        setProductKeywords(keywords);
        
        // Apply recommended visual style
        if (analysis.visualStyle?.recommended) {
          const mappedStyle = mapAIStyleToId(analysis.visualStyle.recommended) as VisualStyleId;
          setAiRecommendedStyle(mappedStyle);
          setVisualStyle(mappedStyle);
          
          // Also recommend a matching layout
          const layoutMap: Record<string, LayoutStyleId> = {
            'magazine': 'magazine_grid',
            'watercolor': 'handwritten',
            'tech_futuristic': 'glassmorphism',
            'vintage_film': 'handwritten',
            'minimalist_nordic': 'ultra_minimal',
            'neon_cyberpunk': 'neon_glow',
            'natural_organic': 'glassmorphism',
          };
          const recommendedLayout = layoutMap[mappedStyle] || 'glassmorphism';
          setAiRecommendedLayout(recommendedLayout);
          setLayoutStyle(recommendedLayout);
        }
        
        // Recommend default scenes after AI analysis
        if (selectedScenes.length === 0) {
          const defaultRecommendedScenes: SceneType[] = ['main', 'front_view', 'lifestyle', 'detail_1'];
          setSelectedScenes(defaultRecommendedScenes);
        }
        
        toast({
          title: language === 'zh' ? 'AI 分析完成' : 'AI Analysis Complete',
          description: language === 'zh' 
            ? `产品: ${productNameText || brandNameText}, 推荐风格: ${analysis.visualStyle?.recommended || 'auto'}`
            : `Product: ${productNameText || brandNameText}, Recommended: ${analysis.visualStyle?.recommended || 'auto'}`,
        });
      } else {
        console.error('AI analysis failed:', result.error);
        // Fall back to mock data
        fallbackToMockAnalysis();
        
        if (result.error?.includes('Rate limit') || result.error?.includes('429')) {
          toast({
            title: language === 'zh' ? 'AI 请求限制' : 'Rate Limited',
            description: language === 'zh' ? '请稍后重试' : 'Please try again later',
            variant: 'destructive',
          });
        } else if (result.error?.includes('402') || result.error?.includes('credits')) {
          toast({
            title: language === 'zh' ? 'AI 额度不足' : 'Credits Exhausted',
            description: language === 'zh' ? '请添加额度' : 'Please add credits',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('AI analysis error:', error);
      fallbackToMockAnalysis();
    } finally {
      setIsAIProcessing(false);
      setIsRefreshingPlan(false);
    }
  };

  const fallbackToMockAnalysis = () => {
    // Fallback mock data when AI fails - don't auto-select platform
    setProductName('Sample Product');
    setBrandName('Brand');
    setProductKeywords('quality, premium, professional');
    
    setAiRecommendedStyle('natural_organic');
    setVisualStyle('natural_organic');
    setAiRecommendedLayout('glassmorphism');
    setLayoutStyle('glassmorphism');
    
    // Also recommend default scenes on fallback
    if (selectedScenes.length === 0) {
      const defaultRecommendedScenes: SceneType[] = ['main', 'front_view', 'lifestyle', 'detail_1'];
      setSelectedScenes(defaultRecommendedScenes);
    }
  };

  // Refresh AI plan - save history first
  const handleRefreshPlan = () => {
    saveToHistory();
    runAIAnalysis(true);
  };

  // Switch from Agent to Manual for customization
  const handleSwitchToManual = () => {
    saveToHistory();
    setIsAgentMode(false);
    toast({
      title: language === 'zh' ? '已切换至手动模式' : 'Switched to Manual Mode',
      description: language === 'zh' ? '您现在可以自由调整所有配置，点击撤销可恢复' : 'You can now freely adjust all settings, click undo to restore',
    });
  };

  // Switch back to Agent mode
  const handleSwitchToAgent = () => {
    saveToHistory();
    setIsAgentMode(true);
    toast({
      title: language === 'zh' ? '已切换至智能模式' : 'Switched to Agent Mode',
      description: language === 'zh' ? 'AI 将为您智能推荐设计方案' : 'AI will intelligently recommend design plans for you',
    });
  };

  const handleToggleScene = (scene: SceneType) => {
    setSelectedScenes(prev => 
      prev.includes(scene) ? prev.filter(s => s !== scene) : [...prev, scene]
    );
  };

  const handleSelectAllScenes = () => {
    const allSceneIds = [...defaultScenes, ...customScenes].map(s => s.id);
    setSelectedScenes(prev => prev.length === allSceneIds.length ? [] : allSceneIds);
  };

  const handleAddCustomScene = (scene: Scene) => {
    setCustomScenes(prev => [...prev, scene]);
  };

  const handleRemoveCustomScene = (sceneId: string) => {
    setCustomScenes(prev => prev.filter(s => s.id !== sceneId));
    setSelectedScenes(prev => prev.filter(s => s !== sceneId));
  };

  // FIXED: Additive calculation (modules + scenes), not multiplicative
  const totalImages = selectedModules.length + selectedScenes.length;

  const handleGenerate = useCallback(() => {
    setShowConfirmModal(false);
    setIsGenerating(true);
    setProgress(0);
    setGeneratedImages([]);
    
    const interval = setInterval(() => setProgress(prev => prev >= 100 ? 100 : prev + Math.random() * 15), 500);
    
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setGeneratedImages(sampleImages.slice(0, Math.min(4, totalImages || 4)));
      setIsGenerating(false);
      setShowCelebration(true);
    }, 4000);
  }, [totalImages]);

  const handleDownload = (id: string) => toast({ title: language === 'zh' ? '下载中...' : 'Downloading...' });
  const handleZoom = (id: string) => {
    const index = generatedImages.findIndex(img => img.id === id);
    if (index !== -1) setPreviewImage({ url: generatedImages[index].url, id, index });
  };
  const handleRegenerate = (id: string) => toast({ title: language === 'zh' ? '重新生成中...' : 'Regenerating...' });
  const handleSelect = (id: string) => setGeneratedImages(prev => prev.map(img => ({ ...img, isSelected: img.id === id ? !img.isSelected : img.isSelected })));
  const handleDownloadAll = () => toast({ title: language === 'zh' ? '下载全部...' : 'Downloading all...' });

  const canGenerate = uploadedImages.length > 0 && !isGenerating && selectedPlatform && selectedModules.length > 0;

  const handleReset = () => {
    setUploadedImages([]);
    setProductName('');
    setBrandName('');
    setProductKeywords('');
    setSelectedPlatform(null);
    setSelectedModules([]);
    setSelectedScenes(['main', 'front_view', 'lifestyle', 'detail_1']);
    setCustomScenes([]);
    setVisualStyle('ai_auto');
    setLayoutStyle('ai_auto');
    setAiRecommendedStyle(undefined);
    setAiRecommendedLayout(undefined);
    setAiAnalysis(null);
    setGeneratedImages([]);
    setLogoConfig({
      file: null,
      preview: null,
      include: false,
      position: 'top-left',
      style: 'original',
    });
  };

  const currentPlatform = platformsConfig.find(p => p.id === selectedPlatform);
  const currentVisualStyle = visualStyles.find(s => s.id === visualStyle);

  return (
    <div className="h-screen flex flex-col bg-mesh">
      <Header credits={credits} onNavigate={setActiveView} activeView={activeView} />
      
      <div className="flex-1 flex overflow-hidden">
        {activeView === 'workbench' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - Config */}
            <aside className={cn(
              "w-[340px] flex-shrink-0 border-r border-border/30 overflow-y-auto transition-all duration-500",
              isAgentMode 
                ? "bg-gradient-to-b from-primary/[0.03] to-transparent" 
                : "bg-card/20"
            )}>
              <div className="p-4 space-y-1">
                {/* Mode Toggle with Undo */}
                <div className="flex items-center justify-between mb-4">
                  <div className={cn(
                    "relative flex items-center p-1 rounded-full border transition-all duration-500",
                    isAgentMode 
                      ? "bg-primary/5 border-primary/20" 
                      : "bg-secondary/50 border-border/30"
                  )}>
                    <div
                      className={cn(
                        "absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full transition-all duration-500 ease-out",
                        isAgentMode 
                          ? "left-1 bg-gradient-primary shadow-primary-glow" 
                          : "left-[calc(50%+2px)] bg-card shadow-sm border border-border/50"
                      )}
                    />
                    <button
                      onClick={handleSwitchToAgent}
                      className={cn(
                        "relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                        isAgentMode ? "text-primary-foreground" : "text-foreground-muted hover:text-foreground"
                      )}
                    >
                      <Bot className="h-3.5 w-3.5" />
                      {language === 'zh' ? '智能' : 'Agent'}
                    </button>
                    <button
                      onClick={handleSwitchToManual}
                      className={cn(
                        "relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                        !isAgentMode ? "text-foreground" : "text-primary-foreground/70 hover:text-primary-foreground"
                      )}
                    >
                      <Hand className="h-3.5 w-3.5" />
                      {language === 'zh' ? '手动' : 'Manual'}
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Undo Button */}
                    {configHistory.length > 0 && (
                      <button
                        onClick={handleUndo}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-foreground-muted hover:text-foreground rounded-md hover:bg-secondary/50 transition-colors"
                        title={language === 'zh' ? '撤销上一步' : 'Undo last change'}
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span className="hidden sm:inline">{language === 'zh' ? '撤销' : 'Undo'}</span>
                      </button>
                    )}
                    
                    {/* Processing indicator */}
                    {isAIProcessing && (
                      <div className="flex items-center gap-2 text-xs text-primary">
                        <div className="flex gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                          <span className="w-1 h-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: '150ms' }} />
                          <span className="w-1 h-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Scrollable Config Sections */}
                <div className="space-y-3">
                  {/* 01 - Upload (Both modes) */}
                  <ConfigSection 
                    number="01" 
                    title={language === 'zh' ? '商品上传' : 'Product Upload'}
                    icon={<Upload className="h-3.5 w-3.5" />}
                    isComplete={uploadedImages.length > 0}
                    isAgentMode={isAgentMode}
                  >
                    <MultiImageUpload 
                      images={uploadedImages}
                      onImagesChange={setUploadedImages}
                    />
                  </ConfigSection>

                  {/* 02 - Platform Selection (Both modes - user must choose) */}
                  {uploadedImages.length > 0 && (
                    <ConfigSection 
                      number="02" 
                      title={language === 'zh' ? '平台配置' : 'Platform'}
                      icon={<Layers className="h-3.5 w-3.5" />}
                      isComplete={selectedModules.length > 0}
                      isAgentMode={isAgentMode}
                    >
                      <PlatformConfigSimplified
                        selectedPlatform={selectedPlatform}
                        onSelectPlatform={setSelectedPlatform}
                        selectedModules={selectedModules}
                        onUpdateModules={setSelectedModules}
                        isAgentMode={isAgentMode}
                      />
                    </ConfigSection>
                  )}

                  {/* Agent Mode: Compact sidebar summary after platform selected */}
                  {isAgentMode && uploadedImages.length > 0 && selectedPlatform && (
                    <AgentModeSidebar
                      analysis={aiAnalysis}
                      isAnalyzing={isAIProcessing}
                      hasStartedAnalysis={!!aiAnalysis || isAIProcessing}
                      recommendedVisualStyle={visualStyle}
                      recommendedLayoutStyle={layoutStyle}
                      recommendedScenes={selectedScenes}
                      recommendedModules={selectedModules}
                      totalImages={totalImages}
                    />
                  )}

                  {/* Manual Mode: Show all config sections step by step */}
                  {!isAgentMode && (
                    <>
                      {/* 03 - Product Info (Manual) */}
                      {uploadedImages.length > 0 && selectedPlatform && (
                        <ConfigSection 
                          number="03" 
                          title={language === 'zh' ? '商品信息' : 'Product Info'}
                          icon={<Package className="h-3.5 w-3.5" />}
                          isComplete={!!productName}
                          isAgentMode={isAgentMode}
                        >
                          <div className="space-y-2">
                            <div>
                              <label className="text-[10px] text-foreground-muted mb-1 block">
                                {language === 'zh' ? '产品名称' : 'Product Name'}
                              </label>
                              <input
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder={language === 'zh' ? '输入产品名称' : 'Enter product name'}
                                className="w-full px-3 py-2 rounded-lg bg-card border border-border/50 text-sm focus:border-primary/50 focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-foreground-muted mb-1 block">
                                {language === 'zh' ? '核心卖点' : 'Key Points'}
                              </label>
                              <textarea
                                value={productKeywords}
                                onChange={(e) => setProductKeywords(e.target.value)}
                                placeholder={language === 'zh' ? '输入产品关键词' : 'Enter keywords'}
                                rows={2}
                                className="w-full px-3 py-2 rounded-lg bg-card border border-border/50 text-sm focus:border-primary/50 focus:outline-none transition-colors resize-none"
                              />
                            </div>
                          </div>
                        </ConfigSection>
                      )}

                      {/* 04 - Scene Planning (Manual) */}
                      {selectedPlatform && (
                        <ConfigSection 
                          number="04" 
                          title={language === 'zh' ? '场景规划' : 'Scenes'}
                          icon={<ImageIcon className="h-3.5 w-3.5" />}
                          isComplete={selectedScenes.length > 0}
                          isAgentMode={isAgentMode}
                        >
                          <ScenePlanning
                            selectedScenes={selectedScenes}
                            onToggleScene={handleToggleScene}
                            onSelectAll={handleSelectAllScenes}
                            customScenes={customScenes}
                            onAddCustomScene={handleAddCustomScene}
                            onRemoveCustomScene={handleRemoveCustomScene}
                          />
                        </ConfigSection>
                      )}

                      {/* 05 - Visual & Layout (Manual) */}
                      {selectedScenes.length > 0 && (
                        <ConfigSection 
                          number="05" 
                          title={language === 'zh' ? '视觉风格' : 'Visual'}
                          icon={<Palette className="h-3.5 w-3.5" />}
                          isComplete={visualStyle !== 'ai_auto'}
                          isAgentMode={isAgentMode}
                        >
                          <VisualStylePicker
                            selectedVisual={visualStyle}
                            selectedLayout={layoutStyle}
                            onVisualChange={setVisualStyle}
                            onLayoutChange={setLayoutStyle}
                            aiRecommendedVisual={aiRecommendedStyle}
                            aiRecommendedLayout={aiRecommendedLayout}
                            isAgentMode={isAgentMode}
                          />
                        </ConfigSection>
                      )}

                      {/* 06 - Language (Manual) */}
                      {selectedScenes.length > 0 && (
                        <ConfigSection 
                          number="06" 
                          title={language === 'zh' ? '画面语言' : 'Language'}
                          icon={<Globe className="h-3.5 w-3.5" />}
                          isComplete={true}
                          isAgentMode={isAgentMode}
                        >
                          <LanguageSettings
                            primaryLanguage={primaryLanguage}
                            secondaryLanguage={secondaryLanguage}
                            onPrimaryChange={setPrimaryLanguage}
                            onSecondaryChange={setSecondaryLanguage}
                          />
                        </ConfigSection>
                      )}

                      {/* 07 - Brand & Logo Settings (Manual) */}
                      {selectedScenes.length > 0 && (
                        <ConfigSection 
                          number="07" 
                          title={language === 'zh' ? '品牌资产' : 'Brand Assets'}
                          icon={<ImagePlus className="h-3.5 w-3.5" />}
                          isComplete={logoConfig.preview !== null || !!brandName}
                          isAgentMode={isAgentMode}
                          isOptional
                        >
                          <div className="space-y-3">
                            {/* Brand Name */}
                            <div>
                              <label className="text-[10px] text-foreground-muted mb-1 block">
                                {language === 'zh' ? '品牌名称' : 'Brand Name'}
                              </label>
                              <input
                                type="text"
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                                placeholder={language === 'zh' ? '输入品牌名称' : 'Enter brand name'}
                                className="w-full px-3 py-2 rounded-lg bg-card border border-border/50 text-sm focus:border-primary/50 focus:outline-none transition-colors"
                              />
                            </div>
                            
                            {/* Logo Settings */}
                            <LogoSettings
                              config={logoConfig}
                              onChange={setLogoConfig}
                            />
                          </div>
                        </ConfigSection>
                      )}
                    </>
                  )}
                </div>

                {/* Action Buttons - Only show in Manual mode or when no AI panel */}
                {(!isAgentMode || !selectedPlatform || uploadedImages.length === 0) && (
                  <div className="mt-6 pt-4 pb-4 space-y-3 border-t border-border/30 bg-background relative z-10">
                    {/* Calculation breakdown - only show after upload when there are selections */}
                    {uploadedImages.length > 0 && (selectedModules.length > 0 || selectedScenes.length > 0) && (
                      <div className="px-3 py-2 rounded-lg bg-secondary/30 border border-border/30">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-foreground-muted">
                            <span>{language === 'zh' ? '输出模块' : 'Modules'}: <span className="text-foreground font-medium">{selectedModules.length}</span></span>
                            <span className="text-foreground-muted/50">+</span>
                            <span>{language === 'zh' ? '场景' : 'Scenes'}: <span className="text-foreground font-medium">{selectedScenes.length}</span></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-primary font-semibold">
                            <span>=</span>
                            <span>{totalImages}</span>
                            <span className="font-normal text-foreground-muted">{language === 'zh' ? '张' : 'imgs'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Button
                      variant="generate"
                      size="lg"
                      className="w-full"
                      onClick={() => setShowConfirmModal(true)}
                      disabled={!canGenerate || isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          {language === 'zh' ? '生成中...' : 'Generating...'}
                        </>
                      ) : (
                        <>
                          <Zap className="h-5 w-5" />
                          {language === 'zh' ? '开始设计' : 'Start Design'}
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-foreground-muted"
                      onClick={handleReset}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      {language === 'zh' ? '重置' : 'Reset'}
                    </Button>
                  </div>
                )}
              </div>
            </aside>

            {/* Right Panel - Preview / Results */}
            <main className="flex-1 overflow-hidden" ref={containerRef}>
              {/* Agent Mode: AI Chat Canvas */}
              {isAgentMode && uploadedImages.length > 0 && selectedPlatform && generatedImages.length === 0 && !isGenerating && (
                <AgentChatCanvas
                  analysis={aiAnalysis}
                  isAnalyzing={isAIProcessing}
                  recommendedVisualStyle={visualStyle}
                  recommendedLayoutStyle={layoutStyle}
                  recommendedScenes={selectedScenes}
                  recommendedModules={selectedModules}
                  totalImages={totalImages}
                  aiRecommendedCount={selectedModules.length > 0 ? selectedModules.length + Math.min(selectedScenes.length, 4) : undefined}
                  uploadedImagesCount={uploadedImages.length}
                  onConfirm={() => setShowConfirmModal(true)}
                  onRefresh={handleRefreshPlan}
                  onCustomize={handleSwitchToManual}
                  onStartAnalysis={handleStartAnalysis}
                  onUpdatePlan={(update) => {
                    if (update.visualStyle) setVisualStyle(update.visualStyle);
                    if (update.layoutStyle) setLayoutStyle(update.layoutStyle);
                    if (update.scenes) setSelectedScenes(update.scenes as SceneType[]);
                    if (update.modules) setSelectedModules(update.modules);
                  }}
                  isRefreshing={isRefreshingPlan}
                  isReady={canGenerate}
                />
              )}

              <div className={cn(
                "p-6 lg:p-8",
                isAgentMode && uploadedImages.length > 0 && selectedPlatform && generatedImages.length === 0 && !isGenerating ? "hidden" : ""
              )}>
                {/* Empty State */}
                {uploadedImages.length === 0 && generatedImages.length === 0 && !isGenerating && (
                  <div className="h-full overflow-y-auto animate-fade-in">
                    <div className="max-w-5xl mx-auto space-y-8 pb-8">
                      {/* Hero Section */}
                      <div className="flex flex-col items-center text-center pt-8 pb-4">
                        <div className="relative mb-4">
                          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                            <Package className="h-14 w-14 text-primary" />
                          </div>
                          <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-2xl -z-10" />
                        </div>
                        <h2 className="text-xl font-display font-bold text-foreground mb-2">
                          {language === 'zh' ? '开始创建电商视觉' : 'Start Creating E-commerce Visuals'}
                        </h2>
                        <p className="text-sm text-foreground-muted max-w-md mb-4">
                          {language === 'zh' 
                            ? '上传产品图片，AI 将自动分析并生成专业的电商 KV 设计' 
                            : 'Upload product images, AI will analyze and generate professional e-commerce KV designs'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-foreground-secondary">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <Upload className="h-3 w-3 text-primary" />
                            </div>
                            <span>{language === 'zh' ? '上传' : 'Upload'}</span>
                          </div>
                          <ChevronRight className="h-3 w-3 text-foreground-muted" />
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <Sparkles className="h-3 w-3 text-primary" />
                            </div>
                            <span>{language === 'zh' ? 'AI 分析' : 'Analyze'}</span>
                          </div>
                          <ChevronRight className="h-3 w-3 text-foreground-muted" />
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <ImageIcon className="h-3 w-3 text-primary" />
                            </div>
                            <span>{language === 'zh' ? '生成' : 'Generate'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Tool Cards - Flyelep inspired */}
                      <QuickToolCards 
                        onToolSelect={(toolId) => {
                          toast({
                            title: language === 'zh' ? '功能即将上线' : 'Coming Soon',
                            description: language === 'zh' 
                              ? `${toolId} 功能正在开发中，敬请期待` 
                              : `${toolId} feature is under development`,
                          });
                        }}
                      />

                      {/* Inspiration Gallery - Pixifield inspired */}
                      <InspirationGallery 
                        onSelectInspiration={(item) => {
                          toast({
                            title: language === 'zh' ? '灵感已选择' : 'Inspiration Selected',
                            description: language === 'zh' 
                              ? `将使用「${item.titleZh}」风格作为参考` 
                              : `Will use "${item.title}" style as reference`,
                          });
                        }}
                        maxItems={6}
                      />

                      {/* Visual Preset Cards - Enhanced */}
                      <VisualPresetCards
                        selectedStyle={visualStyle}
                        onSelectStyle={(style) => {
                          setVisualStyle(style);
                          toast({
                            title: language === 'zh' ? '风格已选择' : 'Style Selected',
                            description: visualStyles.find(s => s.id === style)?.[language === 'zh' ? 'nameZh' : 'name'] || style,
                          });
                        }}
                        aiRecommended={aiRecommendedStyle}
                        showAIAuto={isAgentMode}
                      />
                    </div>
                  </div>
                )}

                {/* Manual Mode: Design Brief Preview */}
                {!isAgentMode && uploadedImages.length > 0 && !isGenerating && generatedImages.length === 0 && (
                  <div className="max-w-3xl mx-auto animate-fade-in">
                    <DesignBrief
                      productName={productName}
                      productKeywords={productKeywords}
                      platformName={language === 'zh' ? (currentPlatform?.nameZh || '-') : (currentPlatform?.name || '-')}
                      platformIcon={currentPlatform?.icon || null}
                      visualStyleName={language === 'zh' ? (currentVisualStyle?.nameZh || 'AI Auto') : (currentVisualStyle?.name || 'AI Auto')}
                      visualStyleIcon={currentVisualStyle?.icon || null}
                      layoutStyleName={layoutStyle}
                      primaryLanguage={primaryLanguage === 'zh' ? '中文' : 'English'}
                      secondaryLanguage={secondaryLanguage ? (secondaryLanguage === 'zh' ? '中文' : 'English') : null}
                      selectedModules={selectedModules}
                      selectedScenes={selectedScenes}
                      totalImages={totalImages}
                      onConfirm={() => setShowConfirmModal(true)}
                      isReady={canGenerate}
                    />
                  </div>
                )}

                {/* Generated Results */}
                {generatedImages.length > 0 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <ImageIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h2 className="font-display font-semibold text-foreground">
                            {language === 'zh' ? '生成结果' : 'Generated Results'}
                          </h2>
                          <span className="text-xs text-foreground-muted">
                            {generatedImages.length} {language === 'zh' ? '张图片' : 'images'}
                          </span>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm" onClick={handleDownloadAll} className="gap-2">
                        <Download className="h-4 w-4" />
                        {language === 'zh' ? '全部下载' : 'Download All'}
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {generatedImages.map(img => (
                        <EnhancedResultCard 
                          key={img.id} 
                          id={img.id} 
                          url={img.url} 
                          label={img.label}
                          isSelected={img.isSelected}
                          onDownload={handleDownload}
                          onZoom={handleZoom}
                          onRegenerate={handleRegenerate}
                          onSelect={handleSelect}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Generating Overlay */}
                {isGenerating && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-background/60 backdrop-blur-md">
                    <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-lg max-w-sm w-full mx-4">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative p-3 rounded-xl bg-gradient-primary shadow-primary-glow">
                          <Sparkles className="h-6 w-6 text-primary-foreground animate-pulse" />
                        </div>
                        <div>
                          <p className="font-display font-semibold text-foreground">
                            {language === 'zh' ? '正在生成设计...' : 'Generating designs...'}
                          </p>
                          <p className="text-sm text-foreground-muted">
                            {language === 'zh' ? 'AI 正在创作您的视觉' : 'AI is creating your visuals'}
                          </p>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-xs text-foreground-muted mt-3 text-center">
                        {Math.round(progress)}% {language === 'zh' ? '完成' : 'complete'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        )}

        {activeView === 'history' && (
          <main className="flex-1 overflow-hidden bg-card/30">
            <HistoryPanel 
              historyItems={[]} 
              onViewItem={() => {}} 
              onDownloadItem={() => {}} 
              onDeleteItem={() => {}} 
              searchQuery="" 
              onSearchChange={() => {}} 
            />
          </main>
        )}
        
        {activeView === 'templates' && (
          <main className="flex-1 overflow-hidden bg-card/30">
            <TemplatesPanel onSelectTemplate={(template: Template) => { 
              // Apply template configuration
              const { config } = template;
              
              // Set platform
              setSelectedPlatform(config.platform);
              
              // Set visual and layout style
              setVisualStyle(config.visualStyle as VisualStyleId);
              setLayoutStyle(config.layoutStyle as LayoutStyleId);
              
              // Set modules
              setSelectedModules(config.modules);
              
              // Set scenes
              setSelectedScenes(config.scenes as SceneType[]);
              
              // Switch to workbench view
              setActiveView('workbench');
              
              // Switch to Manual Mode so user can see all loaded configurations
              saveToHistory();
              setIsAgentMode(false);
              
              toast({ 
                title: language === 'zh' ? '模板配置已加载' : 'Template loaded',
                description: language === 'zh' 
                  ? `平台: ${config.platform} · 风格: ${template.style} · ${config.modules.length}个模块` 
                  : `Platform: ${config.platform} · Style: ${template.style} · ${config.modules.length} modules`,
              }); 
            }} />
          </main>
        )}
      </div>

      <GenerationConfirmModal 
        isOpen={showConfirmModal} 
        onClose={() => setShowConfirmModal(false)} 
        onConfirm={handleGenerate} 
        summary={{ 
          style: visualStyles.find(s => s.id === visualStyle)?.nameZh || 'AI Auto', 
          modules: selectedModules.map(m => ({ id: m.id, name: m.name, credits: 1 })),
          totalImages: totalImages || 1, 
          estimatedTime: (totalImages || 1) * 10, 
          totalCredits: totalImages || 1, 
          currentCredits: credits 
        }} 
      />
      <CelebrationOverlay isVisible={showCelebration} onClose={() => setShowCelebration(false)} imageCount={generatedImages.length} />
      {previewImage && (
        <ImagePreviewModal 
          isOpen={!!previewImage} 
          onClose={() => setPreviewImage(null)} 
          imageUrl={previewImage.url} 
          imageId={previewImage.id} 
          onDownload={handleDownload} 
          onRegenerate={handleRegenerate} 
          onPrevious={() => {}} 
          onNext={() => {}} 
          hasPrevious={previewImage.index > 0} 
          hasNext={previewImage.index < generatedImages.length - 1} 
          currentIndex={previewImage.index} 
          totalImages={generatedImages.length} 
        />
      )}
    </div>
  );
};

// Config Section Component
interface ConfigSectionProps {
  number: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isComplete?: boolean;
  isProcessing?: boolean;
  isAgentMode?: boolean;
  isOptional?: boolean;
}

const ConfigSection: React.FC<ConfigSectionProps> = ({
  number,
  title,
  icon,
  children,
  isComplete = false,
  isProcessing = false,
  isAgentMode = false,
  isOptional = false,
}) => {
  const { language } = useLanguage();
  
  return (
    <div className={cn(
      "rounded-xl border overflow-hidden transition-all",
      isAgentMode 
        ? "border-primary/10 bg-card/60 hover:border-primary/20" 
        : "border-border/30 bg-card/50 hover:border-border/50"
    )}>
      <div className="flex items-center gap-2 p-2.5 border-b border-border/20">
        <div className={cn(
          "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
          isComplete
            ? "bg-gradient-primary text-primary-foreground shadow-sm"
            : "bg-secondary text-foreground-muted"
        )}>
          {isProcessing ? (
            <Loader2 className="h-2.5 w-2.5 animate-spin" />
          ) : isComplete ? (
            '✓'
          ) : (
            number
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
          {icon}
          <span>{title}</span>
        </div>
        {isOptional && (
          <span className="ml-auto text-[10px] text-foreground-muted px-1.5 py-0.5 rounded bg-secondary/50">
            {language === 'zh' ? '可选' : 'Optional'}
          </span>
        )}
      </div>
      <div className="p-2.5">
        {children}
      </div>
    </div>
  );
};

// Wrapper with Language Provider
const Workbench: React.FC = () => {
  return (
    <LanguageProvider>
      <WorkbenchContent />
    </LanguageProvider>
  );
};

export default Workbench;
