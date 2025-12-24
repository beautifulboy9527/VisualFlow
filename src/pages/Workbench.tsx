import React, { useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { UploadZone } from '@/components/workbench/UploadZone';
import { EditableAIAnalysis } from '@/components/workbench/EditableAIAnalysis';
import { OutputModuleSelector, modules } from '@/components/workbench/OutputModuleSelector';
import { CopyPreviewCards, CopyPreview } from '@/components/workbench/CopyPreviewCards';
import { CustomSizeInput, presets } from '@/components/workbench/CustomSizeInput';
import { GenerationConfirmModal } from '@/components/workbench/GenerationConfirmModal';
import { CelebrationOverlay } from '@/components/workbench/CelebrationOverlay';
import { EnhancedResultCard } from '@/components/workbench/EnhancedResultCard';
import { HistoryPanel } from '@/components/workbench/HistoryPanel';
import { TemplatesPanel } from '@/components/workbench/TemplatesPanel';
import { ImagePreviewModal } from '@/components/workbench/ImagePreviewModal';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Zap, Loader2, Download, Sparkles, Package, Image as ImageIcon } from 'lucide-react';

const sampleImages = [
  { id: '1', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop', label: 'Main KV' },
  { id: '2', url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=800&fit=crop', label: 'Banner' },
  { id: '3', url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&h=800&fit=crop', label: 'Social' },
  { id: '4', url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop', label: 'Detail' },
];

const Workbench: React.FC = () => {
  const [activeView, setActiveView] = useState<'workbench' | 'history' | 'templates'>('workbench');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ material: string; category: string; recommendedStyle: string; confidence: number } | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>(['main_kv', 'banner']);
  const [copyPreviews, setCopyPreviews] = useState<CopyPreview[]>([]);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [outputWidth, setOutputWidth] = useState(1500);
  const [outputHeight, setOutputHeight] = useState(1500);
  const [selectedPreset, setSelectedPreset] = useState<string | null>('1:1');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<Array<{ id: string; url: string; isSelected?: boolean; label?: string }>>([]);
  const [credits, setCredits] = useState(100);
  const [previewImage, setPreviewImage] = useState<{ url: string; id: string; index: number } | null>(null);

  const handleImageUpload = useCallback((file: File, previewUrl: string) => {
    setUploadedImage(previewUrl);
    setAnalysisResult(null);
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult({ material: 'Glass, Frosted', category: 'Skincare', recommendedStyle: 'Minimal Organic', confidence: 0.94 });
      setIsAnalyzing(false);
      generateCopyPreviews();
    }, 2000);
  }, []);

  const generateCopyPreviews = () => {
    setIsGeneratingCopy(true);
    setTimeout(() => {
      const previews = selectedModules.map(moduleId => {
        const mod = modules.find(m => m.id === moduleId);
        return {
          moduleId,
          moduleName: mod?.name || moduleId,
          title: 'Premium Skincare Solution',
          subtitle: 'Hydrate. Nourish. Glow.',
          cta: 'Shop Now',
          font: 'inter',
          fontSize: 'medium' as const,
          layout: 'centered' as const,
        };
      });
      setCopyPreviews(previews);
      setIsGeneratingCopy(false);
    }, 1500);
  };

  const handleToggleModule = (moduleId: string) => {
    setSelectedModules(prev => 
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  const handleUpdateAnalysis = (updates: Partial<{ material: string; category: string; recommendedStyle: string }>) => {
    if (analysisResult) {
      setAnalysisResult({ ...analysisResult, ...updates });
    }
  };

  const handlePresetSelect = (preset: { id: string; width: number; height: number }) => {
    setSelectedPreset(preset.id);
    setOutputWidth(preset.width);
    setOutputHeight(preset.height);
  };

  const totalCredits = modules.filter(m => selectedModules.includes(m.id)).reduce((sum, m) => sum + m.credits, 0);

  const handleGenerate = useCallback(() => {
    setShowConfirmModal(false);
    setIsGenerating(true);
    setProgress(0);
    setGeneratedImages([]);
    setCredits(prev => prev - totalCredits);
    toast({ title: `${totalCredits} credits used`, description: `${credits - totalCredits} credits remaining` });
    
    const interval = setInterval(() => setProgress(prev => prev >= 100 ? 100 : prev + Math.random() * 15), 500);
    
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setGeneratedImages(sampleImages.slice(0, selectedModules.length));
      setIsGenerating(false);
      setShowCelebration(true);
    }, 4000);
  }, [totalCredits, credits, selectedModules.length]);

  const handleDownload = (id: string) => toast({ title: "Downloading...", description: "Image download started" });
  const handleZoom = (id: string) => {
    const index = generatedImages.findIndex(img => img.id === id);
    if (index !== -1) setPreviewImage({ url: generatedImages[index].url, id, index });
  };
  const handleRegenerate = (id: string) => {
    if (credits < 1) { toast({ title: "Insufficient credits", variant: "destructive" }); return; }
    setCredits(prev => prev - 1);
    toast({ title: "Regenerating...", description: "1 credit used" });
  };
  const handleSelect = (id: string) => setGeneratedImages(prev => prev.map(img => ({ ...img, isSelected: img.id === id ? !img.isSelected : img.isSelected })));
  const handleDownloadAll = () => toast({ title: "Downloading all images...", description: "ZIP file is being prepared." });

  const canGenerate = uploadedImage && !isGenerating && !isAnalyzing && selectedModules.length > 0;

  return (
    <div className="h-screen flex flex-col bg-mesh">
      <Header credits={credits} onNavigate={setActiveView} activeView={activeView} />
      
      <div className="flex-1 flex overflow-hidden">
        {activeView === 'workbench' && (
          <>
            {/* Left Panel */}
            <aside className="w-[380px] flex-shrink-0 border-r border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hidden lg:flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <section>
                  <h2 className="text-sm font-semibold text-foreground mb-3">Product Image</h2>
                  <UploadZone uploadedImage={uploadedImage} onImageUpload={handleImageUpload} onClear={() => { setUploadedImage(null); setAnalysisResult(null); setCopyPreviews([]); }} />
                  {uploadedImage && <EditableAIAnalysis analysis={analysisResult} isAnalyzing={isAnalyzing} onUpdateAnalysis={handleUpdateAnalysis} />}
                </section>

                {analysisResult && (
                  <>
                    <section>
                      <OutputModuleSelector selectedModules={selectedModules} onToggleModule={handleToggleModule} />
                    </section>
                    <section>
                      <CustomSizeInput width={outputWidth} height={outputHeight} onWidthChange={setOutputWidth} onHeightChange={setOutputHeight} selectedPreset={selectedPreset} onPresetSelect={handlePresetSelect} />
                    </section>
                    <section>
                      <CopyPreviewCards previews={copyPreviews} onUpdatePreview={(id, updates) => setCopyPreviews(prev => prev.map(p => p.moduleId === id ? { ...p, ...updates } : p))} onRegenerateCopy={generateCopyPreviews} isGeneratingCopy={isGeneratingCopy} />
                    </section>
                  </>
                )}
              </div>

              <div className="sticky bottom-0 p-4 bg-card border-t border-border">
                <Button variant="generate" size="lg" className="w-full" onClick={() => setShowConfirmModal(true)} disabled={!canGenerate}>
                  {isGenerating ? <><Loader2 className="h-5 w-5 animate-spin" />Generating...</> : <><Zap className="h-5 w-5" />Generate ({totalCredits} Credits)</>}
                </Button>
                <p className="text-center text-xs text-foreground-muted mt-2">{credits} credits remaining</p>
              </div>
            </aside>

            {/* Right Panel - Canvas */}
            <main className="flex-1 overflow-hidden bg-grid-pattern">
              {generatedImages.length > 0 && (
                <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10"><ImageIcon className="h-5 w-5 text-primary" /></div>
                    <div><h2 className="font-display font-semibold text-foreground">Generated Results</h2><span className="text-xs text-foreground-muted">{generatedImages.length} images</span></div>
                  </div>
                  <Button variant="secondary" size="sm" onClick={handleDownloadAll} className="gap-2"><Download className="h-4 w-4" />Download All</Button>
                </div>
              )}
              
              <div className={`p-6 ${generatedImages.length === 0 ? 'h-full flex items-center justify-center' : ''}`}>
                {generatedImages.length === 0 && !isGenerating && (
                  <div className="flex flex-col items-center justify-center text-center animate-fade-in">
                    <div className="relative mb-6"><div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"><Package className="h-16 w-16 text-primary" /></div></div>
                    <h3 className="text-xl font-display font-bold text-foreground mb-2">Ready to create stunning visuals?</h3>
                    <p className="text-sm text-foreground-muted max-w-md">Upload product images, select output modules, and let AI generate professional e-commerce visuals</p>
                  </div>
                )}
                
                {generatedImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {generatedImages.map(img => <EnhancedResultCard key={img.id} id={img.id} url={img.url} label={img.label} isSelected={img.isSelected} onDownload={handleDownload} onZoom={handleZoom} onRegenerate={handleRegenerate} onSelect={handleSelect} />)}
                  </div>
                )}
              </div>

              {isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-background/60 backdrop-blur-md">
                  <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-precision-lg max-w-sm w-full mx-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative p-3 rounded-xl bg-gradient-primary shadow-primary"><Sparkles className="h-6 w-6 text-primary-foreground animate-pulse" /></div>
                      <div><p className="font-display font-semibold text-foreground">Generating designs...</p><p className="text-sm text-foreground-muted">AI is crafting your visuals</p></div>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden"><div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
                    <p className="text-xs text-foreground-muted mt-3 text-center">{Math.round(progress)}% complete</p>
                  </div>
                </div>
              )}
            </main>
          </>
        )}

        {activeView === 'history' && <main className="flex-1 overflow-hidden bg-card/30"><HistoryPanel historyItems={[]} onViewItem={() => {}} onDownloadItem={() => {}} onDeleteItem={() => {}} searchQuery="" onSearchChange={() => {}} /></main>}
        {activeView === 'templates' && <main className="flex-1 overflow-hidden bg-card/30"><TemplatesPanel onSelectTemplate={() => { setActiveView('workbench'); toast({ title: "Template loaded" }); }} /></main>}
      </div>

      <GenerationConfirmModal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} onConfirm={handleGenerate} summary={{ style: analysisResult?.recommendedStyle || 'AI Auto', modules: modules.filter(m => selectedModules.includes(m.id)).map(m => ({ id: m.id, name: m.name, credits: m.credits })), totalImages: selectedModules.length, estimatedTime: selectedModules.length * 10, totalCredits, currentCredits: credits }} />
      <CelebrationOverlay isVisible={showCelebration} onClose={() => setShowCelebration(false)} imageCount={generatedImages.length} />
      {previewImage && <ImagePreviewModal isOpen={!!previewImage} onClose={() => setPreviewImage(null)} imageUrl={previewImage.url} imageId={previewImage.id} onDownload={handleDownload} onRegenerate={handleRegenerate} onPrevious={() => {}} onNext={() => {}} hasPrevious={previewImage.index > 0} hasNext={previewImage.index < generatedImages.length - 1} currentIndex={previewImage.index} totalImages={generatedImages.length} />}
    </div>
  );
};

export default Workbench;
