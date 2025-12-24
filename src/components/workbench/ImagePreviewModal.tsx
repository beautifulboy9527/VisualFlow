import React from 'react';
import { X, Download, Copy, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageId: string;
  onDownload: (imageId: string) => void;
  onRegenerate: (imageId: string) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalImages?: number;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  imageId,
  onDownload,
  onRegenerate,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  currentIndex = 0,
  totalImages = 0,
}) => {
  const handleCopy = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      toast({
        title: "Copied!",
        description: "Image copied to clipboard",
      });
    } catch (error) {
      // Fallback: copy URL
      await navigator.clipboard.writeText(imageUrl);
      toast({
        title: "Copied!",
        description: "Image URL copied to clipboard",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 gap-0 bg-background/95 backdrop-blur-xl border-border/50">
        <DialogTitle className="sr-only">Image Preview</DialogTitle>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-4">
            <span className="text-sm text-foreground-muted">
              {currentIndex + 1} / {totalImages}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-2">
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDownload(imageId)} className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onRegenerate(imageId)} className="gap-2 text-primary">
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Image Container */}
        <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden">
          {/* Navigation arrows */}
          {hasPrevious && (
            <button
              onClick={onPrevious}
              className="absolute left-4 p-3 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card transition-colors z-10"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          
          {hasNext && (
            <button
              onClick={onNext}
              className="absolute right-4 p-3 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card transition-colors z-10"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Image */}
          <img
            src={imageUrl}
            alt="Generated design preview"
            className="max-w-full max-h-full object-contain rounded-lg shadow-precision-lg animate-scale-in"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};