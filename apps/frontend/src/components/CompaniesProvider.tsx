'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { NEXT_PUBLIC_API_BASE_URL } from '@/utils/api';
import type { Company } from '@/views/companies/CompanySingle';

interface CompaniesContextValue {
    companies: Company[];
    loading: boolean;
}

const CompaniesContext = createContext<CompaniesContextValue>({ companies: [], loading: true });

interface CompaniesProviderProps {
    children: ReactNode;
    /** Server-fetched companies, so the first paint (e.g. the Hero section) never has to wait on a client fetch. */
    initialCompanies?: Company[];
}

export function CompaniesProvider({ children, initialCompanies }: CompaniesProviderProps) {
    const [companies, setCompanies] = useState<Company[]>(initialCompanies ?? []);
    const [loading, setLoading] = useState(!initialCompanies);

    useEffect(() => {
        if (initialCompanies) return;

        fetch(NEXT_PUBLIC_API_BASE_URL.COMPANIES)
            .then(res => res.json())
            .then(data => setCompanies(data))
            .catch(err => console.error('Failed to fetch companies:', err))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <CompaniesContext.Provider value={{ companies, loading }}>
            {children}
        </CompaniesContext.Provider>
    );
}

export function useCompanies() {
    return useContext(CompaniesContext);
}
