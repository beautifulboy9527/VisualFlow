import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Plus, Image as ImageIcon, Camera, Layers, Star, User, Package, ChevronDown, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { classifyImages } from '@/lib/imageClassifier';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type ImageType = 'main' | 'angle' | 'detail' | 'lifestyle' | 'model' | 'packaging';

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  type: ImageType;
  label?: string;
}

const IMAGE_TYPE_CONFIG: { type: ImageType; labelKey: string; icon: React.ElementType }[] = [
  { type: 'main', labelKey: 'upload.mainImage', icon: Star },
  { type: 'angle', labelKey: 'upload.angleImage', icon: Camera },
  { type: 'detail', labelKey: 'upload.detailImage', icon: Layers },
  { type: 'lifestyle', labelKey: 'upload.lifestyleImage', icon: ImageIcon },
  { type: 'model', labelKey: 'upload.modelImage', icon: User },
  { type: 'packaging', labelKey: 'upload.packagingImage', icon: Package },
];

// Smart sequential assignment order (after main is taken)
const AUTO_ASSIGN_ORDER: ImageType[] = ['angle', 'detail', 'lifestyle', 'model', 'packaging'];

interface MultiImageUploadProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 8,
}) => {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  /** Find the next best type to assign based on what's already used */
  const getNextAutoType = useCallback((currentImages: UploadedImage[]): ImageType => {
    const usedTypes = new Set(currentImages.map(img => img.type));
    for (const type of AUTO_ASSIGN_ORDER) {
      if (!usedTypes.has(type)) return type;
    }
    // All unique types used, default to angle (allows duplicates)
    return 'angle';
  }, []);

  const handleFileSelect = useCallback(async (files: FileList, forceType?: ImageType) => {
    const validFiles: File[] = [];
    
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      if (images.length + validFiles.length >= maxImages) return;
      validFiles.push(file);
    });

    if (validFiles.length === 0) return;

    // Create images with temporary types first (show immediately)
    const newImages: UploadedImage[] = validFiles.map((file, i) => {
      let tempType: ImageType;
      if (forceType) {
        tempType = forceType;
      } else if (!images.some(img => img.type === 'main') && i === 0) {
        tempType = 'main';
      } else {
        tempType = getNextAutoType([...images, ...validFiles.slice(0, i).map((_, j) => ({ type: 'main' as ImageType, id: '', file: validFiles[j], previewUrl: '' }))]);
      }
      return {
        id: generateId(),
        file,
        previewUrl: URL.createObjectURL(file),
        type: tempType,
      };
    });

    const allImages = [...images, ...newImages];
    onImagesChange(allImages);

    // If forceType was specified, skip AI classification
    if (forceType) return;

    // Run AI classification in background
    setIsClassifying(true);
    try {
      const allFiles = allImages.map(img => img.file);
      const categories = await classifyImages(allFiles);
      
      // Update all images with AI-classified types
      const updated = allImages.map((img, i) => ({
        ...img,
        type: categories[i] || img.type,
      }));
      onImagesChange(updated);
    } catch (err) {
      console.error('AI classification failed, keeping defaults:', err);
    } finally {
      setIsClassifying(false);
    }
  }, [images, maxImages, onImagesChange, getNextAutoType]);

  const handleRemove = (id: string) => {
    const image = images.find(img => img.id === id);
    if (image) URL.revokeObjectURL(image.previewUrl);
    onImagesChange(images.filter(img => img.id !== id));
  };

  const handleChangeType = (id: string, newType: ImageType) => {
    onImagesChange(images.map(img => img.id === id ? { ...img, type: newType } : img));
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
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileSelect(files);
  }, [handleFileSelect]);

  const mainImage = images.find(img => img.type === 'main');
  const otherImages = images.filter(img => img.type !== 'main');

  const TypeBadge: React.FC<{ image: UploadedImage; size?: 'sm' | 'md' }> = ({ image, size = 'sm' }) => {
    const config = IMAGE_TYPE_CONFIG.find(c => c.type === image.type);
    const Icon = config?.icon || ImageIcon;
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={cn(
            "flex items-center gap-1 rounded bg-foreground/70 text-background font-medium cursor-pointer hover:bg-foreground/90 transition-colors",
            size === 'sm' ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs"
          )}>
            <Icon className={size === 'sm' ? "h-2.5 w-2.5" : "h-3 w-3"} />
            {t(config?.labelKey || 'upload.angleImage')}
            <ChevronDown className={size === 'sm' ? "h-2 w-2" : "h-2.5 w-2.5"} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[120px]">
          {IMAGE_TYPE_CONFIG.map(({ type, labelKey, icon: ItemIcon }) => (
            <DropdownMenuItem
              key={type}
              onClick={() => handleChangeType(image.id, type)}
              className={cn(
                "flex items-center gap-2 text-xs",
                image.type === type && "bg-accent"
              )}
            >
              <ItemIcon className="h-3 w-3" />
              {t(labelKey)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

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
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFileSelect(e.target.files);
            e.target.value = '';
          }}
        />

        {mainImage ? (
          <div className="relative group">
            <img
              src={mainImage.previewUrl}
              alt={t('upload.mainImage')}
              className="w-full aspect-square object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            <button
              onClick={() => handleRemove(mainImage.id)}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-foreground/80 text-background hover:bg-destructive transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-2">
              <TypeBadge image={mainImage} size="md" />
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center gap-4 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
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
                {isDragging ? t('upload.dropHere') : t('upload.dropOrClick')}
              </p>
              <p className="text-xs text-foreground-muted mt-1">
                {t('upload.hint')}
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
              {t('upload.additional')} ({otherImages.length}/{maxImages - 1})
            </p>
            {isClassifying && (
              <span className="flex items-center gap-1.5 text-xs text-primary animate-pulse">
                <Loader2 className="h-3 w-3 animate-spin" />
                {t('upload.classifying')}
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {otherImages.map((image) => (
              <div key={image.id} className="relative group aspect-square">
                <img
                  src={image.previewUrl}
                  alt={image.label || t(`upload.${image.type}Image`)}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemove(image.id)}
                  className="absolute top-1 right-1 p-1 rounded-md bg-foreground/80 text-background opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="absolute bottom-1 left-1">
                  <TypeBadge image={image} />
                </div>
              </div>
            ))}
            
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

      {/* Quick type upload buttons */}
      {images.length > 0 && images.length < maxImages && (
        <div className="flex flex-wrap gap-2">
          {IMAGE_TYPE_CONFIG.filter(c => c.type !== 'main').map(({ type, labelKey, icon: Icon }) => (
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
              + {t(labelKey)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
