import React, { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CelebrationOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  imageCount: number;
}

const Confetti: React.FC<{ delay: number; left: number }> = ({ delay, left }) => {
  const colors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-info', 'bg-accent-foreground'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const size = 6 + Math.random() * 8;
  const duration = 2 + Math.random() * 2;

  return (
    <div
      className={cn(
        'absolute rounded-sm animate-confetti',
        randomColor
      )}
      style={{
        left: `${left}%`,
        top: '-10px',
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    />
  );
};

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  isVisible,
  onClose,
  imageCount,
}) => {
  const [confettiPieces, setConfettiPieces] = useState<{ id: number; delay: number; left: number }[]>([]);

  useEffect(() => {
    if (isVisible) {
      // Generate confetti pieces
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        delay: Math.random() * 0.5,
        left: Math.random() * 100,
      }));
      setConfettiPieces(pieces);

      // Auto close after 4 seconds
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden pointer-events-auto">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      
      {/* Confetti */}
      {confettiPieces.map((piece) => (
        <Confetti key={piece.id} delay={piece.delay} left={piece.left} />
      ))}

      {/* Content */}
      <div className="relative z-10 text-center animate-scale-in">
        {/* Glowing success icon */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute inset-0 bg-success/30 rounded-full blur-2xl scale-150 animate-pulse" />
          <div className="relative p-6 rounded-full bg-gradient-to-br from-success to-success/80 shadow-lg">
            <CheckCircle2 className="h-16 w-16 text-success-foreground" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-8 w-8 text-warning animate-pulse" />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
          Generation Complete! 🎉
        </h2>
        <p className="text-lg text-foreground-secondary mb-6">
          {imageCount} stunning visuals created successfully
        </p>

        <Button 
          size="lg" 
          onClick={onClose}
          className="bg-gradient-primary shadow-primary hover:opacity-90 gap-2"
        >
          <Sparkles className="h-5 w-5" />
          View Results
        </Button>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-4 p-2 rounded-full bg-card/50 hover:bg-card text-foreground-muted hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
