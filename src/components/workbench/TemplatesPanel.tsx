import React, { useState, useCallback } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Store, 
  Video, 
  Gift, 
  Coffee, 
  Shirt, 
  Watch,
  Leaf,
  Cpu,
  Dumbbell,
  Heart,
  Wine,
  Baby,
  Check,
  Loader2
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

// Import template images
import amazonSkincare from '@/assets/templates/amazon-skincare.jpg';
import shopifyCoffee from '@/assets/templates/shopify-coffee.jpg';
import tiktokEarbuds from '@/assets/templates/tiktok-earbuds.jpg';
import fashionHandbag from '@/assets/templates/fashion-handbag.jpg';
import holidayGift from '@/assets/templates/holiday-gift.jpg';
import luxuryWatch from '@/assets/templates/luxury-watch.jpg';
import organicBeauty from '@/assets/templates/organic-beauty.jpg';
import techSmartHome from '@/assets/templates/tech-smart-home.jpg';
import fitnessSupplement from '@/assets/templates/fitness-supplement.jpg';
import xiaohongshuSkincare from '@/assets/templates/xiaohongshu-skincare.jpg';
import beverageWine from '@/assets/templates/beverage-wine.jpg';
import kidsToys from '@/assets/templates/kids-toys.jpg';

export interface TemplateConfig {
  platform: string;
  visualStyle: string;
  layoutStyle: string;
  modules: Array<{ id: string; name: string; aspectRatio: string }>;
  scenes: string[];
}

export interface Template {
  id: string;
  nameKey: string;
  category: string;
  categoryKey: string;
  thumbnail: string;
  icon: React.ReactNode;
  descKey: string;
  platform?: string;
  style?: string;
  config: TemplateConfig;
}

