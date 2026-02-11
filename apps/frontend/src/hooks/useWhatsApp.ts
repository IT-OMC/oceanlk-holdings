import { useState } from 'react';

export interface WhatsAppConfig {
    id?: string;
    phoneNumber: string; // Kept for interface compatibility but unused
    agentName: string;
    active: boolean;
    welcomeMessage: string;
}

export const useWhatsApp = () => {
    // Static config since we are removing the admin panel settings
    const [config] = useState<WhatsAppConfig>({
        phoneNumber: '',
        agentName: 'Ocean Assistant',
        active: true,
        welcomeMessage: 'Hello! How can I help you today?'
    });
    const [loading] = useState(false);
    const [error] = useState<string | null>(null);

    return { config, loading, error, refetch: () => { } };
};
