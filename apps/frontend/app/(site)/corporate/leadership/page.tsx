import type { Metadata } from 'next';
import { NEXT_PUBLIC_API_BASE_URL } from '@/utils/api';
import Leadership from '@/views/corporate/Leadership';
import type { CorporateLeader, LeadershipCategory } from '@/types/api';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Leadership',
    description: 'Meet the leadership team driving Ocean Ceylon Holdings.',
};

export default async function Page() {
    const [leadersRes, categoriesRes] = await Promise.all([
        fetch(NEXT_PUBLIC_API_BASE_URL.LEADERSHIP, { next: { revalidate: 3600 } }),
        fetch(NEXT_PUBLIC_API_BASE_URL.LEADERSHIP_CATEGORIES, { next: { revalidate: 3600 } }),
    ]);
    if (!leadersRes.ok || !categoriesRes.ok) {
        throw new Error(`Leadership fetch failed: ${leadersRes.status} / ${categoriesRes.status}`);
    }
    const leaders: CorporateLeader[] = await leadersRes.json();
    const categories: LeadershipCategory[] = await categoriesRes.json();

    return <Leadership leaders={leaders} categories={categories} />;
}
