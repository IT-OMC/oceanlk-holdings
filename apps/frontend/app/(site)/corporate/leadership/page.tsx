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
    let leaders: CorporateLeader[] = [];
    let categories: LeadershipCategory[] = [];

    try {
        const [leadersRes, categoriesRes] = await Promise.all([
            fetch(NEXT_PUBLIC_API_BASE_URL.LEADERSHIP, { next: { revalidate: 3600 } }),
            fetch(NEXT_PUBLIC_API_BASE_URL.LEADERSHIP_CATEGORIES, { next: { revalidate: 3600 } }),
        ]);
        if (leadersRes.ok && categoriesRes.ok) {
            leaders = await leadersRes.json();
            categories = await categoriesRes.json();
        } else {
            console.warn(`Leadership fetch failed: ${leadersRes.status} / ${categoriesRes.status}`);
        }
    } catch (e) {
        console.warn('Backend unreachable during build, skipping static generation for leadership.');
    }

    return <Leadership leaders={leaders} categories={categories} />;
}
