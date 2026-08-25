import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NEXT_PUBLIC_API_BASE_URL } from '@/utils/api';
import MediaSingle, { type MediaItem } from '@/views/news/MediaSingle';

export const revalidate = 3600;

export async function generateStaticParams() {
    const res = await fetch(NEXT_PUBLIC_API_BASE_URL.MEDIA_MEDIA);
    if (!res.ok) return [];
    const items = await res.json();
    return items.map((m: { id: string }) => ({ id: m.id }));
}

async function getMediaItem(id: string) {
    const res = await fetch(NEXT_PUBLIC_API_BASE_URL.MEDIA_SINGLE(id), { next: { revalidate: 3600 } });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Media ${id} fetch failed: ${res.status}`);
    const media: MediaItem = await res.json();
    return media;
}

export async function generateMetadata(props: PageProps<'/news/media/[id]'>): Promise<Metadata> {
    const { id } = await props.params;
    const media = await getMediaItem(id);
    if (!media) return { title: 'Media Not Found' };
    return {
        title: media.title,
        description: media.description?.slice(0, 160),
        openGraph: { title: media.title, images: media.imageUrl ? [media.imageUrl] : [] },
    };
}

export default async function Page(props: PageProps<'/news/media/[id]'>) {
    const { id } = await props.params;
    const media = await getMediaItem(id);
    if (!media) notFound();
    return <MediaSingle media={media} />;
}
