import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Settings, 
  User, 
  ChevronDown,
  Home,
  Clock,
  LayoutGrid,
  Zap,
  Globe,
  LogIn,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from './Logo';

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
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const isWorkbench = location.pathname === '/workbench';

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="group">
        <Logo size="md" showText={true} />
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
            <span className="hidden lg:inline">{t('nav.workbench')}</span>
          </Button>
          <Button 
            variant={activeView === 'history' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => onNavigate?.('history')}
            className={`gap-2 ${activeView === 'history' ? 'bg-card shadow-sm' : ''}`}
          >
            <Clock className="h-4 w-4" />
            <span className="hidden lg:inline">{t('nav.history')}</span>
          </Button>
          <Button 
            variant={activeView === 'templates' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => onNavigate?.('templates')}
            className={`gap-2 ${activeView === 'templates' ? 'bg-card shadow-sm' : ''}`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden lg:inline">{t('nav.templates')}</span>
          </Button>
        </nav>
      )}

      {/* Right section */}
      <div className="flex items-center gap-2">
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

        {/* Language Toggle */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={toggleLanguage}
          className="text-foreground-muted hover:text-foreground gap-1.5 px-2"
          title={language === 'zh' ? 'Switch to English' : '切换到中文'}
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs font-medium">{language === 'zh' ? 'EN' : '中'}</span>
        </Button>

        {/* Credits - Subtle display */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-foreground-muted">
          <CreditCard className="h-3.5 w-3.5" />
          <span className="font-medium">{credits}</span>
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

        {/* User menu or Login button */}
        {user ? (
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
              <div className="px-2 py-1.5 text-xs text-foreground-muted truncate">
                {user.email}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
                <User className="h-4 w-4 mr-2" />
                {t('user.profile')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                {t('user.settings')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                {t('user.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            variant="generate" 
            size="sm"
            onClick={() => navigate('/auth')}
            className="gap-2"
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">{language === 'zh' ? '登录' : 'Sign In'}</span>
          </Button>
        )}
      </div>
    </header>
  );
};