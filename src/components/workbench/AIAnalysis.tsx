import React from 'react';
import { Sparkles, Package, Palette, Tag } from 'lucide-react';

interface AnalysisResult {
  material: string;
  category: string;
  recommendedStyle: string;
  confidence: number;
}

interface AIAnalysisProps {
  analysis: AnalysisResult | null;
  isAnalyzing: boolean;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({
  analysis,
  isAnalyzing,
}) => {
  if (isAnalyzing) {
    return (
      <div className="mt-4 p-4 rounded-md border border-border bg-card animate-fade-in">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-md bg-primary-light">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          </div>
          <span className="text-sm font-medium text-foreground">AI Analyzing...</span>
        </div>
        
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="h-4 rounded bg-secondary animate-pulse-soft"
              style={{ width: `${70 + i * 10}%`, animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const insights = [
    { icon: Package, label: 'Category', value: analysis.category },
    { icon: Tag, label: 'Material', value: analysis.material },
    { icon: Palette, label: 'Style', value: analysis.recommendedStyle },
  ];

  return (
    <div className="mt-4 p-4 rounded-md border border-border bg-card animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary-light">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">AI Analysis</span>
        </div>
        <span className="text-xs text-foreground-muted">
          {Math.round(analysis.confidence * 100)}% confidence
        </span>
      </div>

      <div className="space-y-2">
        {insights.map(({ icon: Icon, label, value }) => (
          <div 
            key={label}
            className="flex items-center gap-3 p-2 rounded-md bg-secondary/50"
          >
            <Icon className="h-4 w-4 text-foreground-muted" />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-foreground-muted">{label}</span>
              <p className="text-sm font-medium text-foreground truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
