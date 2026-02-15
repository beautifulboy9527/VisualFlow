import { supabase } from '@/integrations/supabase/client';
import type { ImageType } from '@/components/workbench/MultiImageUpload';

const THUMB_SIZE = 256; // Small enough to save tokens, big enough for classification

/**
 * Compress an image file to a small base64 thumbnail for AI classification.
 * This dramatically reduces token consumption vs sending full-res images.
 */
export async function compressToThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(THUMB_SIZE / img.width, THUMB_SIZE / img.height, 1);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.6));
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Batch classify images using AI. Sends compressed thumbnails to minimize token usage.
 * Returns an array of ImageType classifications.
 */
export async function classifyImages(files: File[]): Promise<ImageType[]> {
  try {
    const thumbnails = await Promise.all(files.map(compressToThumbnail));

    const { data, error } = await supabase.functions.invoke('classify-images', {
      body: { thumbnails }
    });

    if (error) {
      console.error('classify-images error:', error);
      return fallbackClassification(files.length);
    }

    if (data?.categories && Array.isArray(data.categories)) {
      return data.categories as ImageType[];
    }

    return fallbackClassification(files.length);
  } catch (err) {
    console.error('Classification failed, using fallback:', err);
    return fallbackClassification(files.length);
  }
}

/** Sequential fallback when AI is unavailable */
function fallbackClassification(count: number): ImageType[] {
  const order: ImageType[] = ['main', 'angle', 'detail', 'lifestyle', 'model', 'packaging'];
  return Array.from({ length: count }, (_, i) => order[Math.min(i, order.length - 1)]);
}
