import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../utils/api';

export interface WhatsAppConfig {
    id?: string;
    phoneNumber: string;
    agentName: string;
    active: boolean;
    welcomeMessage: string;
}

export const useWhatsApp = () => {
    const [config, setConfig] = useState<WhatsAppConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchConfig = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.WHATSAPP_PUBLIC);
            if (!response.ok) throw new Error('Failed to fetch WhatsApp config');
            const data = await response.json();
            setConfig(data);
        } catch (err: any) {
            console.error('Failed to fetch WhatsApp config:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    return { config, loading, error, refetch: fetchConfig };
};