const templates: Template[] = [
  {
    id: '1',
    nameKey: 'templates.skincare',
    category: 'Amazon',
    categoryKey: 'templates.category.amazon',
    thumbnail: amazonSkincare,
    icon: <ShoppingBag className="h-4 w-4" />,
    descKey: 'templates.skincareDesc',
    platform: 'Amazon',
    style: 'minimalist_nordic',
    config: {
      platform: 'amazon',
      visualStyle: 'minimalist_nordic',
      layoutStyle: 'clean_minimal',
      modules: [
        { id: 'main_image', name: '主图', aspectRatio: '1:1' },
        { id: 'sub_1', name: '副图1', aspectRatio: '1:1' },
        { id: 'sub_2', name: '副图2', aspectRatio: '1:1' },
        { id: 'aplus_banner', name: 'A+横幅', aspectRatio: '970:600' },
      ],
      scenes: ['main', 'front_view', 'lifestyle', 'detail_1'],
    },
  },
  {
    id: '2',
    nameKey: 'templates.artisanCoffee',
    category: 'Shopify',
    categoryKey: 'templates.category.shopify',
    thumbnail: shopifyCoffee,
    icon: <Coffee className="h-4 w-4" />,
    descKey: 'templates.artisanCoffeeDesc',
    platform: 'Shopify',
    style: 'natural_organic',
    config: {
      platform: 'shopify',
      visualStyle: 'natural_organic',
      layoutStyle: 'organic_flow',
      modules: [
        { id: 'hero', name: '主横幅', aspectRatio: '12:5' },
        { id: 'product', name: '产品图', aspectRatio: '1:1' },
        { id: 'collection', name: '系列图', aspectRatio: '16:9' },
      ],
      scenes: ['main', 'lifestyle', 'detail_1', 'detail_2'],
    },
  },
  {
    id: '3',
    nameKey: 'templates.techEarbuds',
    category: 'TikTok',
    categoryKey: 'templates.category.tiktok',
    thumbnail: tiktokEarbuds,
    icon: <Video className="h-4 w-4" />,
    descKey: 'templates.techEarbudsDesc',
    platform: 'TikTok',
    style: 'neon_cyberpunk',
    config: {
      platform: 'tiktok',
      visualStyle: 'neon_cyberpunk',
      layoutStyle: 'dynamic_diagonal',
      modules: [
        { id: 'video_cover', name: '视频封面', aspectRatio: '9:16' },
        { id: 'product_main', name: '产品主图', aspectRatio: '1:1' },
        { id: 'detail_1', name: '细节图1', aspectRatio: '1:1' },
      ],
      scenes: ['main', 'front_view', 'detail_1', 'promo'],
    },
  },
  {
    id: '4',
    nameKey: 'templates.kbeauty',
    category: 'Xiaohongshu',
    categoryKey: 'templates.category.xiaohongshu',
    thumbnail: xiaohongshuSkincare,
    icon: <Heart className="h-4 w-4" />,
    descKey: 'templates.kbeautyDesc',
    platform: 'Xiaohongshu',
    style: 'watercolor',
    config: {
      platform: 'xiaohongshu',
      visualStyle: 'watercolor',
      layoutStyle: 'magazine_grid',
      modules: [
        { id: 'main', name: '主图', aspectRatio: '3:4' },
        { id: 'detail', name: '详情图', aspectRatio: '3:4' },
        { id: 'multi', name: '多图', aspectRatio: '1:1' },
      ],
      scenes: ['main', 'lifestyle', 'detail_1', 'promo'],
    },
  },
  {
    id: '5',
    nameKey: 'templates.luxuryBag',
    category: 'Fashion',
    categoryKey: 'templates.category.fashion',
    thumbnail: fashionHandbag,
    icon: <Shirt className="h-4 w-4" />,
    descKey: 'templates.luxuryBagDesc',
    platform: 'Shopify',
    style: 'magazine',
    config: {
      platform: 'shopify',
      visualStyle: 'magazine',
      layoutStyle: 'magazine_grid',
      modules: [
        { id: 'hero', name: '主横幅', aspectRatio: '12:5' },
        { id: 'product', name: '产品图', aspectRatio: '1:1' },
        { id: 'product_card', name: '产品卡', aspectRatio: '1:1' },
      ],
      scenes: ['main', 'front_view', 'side_view', 'lifestyle'],
    },
  },
  {
    id: '6',
    nameKey: 'templates.luxuryWatch',
    category: 'Fashion',
    categoryKey: 'templates.category.fashion',
    thumbnail: luxuryWatch,
    icon: <Watch className="h-4 w-4" />,
    descKey: 'templates.luxuryWatchDesc',
    platform: 'Amazon',
    style: 'tech_futuristic',
    config: {
      platform: 'amazon',
      visualStyle: 'tech_futuristic',
      layoutStyle: 'dynamic_diagonal',
      modules: [
        { id: 'main_image', name: '主图', aspectRatio: '1:1' },
        { id: 'sub_1', name: '副图1', aspectRatio: '1:1' },
        { id: 'sub_2', name: '副图2', aspectRatio: '1:1' },
        { id: 'sub_3', name: '副图3', aspectRatio: '1:1' },
      ],
      scenes: ['main', 'front_view', 'detail_1', 'specs'],
    },
  },
  {
    id: '7',
    nameKey: 'templates.holidayGift',
    category: 'Holiday',
    categoryKey: 'templates.category.holiday',
    thumbnail: holidayGift,
    icon: <Gift className="h-4 w-4" />,
    descKey: 'templates.holidayGiftDesc',
    platform: 'Shopify',
    style: 'vintage_film',
    config: {
      platform: 'shopify',
      visualStyle: 'vintage_film',
      layoutStyle: 'classic_center',
      modules: [
        { id: 'hero', name: '主横幅', aspectRatio: '12:5' },
        { id: 'product', name: '产品图', aspectRatio: '1:1' },
        { id: 'collection', name: '系列图', aspectRatio: '16:9' },
      ],
      scenes: ['main', 'lifestyle', 'promo', 'sale_event'],
    },
  },
  {
    id: '8',
    nameKey: 'templates.organicBeauty',
    category: 'Beauty',
    categoryKey: 'templates.category.beauty',
    thumbnail: organicBeauty,
    icon: <Leaf className="h-4 w-4" />,
    descKey: 'templates.organicBeautyDesc',
    platform: 'Shopify',
    style: 'natural_organic',
    config: {
      platform: 'shopify',
      visualStyle: 'natural_organic',
      layoutStyle: 'organic_flow',
      modules: [
        { id: 'hero', name: '主横幅', aspectRatio: '12:5' },
        { id: 'product', name: '产品图', aspectRatio: '1:1' },
        { id: 'product_card', name: '产品卡', aspectRatio: '1:1' },
      ],
      scenes: ['main', 'lifestyle', 'detail_1', 'detail_2'],
    },
  },
  {
    id: '9',
    nameKey: 'templates.fitnessSupplement',
    category: 'Health',
    categoryKey: 'templates.category.health',
    thumbnail: fitnessSupplement,
    icon: <Dumbbell className="h-4 w-4" />,
    descKey: 'templates.fitnessSupplementDesc',
    platform: 'Amazon',
    style: 'tech_futuristic',
    config: {
      platform: 'amazon',
      visualStyle: 'tech_futuristic',
      layoutStyle: 'dynamic_diagonal',
      modules: [
        { id: 'main_image', name: '主图', aspectRatio: '1:1' },
        { id: 'sub_1', name: '副图1', aspectRatio: '1:1' },
        { id: 'sub_2', name: '副图2', aspectRatio: '1:1' },
        { id: 'aplus_banner', name: 'A+横幅', aspectRatio: '970:600' },
      ],
      scenes: ['main', 'front_view', 'specs', 'lifestyle'],
    },
  },
  {
    id: '10',
    nameKey: 'templates.smartHome',
    category: 'Tech',
    categoryKey: 'templates.category.tech',
    thumbnail: techSmartHome,
    icon: <Cpu className="h-4 w-4" />,
    descKey: 'templates.smartHomeDesc',
    platform: 'Amazon',
    style: 'minimalist_nordic',
    config: {
      platform: 'amazon',
      visualStyle: 'minimalist_nordic',
      layoutStyle: 'clean_minimal',
      modules: [
        { id: 'main_image', name: '主图', aspectRatio: '1:1' },
        { id: 'sub_1', name: '副图1', aspectRatio: '1:1' },
        { id: 'sub_2', name: '副图2', aspectRatio: '1:1' },
        { id: 'aplus_feature', name: '特性展示', aspectRatio: '970:300' },
      ],
      scenes: ['main', 'front_view', 'lifestyle', 'specs'],
    },
  },
  {
    id: '11',
    nameKey: 'templates.premiumWine',
    category: 'Beverage',
    categoryKey: 'templates.category.beverage',
    thumbnail: beverageWine,
    icon: <Wine className="h-4 w-4" />,
    descKey: 'templates.premiumWineDesc',
    platform: 'Shopify',
    style: 'magazine',
    config: {
      platform: 'shopify',
      visualStyle: 'magazine',
      layoutStyle: 'magazine_grid',
      modules: [
        { id: 'hero', name: '主横幅', aspectRatio: '12:5' },
        { id: 'product', name: '产品图', aspectRatio: '1:1' },
        { id: 'collection', name: '系列图', aspectRatio: '16:9' },
      ],
      scenes: ['main', 'lifestyle', 'detail_1', 'promo'],
    },
  },
  {
    id: '12',
    nameKey: 'templates.kidsToys',
    category: 'Kids',
    categoryKey: 'templates.category.kids',
    thumbnail: kidsToys,
    icon: <Baby className="h-4 w-4" />,
    descKey: 'templates.kidsToysDesc',
    platform: 'Amazon',
    style: 'watercolor',
    config: {
      platform: 'amazon',
      visualStyle: 'watercolor',
      layoutStyle: 'playful_pop',
      modules: [
        { id: 'main_image', name: '主图', aspectRatio: '1:1' },
        { id: 'sub_1', name: '副图1', aspectRatio: '1:1' },
        { id: 'sub_2', name: '副图2', aspectRatio: '1:1' },
        { id: 'sub_3', name: '副图3', aspectRatio: '1:1' },
      ],
      scenes: ['main', 'lifestyle', 'detail_1', 'promo'],
    },
  },
];

