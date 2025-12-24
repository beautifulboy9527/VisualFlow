import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  CreditCard, 
  Settings, 
  User, 
  ChevronDown,
  Home,
  Clock,
  LayoutGrid,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  credits: number;
  userName?: string;
  onNavigate?: (view: 'workbench' | 'history' | 'templates') => void;
  activeView?: 'workbench' | 'history' | 'templates';
}

export const Header: React.FC<HeaderProps> = ({ 
  credits, 
  userName = 'User',
  onNavigate,
  activeView = 'workbench'
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isWorkbench = location.pathname === '/workbench';

  return (
    <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="relative p-2 rounded-lg bg-gradient-primary shadow-primary group-hover:shadow-glow transition-shadow duration-300">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
          <div className="absolute inset-0 bg-gradient-primary rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-display font-bold text-foreground tracking-tight">
            PixMiller
          </span>
          <span className="text-[10px] font-medium text-primary tracking-widest uppercase">
            AI Design Studio
          </span>
        </div>
      </Link>

      {/* Navigation - only show on workbench */}
      {isWorkbench && (
        <nav className="hidden md:flex items-center gap-1 bg-secondary/50 p-1 rounded-lg">
          <Button 
            variant={activeView === 'workbench' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => onNavigate?.('workbench')}
            className={`gap-2 ${activeView === 'workbench' ? 'bg-card shadow-sm' : ''}`}
          >
            <Zap className="h-4 w-4" />
            Workbench
          </Button>
          <Button 
            variant={activeView === 'history' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => onNavigate?.('history')}
            className={`gap-2 ${activeView === 'history' ? 'bg-card shadow-sm' : ''}`}
          >
            <Clock className="h-4 w-4" />
            History
          </Button>
          <Button 
            variant={activeView === 'templates' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => onNavigate?.('templates')}
            className={`gap-2 ${activeView === 'templates' ? 'bg-card shadow-sm' : ''}`}
          >
            <LayoutGrid className="h-4 w-4" />
            Templates
          </Button>
        </nav>
      )}

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Home link - only show on workbench */}
        {isWorkbench && (
          <Button 
            variant="ghost" 
            size="icon-sm" 
            onClick={() => navigate('/')}
            className="text-foreground-muted hover:text-foreground"
          >
            <Home className="h-4 w-4" />
          </Button>
        )}

        {/* Credits with glow effect */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <div className="relative">
            <CreditCard className="h-4 w-4 text-primary" />
            <div className="absolute inset-0 blur-sm bg-primary/30" />
          </div>
          <span className="text-sm font-semibold text-foreground">{credits}</span>
          <span className="text-xs text-foreground-muted">credits</span>
        </div>

        {/* Settings */}
        <Button 
          variant="ghost" 
          size="icon-sm" 
          className="text-foreground-muted hover:text-foreground"
          onClick={() => navigate('/settings')}
        >
          <Settings className="h-4 w-4" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary transition-colors duration-200">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-sm">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <ChevronDown className="h-4 w-4 text-foreground-muted hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};