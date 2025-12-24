import React from 'react';
import { Hexagon, CreditCard, Settings, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  credits: number;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({ credits, userName = 'User' }) => {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-primary">
          <Hexagon className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-foreground tracking-tight">
          PixMiller
        </span>
        <span className="hidden md:inline-block text-xs font-medium text-foreground-muted bg-secondary px-2 py-0.5 rounded">
          BETA
        </span>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-1">
        <Button variant="ghost" size="sm" className="text-foreground-secondary hover:text-foreground">
          Workbench
        </Button>
        <Button variant="ghost" size="sm" className="text-foreground-secondary hover:text-foreground">
          History
        </Button>
        <Button variant="ghost" size="sm" className="text-foreground-secondary hover:text-foreground">
          Templates
        </Button>
      </nav>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Credits */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary border border-border">
          <CreditCard className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{credits}</span>
          <span className="text-xs text-foreground-muted">credits</span>
        </div>

        {/* Settings */}
        <Button variant="ghost" size="icon-sm" className="text-foreground-muted hover:text-foreground">
          <Settings className="h-4 w-4" />
        </Button>

        {/* User menu */}
        <button className="flex items-center gap-2 p-1.5 rounded-md hover:bg-secondary transition-colors duration-200">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <ChevronDown className="h-4 w-4 text-foreground-muted hidden sm:block" />
        </button>
      </div>
    </header>
  );
};
