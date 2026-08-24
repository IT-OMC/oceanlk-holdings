import type { Metadata } from 'next';
import { oceanData } from '@/data/mockData';
import CompanySingle from '@/views/companies/CompanySingle';

export function generateStaticParams() {
    return oceanData.sectors.map((c: { id: string }) => ({ id: c.id }));
}

export async function generateMetadata(props: PageProps<'/companies/[id]'>): Promise<Metadata> {
    const { id } = await props.params;
    const company = oceanData.sectors.find((c: { id: string }) => c.id === id);
    if (!company) return { title: 'Company Not Found' };
    return {
        title: company.title,
        description: company.desc,
    };
}

export default function Page() {
    return <CompanySingle />;
}
