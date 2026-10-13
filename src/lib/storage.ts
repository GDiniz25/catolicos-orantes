import { supabase } from './supabase';

const BUCKET = 'article-images';

/**
 * Downloads an image from a URL and uploads it to Supabase Storage.
 * Returns the public URL of the stored image.
 */
export async function uploadImageFromUrl(
  imageUrl: string,
  fileName: string
): Promise<string | null> {
  try {
    // Download the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error('Failed to download image:', response.status);
      return null;
    }

    const blob = await response.blob();
    const extension = blob.type === 'image/png' ? 'png' : 'jpg';
    const path = `${fileName}.${extension}`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, {
        contentType: blob.type,
        upsert: true,
      });

    if (error) {
      console.error('Storage upload error:', error.message);
      return null;
    }

    // Get public URL
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.error('uploadImageFromUrl error:', err);
    return null;
  }
}

/**
 * Uploads multiple Unsplash images to Storage and returns their public URLs.
 * Used during article generation to persist images.
 */
export async function uploadArticleImages(
  images: { url: string; alt: string; credit: string }[],
  articleSlug: string
): Promise<{ url: string; alt: string; credit: string }[]> {
  const results: { url: string; alt: string; credit: string }[] = [];

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const fileName = `${articleSlug}/img-${i + 1}-${Date.now()}`;
    const storedUrl = await uploadImageFromUrl(img.url, fileName);

    results.push({
      url: storedUrl || img.url, // Fallback to original URL if upload fails
      alt: img.alt,
      credit: img.credit,
    });
  }

  return results;
}
