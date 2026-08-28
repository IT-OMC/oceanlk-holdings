import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NEXT_PUBLIC_API_BASE_URL } from '@/utils/api';
import JobApplication from '@/views/careers/JobApplication';
import type { JobOpportunity } from '@/types/api';

// Live application form for a role that may close at any time -- never cache.
export const dynamic = 'force-dynamic';

async function getJob(id: string): Promise<JobOpportunity | null> {
    const res = await fetch(NEXT_PUBLIC_API_BASE_URL.JOBS, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Jobs fetch failed: ${res.status}`);
    const jobs: JobOpportunity[] = await res.json();
    return jobs.find((j) => j.id === id) ?? null;
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await props.params;
    const job = await getJob(id);
    if (!job) return { title: 'Job Not Found' };
    return {
        title: `Apply: ${job.title}`,
        description: job.description.slice(0, 160),
    };
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const job = await getJob(id);
    if (!job) notFound();
    return <JobApplication job={job} />;
}
