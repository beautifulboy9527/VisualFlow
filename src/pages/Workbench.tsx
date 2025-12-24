import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { MultiImageUpload, UploadedImage } from '@/components/workbench/MultiImageUpload';
import { PlatformConfig, platformsConfig } from '@/components/workbench/PlatformConfig';
import { LanguageSettings, Language } from '@/components/workbench/LanguageSettings';
import { VisualStylePicker, VisualStyleId, LayoutStyleId, visualStyles } from '@/components/workbench/VisualStylePicker';
import { ScenePlanning, SceneType } from '@/components/workbench/ScenePlanning';
import { GenerationConfirmModal } from '@/components/workbench/GenerationConfirmModal';
import { CelebrationOverlay } from '@/components/workbench/CelebrationOverlay';
import { EnhancedResultCard } from '@/components/workbench/EnhancedResultCard';
import { HistoryPanel } from '@/components/workbench/HistoryPanel';
import { TemplatesPanel } from '@/components/workbench/TemplatesPanel';
import { ImagePreviewModal } from '@/components/workbench/ImagePreviewModal';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
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
  Settings
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

const Workbench: React.FC = () => {
  const [activeView, setActiveView] = useState<'workbench' | 'history' | 'templates'>('workbench');
  const [isAgentMode, setIsAgentMode] = useState(true);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  
  // Step 1: Images
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  
  // Step 2: Product Info (AI analyzed)
  const [brandName, setBrandName] = useState('');
  const [productKeywords, setProductKeywords] = useState('');
  
  // Step 3: Platform & Modules
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedModules, setSelectedModules] = useState<SelectedModule[]>([]);
  
  // Step 4: Scene Planning
  const [selectedScenes, setSelectedScenes] = useState<SceneType[]>(['main_kv', 'lifestyle', 'detail_1', 'detail_2']);
  
  // Step 5: Visual Style
  const [visualStyle, setVisualStyle] = useState<VisualStyleId>('ai_auto');
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyleId>('ai_auto');
  const [aiRecommendedStyle, setAiRecommendedStyle] = useState<VisualStyleId | undefined>();
  
  // Step 6: Language
  const [primaryLanguage, setPrimaryLanguage] = useState<Language>('zh');
  const [secondaryLanguage, setSecondaryLanguage] = useState<Language | null>('en');
  
  // Generation states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<Array<{ id: string; url: string; isSelected?: boolean; label?: string }>>([]);
  const [credits] = useState(100);
  const [previewImage, setPreviewImage] = useState<{ url: string; id: string; index: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // AI Analysis when images uploaded
  useEffect(() => {
    if (uploadedImages.length > 0 && isAgentMode) {
      runAIAnalysis();
    }
  }, [uploadedImages.length]);

  const runAIAnalysis = async () => {
    setIsAIProcessing(true);
    
    await new Promise(r => setTimeout(r, 800));
    setBrandName('Premium Skincare');
    setProductKeywords('hydrating, natural, glow, premium, organic');
    
    await new Promise(r => setTimeout(r, 500));
    setSelectedPlatform('amazon');
    
    await new Promise(r => setTimeout(r, 400));
    const amazonPlatform = platformsConfig.find(p => p.id === 'amazon');
    if (amazonPlatform) {
      const defaultModules = amazonPlatform.modules.slice(0, 4).map(m => ({
        id: m.id,
        name: m.name,
        aspectRatio: m.aspectRatio,
      }));
      setSelectedModules(defaultModules);
    }
    
    await new Promise(r => setTimeout(r, 400));
    setAiRecommendedStyle('natural_organic');
    setVisualStyle('natural_organic');
    
    setIsAIProcessing(false);
  };

  const handleToggleScene = (scene: SceneType) => {
    setSelectedScenes(prev => 
      prev.includes(scene) ? prev.filter(s => s !== scene) : [...prev, scene]
    );
  };

  const handleSelectAllScenes = () => {
    const allScenes: SceneType[] = ['main_kv', 'lifestyle', 'craftsmanship', 'detail_1', 'detail_2', 'detail_3', 'reviews', 'brand_story', 'specs', 'usage_guide'];
    setSelectedScenes(prev => prev.length === allScenes.length ? [] : allScenes);
  };

  const totalImages = selectedModules.length * selectedScenes.length;

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

  const handleDownload = (id: string) => toast({ title: "Downloading..." });
  const handleZoom = (id: string) => {
    const index = generatedImages.findIndex(img => img.id === id);
    if (index !== -1) setPreviewImage({ url: generatedImages[index].url, id, index });
  };
  const handleRegenerate = (id: string) => toast({ title: "Regenerating..." });
  const handleSelect = (id: string) => setGeneratedImages(prev => prev.map(img => ({ ...img, isSelected: img.id === id ? !img.isSelected : img.isSelected })));
  const handleDownloadAll = () => toast({ title: "Downloading all..." });

  const canGenerate = uploadedImages.length > 0 && !isGenerating && selectedPlatform && selectedModules.length > 0;

  const handleReset = () => {
    setUploadedImages([]);
    setBrandName('');
    setProductKeywords('');
    setSelectedPlatform(null);
    setSelectedModules([]);
    setSelectedScenes(['main_kv', 'lifestyle', 'detail_1', 'detail_2']);
    setVisualStyle('ai_auto');
    setLayoutStyle('ai_auto');
    setGeneratedImages([]);
  };

  return (
    <div className="h-screen flex flex-col bg-mesh">
      <Header credits={credits} onNavigate={setActiveView} activeView={activeView} />
      
      <div className="flex-1 flex overflow-hidden">
        {activeView === 'workbench' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - Config */}
            <aside className={cn(
              "w-[360px] flex-shrink-0 border-r border-border/30 overflow-y-auto transition-all duration-500",
              isAgentMode 
                ? "bg-gradient-to-b from-primary/[0.02] to-transparent" 
                : "bg-card/30"
            )}>
              <div className="p-4 space-y-1">
                {/* Mode Toggle - More Liquid Style */}
                <div className="flex items-center justify-between mb-4">
                  <div className="relative flex items-center p-1 rounded-full bg-secondary/50 border border-border/30">
                    <div
                      className={cn(
                        "absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full transition-all duration-500 ease-out",
                        isAgentMode 
                          ? "left-1 bg-gradient-primary shadow-primary-glow" 
                          : "left-[calc(50%+2px)] bg-card shadow-sm border border-border/50"
                      )}
                    />
                    <button
                      onClick={() => setIsAgentMode(true)}
                      className={cn(
                        "relative z-10 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                        isAgentMode ? "text-primary-foreground" : "text-foreground-muted hover:text-foreground"
                      )}
                    >
                      <Bot className="h-4 w-4" />
                      Agent
                    </button>
                    <button
                      onClick={() => setIsAgentMode(false)}
                      className={cn(
                        "relative z-10 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                        !isAgentMode ? "text-foreground" : "text-primary-foreground/70 hover:text-primary-foreground"
                      )}
                    >
                      <Hand className="h-4 w-4" />
                      Manual
                    </button>
                  </div>
                  
                  {isAIProcessing && (
                    <div className="flex items-center gap-2 text-xs text-primary">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '300ms' }} />
                      </div>
                      AI分析中
                    </div>
                  )}
                </div>

                {/* Scrollable Config Sections */}
                <div className="space-y-4">
                  {/* 01 - Upload */}
                  <ConfigSection 
                    number="01" 
                    title="商品上传" 
                    icon={<Upload className="h-4 w-4" />}
                    isComplete={uploadedImages.length > 0}
                  >
                    <MultiImageUpload 
                      images={uploadedImages}
                      onImagesChange={setUploadedImages}
                    />
                  </ConfigSection>

                  {/* 02 - Product Info */}
                  {uploadedImages.length > 0 && (
                    <ConfigSection 
                      number="02" 
                      title="商品信息" 
                      icon={<Package className="h-4 w-4" />}
                      isComplete={!!brandName}
                      isProcessing={isAIProcessing}
                    >
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-foreground-muted mb-1 block">品牌名称</label>
                          <input
                            type="text"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            placeholder={isAgentMode ? "AI 自动识别..." : "输入品牌名称"}
                            className="w-full px-3 py-2 rounded-lg bg-card border border-border/50 text-sm focus:border-primary/50 focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-foreground-muted mb-1 block">核心卖点/参数</label>
                          <textarea
                            value={productKeywords}
                            onChange={(e) => setProductKeywords(e.target.value)}
                            placeholder={isAgentMode ? "AI 自动提取..." : "输入产品关键词"}
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg bg-card border border-border/50 text-sm focus:border-primary/50 focus:outline-none transition-colors resize-none"
                          />
                        </div>
                      </div>
                    </ConfigSection>
                  )}

                  {/* 03 - Platform & Modules */}
                  {uploadedImages.length > 0 && (
                    <ConfigSection 
                      number="03" 
                      title="平台配置" 
                      icon={<Layers className="h-4 w-4" />}
                      isComplete={selectedModules.length > 0}
                    >
                      <PlatformConfig
                        selectedPlatform={selectedPlatform}
                        onSelectPlatform={setSelectedPlatform}
                        selectedModules={selectedModules}
                        onUpdateModules={setSelectedModules}
                        isAgentMode={isAgentMode}
                      />
                    </ConfigSection>
                  )}

                  {/* 04 - Scene Planning */}
                  {selectedPlatform && (
                    <ConfigSection 
                      number="04" 
                      title="场景规划" 
                      icon={<ImageIcon className="h-4 w-4" />}
                      isComplete={selectedScenes.length > 0}
                    >
                      <ScenePlanning
                        selectedScenes={selectedScenes}
                        onToggleScene={handleToggleScene}
                        onSelectAll={handleSelectAllScenes}
                      />
                    </ConfigSection>
                  )}

                  {/* 05 - Visual & Layout */}
                  {selectedScenes.length > 0 && (
                    <ConfigSection 
                      number="05" 
                      title="视觉与排版" 
                      icon={<Palette className="h-4 w-4" />}
                      isComplete={visualStyle !== 'ai_auto' || isAgentMode}
                    >
                      <VisualStylePicker
                        selectedVisual={visualStyle}
                        selectedLayout={layoutStyle}
                        onVisualChange={setVisualStyle}
                        onLayoutChange={setLayoutStyle}
                        aiRecommendedVisual={aiRecommendedStyle}
                        isAgentMode={isAgentMode}
                      />
                    </ConfigSection>
                  )}

                  {/* 06 - Language */}
                  {selectedScenes.length > 0 && (
                    <ConfigSection 
                      number="06" 
                      title="画面语言" 
                      icon={<Globe className="h-4 w-4" />}
                      isComplete={true}
                    >
                      <LanguageSettings
                        primaryLanguage={primaryLanguage}
                        secondaryLanguage={secondaryLanguage}
                        onPrimaryChange={setPrimaryLanguage}
                        onSecondaryChange={setSecondaryLanguage}
                      />
                    </ConfigSection>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 pb-2 space-y-2 sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent">
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
                        生成中...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5" />
                        开始设计
                        {totalImages > 0 && (
                          <span className="ml-1 text-primary-foreground/80">
                            ({totalImages} 张)
                          </span>
                        )}
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
                    重置
                  </Button>
                </div>
              </div>
            </aside>

            {/* Right Panel - Preview / Results */}
            <main className="flex-1 overflow-y-auto" ref={containerRef}>
              <div className="p-6 lg:p-8">
                {/* Empty State */}
                {uploadedImages.length === 0 && generatedImages.length === 0 && !isGenerating && (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-fade-in">
                    <div className="relative mb-6">
                      <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                        <Package className="h-20 w-20 text-primary" />
                      </div>
                      <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-2xl -z-10" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-foreground mb-3">
                      开始创建电商视觉
                    </h2>
                    <p className="text-foreground-muted max-w-md mb-6">
                      上传产品图片，AI 将自动分析并生成专业的电商 KV 设计
                    </p>
                    <div className="flex items-center gap-6 text-sm text-foreground-secondary">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Upload className="h-4 w-4 text-primary" />
                        </div>
                        <span>上传产品图</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-foreground-muted" />
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <span>AI 智能分析</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-foreground-muted" />
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-primary" />
                        </div>
                        <span>生成 KV 设计</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Brief Preview */}
                {uploadedImages.length > 0 && !isGenerating && generatedImages.length === 0 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-display font-semibold text-foreground">设计预览</h2>
                      <span className="text-xs text-foreground-muted">
                        {selectedModules.length} 模块 × {selectedScenes.length} 场景 = {totalImages} 张图
                      </span>
                    </div>
                    
                    {/* Brief Card */}
                    <div className="glass rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-gradient-primary">
                          <Sparkles className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">AI 设计方案</h3>
                          <p className="text-xs text-foreground-muted">基于产品分析自动生成</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="p-3 rounded-lg bg-secondary/30">
                          <span className="text-xs text-foreground-muted block mb-1">平台</span>
                          <span className="font-medium text-foreground">
                            {platformsConfig.find(p => p.id === selectedPlatform)?.icon} {platformsConfig.find(p => p.id === selectedPlatform)?.name || '-'}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/30">
                          <span className="text-xs text-foreground-muted block mb-1">视觉风格</span>
                          <span className="font-medium text-foreground">
                            {visualStyles.find(s => s.id === visualStyle)?.icon} {visualStyles.find(s => s.id === visualStyle)?.nameZh || '-'}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/30">
                          <span className="text-xs text-foreground-muted block mb-1">主语言</span>
                          <span className="font-medium text-foreground">{primaryLanguage === 'zh' ? '🇨🇳 中文' : '🇺🇸 English'}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/30">
                          <span className="text-xs text-foreground-muted block mb-1">输出数量</span>
                          <span className="font-medium text-foreground">{totalImages} 张</span>
                        </div>
                      </div>

                      {/* Module Preview Grid */}
                      {selectedModules.length > 0 && (
                        <div className="pt-4 border-t border-border/30">
                          <span className="text-xs text-foreground-muted block mb-3">输出模块预览</span>
                          <div className="grid grid-cols-4 lg:grid-cols-6 gap-2">
                            {selectedModules.map(mod => (
                              <div
                                key={mod.id}
                                className="aspect-square rounded-lg bg-secondary/50 border border-border/30 flex flex-col items-center justify-center p-2"
                              >
                                <span className="text-[10px] text-foreground-secondary text-center leading-tight">{mod.name}</span>
                                <span className="text-[9px] text-foreground-muted mt-1">{mod.aspectRatio}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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
                          <h2 className="font-display font-semibold text-foreground">生成结果</h2>
                          <span className="text-xs text-foreground-muted">{generatedImages.length} 张图片</span>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm" onClick={handleDownloadAll} className="gap-2">
                        <Download className="h-4 w-4" />
                        全部下载
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
                          <p className="font-display font-semibold text-foreground">正在生成设计...</p>
                          <p className="text-sm text-foreground-muted">AI 正在创作您的视觉</p>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-xs text-foreground-muted mt-3 text-center">{Math.round(progress)}% 完成</p>
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
            <TemplatesPanel onSelectTemplate={() => { 
              setActiveView('workbench'); 
              toast({ title: "模板已加载" }); 
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
}

const ConfigSection: React.FC<ConfigSectionProps> = ({
  number,
  title,
  icon,
  children,
  isComplete = false,
  isProcessing = false,
}) => {
  return (
    <div className="rounded-xl border border-border/30 overflow-hidden bg-card/50 hover:border-border/50 transition-colors">
      <div className="flex items-center gap-3 p-3 border-b border-border/20">
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
          isComplete
            ? "bg-gradient-primary text-primary-foreground shadow-sm"
            : "bg-secondary text-foreground-muted"
        )}>
          {isProcessing ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : isComplete ? (
            '✓'
          ) : (
            number
          )}
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          {icon}
          {title}
        </div>
      </div>
      <div className="p-3">
        {children}
      </div>
    </div>
  );
};

export default Workbench;
