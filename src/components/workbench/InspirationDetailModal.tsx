import React from 'react';
import { X, Heart, Eye, Download, Palette, Layers, Globe, Image as ImageIcon, Copy, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export interface InspirationDetail {
  id: string;
  imageUrl: string;
  title: string;
  titleZh: string;
  category: string;
  categoryZh: string;
  likes: number;
  views: number;
  // Generation config details
  visualStyle?: string;
  visualStyleZh?: string;
  layoutStyle?: string;
  layoutStyleZh?: string;
  platform?: string;
  scenes?: string[];
  scenesZh?: string[];
  createdAt?: string;
  author?: string;
}

interface InspirationDetailModalProps {
  item: InspirationDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onUseConfig?: (item: InspirationDetail) => void;
}

export const InspirationDetailModal: React.FC<InspirationDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onUseConfig,
}) => {
  const { language } = useLanguage();

  if (!isOpen || !item) return null;

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleUseConfig = () => {
    onUseConfig?.(item);
    toast({
      title: language === 'zh' ? '配置已应用' : 'Config Applied',
      description: language === 'zh' 
        ? '已将此作品的生成配置应用到工作台' 
        : 'Applied this work\'s generation config to workbench',
    });
    onClose();
  };

  const handleDownload = () => {
    toast({
      title: language === 'zh' ? '下载中...' : 'Downloading...',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Section */}
        <div className="relative md:w-1/2 bg-secondary/30">
          <img
            src={item.imageUrl}
            alt={language === 'zh' ? item.titleZh : item.title}
            className="w-full h-64 md:h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          
          {/* Stats overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
              <Heart className="h-4 w-4" />
              {formatNumber(item.likes)}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
              <Eye className="h-4 w-4" />
              {formatNumber(item.views)}
            </span>
          </div>
        </div>

        {/* Details Section */}
        <div className="md:w-1/2 p-5 md:p-6 flex flex-col overflow-y-auto">
          <div className="flex-1 space-y-4">
            {/* Title */}
            <div>
              <span className="text-[10px] text-primary font-medium uppercase tracking-wider">
                {language === 'zh' ? item.categoryZh : item.category}
              </span>
              <h2 className="text-xl font-bold text-foreground mt-1">
                {language === 'zh' ? item.titleZh : item.title}
              </h2>
              {item.author && (
                <p className="text-xs text-foreground-muted mt-1">
                  {language === 'zh' ? `作者: ${item.author}` : `By: ${item.author}`}
                </p>
              )}
            </div>

            {/* Generation Config */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Copy className="h-4 w-4 text-primary" />
                {language === 'zh' ? '生成配置' : 'Generation Config'}
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {/* Visual Style */}
                <div className="p-3 rounded-lg bg-secondary/50 border border-border/30">
                  <div className="flex items-center gap-1.5 text-[10px] text-foreground-muted mb-1">
                    <Palette className="h-3 w-3" />
                    {language === 'zh' ? '视觉风格' : 'Visual Style'}
                  </div>
                  <p className="text-xs font-medium text-foreground">
                    {language === 'zh' ? (item.visualStyleZh || '杂志编辑风格') : (item.visualStyle || 'Magazine Editorial')}
                  </p>
                </div>

                {/* Layout Style */}
                <div className="p-3 rounded-lg bg-secondary/50 border border-border/30">
                  <div className="flex items-center gap-1.5 text-[10px] text-foreground-muted mb-1">
                    <Layers className="h-3 w-3" />
                    {language === 'zh' ? '布局风格' : 'Layout Style'}
                  </div>
                  <p className="text-xs font-medium text-foreground">
                    {language === 'zh' ? (item.layoutStyleZh || '玻璃拟态') : (item.layoutStyle || 'Glassmorphism')}
                  </p>
                </div>

                {/* Platform */}
                <div className="p-3 rounded-lg bg-secondary/50 border border-border/30">
                  <div className="flex items-center gap-1.5 text-[10px] text-foreground-muted mb-1">
                    <Globe className="h-3 w-3" />
                    {language === 'zh' ? '目标平台' : 'Platform'}
                  </div>
                  <p className="text-xs font-medium text-foreground">
                    {item.platform || 'Amazon'}
                  </p>
                </div>

                {/* Scenes */}
                <div className="p-3 rounded-lg bg-secondary/50 border border-border/30">
                  <div className="flex items-center gap-1.5 text-[10px] text-foreground-muted mb-1">
                    <ImageIcon className="h-3 w-3" />
                    {language === 'zh' ? '场景数量' : 'Scenes'}
                  </div>
                  <p className="text-xs font-medium text-foreground">
                    {item.scenes?.length || 4} {language === 'zh' ? '个场景' : 'scenes'}
                  </p>
                </div>
              </div>

              {/* Scenes List */}
              {item.scenes && item.scenes.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {(language === 'zh' ? item.scenesZh : item.scenes)?.slice(0, 6).map((scene, idx) => (
                    <span 
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {scene}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-border/30">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-1.5" />
              {language === 'zh' ? '下载图片' : 'Download'}
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={handleUseConfig}
            >
              <ExternalLink className="h-4 w-4 mr-1.5" />
              {language === 'zh' ? '使用此配置' : 'Use Config'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspirationDetailModal;
