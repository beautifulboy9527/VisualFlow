import React from 'react';
import { Sparkles, ShoppingBag, Store, Video, Gift, Coffee, Shirt, Watch } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  icon: React.ReactNode;
  description: string;
}

const templates: Template[] = [
  {
    id: '1',
    name: 'E-commerce Hero',
    category: 'Amazon',
    thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
    icon: <ShoppingBag className="h-4 w-4" />,
    description: 'Perfect for product listings',
  },
  {
    id: '2',
    name: 'Lifestyle Scene',
    category: 'Shopify',
    thumbnail: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop',
    icon: <Store className="h-4 w-4" />,
    description: 'Show product in context',
  },
  {
    id: '3',
    name: 'Social Media Ad',
    category: 'TikTok',
    thumbnail: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop',
    icon: <Video className="h-4 w-4" />,
    description: 'Trending visual styles',
  },
  {
    id: '4',
    name: 'Gift Box',
    category: 'Holiday',
    thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    icon: <Gift className="h-4 w-4" />,
    description: 'Seasonal promotions',
  },
  {
    id: '5',
    name: 'Coffee Product',
    category: 'Food & Beverage',
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
    icon: <Coffee className="h-4 w-4" />,
    description: 'Warm, inviting style',
  },
  {
    id: '6',
    name: 'Fashion Item',
    category: 'Fashion',
    thumbnail: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop',
    icon: <Shirt className="h-4 w-4" />,
    description: 'Trendy fashion display',
  },
  {
    id: '7',
    name: 'Luxury Watch',
    category: 'Luxury',
    thumbnail: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
    icon: <Watch className="h-4 w-4" />,
    description: 'Premium product showcase',
  },
  {
    id: '8',
    name: 'AI Generated',
    category: 'Smart',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=400&fit=crop',
    icon: <Sparkles className="h-4 w-4" />,
    description: 'AI-powered creativity',
  },
];

interface TemplatesPanelProps {
  onSelectTemplate: (template: Template) => void;
}

export const TemplatesPanel: React.FC<TemplatesPanelProps> = ({
  onSelectTemplate,
}) => {
  const categories = [...new Set(templates.map(t => t.category))];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Quick Start Templates</h2>
        <p className="text-sm text-foreground-muted mt-1">
          Choose a template to get started quickly
        </p>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {categories.map((category) => (
          <div key={category} className="mb-6">
            <h3 className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-3">
              {category}
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {templates
                .filter(t => t.category === category)
                .map((template) => (
                  <button
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className="group text-left bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-primary-glow transition-all duration-300 overflow-hidden"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Use Template Button */}
                      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" className="w-full bg-card/90 text-foreground hover:bg-card">
                          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                          Use Template
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
                          {template.name}
                        </span>
                      </div>
                      <p className="text-xs text-foreground-muted">
                        {template.description}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};