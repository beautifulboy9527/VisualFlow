import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Plus, Image as ImageIcon, Camera, Layers, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  type: 'main' | 'angle' | 'detail' | 'lifestyle';
  label?: string;
}

interface MultiImageUploadProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

const imageTypes = [
  { type: 'main', label: 'Main', icon: Star, description: 'Primary product shot' },
  { type: 'angle', label: 'Angle', icon: Camera, description: 'Different angles' },
  { type: 'detail', label: 'Detail', icon: Layers, description: 'Close-up details' },
  { type: 'lifestyle', label: 'Lifestyle', icon: ImageIcon, description: 'In-use scenes' },
] as const;

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 8,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleFileSelect = useCallback((files: FileList, type: UploadedImage['type'] = 'main') => {
    const newImages: UploadedImage[] = [];
    
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      if (images.length + newImages.length >= maxImages) return;
      
      newImages.push({
        id: generateId(),
        file,
        previewUrl: URL.createObjectURL(file),
        type,
      });
    });
    
    onImagesChange([...images, ...newImages]);
  }, [images, maxImages, onImagesChange]);

  const handleRemove = (id: string) => {
    const image = images.find(img => img.id === id);
    if (image) {
      URL.revokeObjectURL(image.previewUrl);
    }
    onImagesChange(images.filter(img => img.id !== id));
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setActiveDropZone(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, type: UploadedImage['type'] = 'main') => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setActiveDropZone(null);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files, type);
    }
  }, [handleFileSelect]);

  const mainImage = images.find(img => img.type === 'main');
  const otherImages = images.filter(img => img.type !== 'main');

  return (
    <div className="space-y-4">
      {/* Main Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-2xl transition-all duration-300 overflow-hidden",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border/50 hover:border-primary/50",
          mainImage ? "p-2" : "p-6"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, 'main')}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files, 'main')}
        />

        {mainImage ? (
          <div className="relative group">
            <img
              src={mainImage.previewUrl}
              alt="Main product"
              className="w-full aspect-square object-cover rounded-xl"
            />
            {/* Liquid overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            
            {/* Remove button */}
            <button
              onClick={() => handleRemove(mainImage.id)}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-foreground/80 text-background hover:bg-destructive transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Type badge */}
            <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-primary/90 text-primary-foreground text-xs font-medium flex items-center gap-1.5">
              <Star className="h-3 w-3" />
              Main
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center gap-4 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {/* Animated icon */}
            <div className={cn(
              "relative p-4 rounded-2xl transition-all duration-300",
              isDragging ? "bg-primary/20 scale-110" : "bg-secondary"
            )}>
              <Upload className={cn(
                "h-8 w-8 transition-colors duration-300",
                isDragging ? "text-primary" : "text-foreground-muted"
              )} />
              {isDragging && (
                <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping" />
              )}
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {isDragging ? 'Drop your images here' : 'Drop product images or click to upload'}
              </p>
              <p className="text-xs text-foreground-muted mt-1">
                Main product shot • Multiple angles • Detail shots
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Secondary Images Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-foreground-muted">
              Additional Images ({otherImages.length}/{maxImages - 1})
            </p>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {otherImages.map((image) => (
              <div key={image.id} className="relative group aspect-square">
                <img
                  src={image.previewUrl}
                  alt={image.label || image.type}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemove(image.id)}
                  className="absolute top-1 right-1 p-1 rounded-md bg-foreground/80 text-background opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-foreground/70 text-background text-[10px] font-medium capitalize">
                  {image.type}
                </div>
              </div>
            ))}
            
            {/* Add more button */}
            {images.length < maxImages && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 flex items-center justify-center group"
              >
                <Plus className="h-5 w-5 text-foreground-muted group-hover:text-primary transition-colors" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick type selectors for next upload */}
      {images.length > 0 && images.length < maxImages && (
        <div className="flex flex-wrap gap-2">
          {imageTypes.slice(1).map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.multiple = true;
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) handleFileSelect(files, type);
                };
                input.click();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary text-xs text-foreground-muted hover:text-foreground transition-colors"
            >
              <Icon className="h-3 w-3" />
              + {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
