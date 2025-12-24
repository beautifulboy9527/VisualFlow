import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Image as ImageIcon, 
  Clock, 
  Coins, 
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenerationSummary {
  style: string;
  modules: { id: string; name: string; credits: number }[];
  totalImages: number;
  estimatedTime: number; // in seconds
  totalCredits: number;
  currentCredits: number;
}

interface GenerationConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  summary: GenerationSummary;
}

export const GenerationConfirmModal: React.FC<GenerationConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  summary,
}) => {
  const hasEnoughCredits = summary.currentCredits >= summary.totalCredits;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <div className="p-2 rounded-lg bg-gradient-primary shadow-primary">
              <Layers className="h-5 w-5 text-primary-foreground" />
            </div>
            Generation Summary
          </DialogTitle>
          <DialogDescription>
            Review your generation settings before proceeding
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Style */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-foreground-muted">Visual Style</span>
            </div>
            <span className="text-sm font-medium text-foreground">{summary.style}</span>
          </div>

          {/* Modules */}
          <div className="p-3 rounded-lg bg-secondary/50 space-y-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <ImageIcon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-foreground-muted">Output Modules</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {summary.modules.map((module) => (
                <span
                  key={module.id}
                  className="px-2 py-1 rounded-full bg-card text-xs font-medium text-foreground border border-border/50"
                >
                  {module.name}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-secondary/50 text-center">
              <ImageIcon className="h-4 w-4 mx-auto text-primary mb-1" />
              <p className="text-lg font-display font-bold text-foreground">{summary.totalImages}</p>
              <p className="text-xs text-foreground-muted">Images</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50 text-center">
              <Clock className="h-4 w-4 mx-auto text-primary mb-1" />
              <p className="text-lg font-display font-bold text-foreground">~{summary.estimatedTime}s</p>
              <p className="text-xs text-foreground-muted">Est. Time</p>
            </div>
            <div className={cn(
              'p-3 rounded-lg text-center',
              hasEnoughCredits ? 'bg-secondary/50' : 'bg-destructive/10'
            )}>
              <Coins className={cn('h-4 w-4 mx-auto mb-1', hasEnoughCredits ? 'text-primary' : 'text-destructive')} />
              <p className={cn(
                'text-lg font-display font-bold',
                hasEnoughCredits ? 'text-foreground' : 'text-destructive'
              )}>
                {summary.totalCredits}
              </p>
              <p className="text-xs text-foreground-muted">Credits</p>
            </div>
          </div>

          {/* Credit Warning */}
          {!hasEnoughCredits && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive">
                Insufficient credits. You have {summary.currentCredits} credits.
              </p>
            </div>
          )}

          {hasEnoughCredits && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/30">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <p className="text-sm text-success">
                Ready to generate! {summary.currentCredits - summary.totalCredits} credits will remain.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="generate" 
            onClick={onConfirm}
            disabled={!hasEnoughCredits}
            className="gap-2"
          >
            <Zap className="h-4 w-4" />
            Generate Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
