import React, { useState } from 'react';
import { TrendingUp, ChevronRight, Heart, Eye, ExternalLink, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useShowcase, ShowcaseItem } from '@/hooks/useShowcase';
import { InspirationDetailModal, InspirationDetail } from './InspirationDetailModal';

interface InspirationItem {
  id: string;
  imageUrl: string;
  title: string;
  titleZh: string;
  category: string;
  categoryZh: string;
  likes: number;
  views: number;
  // Additional config details
  visualStyle?: string;
  visualStyleZh?: string;
  layoutStyle?: string;
  layoutStyleZh?: string;
  platform?: string;
  scenes?: string[];
  scenesZh?: string[];
}

// Fallback mock data when database is empty
const fallbackData: InspirationItem[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop',
    title: 'Luxury Skincare',
    titleZh: '高端护肤',
    category: 'Beauty',
    categoryZh: '美妆',
    likes: 1240,
    views: 8500,
    visualStyle: 'Magazine Editorial',
    visualStyleZh: '杂志编辑风格',
    layoutStyle: 'Glassmorphism',
    layoutStyleZh: '玻璃拟态',
    platform: 'Amazon',
    scenes: ['Main KV', 'Lifestyle', 'Detail', 'White BG'],
    scenesZh: ['主视觉', '场景图', '细节图', '白底图'],
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop',
    title: 'Minimalist Watch',
    titleZh: '极简腕表',
    category: 'Fashion',
    categoryZh: '时尚',
    likes: 980,
    views: 6200,
    visualStyle: 'Minimalist Nordic',
    visualStyleZh: '极简北欧风格',
    layoutStyle: 'Ultra Minimal',
    layoutStyleZh: '极简布局',
    platform: 'Shopify',
    scenes: ['Hero', 'Product', 'Detail'],
    scenesZh: ['主图', '产品图', '细节图'],
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop',
    title: 'Premium Headphones',
    titleZh: '高端耳机',
    category: 'Tech',
    categoryZh: '科技',
    likes: 1560,
    views: 12000,
    visualStyle: 'Tech Futuristic',
    visualStyleZh: '科技未来风格',
    layoutStyle: 'Neon Glow',
    layoutStyleZh: '霓虹发光',
    platform: 'TikTok Shop',
    scenes: ['Main', 'Features', 'Lifestyle', 'Specs'],
    scenesZh: ['主图', '功能图', '场景图', '参数图'],
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=500&fit=crop',
    title: 'Natural Cosmetics',
    titleZh: '天然化妆品',
    category: 'Beauty',
    categoryZh: '美妆',
    likes: 850,
    views: 5400,
    visualStyle: 'Natural Organic',
    visualStyleZh: '自然有机风格',
    layoutStyle: 'Glassmorphism',
    layoutStyleZh: '玻璃拟态',
    platform: 'Xiaohongshu',
    scenes: ['Cover', 'Ingredients', 'Usage'],
    scenesZh: ['封面', '成分图', '使用图'],
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=500&fit=crop',
    title: 'Coffee Brand',
    titleZh: '精品咖啡',
    category: 'Food',
    categoryZh: '食品',
    likes: 720,
    views: 4800,
    visualStyle: 'Vintage Film',
    visualStyleZh: '复古胶片风格',
    layoutStyle: 'Handwritten',
    layoutStyleZh: '手写风格',
    platform: 'Shopify',
    scenes: ['Hero', 'Product', 'Lifestyle'],
    scenesZh: ['主图', '产品图', '场景图'],
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop',
    title: 'Fashion Accessories',
    titleZh: '时尚配饰',
    category: 'Fashion',
    categoryZh: '时尚',
    likes: 1100,
    views: 7300,
    visualStyle: 'Magazine Editorial',
    visualStyleZh: '杂志编辑风格',
    layoutStyle: 'Magazine Grid',
    layoutStyleZh: '杂志网格',
    platform: 'Amazon',
    scenes: ['Main', 'Detail', 'Lifestyle', 'Set'],
    scenesZh: ['主图', '细节图', '场景图', '套装图'],
  },
];

// Category mapping for display
const categoryMap: Record<string, { en: string; zh: string }> = {
  'beauty': { en: 'Beauty', zh: '美妆' },
  'fashion': { en: 'Fashion', zh: '时尚' },
  'tech': { en: 'Tech', zh: '科技' },
  'food': { en: 'Food', zh: '食品' },
  'lifestyle': { en: 'Lifestyle', zh: '生活' },
};

interface InspirationGalleryProps {
  compact?: boolean;
  maxItems?: number;
}

