import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { icon: 24, text: 'text-sm' },
    md: { icon: 32, text: 'text-lg' },
    lg: { icon: 40, text: 'text-xl' }
  };

  const { icon, text } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* SVG Logo - Flowing wave/water inspired design */}
      <div 
        className="relative rounded-lg flex items-center justify-center overflow-hidden"
        style={{ 
          width: icon + 8, 
          height: icon + 8,
          background: 'linear-gradient(135deg, hsl(185 75% 50%), hsl(160 70% 45%))',
          boxShadow: '0 4px 20px hsl(175 70% 45% / 0.35)'
        }}
      >
        <svg 
          width={icon} 
          height={icon} 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Flowing wave lines - representing visual flow */}
          <path 
            d="M4 12C8 8 12 14 16 10C20 6 24 12 28 8" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
          <path 
            d="M4 18C8 14 12 20 16 16C20 12 24 18 28 14" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path 
            d="M4 24C8 20 12 26 16 22C20 18 24 24 28 20" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
          
          {/* Sparkle accent */}
          <circle cx="26" cy="6" r="2" fill="white" opacity="0.8" />
        </svg>
        
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-lg opacity-50"
          style={{
            background: 'linear-gradient(135deg, hsl(185 75% 50%), hsl(160 70% 45%))',
            filter: 'blur(8px)'
          }}
        />
      </div>
      
      {showText && (
        <span className={`font-display font-semibold text-foreground tracking-tight ${text}`}>
          VisualFlow
        </span>
      )}
    </div>
  );
};

// Inline SVG for use in places where we need just the icon
export const LogoIcon: React.FC<{ size?: number; className?: string }> = ({ 
  size = 24, 
  className = '' 
}) => (
  <div 
    className={`rounded-lg flex items-center justify-center ${className}`}
    style={{ 
      width: size + 8, 
      height: size + 8,
      background: 'linear-gradient(135deg, hsl(185 75% 50%), hsl(160 70% 45%))',
      boxShadow: '0 4px 20px hsl(175 70% 45% / 0.35)'
    }}
  >
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M4 12C8 8 12 14 16 10C20 6 24 12 28 8" 
        stroke="white" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path 
        d="M4 18C8 14 12 20 16 16C20 12 24 18 28 14" 
        stroke="white" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path 
        d="M4 24C8 20 12 26 16 22C20 18 24 24 28 20" 
        stroke="white" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <circle cx="26" cy="6" r="2" fill="white" opacity="0.8" />
    </svg>
  </div>
);

// Simple letter logo for small spaces
export const LogoLetter: React.FC<{ size?: number; className?: string }> = ({ 
  size = 24, 
  className = '' 
}) => (
  <div 
    className={`rounded-lg flex items-center justify-center ${className}`}
    style={{ 
      width: size, 
      height: size,
      background: 'linear-gradient(135deg, hsl(185 75% 50%), hsl(160 70% 45%))',
      boxShadow: '0 4px 12px hsl(175 70% 45% / 0.3)'
    }}
  >
    <span 
      className="font-bold text-white"
      style={{ fontSize: size * 0.5 }}
    >
      V
    </span>
  </div>
);