interface TemplatesPanelProps {
  onSelectTemplate: (template: Template) => void;
}

// Template Card Component with loading state
const TemplateCard: React.FC<{
  template: Template;
  index: number;
  onSelect: (template: Template) => void;
  isLoading: boolean;
  isLoaded: boolean;
}> = ({ template, index, onSelect, isLoading, isLoaded }) => {
  const { t } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Staggered animation delay based on index
  const animationDelay = `${index * 50}ms`;
  
  // Varying heights for masonry effect
  const heights = ['h-48', 'h-56', 'h-52', 'h-60', 'h-44', 'h-64'];
  const heightClass = heights[index % heights.length];

  return (
    <div
      onClick={() => !isLoading && onSelect(template)}
      style={{ animationDelay }}
      className={cn(
        "group relative rounded-2xl overflow-hidden cursor-pointer",
        "transform transition-all duration-500 ease-out",
        "animate-[fadeSlideUp_0.6s_ease-out_forwards] opacity-0",
        "hover:scale-[1.02] hover:z-10",
        isLoading && "pointer-events-none",
        isLoaded && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      {/* Card Container with Glass Effect */}
      <div className={cn(
        "relative w-full bg-card/50 backdrop-blur-sm",
        "border border-border/40 rounded-2xl overflow-hidden",
        "shadow-lg shadow-black/5",
        "transition-all duration-300",
        "group-hover:border-primary/40 group-hover:shadow-xl group-hover:shadow-primary/10",
        heightClass
      )}>
        {/* Image with Skeleton */}
        <div className="absolute inset-0">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted animate-pulse" />
          )}
          <img
            src={template.thumbnail}
            alt={t(template.nameKey)}
            onLoad={() => setImageLoaded(true)}
            className={cn(
              "w-full h-full object-cover",
              "transition-all duration-700 ease-out",
              "group-hover:scale-110",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        </div>

        {/* Gradient Overlay - Always visible but more intense on hover */}
        <div className={cn(
          "absolute inset-0 transition-all duration-300",
          "bg-gradient-to-t from-black/70 via-black/20 to-transparent",
          "group-hover:from-black/80 group-hover:via-black/30"
        )} />

        {/* Loading/Success Overlay */}
        {(isLoading || isLoaded) && (
          <div className={cn(
            "absolute inset-0 flex items-center justify-center z-20",
            "bg-primary/20 backdrop-blur-sm",
            "animate-[fadeIn_0.2s_ease-out]"
          )}>
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <span className="text-xs font-medium text-white">{t('templates.loading')}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 animate-[scaleIn_0.3s_ease-out]">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xs font-medium text-white">{t('templates.loaded')}</span>
              </div>
            )}
          </div>
        )}

        {/* Platform Badge - Floating Glass */}
        {template.platform && (
          <div className={cn(
            "absolute top-3 left-3 z-10",
            "px-2.5 py-1 rounded-full",
            "bg-white/90 backdrop-blur-md",
            "text-[10px] font-semibold text-foreground",
            "shadow-lg shadow-black/10",
            "transform transition-transform duration-300",
            "group-hover:scale-105"
          )}>
            {template.platform}
          </div>
        )}

        {/* Content - Bottom */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-4 z-10",
          "transform transition-all duration-300",
          "group-hover:translate-y-0"
        )}>
          {/* Title */}
          <h3 className={cn(
            "text-sm font-semibold text-white mb-1",
            "transform transition-all duration-300",
            "group-hover:translate-y-0"
          )}>
            {t(template.nameKey)}
          </h3>
          
          {/* Description - Hidden by default, shown on hover */}
          <p className={cn(
            "text-[11px] text-white/70 line-clamp-2",
            "transform transition-all duration-300 ease-out",
            "opacity-0 translate-y-2 max-h-0",
            "group-hover:opacity-100 group-hover:translate-y-0 group-hover:max-h-10"
          )}>
            {t(template.descKey)}
          </p>

          {/* Action Button - Appears on hover */}
          <div className={cn(
            "mt-3 flex items-center gap-2",
            "transform transition-all duration-300 ease-out",
            "opacity-0 translate-y-4",
            "group-hover:opacity-100 group-hover:translate-y-0"
          )}>
            <button className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
              "bg-white text-foreground text-xs font-medium",
              "hover:bg-primary hover:text-primary-foreground",
              "transition-colors duration-200",
              "shadow-lg"
            )}>
              <Sparkles className="h-3 w-3" />
              {t('templates.use')}
            </button>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className={cn(
          "absolute inset-0 pointer-events-none",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity duration-500",
          "bg-gradient-to-tr from-primary/10 via-transparent to-primary/5"
        )} />
      </div>
    </div>
  );
};

