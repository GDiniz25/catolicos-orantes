export interface UnsplashImage {
  url: string;
  alt: string;
  credit: string;
  creditUrl: string;
}

// Unsplash search is now handled server-side in the generate-article edge function.
// This client-side function is kept for the image regeneration feature (admin only).
// It requires the edge function for security.

import { supabase } from './supabase';

export async function searchImages(
  query: string,
  count: number = 3
): Promise<UnsplashImage[]> {
  const { data, error } = await supabase.functions.invoke('search-unsplash', {
    body: { query, count },
  });
  if (error || !data) return [];
  return data as UnsplashImage[];
}
