import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NEXT_PUBLIC_API_BASE_URL } from '@/utils/api';
import NewsSingle, { type NewsArticle } from '@/views/news/NewsSingle';

export const revalidate = 3600;

export async function generateStaticParams() {
    const res = await fetch(NEXT_PUBLIC_API_BASE_URL.MEDIA_NEWS);
    if (!res.ok) return [];
    const articles = await res.json();
    return articles.map((a: { id: string }) => ({ id: a.id }));
}

async function getArticle(id: string) {
    const res = await fetch(NEXT_PUBLIC_API_BASE_URL.MEDIA_SINGLE(id), { next: { revalidate: 3600 } });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Article ${id} fetch failed: ${res.status}`);
    const data = await res.json();
    const article: NewsArticle = {
        id: data.id,
        title: data.title,
        content: data.description,
        imageUrl: data.imageUrl,
        publishedDate: new Date(data.publishedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
        category: data.category,
    };
    return article;
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await props.params;
    const article = await getArticle(id);
    if (!article) return { title: 'Article Not Found' };
    return {
        title: article.title,
        description: article.content.replace(/<[^>]*>/g, '').slice(0, 160),
        openGraph: { title: article.title, images: article.imageUrl ? [article.imageUrl] : [] },
    };
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const article = await getArticle(id);
    if (!article) notFound();
    return <NewsSingle article={article} />;
}