export const InspirationGallery: React.FC<InspirationGalleryProps> = ({
  compact = false,
  maxItems = 6,
}) => {
  const { language } = useLanguage();
  const { items: showcaseItems, loading } = useShowcase(maxItems);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<InspirationItem | null>(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  // Transform showcase items to inspiration items, or use fallback if empty
  const displayItems: InspirationItem[] = showcaseItems.length > 0 
    ? showcaseItems.map(item => ({
        id: item.id,
        imageUrl: item.imageUrl,
        title: item.title,
        titleZh: item.titleZh,
        category: categoryMap[item.category?.toLowerCase() || 'lifestyle']?.en || item.category || 'Lifestyle',
        categoryZh: categoryMap[item.category?.toLowerCase() || 'lifestyle']?.zh || '生活',
        likes: item.likes,
        views: item.views,
      }))
    : fallbackData.slice(0, maxItems);

  const allItems = fallbackData; // For the full gallery modal

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleItemClick = (item: InspirationItem) => {
    setSelectedItem(item);
  };

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-foreground-secondary">
              {language === 'zh' ? '热门灵感' : 'Trending'}
            </span>
          </div>
          <button className="text-[10px] text-primary hover:text-primary-hover flex items-center gap-0.5">
            {language === 'zh' ? '查看全部' : 'View All'}
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {displayItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={cn(
                "relative shrink-0 w-16 h-20 rounded-lg overflow-hidden",
                "ring-2 ring-transparent hover:ring-primary/50 transition-all"
              )}
            >
              <img
                src={item.imageUrl}
                alt={language === 'zh' ? item.titleZh : item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-1 left-1 right-1 text-[8px] text-white font-medium truncate">
                {language === 'zh' ? item.titleZh : item.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            {language === 'zh' ? '灵感案例' : 'Inspiration Gallery'}
          </h3>
          <button 
            onClick={() => setShowGalleryModal(true)}
            className="text-xs text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
          >
            {language === 'zh' ? '查看更多' : 'View More'}
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        
        {/* Horizontal scroll container - show complete images */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
          {displayItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={cn(
                "relative group rounded-xl overflow-hidden shrink-0",
                "w-[180px] sm:w-[200px] lg:w-[220px] aspect-[3/4]",
                "ring-2 ring-transparent hover:ring-primary/50 transition-all duration-300",
                "hover:shadow-lg hover:shadow-primary/10 animate-fade-in-scale"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <img
                src={item.imageUrl}
                alt={language === 'zh' ? item.titleZh : item.title}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-500",
                  hoveredId === item.id && "scale-105"
                )}
              />
              
              {/* Gradient overlay */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity",
                hoveredId === item.id ? "opacity-100" : "opacity-60"
              )} />
              
              {/* Category badge */}
              <div className="absolute top-2.5 left-2.5">
                <span className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full font-medium">
                  {language === 'zh' ? item.categoryZh : item.category}
                </span>
              </div>
              
              {/* Stats - Always visible */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                <span className="flex items-center gap-0.5 text-[9px] text-white/80 bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded">
                  <Heart className="h-2.5 w-2.5" />
                  {formatNumber(item.likes)}
                </span>
              </div>
              
              {/* Title and action */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-sm font-semibold text-white mb-1 drop-shadow-md line-clamp-1">
                  {language === 'zh' ? item.titleZh : item.title}
                </p>
                <div className={cn(
                  "flex items-center gap-1.5 text-[11px] text-white/90 transition-all",
                  hoveredId === item.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                )}>
                  <ExternalLink className="h-3.5 w-3.5" />
                  {language === 'zh' ? '查看详情' : 'View Details'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <InspirationDetailModal
        item={selectedItem as InspirationDetail}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {/* Full Gallery Modal */}
      {showGalleryModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowGalleryModal(false)}
        >
          <div 
            className="bg-card rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <h2 className="text-lg font-bold text-foreground">
                {language === 'zh' ? '灵感案例库' : 'Inspiration Gallery'}
              </h2>
              <button
                onClick={() => setShowGalleryModal(false)}
                className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <X className="h-5 w-5 text-foreground-muted" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[calc(85vh-60px)]">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {allItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      setShowGalleryModal(false);
                    }}
                    className={cn(
                      "relative group rounded-xl overflow-hidden aspect-[3/4]",
                      "ring-2 ring-transparent hover:ring-primary/50 transition-all duration-300",
                      "hover:shadow-lg hover:shadow-primary/10"
                    )}
                  >
                    <img
                      src={item.imageUrl}
                      alt={language === 'zh' ? item.titleZh : item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute top-2 left-2">
                      <span className="text-[9px] bg-white/20 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-full">
                        {language === 'zh' ? item.categoryZh : item.category}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2.5">
                      <p className="text-xs font-semibold text-white drop-shadow-md line-clamp-1">
                        {language === 'zh' ? item.titleZh : item.title}
                      </p>
                      <p className="text-[10px] text-white/70 mt-0.5">
                        {language === 'zh' ? item.visualStyleZh : item.visualStyle}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InspirationGallery;
