import React from 'react';
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
  Baby
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

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

interface Template {
  id: string;
  nameKey: string;
  category: string;
  categoryKey: string;
  thumbnail: string;
  icon: React.ReactNode;
  descKey: string;
  platform?: string;
  style?: string;
}

const templates: Template[] = [
  // Amazon Templates
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
  },
  // Shopify Templates
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
  },
  // TikTok Templates
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
  },
  // Xiaohongshu Templates
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
  },
  // Fashion Templates
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
  },
  // Holiday Templates
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
  },
  // Beauty & Health
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
  },
  // Tech Templates
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
  },
  // Food & Beverage
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
  },
  // Kids & Family
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
  },
];

interface TemplatesPanelProps {
  onSelectTemplate: (template: Template) => void;
}

export const TemplatesPanel: React.FC<TemplatesPanelProps> = ({
  onSelectTemplate,
}) => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = React.useState<string>('all');
  
  // Get unique platforms for filtering
  const platforms = ['all', 'Amazon', 'Shopify', 'TikTok', 'Xiaohongshu'];
  
  const filteredTemplates = activeFilter === 'all' 
    ? templates 
    : templates.filter(t => t.platform === activeFilter);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Compact Header with Filters */}
      <div className="p-3 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="font-medium text-sm text-foreground">{t('templates.quickStart')}</h2>
            <span className="text-xs text-foreground-muted">({filteredTemplates.length})</span>
          </div>
          
          {/* Platform Filters - Compact Pills */}
          <div className="flex items-center gap-1">
            {platforms.map(platform => (
              <button
                key={platform}
                onClick={() => setActiveFilter(platform)}
                className={`px-2 py-0.5 text-[10px] rounded-full transition-all ${
                  activeFilter === platform
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-foreground-muted hover:bg-muted'
                }`}
              >
                {platform === 'all' ? t('templates.all') : platform}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dense Masonry-like Grid */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-2">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className="group relative bg-card rounded-lg border border-border/30 hover:border-primary/50 hover:shadow-md hover:shadow-primary/10 transition-all duration-200 overflow-hidden cursor-pointer"
            >
              {/* Compact Thumbnail */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={template.thumbnail}
                  alt={t(template.nameKey)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                
                {/* Platform Badge - Smaller */}
                {template.platform && (
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-card/90 backdrop-blur-sm text-[8px] font-medium text-foreground-secondary">
                    {template.platform}
                  </div>
                )}
                
                {/* Use Button on Hover */}
                <div className="absolute bottom-1 left-1 right-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <Button 
                    size="sm" 
                    className="w-full bg-primary text-primary-foreground text-[10px] h-5 px-1"
                  >
                    <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                    {t('templates.use')}
                  </Button>
                </div>
              </div>

              {/* Minimal Info */}
              <div className="p-1.5">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-medium text-foreground truncate leading-tight">
                    {t(template.nameKey)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
