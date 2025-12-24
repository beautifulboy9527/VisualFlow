import React, { useState } from 'react';
import { 
  Download, 
  ZoomIn, 
  RefreshCw, 
  Copy, 
  Pencil, 
  Check,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

interface EnhancedResultCardProps {
  id: string;
  url: string;
  label?: string;
  isSelected?: boolean;
  onDownload: (id: string) => void;
  onZoom: (id: string) => void;
  onRegenerate: (id: string) => void;
  onSelect: (id: string) => void;
  onCopy?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const EnhancedResultCard: React.FC<EnhancedResultCardProps> = ({
  id,
  url,
  label,
  isSelected,
  onDownload,
  onZoom,
  onRegenerate,
  onSelect,
  onCopy,
  onEdit,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleCopy = async () => {
    setIsCopying(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      toast({ title: "Copied to clipboard" });
      onCopy?.(id);
    } catch (error) {
      // Fallback: copy URL
      await navigator.clipboard.writeText(url);
      toast({ title: "Image URL copied" });
    } finally {
      setIsCopying(false);
    }
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    onRegenerate(id);
    // Reset after animation
    setTimeout(() => setIsRegenerating(false), 2000);
  };

  return (
    <div
      className={cn(
        'group relative rounded-xl overflow-hidden border transition-all duration-300',
        'bg-card hover:shadow-precision-lg',
        isSelected 
          ? 'border-primary ring-2 ring-primary/20' 
          : 'border-border/50 hover:border-primary/30'
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Image */}
      <div className="relative aspect-square bg-secondary">
        <img
          src={url}
          alt={label || 'Generated image'}
          className={cn(
            'w-full h-full object-cover transition-transform duration-300',
            isHovering && 'scale-105'
          )}
        />
        
        {/* Overlay on hover */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
        )} />

        {/* Label Badge */}
        {label && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-card/90 backdrop-blur-sm border border-border/50">
            <span className="text-xs font-medium text-foreground">{label}</span>
          </div>
        )}

        {/* Selection indicator */}
        <button
          onClick={() => onSelect(id)}
          className={cn(
            'absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
            isSelected
              ? 'bg-primary border-primary'
              : 'bg-card/80 border-border/80 hover:border-primary/50'
          )}
        >
          {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
        </button>

        {/* Quick Actions (visible on hover) */}
        <div className={cn(
          'absolute bottom-3 left-3 right-3 flex items-center justify-between',
          'opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0'
        )}>
          {/* Primary Actions */}
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 bg-card/90 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground"
              onClick={() => onZoom(id)}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 bg-card/90 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground"
              onClick={() => onDownload(id)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className={cn(
                'h-9 w-9 bg-card/90 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground',
                isRegenerating && 'animate-spin'
              )}
              onClick={handleRegenerate}
              disabled={isRegenerating}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="h-9 w-9 bg-card/90 backdrop-blur-sm"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleCopy} disabled={isCopying}>
                <Copy className="h-4 w-4 mr-2" />
                {isCopying ? 'Copying...' : 'Copy Image'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(id)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Image
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDownload(id)}>
                <Download className="h-4 w-4 mr-2" />
                Download HD
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
