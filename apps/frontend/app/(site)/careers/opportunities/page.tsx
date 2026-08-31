import type { Metadata } from 'next';
import { NEXT_PUBLIC_API_BASE_URL } from '@/utils/api';
import Onboard, { type JobOpportunity } from '@/views/careers/Onboard';

export const revalidate = 300;

export const metadata: Metadata = {
    title: 'Career Opportunities',
    description: "Discover where your talent fits in Ocean Ceylon Holdings' ecosystem of innovative companies.",
};

export default async function Page() {
    let jobOpenings: JobOpportunity[] = [];
    try {
        const res = await fetch(NEXT_PUBLIC_API_BASE_URL.JOBS, { next: { revalidate: 300 } });
        if (res.ok) {
            jobOpenings = await res.json();
        }
    } catch {
        console.warn('Backend unreachable during build, skipping static generation for opportunities.');
    }

    return <Onboard jobOpenings={jobOpenings} />;
}
