import type { MetadataRoute } from 'next';
import { NEXT_PUBLIC_API_BASE_URL } from '@/utils/api';
import { oceanData } from '@/data/mockData';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

async function fetchIds(url: string): Promise<string[]> {
    try {
        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) return [];
        const data = await res.json();
        return data.map((item: { id: string }) => item.id);
    } catch {
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes = [
        '',
        '/corporate/profile',
        '/corporate/leadership',
        '/companies',
        '/careers/culture',
        '/careers/opportunities',
        '/careers/talent-pool',
        '/news/blogs',
        '/news/articles',
        '/news/media',
        '/contact',
    ].map((path) => ({
        url: `${siteUrl}${path}`,
        lastModified: new Date(),
    }));

    const companyRoutes = oceanData.sectors.map((c: { id: string }) => ({
        url: `${siteUrl}/companies/${c.id}`,
        lastModified: new Date(),
    }));

    const [blogIds, articleIds, mediaIds] = await Promise.all([
        fetchIds(NEXT_PUBLIC_API_BASE_URL.MEDIA_BLOGS),
        fetchIds(NEXT_PUBLIC_API_BASE_URL.MEDIA_NEWS),
        fetchIds(NEXT_PUBLIC_API_BASE_URL.MEDIA_MEDIA),
    ]);

    const blogRoutes = blogIds.map((id) => ({ url: `${siteUrl}/news/blogs/${id}`, lastModified: new Date() }));
    const articleRoutes = articleIds.map((id) => ({ url: `${siteUrl}/news/articles/${id}`, lastModified: new Date() }));
    const mediaRoutes = mediaIds.map((id) => ({ url: `${siteUrl}/news/media/${id}`, lastModified: new Date() }));

    return [...staticRoutes, ...companyRoutes, ...blogRoutes, ...articleRoutes, ...mediaRoutes];
}
