import React, { useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { ControlPanel } from '@/components/workbench/ControlPanel';
import { CanvasArea } from '@/components/workbench/CanvasArea';
import { GenerationMode } from '@/components/workbench/ModeSelector';
import { toast } from '@/hooks/use-toast';

// Sample generated images for demo
const sampleImages = [
  { 
    id: '1', 
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop', 
    isSelected: false 
  },
  { 
    id: '2', 
    url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=800&fit=crop', 
    isSelected: false 
  },
  { 
    id: '3', 
    url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&h=800&fit=crop', 
    isSelected: false 
  },
  { 
    id: '4', 
    url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop', 
    isSelected: false 
  },
];

const Workbench: React.FC = () => {
  // Upload state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // AI Analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    material: string;
    category: string;
    recommendedStyle: string;
    confidence: number;
  } | null>(null);
  
  // Text content
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [cta, setCta] = useState('');
  
  // Mode
  const [selectedMode, setSelectedMode] = useState<GenerationMode>('amazon');
  
  // Generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<Array<{
    id: string;
    url: string;
    isSelected?: boolean;
  }>>([]);
  
  // User
  const [credits] = useState(100);

  // Handlers
  const handleImageUpload = useCallback((file: File, previewUrl: string) => {
    setUploadedFile(file);
    setUploadedImage(previewUrl);
    setAnalysisResult(null);
    
    // Simulate AI analysis
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult({
        material: 'Glass, Frosted',
        category: 'Skincare',
        recommendedStyle: 'Minimal Organic',
        confidence: 0.94,
      });
      setIsAnalyzing(false);
    }, 2000);
  }, []);

  const handleClearImage = useCallback(() => {
    setUploadedImage(null);
    setUploadedFile(null);
    setAnalysisResult(null);
  }, []);

  const handleGenerate = useCallback(() => {
    if (!uploadedImage) return;
    
    setIsGenerating(true);
    setProgress(0);
    setGeneratedImages([]);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
    
    // Simulate generation complete
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setGeneratedImages(sampleImages);
      setIsGenerating(false);
      
      toast({
        title: "Generation complete!",
        description: "4 images have been generated successfully.",
      });
    }, 4000);
  }, [uploadedImage]);

  const handleDownload = useCallback((imageId: string) => {
    toast({
      title: "Downloading...",
      description: `Image ${imageId} is being downloaded.`,
    });
  }, []);

  const handleZoom = useCallback((imageId: string) => {
    toast({
      title: "Preview",
      description: "Full-size preview coming soon!",
    });
  }, []);

  const handleSelect = useCallback((imageId: string) => {
    setGeneratedImages(prev => 
      prev.map(img => ({
        ...img,
        isSelected: img.id === imageId ? !img.isSelected : img.isSelected,
      }))
    );
  }, []);

  const handleDownloadAll = useCallback(() => {
    toast({
      title: "Downloading all images...",
      description: "ZIP file is being prepared.",
    });
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <Header credits={credits} />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Control */}
        <aside className="w-80 flex-shrink-0 border-r border-border bg-card overflow-hidden hidden lg:block">
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
        
        {/* Right Panel - Canvas */}
        <main className="flex-1 overflow-hidden">
          <CanvasArea
            images={generatedImages}
            isGenerating={isGenerating}
            progress={Math.min(100, Math.round(progress))}
            onDownload={handleDownload}
            onZoom={handleZoom}
            onSelect={handleSelect}
            onDownloadAll={handleDownloadAll}
          />
        </main>
      </div>
      
      {/* Mobile Bottom Sheet (simplified) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <p className="text-sm text-center text-foreground-muted">
          For the best experience, please use a desktop browser
        </p>
      </div>
    </div>
  );
};

export default Workbench;
