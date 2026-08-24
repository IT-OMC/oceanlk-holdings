import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NEXT_PUBLIC_API_BASE_URL } from '@/utils/api';
import CompanySingle from '@/views/companies/CompanySingle';
import type { Company } from '@/views/companies/CompanySingle';

export const revalidate = 3600;

export async function generateStaticParams() {
    const res = await fetch(NEXT_PUBLIC_API_BASE_URL.COMPANIES);
    if (!res.ok) return [];
    const companies: Company[] = await res.json();
    return companies.map((c) => ({ id: c.id }));
}

async function getCompany(id: string): Promise<Company | null> {
    const res = await fetch(NEXT_PUBLIC_API_BASE_URL.COMPANY_BY_ID(id), { next: { revalidate: 3600 } });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Company ${id} fetch failed: ${res.status}`);
    return res.json();
}

export async function generateMetadata(props: PageProps<'/companies/[id]'>): Promise<Metadata> {
    const { id } = await props.params;
    const company = await getCompany(id);
    if (!company) return { title: 'Company Not Found' };
    return {
        title: company.title,
        description: company.description,
    };
}

export default async function Page(props: PageProps<'/companies/[id]'>) {
    const { id } = await props.params;

    const [company, companiesRes] = await Promise.all([
        getCompany(id),
        fetch(NEXT_PUBLIC_API_BASE_URL.COMPANIES, { next: { revalidate: 3600 } }),
    ]);

    if (!company) notFound();

    const allCompanies: Company[] = companiesRes.ok ? await companiesRes.json() : [];
    const relatedCompanies = allCompanies.filter((c) => c.id !== id).slice(0, 3);

    return <CompanySingle company={company} relatedCompanies={relatedCompanies} />;
}
