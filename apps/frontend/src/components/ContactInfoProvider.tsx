'use client';

import { createContext, useContext, ReactNode } from 'react';
import { DEFAULT_CONTACT_INFO, type ContactInfo } from '@/lib/contactInfo';

const ContactInfoContext = createContext<ContactInfo>(DEFAULT_CONTACT_INFO);

interface ContactInfoProviderProps {
    children: ReactNode;
    /** Server-fetched info, so the Footer (and Contact page) are correct on first paint. */
    contactInfo: ContactInfo;
}

export function ContactInfoProvider({ children, contactInfo }: ContactInfoProviderProps) {
    return (
        <ContactInfoContext.Provider value={contactInfo}>
            {children}
        </ContactInfoContext.Provider>
    );
}

export function useContactInfo() {
    return useContext(ContactInfoContext);
}
