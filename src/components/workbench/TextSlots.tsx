import React from 'react';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TextSlotsProps {
  title: string;
  subtitle: string;
  cta: string;
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onCtaChange: (value: string) => void;
  onAutoGenerate?: () => void;
  isGenerating?: boolean;
}

export const TextSlots: React.FC<TextSlotsProps> = ({
  title,
  subtitle,
  cta,
  onTitleChange,
  onSubtitleChange,
  onCtaChange,
  onAutoGenerate,
  isGenerating = false,
}) => {
  return (
    <div className="space-y-5">
      {/* Main Title */}
      <div className="space-y-1.5">
        <label className="text-xxs font-medium text-foreground-muted uppercase tracking-wide">
          Main Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="SUMMER SALE"
          className="w-full border-b border-border bg-transparent px-0 py-2 text-base text-foreground
                     placeholder:text-foreground-muted
                     focus:border-primary focus:outline-none
                     transition-colors duration-150"
        />
      </div>

      {/* Subtitle */}
      <div className="space-y-1.5">
        <label className="text-xxs font-medium text-foreground-muted uppercase tracking-wide">
          Subtitle
        </label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => onSubtitleChange(e.target.value)}
          placeholder="50% OFF"
          className="w-full border-b border-border bg-transparent px-0 py-2 text-base text-foreground
                     placeholder:text-foreground-muted
                     focus:border-primary focus:outline-none
                     transition-colors duration-150"
        />
      </div>

      {/* CTA Text */}
      <div className="space-y-1.5">
        <label className="text-xxs font-medium text-foreground-muted uppercase tracking-wide">
          Call to Action
        </label>
        <input
          type="text"
          value={cta}
          onChange={(e) => onCtaChange(e.target.value)}
          placeholder="SHOP NOW"
          className="w-full border-b border-border bg-transparent px-0 py-2 text-base text-foreground
                     placeholder:text-foreground-muted
                     focus:border-primary focus:outline-none
                     transition-colors duration-150"
        />
      </div>

      {/* AI Auto Generate Button */}
      {onAutoGenerate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onAutoGenerate}
          disabled={isGenerating}
          className="w-full justify-center gap-2 text-primary hover:text-primary-hover hover:bg-primary-light"
        >
          <Wand2 className="h-4 w-4" />
          {isGenerating ? 'Generating...' : 'Auto Generate Copy'}
        </Button>
      )}
    </div>
  );
};
