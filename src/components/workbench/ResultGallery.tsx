import React from 'react';
import { Download, ZoomIn, Edit2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GeneratedImage {
  id: string;
  url: string;
  isSelected?: boolean;
}

interface ResultGalleryProps {
  images: GeneratedImage[];
  isGenerating: boolean;
  onDownload: (imageId: string) => void;
  onZoom: (imageId: string) => void;
  onSelect: (imageId: string) => void;
}

const SkeletonCard: React.FC<{ index: number }> = ({ index }) => (
  <div 
    className="relative aspect-square rounded-lg border border-border bg-card overflow-hidden"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    <div className="absolute inset-0 bg-secondary animate-pulse-soft" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-md bg-border/50 mx-auto animate-pulse-soft" />
        <div className="h-3 w-20 rounded bg-border/50 mx-auto animate-pulse-soft" />
      </div>
    </div>
  </div>
);

const ImageCard: React.FC<{
  image: GeneratedImage;
  onDownload: () => void;
  onZoom: () => void;
  onSelect: () => void;
}> = ({ image, onDownload, onZoom, onSelect }) => (
  <div 
    className="group relative aspect-square rounded-lg border border-border bg-card overflow-hidden 
               hover:border-border-hover hover:shadow-precision-md transition-all duration-200 animate-fade-in"
  >
    <img
      src={image.url}
      alt="Generated design"
      className="w-full h-full object-cover"
    />

    {/* Selection indicator */}
    {image.isSelected && (
      <div className="absolute top-3 left-3 p-1.5 rounded-md bg-primary text-primary-foreground animate-scale-in">
        <Check className="h-4 w-4" />
      </div>
    )}

    {/* Hover overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      {/* Action buttons */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            className="bg-background/90 hover:bg-background border-0"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              onZoom();
            }}
            className="bg-background/90 hover:bg-background border-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="text-background hover:text-background hover:bg-background/20"
        >
          <Edit2 className="h-4 w-4 mr-1" />
          Edit
        </Button>
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
}) => {
  if (isGenerating) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((index) => (
          <SkeletonCard key={index} index={index} />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onDownload={() => onDownload(image.id)}
          onZoom={() => onZoom(image.id)}
          onSelect={() => onSelect(image.id)}
        />
      ))}
    </div>
  );
};
