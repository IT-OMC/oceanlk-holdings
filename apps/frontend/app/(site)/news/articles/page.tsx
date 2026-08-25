import type { Metadata } from 'next';
import { NEXT_PUBLIC_API_BASE_URL } from '@/utils/api';
import News, { type NewsArticle } from '@/views/news/News';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Latest News',
    description: 'Stay updated with our latest announcements and achievements.',
};

function getGridSpan(index: number) {
    if (index === 0) return 'md:col-span-2 md:row-span-2';
    if (index === 1) return 'md:col-span-1 md:row-span-2';
    return 'md:col-span-1 md:row-span-1';
}

export default async function Page() {
    const res = await fetch(NEXT_PUBLIC_API_BASE_URL.MEDIA_NEWS, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`News fetch failed: ${res.status}`);
    const data = await res.json();

    const newsArticles: NewsArticle[] = data.map((item: any, index: number) => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt || item.description,
        description: item.description,
        imageUrl: item.imageUrl,
        publishedDate: new Date(item.publishedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
        category: item.category,
        span: getGridSpan(index),
    }));

    return <News newsArticles={newsArticles} />;
}
