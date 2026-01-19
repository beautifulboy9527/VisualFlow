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
  
  // Get unique categories and order them
  const categoryOrder = ['Amazon', 'Shopify', 'TikTok', 'Xiaohongshu', 'Fashion', 'Beauty', 'Health', 'Tech', 'Holiday', 'Beverage', 'Kids'];
  const categories = categoryOrder.filter(cat => templates.some(tmpl => tmpl.category === cat));

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">{t('templates.quickStart')}</h2>
        </div>
        <p className="text-sm text-foreground-muted">
          {t('templates.quickStartDesc')}
        </p>
      </div>

      {/* Templates Grid - Improved Layout */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {categories.map((category) => {
          const categoryTemplates = templates.filter(tmpl => tmpl.category === category);
          const categoryKey = categoryTemplates[0]?.categoryKey || category;
          
          return (
            <div key={category}>
              {/* Category Header */}
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                  {t(categoryKey)}
                </h3>
                <div className="flex-1 h-px bg-border/50" />
                <span className="text-xs text-foreground-muted">
                  {categoryTemplates.length} {t('templates.items')}
                </span>
              </div>
              
              {/* Template Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {categoryTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className="group relative bg-card rounded-xl border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden cursor-pointer"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={template.thumbnail}
                        alt={t(template.nameKey)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Platform Badge */}
                      {template.platform && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-card/80 backdrop-blur-sm text-[10px] font-medium text-foreground-secondary border border-border/50">
                          {template.platform}
                        </div>
                      )}
                      
                      {/* Use Template Button */}
                      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <Button 
                          size="sm" 
                          className="w-full bg-primary/90 text-primary-foreground hover:bg-primary text-xs h-7"
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          {t('templates.useTemplate')}
                        </Button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-2.5">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <div className="p-1 rounded bg-primary/10 text-primary flex-shrink-0">
                          {template.icon}
                        </div>
                        <span className="text-xs font-medium text-foreground truncate">
                          {t(template.nameKey)}
                        </span>
                      </div>
                      <p className="text-[10px] text-foreground-muted line-clamp-1 pl-6">
                        {t(template.descKey)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
