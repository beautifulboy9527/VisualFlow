import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Json } from '@/integrations/supabase/types';

export interface SelectedModule {
  id: string;
  name: string;
  aspectRatio: string;
  customSize?: { width: number; height: number };
}

export interface UserPreferences {
  id?: string;
  last_platform: string | null;
  last_modules: SelectedModule[];
  frequent_platforms: string[];
  frequent_visual_styles: string[];
  frequent_scenes: string[];
  custom_presets: CustomPreset[];
  usage_count: number;
}

export interface CustomPreset {
  id: string;
  name: string;
  platform: string;
  modules: SelectedModule[];
  visual_style?: string;
  created_at: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  last_platform: null,
  last_modules: [],
  frequent_platforms: [],
  frequent_visual_styles: [],
  frequent_scenes: [],
  custom_presets: [],
  usage_count: 0,
};

// Helper to safely parse JSON arrays
const parseJsonArray = <T,>(value: Json | null, defaultValue: T[]): T[] => {
  if (!value) return defaultValue;
  if (Array.isArray(value)) return value as unknown as T[];
  return defaultValue;
};

export const useUserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    if (!user) {
      setPreferences(DEFAULT_PREFERENCES);
      setIsLoading(false);
      return;
    }

    const loadPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading preferences:', error);
          return;
        }

        if (data) {
          setPreferences({
            id: data.id,
            last_platform: data.last_platform,
            last_modules: parseJsonArray<SelectedModule>(data.last_modules, []),
            frequent_platforms: parseJsonArray<string>(data.frequent_platforms, []),
            frequent_visual_styles: parseJsonArray<string>(data.frequent_visual_styles, []),
            frequent_scenes: parseJsonArray<string>(data.frequent_scenes, []),
            custom_presets: parseJsonArray<CustomPreset>(data.custom_presets, []),
            usage_count: data.usage_count || 0,
          });
        }
      } catch (err) {
        console.error('Error loading preferences:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Update platform usage frequency
  const updatePlatformUsage = useCallback((platform: string) => {
    setPreferences(prev => {
      const platforms = [...prev.frequent_platforms];
      const index = platforms.indexOf(platform);
      
      // Move to front (most recent) or add
      if (index > -1) {
        platforms.splice(index, 1);
      }
      platforms.unshift(platform);
      
      // Keep top 5
      return {
        ...prev,
        frequent_platforms: platforms.slice(0, 5),
      };
    });
  }, []);

  // Save last used configuration
  const saveLastConfig = useCallback(async (
    platform: string,
    modules: SelectedModule[]
  ) => {
    if (!user) return;

    setIsSaving(true);
    
    const updatedPrefs = {
      ...preferences,
      last_platform: platform,
      last_modules: modules,
      usage_count: preferences.usage_count + 1,
    };
    
    // Update frequency tracking
    updatePlatformUsage(platform);

    try {
      // Check if record exists
      const { data: existing } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('user_preferences')
          .update({
            last_platform: platform,
            last_modules: modules as unknown as Json,
            frequent_platforms: updatedPrefs.frequent_platforms as unknown as Json,
            frequent_visual_styles: updatedPrefs.frequent_visual_styles as unknown as Json,
            frequent_scenes: updatedPrefs.frequent_scenes as unknown as Json,
            custom_presets: updatedPrefs.custom_presets as unknown as Json,
            usage_count: updatedPrefs.usage_count,
          })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating preferences:', error);
        } else {
          setPreferences(updatedPrefs);
        }
      } else {
        // Insert new
        const { error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            last_platform: platform,
            last_modules: modules as unknown as Json,
            frequent_platforms: updatedPrefs.frequent_platforms as unknown as Json,
            frequent_visual_styles: updatedPrefs.frequent_visual_styles as unknown as Json,
            frequent_scenes: updatedPrefs.frequent_scenes as unknown as Json,
            custom_presets: updatedPrefs.custom_presets as unknown as Json,
            usage_count: updatedPrefs.usage_count,
          });

        if (error) {
          console.error('Error inserting preferences:', error);
        } else {
          setPreferences(updatedPrefs);
        }
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
    } finally {
      setIsSaving(false);
    }
  }, [user, preferences, updatePlatformUsage]);

  // Save custom preset
  const saveCustomPreset = useCallback(async (
    name: string,
    platform: string,
    modules: SelectedModule[],
    visualStyle?: string
  ) => {
    if (!user) return;

    const newPreset: CustomPreset = {
      id: crypto.randomUUID(),
      name,
      platform,
      modules,
      visual_style: visualStyle,
      created_at: new Date().toISOString(),
    };

    const updatedPresets = [...preferences.custom_presets, newPreset];

    try {
      const { data: existing } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('user_preferences')
          .update({
            custom_presets: updatedPresets as unknown as Json,
          })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error saving preset:', error);
        } else {
          setPreferences(prev => ({
            ...prev,
            custom_presets: updatedPresets,
          }));
        }
      } else {
        const { error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            custom_presets: updatedPresets as unknown as Json,
          });

        if (error) {
          console.error('Error saving preset:', error);
        } else {
          setPreferences(prev => ({
            ...prev,
            custom_presets: updatedPresets,
          }));
        }
      }
    } catch (err) {
      console.error('Error saving preset:', err);
    }
  }, [user, preferences]);

  // Delete custom preset
  const deleteCustomPreset = useCallback(async (presetId: string) => {
    if (!user) return;

    const updatedPresets = preferences.custom_presets.filter(p => p.id !== presetId);

    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({
          custom_presets: updatedPresets as unknown as Json,
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting preset:', error);
      } else {
        setPreferences(prev => ({
          ...prev,
          custom_presets: updatedPresets,
        }));
      }
    } catch (err) {
      console.error('Error deleting preset:', err);
    }
  }, [user, preferences]);

  // Check if user has previous config
  const hasPreviousConfig = preferences.last_platform !== null && preferences.last_modules.length > 0;

  // Get most used platform
  const mostUsedPlatform = preferences.frequent_platforms[0] || null;

  return {
    preferences,
    isLoading,
    isSaving,
    saveLastConfig,
    saveCustomPreset,
    deleteCustomPreset,
    hasPreviousConfig,
    mostUsedPlatform,
  };
};
