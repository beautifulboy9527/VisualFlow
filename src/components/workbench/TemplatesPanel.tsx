import React from 'react';
import { Sparkles, ShoppingBag, Store, Video, Gift, Coffee, Shirt, Watch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

interface Template {
  id: string;
  nameKey: string;
  category: string;
  categoryKey: string;
  thumbnail: string;
  icon: React.ReactNode;
  descKey: string;
}

const templates: Template[] = [
  {
    id: '1',
    nameKey: 'templates.ecommerceHero',
    category: 'Amazon',
    categoryKey: 'templates.category.amazon',
    thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
    icon: <ShoppingBag className="h-4 w-4" />,
    descKey: 'templates.ecommerceHeroDesc',
  },
  {
    id: '2',
    nameKey: 'templates.lifestyleScene',
    category: 'Shopify',
    categoryKey: 'templates.category.shopify',
    thumbnail: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop',
    icon: <Store className="h-4 w-4" />,
    descKey: 'templates.lifestyleSceneDesc',
  },
  {
    id: '3',
    nameKey: 'templates.socialMediaAd',
    category: 'TikTok',
    categoryKey: 'templates.category.tiktok',
    thumbnail: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop',
    icon: <Video className="h-4 w-4" />,
    descKey: 'templates.socialMediaAdDesc',
  },
  {
    id: '4',
    nameKey: 'templates.giftBox',
    category: 'Holiday',
    categoryKey: 'templates.category.holiday',
    thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    icon: <Gift className="h-4 w-4" />,
    descKey: 'templates.giftBoxDesc',
  },
  {
    id: '5',
    nameKey: 'templates.coffeeProduct',
    category: 'Food & Beverage',
    categoryKey: 'templates.category.food',
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
    icon: <Coffee className="h-4 w-4" />,
    descKey: 'templates.coffeeProductDesc',
  },
  {
    id: '6',
    nameKey: 'templates.fashionItem',
    category: 'Fashion',
    categoryKey: 'templates.category.fashion',
    thumbnail: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop',
    icon: <Shirt className="h-4 w-4" />,
    descKey: 'templates.fashionItemDesc',
  },
  {
    id: '7',
    nameKey: 'templates.luxuryWatch',
    category: 'Luxury',
    categoryKey: 'templates.category.luxury',
    thumbnail: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
    icon: <Watch className="h-4 w-4" />,
    descKey: 'templates.luxuryWatchDesc',
  },
  {
    id: '8',
    nameKey: 'templates.aiGenerated',
    category: 'Smart',
    categoryKey: 'templates.category.smart',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=400&fit=crop',
    icon: <Sparkles className="h-4 w-4" />,
    descKey: 'templates.aiGeneratedDesc',
  },
];

interface TemplatesPanelProps {
  onSelectTemplate: (template: Template) => void;
}

export const TemplatesPanel: React.FC<TemplatesPanelProps> = ({
  onSelectTemplate,
}) => {
  const { t } = useLanguage();
  
  // Get unique categories
  const categories = [...new Set(templates.map(t => t.category))];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">{t('templates.quickStart')}</h2>
        <p className="text-sm text-foreground-muted mt-1">
          {t('templates.quickStartDesc')}
        </p>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {categories.map((category) => {
          const categoryTemplates = templates.filter(tmpl => tmpl.category === category);
          const categoryKey = categoryTemplates[0]?.categoryKey || category;
          
          return (
            <div key={category} className="mb-6">
              <h3 className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-3">
                {t(categoryKey)}
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className="group text-left bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-primary-glow transition-all duration-300 overflow-hidden cursor-pointer"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={template.thumbnail}
                        alt={t(template.nameKey)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Use Template Button */}
                      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" className="w-full bg-card/90 text-foreground hover:bg-card">
                          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                          {t('templates.useTemplate')}
                        </Button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1 rounded bg-primary/10 text-primary">
                          {template.icon}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {t(template.nameKey)}
                        </span>
                      </div>
                      <p className="text-xs text-foreground-muted">
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
