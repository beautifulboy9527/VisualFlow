import { supabase } from '@/integrations/supabase/client';

export interface ProductAnalysis {
  brandName: { zh: string; en: string };
  productName: { zh: string; en: string };
  category: string;
  specifications?: string[];
  sellingPoints: Array<{ zh: string; en: string; icon?: string }>;
  colorPalette: { primary: string; secondary: string; accent: string };
  visualStyle: {
    recommended: string;
    alternatives: string[];
    reason: { zh: string; en: string };
  };
  targetAudience: { zh: string; en: string };
  suggestedCopy: {
    headline: { zh: string; en: string };
    subheadline: { zh: string; en: string };
    cta: { zh: string; en: string };
    features: Array<{ zh: string; en: string }>;
  };
  confidence: number;
}

export interface AnalyzeProductResult {
  success: boolean;
  analysis?: ProductAnalysis;
  error?: string;
}

/**
 * Analyze product images using AI
 * @param imageUrls - Array of image URLs (data URLs or http URLs)
 * @param analysisType - Type of analysis ('full' | 'quick')
 */
export async function analyzeProduct(
  imageUrls: string[],
  analysisType: 'full' | 'quick' = 'full'
): Promise<AnalyzeProductResult> {
  try {
    // Convert blob URLs to base64 data URLs
    const base64Images = await Promise.all(
      imageUrls.map(async (url) => {
        if (url.startsWith('blob:')) {
          return await blobUrlToBase64(url);
        }
        return url;
      })
    );

    const { data, error } = await supabase.functions.invoke('analyze-product', {
      body: { imageUrls: base64Images, analysisType }
    });

    if (error) {
      console.error('Error calling analyze-product:', error);
      return { success: false, error: error.message };
    }

    if (data.error) {
      return { success: false, error: data.error };
    }

    return { success: true, analysis: data.analysis };
  } catch (err) {
    console.error('Exception in analyzeProduct:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Convert blob URL to base64 data URL
 */
async function blobUrlToBase64(blobUrl: string): Promise<string> {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Convert File to data URL for AI analysis
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Map AI recommended style to our style IDs
 */
export function mapAIStyleToId(aiStyle: string): string {
  const styleMap: Record<string, string> = {
    'magazine_editorial': 'magazine_editorial',
    'magazine': 'magazine_editorial',
    'editorial': 'magazine_editorial',
    'natural_organic': 'natural_organic',
    'natural': 'natural_organic',
    'organic': 'natural_organic',
    'tech_futuristic': 'tech_futuristic',
    'tech': 'tech_futuristic',
    'futuristic': 'tech_futuristic',
    'retro_vintage': 'retro_vintage',
    'retro': 'retro_vintage',
    'vintage': 'retro_vintage',
    'minimal_nordic': 'minimal_nordic',
    'minimal': 'minimal_nordic',
    'nordic': 'minimal_nordic',
    'neon_cyber': 'neon_cyber',
    'neon': 'neon_cyber',
    'cyber': 'neon_cyber',
    'watercolor_art': 'watercolor_art',
    'watercolor': 'watercolor_art',
    'art': 'watercolor_art',
  };

  const normalized = aiStyle.toLowerCase().replace(/[^a-z]/g, '_');
  return styleMap[normalized] || 'ai_auto';
}
