import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadZoneProps {
  onImageUpload: (file: File, previewUrl: string) => void;
  uploadedImage: string | null;
  onClear: () => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ 
  onImageUpload, 
  uploadedImage,
  onClear 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }
    
    const previewUrl = URL.createObjectURL(file);
    onImageUpload(file, previewUrl);
  }, [onImageUpload]);

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
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  if (uploadedImage) {
    return (
      <div className="relative group animate-fade-in">
        <div className="relative overflow-hidden rounded-md border border-border">
          <img
            src={uploadedImage}
            alt="Uploaded product"
            className="w-full aspect-square object-cover"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-200" />
        </div>
        
        {/* Remove button */}
        <button
          onClick={onClear}
          className="absolute top-2 right-2 p-1.5 rounded-md bg-foreground/80 text-background hover:bg-foreground transition-colors duration-200"
          aria-label="Remove image"
        >
          <X className="h-4 w-4" />
        </button>

        {/* AI Analysis indicator */}
        <div className="mt-3 flex items-center gap-2 text-sm text-foreground-secondary animate-slide-up">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>AI analyzing product...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-md p-8 text-center cursor-pointer
        transition-all duration-200 ease-out
        ${isDragging 
          ? 'border-primary bg-primary-light' 
          : 'border-border hover:border-border-hover hover:bg-secondary/50'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
      
      <div className="flex flex-col items-center gap-3">
        <div className={`
          p-3 rounded-md transition-colors duration-200
          ${isDragging ? 'bg-primary/10' : 'bg-secondary'}
        `}>
          {isDragging ? (
            <Upload className="h-6 w-6 text-primary" />
          ) : (
            <ImageIcon className="h-6 w-6 text-foreground-muted" />
          )}
        </div>
        
        <div>
          <p className="text-sm font-medium text-foreground">
            {isDragging ? 'Drop your image here' : 'Drop image or click to upload'}
          </p>
          <p className="text-xs text-foreground-muted mt-1">
            JPG, PNG up to 10MB
          </p>
        </div>

        <Button 
          variant="secondary" 
          size="sm"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          Select File
        </Button>
      </div>
    </div>
  );
};
