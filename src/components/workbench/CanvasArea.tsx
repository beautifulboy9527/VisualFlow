import React from 'react';
import { ResultGallery } from './ResultGallery';
import { Layers, Image as ImageIcon, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GeneratedImage {
  id: string;
  url: string;
  isSelected?: boolean;
}

interface CanvasAreaProps {
  images: GeneratedImage[];
  isGenerating: boolean;
  progress: number; // 0-100
  onDownload: (imageId: string) => void;
  onZoom: (imageId: string) => void;
  onSelect: (imageId: string) => void;
  onDownloadAll: () => void;
}

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in">
    <div className="p-4 rounded-lg bg-secondary/80 mb-4">
      <Layers className="h-12 w-12 text-foreground-muted" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">
      Your designs will appear here
    </h3>
    <p className="text-sm text-foreground-muted max-w-sm">
      Upload a product image, add your text, and click Generate to create stunning marketing visuals
    </p>
  </div>
);

const GeneratingState: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-background/50 backdrop-blur-sm animate-fade-in">
    <div className="bg-card p-8 rounded-lg border border-border shadow-precision-lg max-w-sm w-full mx-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-md bg-primary-light">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        </div>
        <div>
          <p className="font-medium text-foreground">Generating designs...</p>
          <p className="text-sm text-foreground-muted">This usually takes 15-20 seconds</p>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-foreground-muted mt-2 text-center">{progress}%</p>
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
}) => {
  const hasImages = images.length > 0;

  return (
    <div className="relative h-full bg-background-secondary bg-dot-pattern">
      {/* Header */}
      {hasImages && (
        <div className="sticky top-0 z-10 bg-background-secondary/80 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-foreground-muted" />
            <h2 className="font-semibold text-foreground">Generated Results</h2>
            <span className="text-sm text-foreground-muted">({images.length} images)</span>
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={onDownloadAll}
          >
            <Download className="h-4 w-4 mr-1.5" />
            Download All
          </Button>
        </div>
      )}

      {/* Content */}
      <div className={`p-6 ${hasImages ? '' : 'h-full flex items-center justify-center'}`}>
        {!hasImages && !isGenerating && <EmptyState />}
        
        {hasImages && (
          <ResultGallery
            images={images}
            isGenerating={false}
            onDownload={onDownload}
            onZoom={onZoom}
            onSelect={onSelect}
          />
        )}

        {isGenerating && !hasImages && (
          <ResultGallery
            images={[]}
            isGenerating={true}
            onDownload={onDownload}
            onZoom={onZoom}
            onSelect={onSelect}
          />
        )}
      </div>

      {/* Generating overlay */}
      {isGenerating && <GeneratingState progress={progress} />}
    </div>
  );
};
