import React from 'react';
import { UploadZone } from './UploadZone';
import { TextSlots } from './TextSlots';
import { ModeSelector, GenerationMode } from './ModeSelector';
import { AIAnalysis } from './AIAnalysis';
import { Button } from '@/components/ui/button';
import { Zap, Loader2 } from 'lucide-react';

interface ControlPanelProps {
  // Upload state
  uploadedImage: string | null;
  onImageUpload: (file: File, previewUrl: string) => void;
  onClearImage: () => void;
  
  // AI Analysis
  analysisResult: {
    material: string;
    category: string;
    recommendedStyle: string;
    confidence: number;
  } | null;
  isAnalyzing: boolean;
  
  // Text state
  title: string;
  subtitle: string;
  cta: string;
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onCtaChange: (value: string) => void;
  
  // Mode
  selectedMode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
  
  // Generate
  onGenerate: () => void;
  isGenerating: boolean;
  credits: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  uploadedImage,
  onImageUpload,
  onClearImage,
  analysisResult,
  isAnalyzing,
  title,
  subtitle,
  cta,
  onTitleChange,
  onSubtitleChange,
  onCtaChange,
  selectedMode,
  onModeChange,
  onGenerate,
  isGenerating,
  credits,
}) => {
  const canGenerate = uploadedImage && !isGenerating && !isAnalyzing;
  const creditsToUse = 4;

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Section: Upload */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Product Image
          </h2>
          <UploadZone
            uploadedImage={uploadedImage}
            onImageUpload={onImageUpload}
            onClear={onClearImage}
          />
          
          {/* AI Analysis Result */}
          {uploadedImage && (
            <AIAnalysis 
              analysis={analysisResult}
              isAnalyzing={isAnalyzing}
            />
          )}
        </section>

        {/* Section: Text Content */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Text Content
          </h2>
          <TextSlots
            title={title}
            subtitle={subtitle}
            cta={cta}
            onTitleChange={onTitleChange}
            onSubtitleChange={onSubtitleChange}
            onCtaChange={onCtaChange}
          />
        </section>

        {/* Section: Generation Mode */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Generation Mode
          </h2>
          <ModeSelector
            selectedMode={selectedMode}
            onModeChange={onModeChange}
          />
        </section>
      </div>

      {/* Fixed Generate Button */}
      <div className="sticky bottom-0 p-4 bg-card border-t border-border">
        <Button
          variant="generate"
          size="lg"
          className="w-full"
          onClick={onGenerate}
          disabled={!canGenerate}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Zap className="h-5 w-5" />
              Generate ({creditsToUse} Credits)
            </>
          )}
        </Button>
        
        {/* Credits indicator */}
        <p className="text-center text-xs text-foreground-muted mt-2">
          {credits} credits remaining
        </p>
      </div>
    </div>
  );
};
