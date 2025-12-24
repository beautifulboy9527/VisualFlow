import React, { useState } from 'react';
import { Brain, Sparkles, Pencil, Check, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AnalysisField {
  label: string;
  value: string;
  options?: string[];
}

interface EditableAIAnalysisProps {
  analysis: {
    material: string;
    category: string;
    recommendedStyle: string;
    confidence: number;
  } | null;
  isAnalyzing: boolean;
  onUpdateAnalysis: (updates: Partial<{
    material: string;
    category: string;
    recommendedStyle: string;
  }>) => void;
}

const categoryOptions = [
  'Skincare', 'Makeup', 'Haircare', 'Electronics', 'Fashion', 
  'Home & Living', 'Food & Beverage', 'Sports', 'Toys', 'Other'
];

const materialOptions = [
  'Glass, Frosted', 'Glass, Clear', 'Plastic', 'Metal', 'Ceramic',
  'Paper/Cardboard', 'Fabric', 'Wood', 'Leather', 'Other'
];

const styleOptions = [
  'Minimal Organic', 'Bold & Vibrant', 'Luxury Premium', 'Tech Modern',
  'Natural & Earthy', 'Playful Fun', 'Classic Elegant', 'Urban Street'
];

export const EditableAIAnalysis: React.FC<EditableAIAnalysisProps> = ({
  analysis,
  isAnalyzing,
  onUpdateAnalysis,
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  if (isAnalyzing) {
    return (
      <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="h-4 bg-primary/10 rounded w-24 mb-2" />
            <div className="h-3 bg-primary/5 rounded w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const fields: { key: keyof typeof analysis; label: string; options: string[] }[] = [
    { key: 'category', label: 'Category', options: categoryOptions },
    { key: 'material', label: 'Material', options: materialOptions },
    { key: 'recommendedStyle', label: 'Style', options: styleOptions },
  ];

  const startEdit = (key: string, currentValue: string) => {
    setEditingField(key);
    setEditValue(currentValue);
  };

  const saveEdit = (key: string) => {
    onUpdateAnalysis({ [key]: editValue });
    setEditingField(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  return (
    <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">AI Analysis</span>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success font-medium">
          {Math.round(analysis.confidence * 100)}% confident
        </span>
      </div>

      <div className="space-y-3">
        {fields.map(({ key, label, options }) => {
          const value = analysis[key];
          const isEditing = editingField === key;

          return (
            <div key={key} className="flex items-center justify-between group">
              <span className="text-xs text-foreground-muted w-16">{label}</span>
              
              {isEditing ? (
                <div className="flex items-center gap-2 flex-1 ml-2">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-7 text-xs flex-1"
                    autoFocus
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => saveEdit(key)}
                  >
                    <Check className="h-3 w-3 text-success" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={cancelEdit}
                  >
                    <X className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-1 ml-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1 text-sm text-foreground hover:text-primary transition-colors group/btn">
                        <span className={cn(
                          typeof value === 'string' && value !== analysis[key] && 'text-primary'
                        )}>
                          {typeof value === 'string' ? value : String(value)}
                        </span>
                        <ChevronDown className="h-3 w-3 text-foreground-muted group-hover/btn:text-primary" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="max-h-48 overflow-y-auto">
                      {options.map((option) => (
                        <DropdownMenuItem
                          key={option}
                          onClick={() => onUpdateAnalysis({ [key]: option })}
                          className={cn(
                            'text-sm',
                            option === value && 'bg-primary/10 text-primary'
                          )}
                        >
                          {option}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <button
                    onClick={() => startEdit(key, typeof value === 'string' ? value : String(value))}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-secondary transition-all"
                  >
                    <Pencil className="h-3 w-3 text-foreground-muted" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
