import React, { useState, useCallback, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { MultiImageUpload, UploadedImage } from '@/components/workbench/MultiImageUpload';
import { LiquidModeToggle } from '@/components/workbench/LiquidModeToggle';
import { PlatformSelector, platforms } from '@/components/workbench/PlatformSelector';
import { AITypingField } from '@/components/workbench/AITypingText';
import { CopyPreviewCards, CopyPreview } from '@/components/workbench/CopyPreviewCards';
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
  Palette,
  Type,
  Wand2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sampleImages = [
  { id: '1', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop', label: 'Main KV' },
  { id: '2', url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=800&fit=crop', label: 'Banner' },
  { id: '3', url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&h=800&fit=crop', label: 'Social' },
  { id: '4', url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop', label: 'Detail' },
];

const visualStyles = [
  { id: 'minimal', name: 'Minimal Organic', emoji: '🌿' },
  { id: 'luxury', name: 'Premium Luxury', emoji: '✨' },
  { id: 'tech', name: 'Tech Modern', emoji: '💎' },
  { id: 'playful', name: 'Playful Pop', emoji: '🎨' },
  { id: 'editorial', name: 'Editorial', emoji: '📖' },
  { id: 'watercolor', name: 'Watercolor Art', emoji: '🎨' },
];

const Workbench: React.FC = () => {
  const [activeView, setActiveView] = useState<'workbench' | 'history' | 'templates'>('workbench');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isAgentMode, setIsAgentMode] = useState(true);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  
  // AI-generated fields with typing animation
  const [isTypingAnalysis, setIsTypingAnalysis] = useState(false);
  const [analysisFields, setAnalysisFields] = useState({
    category: '',
    material: '',
    style: '',
    keywords: '',
  });
  
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [copyPreviews, setCopyPreviews] = useState<CopyPreview[]>([]);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<Array<{ id: string; url: string; isSelected?: boolean; label?: string }>>([]);
  const [credits] = useState(100);
  const [previewImage, setPreviewImage] = useState<{ url: string; id: string; index: number } | null>(null);

  // Current step in the flow
  const [currentStep, setCurrentStep] = useState(0);

  // Trigger AI analysis when images are uploaded
  useEffect(() => {
    if (uploadedImages.length > 0 && isAgentMode) {
      runAIAnalysis();
    }
  }, [uploadedImages.length, isAgentMode]);

  const runAIAnalysis = async () => {
    setIsAIProcessing(true);
    setIsTypingAnalysis(true);
    setCurrentStep(1);
    
    // Simulate AI analysis with staggered typing
    await new Promise(r => setTimeout(r, 500));
    setAnalysisFields(prev => ({ ...prev, category: 'Skincare / Beauty' }));
    
    await new Promise(r => setTimeout(r, 400));
    setAnalysisFields(prev => ({ ...prev, material: 'Glass, Frosted finish' }));
    
    await new Promise(r => setTimeout(r, 400));
    setAnalysisFields(prev => ({ ...prev, style: 'Minimal Organic' }));
    setSelectedStyle('minimal');
    
    await new Promise(r => setTimeout(r, 400));
    setAnalysisFields(prev => ({ ...prev, keywords: 'hydrating, natural, glow, premium' }));
    
    await new Promise(r => setTimeout(r, 300));
    setIsTypingAnalysis(false);
    
    // Auto-recommend platforms
    await new Promise(r => setTimeout(r, 500));
    setSelectedPlatforms(['amazon', 'instagram']);
    setCurrentStep(2);
    
    // Generate copy
    await new Promise(r => setTimeout(r, 500));
    generateCopyPreviews();
    setIsAIProcessing(false);
  };

  const generateCopyPreviews = () => {
    setIsGeneratingCopy(true);
    setCurrentStep(3);
    
    setTimeout(() => {
      const modules = selectedPlatforms.flatMap(pId => {
        const platform = platforms.find(p => p.id === pId);
        return platform?.modules || [];
      });
      
      const previews = modules.slice(0, 4).map((mod, i) => ({
        moduleId: mod.id,
        moduleName: mod.name,
        title: 'Premium Skincare Solution',
        subtitle: 'Hydrate. Nourish. Glow.',
        cta: 'Shop Now',
        font: 'inter',
        fontSize: 'medium' as const,
        layout: 'centered' as const,
      }));
      
      setCopyPreviews(previews);
      setIsGeneratingCopy(false);
    }, 1500);
  };

  const handleTogglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId) 
        : [...prev, platformId]
    );
  };

  const totalModules = selectedPlatforms.reduce((sum, pId) => {
    const platform = platforms.find(p => p.id === pId);
    return sum + (platform?.modules.length || 0);
  }, 0);

  const handleGenerate = useCallback(() => {
    setShowConfirmModal(false);
    setIsGenerating(true);
    setProgress(0);
    setGeneratedImages([]);
    
    const interval = setInterval(() => setProgress(prev => prev >= 100 ? 100 : prev + Math.random() * 15), 500);
    
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setGeneratedImages(sampleImages.slice(0, Math.min(4, totalModules)));
      setIsGenerating(false);
      setShowCelebration(true);
    }, 4000);
  }, [totalModules]);

  const handleDownload = (id: string) => toast({ title: "Downloading..." });
  const handleZoom = (id: string) => {
    const index = generatedImages.findIndex(img => img.id === id);
    if (index !== -1) setPreviewImage({ url: generatedImages[index].url, id, index });
  };
  const handleRegenerate = (id: string) => toast({ title: "Regenerating..." });
  const handleSelect = (id: string) => setGeneratedImages(prev => prev.map(img => ({ ...img, isSelected: img.id === id ? !img.isSelected : img.isSelected })));
  const handleDownloadAll = () => toast({ title: "Downloading all..." });

  const canGenerate = uploadedImages.length > 0 && !isGenerating && selectedPlatforms.length > 0;

  return (
    <div className="h-screen flex flex-col bg-mesh">
      <Header credits={credits} onNavigate={setActiveView} activeView={activeView} />
      
      <div className="flex-1 flex overflow-hidden">
        {activeView === 'workbench' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Main Content Area - Centered Flow */}
            <main className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8">
                
                {/* Mode Toggle - Floating at top center */}
                <div className="flex justify-center animate-fade-in">
                  <LiquidModeToggle 
                    isAgentMode={isAgentMode} 
                    onToggle={setIsAgentMode}
                    isProcessing={isAIProcessing}
                  />
                </div>

                {/* Step 1: Upload */}
                <section className="animate-slide-up">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500",
                      currentStep >= 0 
                        ? "bg-gradient-primary text-primary-foreground shadow-primary-glow" 
                        : "bg-secondary text-foreground-muted"
                    )}>
                      1
                    </div>
                    <h2 className="text-lg font-display font-semibold text-foreground">Product Images</h2>
                    {uploadedImages.length > 0 && (
                      <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {uploadedImages.length} uploaded
                      </span>
                    )}
                  </div>
                  
                  <div className="glass rounded-2xl p-5">
                    <MultiImageUpload 
                      images={uploadedImages}
                      onImagesChange={setUploadedImages}
                    />
                  </div>
                </section>

                {/* Step 2: AI Analysis + Platform Selection */}
                {uploadedImages.length > 0 && (
                  <section className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500",
                        currentStep >= 1 
                          ? "bg-gradient-primary text-primary-foreground shadow-primary-glow" 
                          : "bg-secondary text-foreground-muted"
                      )}>
                        2
                      </div>
                      <h2 className="text-lg font-display font-semibold text-foreground">Analysis & Platforms</h2>
                      {isTypingAnalysis && (
                        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                      )}
                    </div>
                    
                    <div className="grid lg:grid-cols-2 gap-4">
                      {/* AI Analysis Card */}
                      <div className="glass rounded-2xl p-5 space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground-secondary">
                          <Wand2 className="h-4 w-4 text-primary" />
                          Product Analysis
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <AITypingField 
                            label="Category" 
                            value={analysisFields.category}
                            isTyping={isTypingAnalysis}
                            onEdit={(v) => setAnalysisFields(p => ({ ...p, category: v }))}
                          />
                          <AITypingField 
                            label="Material" 
                            value={analysisFields.material}
                            isTyping={isTypingAnalysis}
                            onEdit={(v) => setAnalysisFields(p => ({ ...p, material: v }))}
                          />
                        </div>
                        
                        <AITypingField 
                          label="Keywords" 
                          value={analysisFields.keywords}
                          isTyping={isTypingAnalysis}
                          onEdit={(v) => setAnalysisFields(p => ({ ...p, keywords: v }))}
                        />
                      </div>
                      
                      {/* Platform Selection Card */}
                      <div className="glass rounded-2xl p-5">
                        <PlatformSelector 
                          selectedPlatforms={selectedPlatforms}
                          onTogglePlatform={handleTogglePlatform}
                          isAgentMode={isAgentMode}
                        />
                      </div>
                    </div>
                  </section>
                )}

                {/* Step 3: Visual Style */}
                {selectedPlatforms.length > 0 && (
                  <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500",
                        currentStep >= 2 
                          ? "bg-gradient-primary text-primary-foreground shadow-primary-glow" 
                          : "bg-secondary text-foreground-muted"
                      )}>
                        3
                      </div>
                      <h2 className="text-lg font-display font-semibold text-foreground">Visual Style</h2>
                    </div>
                    
                    <div className="glass rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-4 text-sm font-medium text-foreground-secondary">
                        <Palette className="h-4 w-4 text-primary" />
                        AI Recommended: <span className="text-primary">{analysisFields.style}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
                        {visualStyles.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => setSelectedStyle(style.id)}
                            className={cn(
                              "flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-300 border",
                              selectedStyle === style.id
                                ? "bg-primary/10 border-primary/40 shadow-sm scale-[1.02]"
                                : "bg-card/50 border-border/30 hover:border-primary/30"
                            )}
                          >
                            <span className="text-xl">{style.emoji}</span>
                            <span className="text-[10px] font-medium text-foreground-secondary text-center leading-tight">
                              {style.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* Step 4: Copy Preview */}
                {copyPreviews.length > 0 && (
                  <section className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500",
                        currentStep >= 3 
                          ? "bg-gradient-primary text-primary-foreground shadow-primary-glow" 
                          : "bg-secondary text-foreground-muted"
                      )}>
                        4
                      </div>
                      <h2 className="text-lg font-display font-semibold text-foreground">Copy & Layout</h2>
                      <Type className="h-4 w-4 text-primary" />
                    </div>
                    
                    <div className="glass rounded-2xl p-5">
                      <CopyPreviewCards 
                        previews={copyPreviews}
                        onUpdatePreview={(id, updates) => setCopyPreviews(prev => 
                          prev.map(p => p.moduleId === id ? { ...p, ...updates } : p)
                        )}
                        onRegenerateCopy={generateCopyPreviews}
                        isGeneratingCopy={isGeneratingCopy}
                      />
                    </div>
                  </section>
                )}

                {/* Generate Button - Floating */}
                {canGenerate && (
                  <div className="sticky bottom-6 flex justify-center animate-slide-up">
                    <Button
                      variant="generate"
                      size="lg"
                      onClick={() => setShowConfirmModal(true)}
                      disabled={isGenerating}
                      className="px-8 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      {isGenerating ? (
                        <><Loader2 className="h-5 w-5 animate-spin" />Generating...</>
                      ) : (
                        <>
                          <Zap className="h-5 w-5" />
                          Generate {totalModules} Images
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Generated Results */}
                {generatedImages.length > 0 && (
                  <section className="animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <ImageIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h2 className="font-display font-semibold text-foreground">Generated Results</h2>
                          <span className="text-xs text-foreground-muted">{generatedImages.length} images</span>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm" onClick={handleDownloadAll} className="gap-2">
                        <Download className="h-4 w-4" />
                        Download All
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
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
                  </section>
                )}

                {/* Empty State */}
                {uploadedImages.length === 0 && generatedImages.length === 0 && !isGenerating && (
                  <div className="flex flex-col items-center justify-center text-center py-16 animate-fade-in">
                    <div className="relative mb-6">
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                        <Package className="h-16 w-16 text-primary" />
                      </div>
                      <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-xl -z-10" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-foreground mb-2">
                      Ready to create stunning visuals?
                    </h3>
                    <p className="text-sm text-foreground-muted max-w-md">
                      Upload product images and let AI generate professional e-commerce visuals automatically
                    </p>
                  </div>
                )}

                {/* Generating overlay */}
                {isGenerating && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-background/60 backdrop-blur-md">
                    <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-precision-lg max-w-sm w-full mx-4">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative p-3 rounded-xl bg-gradient-primary shadow-primary">
                          <Sparkles className="h-6 w-6 text-primary-foreground animate-pulse" />
                        </div>
                        <div>
                          <p className="font-display font-semibold text-foreground">Generating designs...</p>
                          <p className="text-sm text-foreground-muted">AI is crafting your visuals</p>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-xs text-foreground-muted mt-3 text-center">{Math.round(progress)}% complete</p>
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
              toast({ title: "Template loaded" }); 
            }} />
          </main>
        )}
      </div>

      <GenerationConfirmModal 
        isOpen={showConfirmModal} 
        onClose={() => setShowConfirmModal(false)} 
        onConfirm={handleGenerate} 
        summary={{ 
          style: selectedStyle || 'AI Auto', 
          modules: platforms
            .filter(p => selectedPlatforms.includes(p.id))
            .flatMap(p => p.modules.map(m => ({ id: m.id, name: m.name, credits: 1 }))),
          totalImages: totalModules, 
          estimatedTime: totalModules * 10, 
          totalCredits: totalModules, 
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

export default Workbench;
