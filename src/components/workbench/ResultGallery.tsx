import React from 'react';
import { Download, ZoomIn, RefreshCw, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface GeneratedImage {
  id: string;
  url: string;
  isSelected?: boolean;
  label?: string;
}

interface ResultGalleryProps {
  images: GeneratedImage[];
  isGenerating: boolean;
  onDownload: (imageId: string) => void;
  onZoom: (imageId: string) => void;
  onSelect: (imageId: string) => void;
  onRegenerate?: (imageId: string) => void;
}

const SkeletonCard: React.FC<{ index: number }> = ({ index }) => (
  <div 
    className="relative aspect-square rounded-xl border border-border bg-card overflow-hidden"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-secondary to-secondary/50 animate-pulse-soft" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-border/50 mx-auto animate-pulse-soft" />
        <div className="h-3 w-20 rounded-full bg-border/50 mx-auto animate-pulse-soft" />
      </div>
    </div>
  </div>
);

const ImageCard: React.FC<{
  image: GeneratedImage;
  index: number;
  onDownload: () => void;
  onZoom: () => void;
  onSelect: () => void;
  onRegenerate?: () => void;
  onCopy: () => void;
}> = ({ image, index, onDownload, onZoom, onSelect, onRegenerate, onCopy }) => (
  <div 
    className="group relative aspect-square rounded-xl border border-border bg-card overflow-hidden 
               hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
  >
    <img
      src={image.url}
      alt={image.label || `Generated design ${index + 1}`}
      className="w-full h-full object-cover"
    />

    {/* Label Badge */}
    <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-card/90 backdrop-blur-sm text-xs font-medium text-foreground">
      {image.label || `Design ${index + 1}`}
    </div>

    {/* Selection indicator */}
    {image.isSelected && (
      <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-primary text-primary-foreground animate-scale-in shadow-primary">
        <Check className="h-4 w-4" />
      </div>
    )}

    {/* Hover overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      {/* Action buttons */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1.5">
            <Button
              variant="secondary"
              size="icon-sm"
              onClick={(e) => { e.stopPropagation(); onDownload(); }}
              className="bg-card/95 hover:bg-card border-0 shadow-sm"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon-sm"
              onClick={(e) => { e.stopPropagation(); onCopy(); }}
              className="bg-card/95 hover:bg-card border-0 shadow-sm"
              title="Copy"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon-sm"
              onClick={(e) => { e.stopPropagation(); onZoom(); }}
              className="bg-card/95 hover:bg-card border-0 shadow-sm"
              title="Preview"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          {onRegenerate && (
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onRegenerate(); }}
              className="bg-primary/90 hover:bg-primary text-primary-foreground border-0 shadow-sm gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerate
            </Button>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const ResultGallery: React.FC<ResultGalleryProps> = ({
  images,
  isGenerating,
  onDownload,
  onZoom,
  onSelect,
  onRegenerate,
}) => {
  const handleCopy = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      toast({ title: "Copied!", description: "Image copied to clipboard" });
    } catch {
      toast({ title: "Copied!", description: "Image URL copied" });
    }
  };

  if (isGenerating) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((index) => (
          <SkeletonCard key={index} index={index} />
        ))}
      </div>
    );
  }

  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((image, index) => (
        <ImageCard
          key={image.id}
          image={image}
          index={index}
          onDownload={() => onDownload(image.id)}
          onZoom={() => onZoom(image.id)}
          onSelect={() => onSelect(image.id)}
          onRegenerate={onRegenerate ? () => onRegenerate(image.id) : undefined}
          onCopy={() => handleCopy(image.url)}
        />
      ))}
    </div>
  );
};