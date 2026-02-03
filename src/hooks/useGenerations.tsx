import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import type { Json } from '@/integrations/supabase/types';

export interface Generation {
  id: string;
  user_id: string;
  input_images: string[];
  platform: string | null;
  modules: Array<{ id: string; name: string; aspectRatio: string }>;
  visual_style: string | null;
  layout_style: string | null;
  scenes: string[];
  ai_analysis: Record<string, unknown> | null;
  output_images: Array<{ id: string; url: string; label?: string }>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  credits_used: number;
  created_at: string;
  completed_at: string | null;
}

export interface CreateGenerationInput {
  input_images: string[];
  platform?: string;
  modules?: Array<{ id: string; name: string; aspectRatio: string }>;
  visual_style?: string;
  layout_style?: string;
  scenes?: string[];
  ai_analysis?: Record<string, unknown>;
}

// Helper to safely parse JSON arrays
const parseJsonArray = <T,>(json: Json | null, fallback: T[] = []): T[] => {
  if (!json) return fallback;
  if (Array.isArray(json)) return json as T[];
  return fallback;
};

export const useGenerations = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's generations
  const fetchGenerations = useCallback(async () => {
    if (!user) {
      setGenerations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      // Transform the data to match our interface
      const transformedData: Generation[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        input_images: parseJsonArray<string>(item.input_images),
        platform: item.platform,
        modules: parseJsonArray<{ id: string; name: string; aspectRatio: string }>(item.modules),
        visual_style: item.visual_style,
        layout_style: item.layout_style,
        scenes: parseJsonArray<string>(item.scenes),
        ai_analysis: item.ai_analysis as Record<string, unknown> | null,
        output_images: parseJsonArray<{ id: string; url: string; label?: string }>(item.output_images),
        status: item.status as Generation['status'],
        credits_used: item.credits_used,
        created_at: item.created_at,
        completed_at: item.completed_at,
      }));

      setGenerations(transformedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching generations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch generations');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create a new generation record
  const createGeneration = useCallback(async (input: CreateGenerationInput): Promise<Generation | null> => {
    if (!user) {
      toast({
        title: language === 'zh' ? '请先登录' : 'Please login first',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('generations')
        .insert({
          user_id: user.id,
          input_images: input.input_images as unknown as Json,
          platform: input.platform || null,
          modules: (input.modules || []) as unknown as Json,
          visual_style: input.visual_style || null,
          layout_style: input.layout_style || null,
          scenes: (input.scenes || []) as unknown as Json,
          ai_analysis: (input.ai_analysis || null) as unknown as Json,
          status: 'pending',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const newGeneration: Generation = {
        id: data.id,
        user_id: data.user_id,
        input_images: parseJsonArray<string>(data.input_images),
        platform: data.platform,
        modules: parseJsonArray<{ id: string; name: string; aspectRatio: string }>(data.modules),
        visual_style: data.visual_style,
        layout_style: data.layout_style,
        scenes: parseJsonArray<string>(data.scenes),
        ai_analysis: data.ai_analysis as Record<string, unknown> | null,
        output_images: [],
        status: data.status as Generation['status'],
        credits_used: data.credits_used,
        created_at: data.created_at,
        completed_at: data.completed_at,
      };

      setGenerations(prev => [newGeneration, ...prev]);
      return newGeneration;
    } catch (err) {
      console.error('Error creating generation:', err);
      toast({
        title: language === 'zh' ? '创建失败' : 'Creation failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
      return null;
    }
  }, [user, language]);

  // Update generation with results
  const updateGeneration = useCallback(async (
    id: string,
    updates: {
      output_images?: Array<{ id: string; url: string; label?: string }>;
      status?: Generation['status'];
      credits_used?: number;
    }
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const updateData: Record<string, unknown> = {};
      
      if (updates.output_images) {
        updateData.output_images = updates.output_images as unknown as Json;
      }
      if (updates.status) {
        updateData.status = updates.status;
        if (updates.status === 'completed') {
          updateData.completed_at = new Date().toISOString();
        }
      }
      if (updates.credits_used !== undefined) {
        updateData.credits_used = updates.credits_used;
      }

      const { error: updateError } = await supabase
        .from('generations')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setGenerations(prev => prev.map(g => 
        g.id === id 
          ? { 
              ...g, 
              ...updates,
              completed_at: updates.status === 'completed' ? new Date().toISOString() : g.completed_at
            } 
          : g
      ));

      return true;
    } catch (err) {
      console.error('Error updating generation:', err);
      return false;
    }
  }, [user]);

  // Delete a generation
  const deleteGeneration = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error: deleteError } = await supabase
        .from('generations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setGenerations(prev => prev.filter(g => g.id !== id));
      
      toast({
        title: language === 'zh' ? '已删除' : 'Deleted',
      });

      return true;
    } catch (err) {
      console.error('Error deleting generation:', err);
      toast({
        title: language === 'zh' ? '删除失败' : 'Delete failed',
        variant: 'destructive',
      });
      return false;
    }
  }, [user, language]);

  // Load generations on mount
  useEffect(() => {
    fetchGenerations();
  }, [fetchGenerations]);

  return {
    generations,
    loading,
    error,
    createGeneration,
    updateGeneration,
    deleteGeneration,
    refetch: fetchGenerations,
  };
};
