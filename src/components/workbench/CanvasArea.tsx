import React from 'react';
import { ResultGallery } from './ResultGallery';
import { Layers, Image as ImageIcon, Download, Sparkles, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GeneratedImage {
  id: string;
  url: string;
  isSelected?: boolean;
  label?: string;
}

interface CanvasAreaProps {
  images: GeneratedImage[];
  isGenerating: boolean;
  progress: number;
  onDownload: (imageId: string) => void;
  onZoom: (imageId: string) => void;
  onSelect: (imageId: string) => void;
  onDownloadAll: () => void;
  onRegenerate?: (imageId: string) => void;
}

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in">
    <div className="relative mb-6">
      <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
        <Package className="h-16 w-16 text-primary" />
      </div>
      <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-xl -z-10" />
    </div>
    <h3 className="text-xl font-display font-bold text-foreground mb-2">
      Ready to start a visual revolution?
    </h3>
    <p className="text-sm text-foreground-muted max-w-md">
      Upload product images and brand logo, AI will deeply analyze your brand DNA and generate master-level e-commerce KV visual solutions
    </p>
  </div>
);

const GeneratingState: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-background/60 backdrop-blur-md animate-fade-in">
    <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-precision-lg max-w-sm w-full mx-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative p-3 rounded-xl bg-gradient-primary shadow-primary">
          <Sparkles className="h-6 w-6 text-primary-foreground animate-pulse" />
          <div className="absolute inset-0 bg-gradient-primary rounded-xl blur-lg opacity-50" />
        </div>
        <div>
          <p className="font-display font-semibold text-foreground">Generating designs...</p>
          <p className="text-sm text-foreground-muted">AI is crafting your visuals</p>
        </div>
      </div>
      
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-primary rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-foreground-muted mt-3 text-center">{progress}% complete</p>
    </div>
  </div>
);

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  images,
  isGenerating,
  progress,
  onDownload,
  onZoom,
  onSelect,
  onDownloadAll,
  onRegenerate,
}) => {
  const hasImages = images.length > 0;

  return (
    <div className="relative h-full bg-grid-pattern">
      {hasImages && (
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ImageIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-foreground">Generated Results</h2>
              <span className="text-xs text-foreground-muted">{images.length} images</span>
            </div>
          </div>
          
          <Button variant="secondary" size="sm" onClick={onDownloadAll} className="gap-2">
            <Download className="h-4 w-4" />
            Download All
          </Button>
        </div>
      )}

      <div className={`p-6 ${hasImages ? '' : 'h-full flex items-center justify-center'}`}>
        {!hasImages && !isGenerating && <EmptyState />}
        
        {hasImages && (
          <ResultGallery
            images={images}
            isGenerating={false}
            onDownload={onDownload}
            onZoom={onZoom}
            onSelect={onSelect}
            onRegenerate={onRegenerate}
          />
        )}

        {isGenerating && !hasImages && (
          <ResultGallery images={[]} isGenerating={true} onDownload={onDownload} onZoom={onZoom} onSelect={onSelect} />
        )}
      </div>

      {isGenerating && <GeneratingState progress={progress} />}
    </div>
  );
};
