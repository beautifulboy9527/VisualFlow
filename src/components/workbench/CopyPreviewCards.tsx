import React, { useState } from 'react';
import { RefreshCw, Pencil, Check, Type, AlignLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CopyPreview {
  moduleId: string;
  moduleName: string;
  title: string;
  subtitle: string;
  cta: string;
  font: string;
  fontSize: 'small' | 'medium' | 'large';
  layout: 'centered' | 'left' | 'right';
}

interface CopyPreviewCardsProps {
  previews: CopyPreview[];
  onUpdatePreview: (moduleId: string, updates: Partial<CopyPreview>) => void;
  onRegenerateCopy: (moduleId: string) => void;
  isGeneratingCopy: boolean;
}

const fontOptions = [
  { value: 'inter', label: 'Inter' },
  { value: 'space-grotesk', label: 'Space Grotesk' },
  { value: 'playfair', label: 'Playfair Display' },
  { value: 'montserrat', label: 'Montserrat' },
  { value: 'poppins', label: 'Poppins' },
];

const fontSizeOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const layoutOptions = [
  { value: 'centered', label: 'Center' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
];

export const CopyPreviewCards: React.FC<CopyPreviewCardsProps> = ({
  previews,
  onUpdatePreview,
  onRegenerateCopy,
  isGeneratingCopy,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<'title' | 'subtitle' | 'cta' | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (moduleId: string, field: 'title' | 'subtitle' | 'cta', value: string) => {
    setEditingId(moduleId);
    setEditingField(field);
    setEditValue(value);
  };

  const saveEdit = (moduleId: string, field: string) => {
    onUpdatePreview(moduleId, { [field]: editValue });
    setEditingId(null);
    setEditingField(null);
    setEditValue('');
  };

  if (previews.length === 0) {
    return (
      <div className="p-6 text-center text-foreground-muted">
        <Type className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Select output modules to preview AI-generated copy</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Copy Preview</h3>
        <span className="text-xs text-foreground-muted">AI Generated • Editable</span>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {previews.map((preview) => (
          <div
            key={preview.moduleId}
            className="p-4 rounded-xl bg-card border border-border/50 space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                {preview.moduleName}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRegenerateCopy(preview.moduleId)}
                disabled={isGeneratingCopy}
                className="h-7 text-xs gap-1"
              >
                <RefreshCw className={cn('h-3 w-3', isGeneratingCopy && 'animate-spin')} />
                Regenerate
              </Button>
            </div>

            {/* Editable Fields */}
            <div className="space-y-3">
              {(['title', 'subtitle', 'cta'] as const).map((field) => {
                const isEditing = editingId === preview.moduleId && editingField === field;
                const value = preview[field];
                const labels = { title: 'Title', subtitle: 'Subtitle', cta: 'CTA' };

                return (
                  <div key={field} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-foreground-muted">{labels[field]}</label>
                      {!isEditing && (
                        <button
                          onClick={() => startEdit(preview.moduleId, field, value)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-secondary transition-all"
                        >
                          <Pencil className="h-3 w-3 text-foreground-muted" />
                        </button>
                      )}
                    </div>
                    
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="min-h-[60px] text-sm"
                          autoFocus
                        />
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 shrink-0"
                          onClick={() => saveEdit(preview.moduleId, field)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <p className={cn(
                        'text-sm text-foreground p-2 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors',
                        field === 'title' && 'font-semibold',
                        field === 'cta' && 'text-primary font-medium'
                      )} onClick={() => startEdit(preview.moduleId, field, value)}>
                        {value || `Add ${labels[field].toLowerCase()}...`}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Style Options */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/30">
              <div className="space-y-1">
                <label className="text-[10px] text-foreground-muted">Font</label>
                <Select
                  value={preview.font}
                  onValueChange={(value) => onUpdatePreview(preview.moduleId, { font: value })}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-foreground-muted">Size</label>
                <Select
                  value={preview.fontSize}
                  onValueChange={(value) => onUpdatePreview(preview.moduleId, { fontSize: value as CopyPreview['fontSize'] })}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-foreground-muted">Layout</label>
                <Select
                  value={preview.layout}
                  onValueChange={(value) => onUpdatePreview(preview.moduleId, { layout: value as CopyPreview['layout'] })}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {layoutOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preview Thumbnail */}
            <div className={cn(
              'relative h-24 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border border-border/30 p-3 flex flex-col',
              preview.layout === 'centered' && 'items-center justify-center text-center',
              preview.layout === 'left' && 'items-start justify-center',
              preview.layout === 'right' && 'items-end justify-center text-right'
            )}>
              <p className={cn(
                'text-[10px] font-bold text-foreground/80 line-clamp-1',
                preview.fontSize === 'large' && 'text-xs',
                preview.fontSize === 'small' && 'text-[8px]'
              )}>
                {preview.title || 'Title Preview'}
              </p>
              <p className="text-[8px] text-foreground-muted line-clamp-1 mt-0.5">
                {preview.subtitle || 'Subtitle Preview'}
              </p>
              <span className="text-[8px] text-primary font-medium mt-1">
                {preview.cta || 'CTA'}
              </span>
              <AlignLeft className="absolute bottom-2 right-2 h-3 w-3 text-foreground-muted/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export type { CopyPreview };
