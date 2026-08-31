'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw, Clock, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { NEXT_PUBLIC_API_BASE_URL, getAuthHeaders } from '../../utils/api';
import {
    DEFAULT_SOCIAL_LINKS,
    SOCIAL_LINKS_PAGE,
    SOCIAL_LINKS_SECTION,
    SOCIAL_PLATFORMS,
    parseSocialLinks,
    type SocialLinks,
} from '../../lib/socialLinks';

interface PendingChangeSummary {
    id: string;
    entityType: string;
    status: string;
    changeData?: string;
    submittedAt?: string;
}

const isValidUrl = (value: string) => {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
};

const SocialLinksManagement = () => {
    const [links, setLinks] = useState<SocialLinks>(DEFAULT_SOCIAL_LINKS);
    const [savedLinks, setSavedLinks] = useState<SocialLinks>(DEFAULT_SOCIAL_LINKS);
    const [errors, setErrors] = useState<Partial<Record<keyof SocialLinks, string>>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [pendingSubmission, setPendingSubmission] = useState<PendingChangeSummary | null>(null);

    // sessionStorage is read in an effect, not at render time: this component is
    // prerendered on the server, where sessionStorage does not exist.
    useEffect(() => {
        setIsSuperAdmin(sessionStorage.getItem('adminRole') === 'SUPER_ADMIN');
    }, []);

    const fetchLinks = useCallback(async () => {
        try {
            const res = await fetch(
                NEXT_PUBLIC_API_BASE_URL.CONTENT_BY_SECTION(SOCIAL_LINKS_PAGE, SOCIAL_LINKS_SECTION),
            );
            // 404 simply means no admin has saved the row yet -> keep the defaults.
            const parsed = res.ok ? parseSocialLinks((await res.json())?.content) : { ...DEFAULT_SOCIAL_LINKS };
            setLinks(parsed);
            setSavedLinks(parsed);
        } catch {
            toast.error('Could not load the current social links');
        } finally {
            setLoading(false);
        }
    }, []);

    /** Surfaces "you already have an edit waiting on approval" so admins don't resubmit blindly. */
    const fetchPendingSubmission = useCallback(async () => {
        try {
            const res = await fetch(NEXT_PUBLIC_API_BASE_URL.PENDING_CHANGES_MY, {
                headers: getAuthHeaders(),
            });
            if (!res.ok) return;
            const all: PendingChangeSummary[] = await res.json();
            const mine = all.find(
                (c) =>
                    c.entityType === 'PageContent' &&
                    c.status === 'PENDING' &&
                    (c.changeData ?? '').includes(SOCIAL_LINKS_SECTION),
            );
            setPendingSubmission(mine ?? null);
        } catch {
            // Non-critical: the banner is an aid, not a gate.
        }
    }, []);

    useEffect(() => {
        fetchLinks();
        fetchPendingSubmission();
    }, [fetchLinks, fetchPendingSubmission]);

    const handleUrlChange = (key: keyof SocialLinks, value: string) => {
        setLinks((prev) => ({ ...prev, [key]: { ...prev[key], url: value } }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    const handleToggle = (key: keyof SocialLinks) => {
        setLinks((prev) => ({ ...prev, [key]: { ...prev[key], enabled: !prev[key].enabled } }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    const validate = () => {
        const next: Partial<Record<keyof SocialLinks, string>> = {};
        for (const { key, label } of SOCIAL_PLATFORMS) {
            const { url, enabled } = links[key];
            // A disabled platform isn't shown on the site, so its URL doesn't
            // need to be filled in or even valid yet.
            if (!enabled) continue;
            const value = url.trim();
            if (!value) next[key] = `${label} URL is required while it's shown on the site`;
            else if (!isValidUrl(value)) next[key] = 'Must be a full http:// or https:// URL';
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const isDirty = SOCIAL_PLATFORMS.some(
        ({ key }) => links[key].url.trim() !== savedLinks[key].url || links[key].enabled !== savedLinks[key].enabled,
    );

    const handleSave = async () => {
        if (!validate()) {
            toast.error('Please fix the highlighted links');
            return;
        }

        setSaving(true);
        try {
            const trimmed = SOCIAL_PLATFORMS.reduce((acc, { key }) => {
                acc[key] = { url: links[key].url.trim(), enabled: links[key].enabled };
                return acc;
            }, {} as SocialLinks);

            const res = await fetch(NEXT_PUBLIC_API_BASE_URL.CONTENT_UPDATE, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    // Uppercase is required: the backend upserts on these exact strings.
                    pageIdentifier: SOCIAL_LINKS_PAGE,
                    sectionIdentifier: SOCIAL_LINKS_SECTION,
                    title: 'Social Media Links',
                    content: JSON.stringify(trimmed),
                }),
            });

            if (!res.ok) {
                toast.error('Failed to save social links');
                return;
            }

            const data = await res.json();

            if (data?.pendingChange) {
                // Admin path: nothing is live until a super admin approves.
                toast.success('Submitted for approval');
                setPendingSubmission(data.pendingChange as PendingChangeSummary);
            } else {
                // Super admin path: applied immediately.
                toast.success('Social links updated');
                setSavedLinks(trimmed);
                setLinks(trimmed);
            }
        } catch {
            toast.error('An error occurred while saving');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setLinks(savedLinks);
        setErrors({});
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">

                <span
                    className={`text-xs px-3 py-1.5 rounded-full border ${isSuperAdmin
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                >
                    {isSuperAdmin ? 'Changes publish immediately' : 'Changes require super admin approval'}
                </span>
            </div>

            {pendingSubmission && !isSuperAdmin && (
                <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                    <Clock size={18} className="text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-amber-200/90">
                        You have a social links edit awaiting approval. The site keeps showing the current
                        links until a super admin approves it in{' '}
                        <span className="font-medium">Pending Changes</span>.
                    </p>
                </div>
            )}

            <div className="bg-[#0B1120] rounded-lg border border-gray-800 divide-y divide-gray-800/60">
                {SOCIAL_PLATFORMS.map(({ key, label, placeholder }, index) => {
                    const { url, enabled } = links[key];
                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className={`p-5 transition-opacity ${enabled ? '' : 'opacity-60'}`}
                        >
                            <div className="flex items-center justify-between mb-2 gap-3">
                                <div className="flex items-center gap-3">
                                    <label htmlFor={`social-${key}`} className="text-sm font-medium text-gray-300">
                                        {label}
                                    </label>
                                    <span className={`text-xs ${enabled ? 'text-emerald-400' : 'text-gray-500'}`}>
                                        {enabled ? 'Shown on site' : 'Hidden'}
                                    </span>
                                </div>
                                {isValidUrl(url.trim()) && (
                                    <a
                                        href={url.trim()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-gray-500 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                                    >
                                        Open <ExternalLink size={12} />
                                    </a>
                                )}
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex-1">
                                    <input
                                        id={`social-${key}`}
                                        type="url"
                                        inputMode="url"
                                        value={url}
                                        placeholder={placeholder}
                                        onChange={(e) => handleUrlChange(key, e.target.value)}
                                        className={`w-full bg-[#151C2C] border rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none transition-colors ${errors[key]
                                                ? 'border-rose-500/60 focus:border-rose-500'
                                                : 'border-gray-700 focus:border-emerald-500'
                                            }`}
                                    />
                                    {errors[key] && <p className="text-xs text-rose-400 mt-1.5">{errors[key]}</p>}
                                </div>
                                <div className="flex items-center h-10 shrink-0">
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={enabled}
                                        aria-label={`${enabled ? 'Hide' : 'Show'} ${label} on the site`}
                                        onClick={() => handleToggle(key)}
                                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${enabled ? 'bg-emerald-600' : 'bg-gray-700'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={handleReset}
                    disabled={!isDirty || saving}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-gray-300 border border-gray-700 hover:bg-gray-800/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <RotateCcw size={16} />
                    Reset
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={!isDirty || saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <Save size={16} />
                    {saving ? 'Saving…' : isSuperAdmin ? 'Save changes' : 'Submit for approval'}
                </button>
            </div>
        </div>
    );
};

export default SocialLinksManagement;
