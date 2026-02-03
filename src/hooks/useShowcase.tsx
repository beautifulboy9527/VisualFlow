import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface ShowcaseItem {
  id: string;
  imageUrl: string;
  title: string;
  titleZh: string;
  description: string | null;
  descriptionZh: string | null;
  category: string | null;
  tags: string[];
  likes: number;
  views: number;
  isFeatured: boolean;
}

// Helper to safely parse JSON arrays
const parseJsonArray = <T,>(json: Json | null, fallback: T[] = []): T[] => {
  if (!json) return fallback;
  if (Array.isArray(json)) return json as T[];
  return fallback;
};

export const useShowcase = (maxItems = 12) => {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShowcase = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('showcase')
        .select('*')
        .eq('is_approved', true)
        .order('likes_count', { ascending: false })
        .limit(maxItems);

      if (fetchError) throw fetchError;

      const transformedData: ShowcaseItem[] = (data || []).map(item => ({
        id: item.id,
        imageUrl: item.image_url,
        title: item.title || 'Untitled',
        titleZh: item.title_zh || item.title || '无标题',
        description: item.description,
        descriptionZh: item.description_zh,
        category: item.category,
        tags: parseJsonArray<string>(item.tags),
        likes: item.likes_count,
        views: item.views_count,
        isFeatured: item.is_featured,
      }));

      setItems(transformedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching showcase:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch showcase');
    } finally {
      setLoading(false);
    }
  }, [maxItems]);

  useEffect(() => {
    fetchShowcase();
  }, [fetchShowcase]);

  return {
    items,
    loading,
    error,
    refetch: fetchShowcase,
  };
};