export const TemplatesPanel: React.FC<TemplatesPanelProps> = ({
  onSelectTemplate,
}) => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  
  const platforms = ['all', 'Amazon', 'Shopify', 'TikTok', 'Xiaohongshu'];
  
  const filteredTemplates = activeFilter === 'all' 
    ? templates 
    : templates.filter(t => t.platform === activeFilter);

  const handleSelectTemplate = useCallback((template: Template) => {
    setLoadingId(template.id);
    
    // Simulate loading for visual feedback
    setTimeout(() => {
      setLoadingId(null);
      setLoadedId(template.id);
      
      // Show success state briefly, then trigger callback
      setTimeout(() => {
        onSelectTemplate(template);
        setLoadedId(null);
      }, 600);
    }, 800);
  }, [onSelectTemplate]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header with Filters */}
      <div className="p-4 border-b border-border/50 bg-card/30 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{t('templates.quickStart')}</h2>
              <p className="text-xs text-foreground-muted">{t('templates.selectToApply')}</p>
            </div>
          </div>
          
          {/* Platform Filters - Glass Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-muted/30 rounded-full backdrop-blur-sm">
            {platforms.map(platform => (
              <button
                key={platform}
                onClick={() => setActiveFilter(platform)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-full",
                  "transition-all duration-300 ease-out",
                  activeFilter === platform
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                    : 'text-foreground-muted hover:text-foreground hover:bg-muted/50'
                )}
              >
                {platform === 'all' ? t('templates.all') : platform}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4 space-y-4">
          {filteredTemplates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              index={index}
              onSelect={handleSelectTemplate}
              isLoading={loadingId === template.id}
              isLoaded={loadedId === template.id}
            />
          ))}
        </div>
        
        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-foreground-muted">
            <Sparkles className="h-12 w-12 mb-4 opacity-30" />
            <p className="text-sm">{t('templates.noTemplates')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
