import React, { useState } from 'react';
import { TrendingUp, ChevronRight, Heart, Eye, ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { useShowcase, ShowcaseItem } from '@/hooks/useShowcase';

interface InspirationItem {
  id: string;
  imageUrl: string;
  title: string;
  titleZh: string;
  category: string;
  categoryZh: string;
  likes: number;
  views: number;
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
  onSelectInspiration?: (item: InspirationItem) => void;
  compact?: boolean;
  maxItems?: number;
}

export const InspirationGallery: React.FC<InspirationGalleryProps> = ({
  onSelectInspiration,
  compact = false,
  maxItems = 6,
}) => {
  const { language } = useLanguage();
  const { items: showcaseItems, loading } = useShowcase(maxItems);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
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
              onClick={() => onSelectInspiration?.(item)}
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {language === 'zh' ? '灵感案例' : 'Inspiration Gallery'}
        </h3>
        <button className="text-xs text-primary hover:text-primary-hover flex items-center gap-1 transition-colors">
          {language === 'zh' ? '查看更多' : 'View More'}
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
      
      {/* Horizontal scroll container - show complete images */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
        {displayItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onSelectInspiration?.(item)}
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
            
            {/* Stats */}
            <div className={cn(
              "absolute top-2.5 right-2.5 flex items-center gap-2 transition-opacity",
              hoveredId === item.id ? "opacity-100" : "opacity-0"
            )}>
              <span className="flex items-center gap-1 text-[10px] text-white/90 bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded">
                <Heart className="h-3 w-3" />
                {formatNumber(item.likes)}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-white/90 bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded">
                <Eye className="h-3 w-3" />
                {formatNumber(item.views)}
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
                {language === 'zh' ? '使用此风格' : 'Use this style'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default InspirationGallery;
