import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AITypingTextProps {
  text: string;
  className?: string;
  speed?: number;
  onComplete?: () => void;
  showCursor?: boolean;
}

export const AITypingText: React.FC<AITypingTextProps> = ({
  text,
  className,
  speed = 30,
  onComplete,
  showCursor = true,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayText('');
    setIsComplete(false);
    
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return (
    <span className={cn("inline", className)}>
      {displayText}
      {showCursor && !isComplete && (
        <span className="inline-block w-0.5 h-[1em] bg-primary ml-0.5 animate-pulse" />
      )}
    </span>
  );
};

interface AITypingFieldProps {
  label: string;
  value: string;
  isTyping: boolean;
  onEdit: (value: string) => void;
  editable?: boolean;
}

export const AITypingField: React.FC<AITypingFieldProps> = ({
  label,
  value,
  isTyping,
  onEdit,
  editable = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onEdit(localValue);
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-foreground-muted">{label}</label>
      
      {isTyping && !isEditing ? (
        <div className="min-h-[2rem] px-3 py-2 rounded-lg bg-secondary/50 border border-primary/20">
          <AITypingText text={value} className="text-sm text-foreground" />
        </div>
      ) : isEditing ? (
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className="w-full px-3 py-2 rounded-lg bg-background border border-primary/40 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      ) : (
        <div
          onClick={() => editable && setIsEditing(true)}
          className={cn(
            "min-h-[2rem] px-3 py-2 rounded-lg bg-secondary/30 border border-border/30 text-sm text-foreground transition-colors",
            editable && "cursor-text hover:border-primary/30 hover:bg-secondary/50"
          )}
        >
          {value || <span className="text-foreground-muted italic">Click to edit...</span>}
        </div>
      )}
    </div>
  );
};
