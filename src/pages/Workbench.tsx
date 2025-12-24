import React, { useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { ControlPanel } from '@/components/workbench/ControlPanel';
import { CanvasArea } from '@/components/workbench/CanvasArea';
import { HistoryPanel } from '@/components/workbench/HistoryPanel';
import { TemplatesPanel } from '@/components/workbench/TemplatesPanel';
import { ImagePreviewModal } from '@/components/workbench/ImagePreviewModal';
import { GenerationMode } from '@/components/workbench/ModeSelector';
import { toast } from '@/hooks/use-toast';

const sampleImages = [
  { id: '1', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop', isSelected: false, label: 'Main KV' },
  { id: '2', url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=800&fit=crop', isSelected: false, label: 'Lifestyle' },
  { id: '3', url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&h=800&fit=crop', isSelected: false, label: 'Detail 01' },
  { id: '4', url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop', isSelected: false, label: 'Detail 02' },
];

const Workbench: React.FC = () => {
  const [activeView, setActiveView] = useState<'workbench' | 'history' | 'templates'>('workbench');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ material: string; category: string; recommendedStyle: string; confidence: number; } | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [cta, setCta] = useState('');
  const [selectedMode, setSelectedMode] = useState<GenerationMode>('amazon');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<Array<{ id: string; url: string; isSelected?: boolean; label?: string }>>([]);
  const [credits, setCredits] = useState(100);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [previewImage, setPreviewImage] = useState<{ url: string; id: string; index: number } | null>(null);

  const historyItems = generatedImages.length > 0 ? [{
    id: '1',
    images: generatedImages.map(img => img.url),
    createdAt: new Date(),
    prompt: title || 'Generated design',
    creditsUsed: 4,
  }] : [];

  const handleImageUpload = useCallback((file: File, previewUrl: string) => {
    setUploadedImage(previewUrl);
    setAnalysisResult(null);
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult({ material: 'Glass, Frosted', category: 'Skincare', recommendedStyle: 'Minimal Organic', confidence: 0.94 });
      setIsAnalyzing(false);
    }, 2000);
  }, []);

  const handleClearImage = useCallback(() => {
    setUploadedImage(null);
    setAnalysisResult(null);
  }, []);

  const handleGenerate = useCallback(() => {
    if (!uploadedImage) return;
    setIsGenerating(true);
    setProgress(0);
    setGeneratedImages([]);
    const creditsToUse = 4;
    setCredits(prev => prev - creditsToUse);
    toast({ title: `${creditsToUse} credits used`, description: `${credits - creditsToUse} credits remaining` });
    
    const interval = setInterval(() => {
      setProgress(prev => prev >= 100 ? 100 : prev + Math.random() * 15);
    }, 500);
    
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setGeneratedImages(sampleImages);
      setIsGenerating(false);
      toast({ title: "Generation complete!", description: "4 images generated successfully." });
    }, 4000);
  }, [uploadedImage, credits]);

  const handleDownload = useCallback((imageId: string) => {
    const image = generatedImages.find(img => img.id === imageId);
    if (image) {
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `pixmiller-${imageId}.jpg`;
      link.click();
      toast({ title: "Downloading...", description: "Image download started" });
    }
  }, [generatedImages]);

  const handleZoom = useCallback((imageId: string) => {
    const index = generatedImages.findIndex(img => img.id === imageId);
    if (index !== -1) {
      setPreviewImage({ url: generatedImages[index].url, id: imageId, index });
    }
  }, [generatedImages]);

  const handleRegenerate = useCallback((imageId: string) => {
    if (credits < 1) {
      toast({ title: "Insufficient credits", variant: "destructive" });
      return;
    }
    setCredits(prev => prev - 1);
    toast({ title: "Regenerating...", description: "1 credit used" });
  }, [credits]);

  const handleSelect = useCallback((imageId: string) => {
    setGeneratedImages(prev => prev.map(img => ({ ...img, isSelected: img.id === imageId ? !img.isSelected : img.isSelected })));
  }, []);

  const handleDownloadAll = useCallback(() => {
    toast({ title: "Downloading all images...", description: "ZIP file is being prepared." });
  }, []);

  const handlePreviewNav = (direction: 'prev' | 'next') => {
    if (!previewImage) return;
    const newIndex = direction === 'prev' ? previewImage.index - 1 : previewImage.index + 1;
    if (newIndex >= 0 && newIndex < generatedImages.length) {
      setPreviewImage({ url: generatedImages[newIndex].url, id: generatedImages[newIndex].id, index: newIndex });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-mesh">
      <Header credits={credits} onNavigate={setActiveView} activeView={activeView} />
      
      <div className="flex-1 flex overflow-hidden">
        {activeView === 'workbench' && (
          <>
            <aside className="w-[340px] flex-shrink-0 border-r border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hidden lg:block">
              <ControlPanel
                uploadedImage={uploadedImage}
                onImageUpload={handleImageUpload}
                onClearImage={handleClearImage}
                analysisResult={analysisResult}
                isAnalyzing={isAnalyzing}
                title={title}
                subtitle={subtitle}
                cta={cta}
                onTitleChange={setTitle}
                onSubtitleChange={setSubtitle}
                onCtaChange={setCta}
                selectedMode={selectedMode}
                onModeChange={setSelectedMode}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                credits={credits}
              />
            </aside>
            <main className="flex-1 overflow-hidden">
              <CanvasArea
                images={generatedImages}
                isGenerating={isGenerating}
                progress={Math.min(100, Math.round(progress))}
                onDownload={handleDownload}
                onZoom={handleZoom}
                onSelect={handleSelect}
                onDownloadAll={handleDownloadAll}
                onRegenerate={handleRegenerate}
              />
            </main>
          </>
        )}

        {activeView === 'history' && (
          <main className="flex-1 overflow-hidden bg-card/30">
            <HistoryPanel
              historyItems={historyItems}
              onViewItem={(item) => setPreviewImage({ url: item.images[0], id: item.id, index: 0 })}
              onDownloadItem={() => toast({ title: "Downloading..." })}
              onDeleteItem={() => toast({ title: "Deleted" })}
              searchQuery={historySearchQuery}
              onSearchChange={setHistorySearchQuery}
            />
          </main>
        )}

        {activeView === 'templates' && (
          <main className="flex-1 overflow-hidden bg-card/30">
            <TemplatesPanel onSelectTemplate={() => { setActiveView('workbench'); toast({ title: "Template loaded" }); }} />
          </main>
        )}
      </div>

      {previewImage && (
        <ImagePreviewModal
          isOpen={!!previewImage}
          onClose={() => setPreviewImage(null)}
          imageUrl={previewImage.url}
          imageId={previewImage.id}
          onDownload={handleDownload}
          onRegenerate={handleRegenerate}
          onPrevious={() => handlePreviewNav('prev')}
          onNext={() => handlePreviewNav('next')}
          hasPrevious={previewImage.index > 0}
          hasNext={previewImage.index < generatedImages.length - 1}
          currentIndex={previewImage.index}
          totalImages={generatedImages.length}
        />
      )}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <p className="text-sm text-center text-foreground-muted">For best experience, use desktop</p>
      </div>
    </div>
  );
};

export default Workbench;