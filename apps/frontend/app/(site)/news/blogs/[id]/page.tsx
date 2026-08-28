import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NEXT_PUBLIC_API_BASE_URL } from '@/utils/api';
import BlogSingle, { type BlogPost } from '@/views/news/BlogSingle';

export const revalidate = 3600;

export async function generateStaticParams() {
    const res = await fetch(NEXT_PUBLIC_API_BASE_URL.MEDIA_BLOGS);
    if (!res.ok) return [];
    const blogs = await res.json();
    return blogs.map((b: { id: string }) => ({ id: b.id }));
}

async function getBlog(id: string) {
    const res = await fetch(NEXT_PUBLIC_API_BASE_URL.MEDIA_SINGLE(id), { next: { revalidate: 3600 } });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Blog ${id} fetch failed: ${res.status}`);
    const data = await res.json();
    const blog: BlogPost = {
        id: data.id,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        author: data.author || 'OceanLK Team',
        publishedDate: new Date(data.publishedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
        category: data.category,
        readTime: data.readTime || '5 min read',
    };
    return blog;
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await props.params;
    const blog = await getBlog(id);
    if (!blog) return { title: 'Blog Post Not Found' };
    return {
        title: blog.title,
        description: blog.description.replace(/<[^>]*>/g, '').slice(0, 160),
        openGraph: { title: blog.title, images: blog.imageUrl ? [blog.imageUrl] : [] },
    };
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const blog = await getBlog(id);
    if (!blog) notFound();
    return <BlogSingle blog={blog} />;
}
