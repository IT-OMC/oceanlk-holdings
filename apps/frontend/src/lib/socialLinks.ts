import { NEXT_PUBLIC_API_BASE_URL } from '@/utils/api';
import { companyData } from '@/data/companyData';

/**
 * Social links are stored as a single `page_content` row so that one admin edit
 * produces exactly one pending change for the super admin to approve — rather
 * than six separate approvals for six separate URLs.
 *
 * These identifiers MUST be uppercase. The public GET route uppercases whatever
 * is in the URL, but POST /api/content upserts on the exact strings it receives,
 * so a lowercase POST would create a second, unreachable row.
 */
export const SOCIAL_LINKS_PAGE = 'GLOBAL';
export const SOCIAL_LINKS_SECTION = 'SOCIAL_LINKS';

/** A platform is only shown on the site when `enabled` is true AND `url` is non-empty. */
export interface SocialLink {
    url: string;
    enabled: boolean;
}

export interface SocialLinks {
    facebook: SocialLink;
    linkedin: SocialLink;
    instagram: SocialLink;
    x: SocialLink;
    weChat: SocialLink;
    youtube: SocialLink;
}

/** Drives both the admin form and the icon rows, so the two can't drift apart. */
export const SOCIAL_PLATFORMS: { key: keyof SocialLinks; label: string; placeholder: string }[] = [
    { key: 'facebook', label: 'Facebook', placeholder: 'https://www.facebook.com/yourpage' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://www.linkedin.com/company/yourcompany/' },
    { key: 'instagram', label: 'Instagram', placeholder: 'https://www.instagram.com/yourhandle/' },
    { key: 'x', label: 'X (Twitter)', placeholder: 'https://www.x.com/yourhandle/' },
    { key: 'weChat', label: 'WeChat', placeholder: 'https://wechat.com/en/yourpage' },
    { key: 'youtube', label: 'YouTube', placeholder: 'https://www.youtube.com/yourchannel' },
];

/**
 * Fallback used before an admin has ever saved the row, and whenever the API is
 * unreachable. Seeded from the values that used to be hardcoded, so the site
 * looks identical on day one (all enabled).
 */
export const DEFAULT_SOCIAL_LINKS: SocialLinks = SOCIAL_PLATFORMS.reduce((acc, { key }) => {
    acc[key] = { url: companyData.socialMedio[key], enabled: true };
    return acc;
}, {} as SocialLinks);

/** True only when a platform should actually be rendered on the site. */
export const isSocialLinkVisible = (link: SocialLink) => link.enabled && link.url.trim().length > 0;

function normalizeLink(raw: unknown, fallback: SocialLink): SocialLink {
    // Legacy rows (saved before the enabled toggle existed) store a bare URL
    // string; treat those as enabled so previously-live links keep showing.
    if (typeof raw === 'string') {
        const url = raw.trim();
        return { url, enabled: url.length > 0 };
    }
    if (raw && typeof raw === 'object') {
        const obj = raw as Partial<SocialLink>;
        return {
            url: typeof obj.url === 'string' ? obj.url.trim() : fallback.url,
            enabled: typeof obj.enabled === 'boolean' ? obj.enabled : fallback.enabled,
        };
    }
    return fallback;
}

/** Tolerant parse: bad or partial JSON degrades to the defaults rather than blanking the footer. */
export function parseSocialLinks(content?: string | null): SocialLinks {
    if (!content) return { ...DEFAULT_SOCIAL_LINKS };
    try {
        const parsed = JSON.parse(content) as Partial<Record<keyof SocialLinks, unknown>>;
        if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_SOCIAL_LINKS };
        const merged = {} as SocialLinks;
        for (const { key } of SOCIAL_PLATFORMS) {
            merged[key] = normalizeLink(parsed[key], DEFAULT_SOCIAL_LINKS[key]);
        }
        return merged;
    } catch {
        return { ...DEFAULT_SOCIAL_LINKS };
    }
}

/**
 * Server-side read for the site layout. Never throws: a dead backend degrades to
 * the defaults instead of failing the whole page render.
 */
export async function getSocialLinks(): Promise<SocialLinks> {
    try {
        const res = await fetch(
            NEXT_PUBLIC_API_BASE_URL.CONTENT_BY_SECTION(SOCIAL_LINKS_PAGE, SOCIAL_LINKS_SECTION),
            { next: { revalidate: 300 } },
        );
        if (!res.ok) return { ...DEFAULT_SOCIAL_LINKS };
        const data = await res.json();
        return parseSocialLinks(data?.content);
    } catch {
        return { ...DEFAULT_SOCIAL_LINKS };
    }
}
