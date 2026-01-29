import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Phone, User, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { API_ENDPOINTS, getAuthHeaders } from '../../utils/api';
import { toast } from 'react-hot-toast';

interface WhatsAppConfig {
    id?: string;
    phoneNumber: string;
    agentName: string;
    active: boolean;
    welcomeMessage: string;
}

const WhatsAppSettings = () => {
    const [config, setConfig] = useState<WhatsAppConfig>({
        phoneNumber: '',
        agentName: 'Customer Support',
        active: false,
        welcomeMessage: 'Hello! How can we help you tonight?'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.WHATSAPP_PUBLIC);
                if (response.ok) {
                    const data = await response.json();
                    setConfig(data);
                }
            } catch (error) {
                toast.error('Failed to load WhatsApp settings');
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await fetch(API_ENDPOINTS.WHATSAPP_ADMIN, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(config)
            });

            if (response.ok) {
                toast.success('WhatsApp settings updated successfully');
            } else {
                const errData = await response.json().catch(() => ({}));
                toast.error(errData.message || 'Failed to update settings');
            }
        } catch (error) {
            toast.error('Network error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            <div className="bg-[#0f1e3a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/10 bg-gradient-to-r from-emerald-500/10 to-blue-500/10">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                        <MessageSquare className="text-emerald-400" />
                        WhatsApp Quick Access Settings
                    </h2>
                    <p className="text-gray-400 text-sm">
                        Configure the floating WhatsApp widget that appears for all website visitors.
                    </p>
                </div>

                <form onSubmit={handleSave} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Status Toggle */}
                        <div className="md:col-span-2 flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                            <div>
                                <h3 className="font-semibold text-white mb-1">Status</h3>
                                <p className="text-xs text-gray-400">Enable or disable the widget globally</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setConfig(prev => ({ ...prev, active: !prev.active }))}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${config.active ? 'bg-emerald-500' : 'bg-gray-600'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${config.active ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Agent Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1 flex items-center gap-2">
                                <User size={14} /> Agent Name
                            </label>
                            <input
                                type="text"
                                value={config.agentName}
                                onChange={(e) => setConfig(prev => ({ ...prev, agentName: e.target.value }))}
                                placeholder="e.g. Paris"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-emerald-500 transition-colors"
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1 flex items-center gap-2">
                                <Phone size={14} /> Phone Number (International Format)
                            </label>
                            <input
                                type="text"
                                value={config.phoneNumber}
                                onChange={(e) => setConfig(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                placeholder="e.g. 94771234567"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-emerald-500 transition-colors"
                            />
                            <p className="text-[10px] text-gray-500 ml-1">Do not include +, spaces or dashes</p>
                        </div>

                        {/* Welcome Message */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1 flex items-center gap-2">
                                <MessageSquare size={14} /> Default Message
                            </label>
                            <textarea
                                value={config.welcomeMessage}
                                onChange={(e) => setConfig(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-emerald-500 transition-colors resize-none"
                                placeholder="Hello! How can we help you today?"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs">
                            {config.active ? (
                                <span className="flex items-center gap-1 text-emerald-400">
                                    <CheckCircle2 size={14} /> Widget is currently live
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-amber-400">
                                    <AlertCircle size={14} /> Widget is hidden
                                </span>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default WhatsAppSettings;
