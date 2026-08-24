import type { Metadata } from 'next';
import { NEXT_PUBLIC_API_BASE_URL } from '@/utils/api';
import Blogs, { type BlogPost } from '@/views/news/Blogs';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Our Blog',
    description: 'Insights, stories, and perspectives from across the OceanLK group.',
};

function getGridSpan(index: number) {
    if (index === 0) return 'md:col-span-2 md:row-span-2';
    if (index === 1) return 'md:col-span-1 md:row-span-2';
    return 'md:col-span-1 md:row-span-1';
}

export default async function Page() {
    const res = await fetch(NEXT_PUBLIC_API_BASE_URL.MEDIA_BLOGS, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Blogs fetch failed: ${res.status}`);
    const data = await res.json();

    const blogPosts: BlogPost[] = data.map((item: any, index: number) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        excerpt: item.excerpt || item.description,
        imageUrl: item.imageUrl,
        author: item.author || 'OceanLK Team',
        publishedDate: new Date(item.publishedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
        category: item.category,
        readTime: item.readTime || '5 min read',
        span: getGridSpan(index),
    }));

    return <Blogs blogPosts={blogPosts} />;
}
