import type { Metadata } from 'next';
import { NEXT_PUBLIC_API_BASE_URL } from '@/utils/api';
import Media, { type MediaItem } from '@/views/news/Media';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Media Center',
    description: 'Videos, galleries, and documents from OceanLK Holdings.',
};

export default async function Page() {
    const res = await fetch(NEXT_PUBLIC_API_BASE_URL.MEDIA_MEDIA, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Media fetch failed: ${res.status}`);
    const mediaItems: MediaItem[] = await res.json();

    return <Media mediaItems={mediaItems} />;
}
