'use client';

import { createContext, useContext, ReactNode } from 'react';
import { DEFAULT_SOCIAL_LINKS, type SocialLinks } from '@/lib/socialLinks';

const SocialLinksContext = createContext<SocialLinks>(DEFAULT_SOCIAL_LINKS);

interface SocialLinksProviderProps {
    children: ReactNode;
    /** Server-fetched links, so the Hero and Footer icons are correct in the first paint. */
    socialLinks: SocialLinks;
}

export function SocialLinksProvider({ children, socialLinks }: SocialLinksProviderProps) {
    return (
        <SocialLinksContext.Provider value={socialLinks}>
            {children}
        </SocialLinksContext.Provider>
    );
}

export function useSocialLinks() {
    return useContext(SocialLinksContext);
}
