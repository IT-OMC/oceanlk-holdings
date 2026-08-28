import { NEXT_PUBLIC_API_BASE_URL } from '@/utils/api';

/**
 * Contact info is stored as a single `page_content` row (like social links) so
 * that one admin edit produces exactly one pending change for the super admin
 * to approve, rather than a separate approval per address line/phone/email.
 *
 * These identifiers MUST be uppercase. The public GET route uppercases whatever
 * is in the URL, but POST /api/content upserts on the exact strings it receives,
 * so a lowercase POST would create a second, unreachable row.
 */
export const CONTACT_INFO_PAGE = 'CONTACT';
export const CONTACT_INFO_SECTION = 'CONTACT_INFO';

export interface ContactInfo {
    headOfficeLines: string[];
    phones: string[];
    emails: string[];
}

/**
 * Fallback used before an admin has ever saved the row, and whenever the API is
 * unreachable. Seeded from the values that used to be hardcoded in Contact.tsx,
 * so the site looks identical on day one.
 */
export const DEFAULT_CONTACT_INFO: ContactInfo = {
    headOfficeLines: ['Ocean Ceylon Holdings', '123 Galle Road', 'Colombo 03, Sri Lanka'],
    phones: ['+94 11 234 5678', '+94 77 123 4567'],
    emails: ['info@oceanlk.com', 'careers@oceanlk.com'],
};

function sanitizeLines(value: unknown, fallback: string[]): string[] {
    if (!Array.isArray(value)) return [...fallback];
    const lines = value
        .filter((line): line is string => typeof line === 'string' && line.trim().length > 0)
        .map((line) => line.trim());
    return lines.length > 0 ? lines : [...fallback];
}

/** Tolerant parse: bad or partial JSON degrades to the defaults rather than blanking the page. */
export function parseContactInfo(content?: string | null): ContactInfo {
    if (!content) return { ...DEFAULT_CONTACT_INFO };
    try {
        const parsed = JSON.parse(content) as Partial<Record<keyof ContactInfo, unknown>>;
        if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_CONTACT_INFO };
        return {
            headOfficeLines: sanitizeLines(parsed.headOfficeLines, DEFAULT_CONTACT_INFO.headOfficeLines),
            phones: sanitizeLines(parsed.phones, DEFAULT_CONTACT_INFO.phones),
            emails: sanitizeLines(parsed.emails, DEFAULT_CONTACT_INFO.emails),
        };
    } catch {
        return { ...DEFAULT_CONTACT_INFO };
    }
}

/**
 * Server-side read for the Contact page. Never throws: a dead backend degrades
 * to the defaults instead of failing the whole page render.
 */
export async function getContactInfo(): Promise<ContactInfo> {
    try {
        const res = await fetch(
            NEXT_PUBLIC_API_BASE_URL.CONTENT_BY_SECTION(CONTACT_INFO_PAGE, CONTACT_INFO_SECTION),
            { next: { revalidate: 300 } },
        );
        if (!res.ok) return { ...DEFAULT_CONTACT_INFO };
        const data = await res.json();
        return parseContactInfo(data?.content);
    } catch {
        return { ...DEFAULT_CONTACT_INFO };
    }
}
