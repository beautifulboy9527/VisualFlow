import React from 'react';
import { Bot, Hand, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiquidModeToggleProps {
  isAgentMode: boolean;
  onToggle: (isAgent: boolean) => void;
  isProcessing?: boolean;
}

export const LiquidModeToggle: React.FC<LiquidModeToggleProps> = ({
  isAgentMode,
  onToggle,
  isProcessing = false,
}) => {
  return (
    <div className="relative">
      {/* Glow backdrop */}
      <div 
        className={cn(
          "absolute inset-0 rounded-2xl blur-xl transition-all duration-700",
          isAgentMode 
            ? "bg-primary/30 scale-110" 
            : "bg-secondary/20 scale-100"
        )} 
      />
      
      {/* Main container */}
      <div className="relative flex items-center gap-1 p-1 rounded-2xl bg-secondary/80 backdrop-blur-sm border border-border/50">
        {/* Manual Mode Button */}
        <button
          onClick={() => onToggle(false)}
          disabled={isProcessing}
          className={cn(
            "relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-500 ease-out",
            !isAgentMode
              ? "bg-card text-foreground shadow-md"
              : "text-foreground-muted hover:text-foreground"
          )}
        >
          <Hand className={cn(
            "h-4 w-4 transition-transform duration-300",
            !isAgentMode && "scale-110"
          )} />
          <span className="text-sm font-medium">Manual</span>
        </button>

        {/* Agent Mode Button */}
        <button
          onClick={() => onToggle(true)}
          disabled={isProcessing}
          className={cn(
            "relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-500 ease-out overflow-hidden",
            isAgentMode
              ? "bg-gradient-primary text-primary-foreground shadow-lg shadow-primary/30"
              : "text-foreground-muted hover:text-foreground"
          )}
        >
          {/* Liquid blob animation inside button */}
          {isAgentMode && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%] animate-shimmer opacity-50" />
              <div className="absolute -inset-1 bg-primary/20 blur-lg animate-pulse" />
            </>
          )}
          
          <div className="relative flex items-center gap-2">
            <Bot className={cn(
              "h-4 w-4 transition-all duration-300",
              isAgentMode && "scale-110 animate-pulse"
            )} />
            <span className="text-sm font-medium">Agent</span>
            {isAgentMode && (
              <Sparkles className="h-3 w-3 animate-pulse" />
            )}
          </div>
        </button>
      </div>

      {/* Processing indicator */}
      {isProcessing && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-xs text-primary animate-pulse">
          <div className="flex gap-0.5">
            <span className="w-1 h-1 rounded-full bg-primary typing-dot" />
            <span className="w-1 h-1 rounded-full bg-primary typing-dot" />
            <span className="w-1 h-1 rounded-full bg-primary typing-dot" />
          </div>
          <span>AI thinking...</span>
        </div>
      )}
    </div>
  );
};
