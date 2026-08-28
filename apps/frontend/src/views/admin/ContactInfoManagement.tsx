'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { NEXT_PUBLIC_API_BASE_URL, getAuthHeaders } from '../../utils/api';
import {
    DEFAULT_CONTACT_INFO,
    CONTACT_INFO_PAGE,
    CONTACT_INFO_SECTION,
    parseContactInfo,
    type ContactInfo,
} from '../../lib/contactInfo';

interface PendingChangeSummary {
    id: string;
    entityType: string;
    status: string;
    changeData?: string;
    submittedAt?: string;
}

const FIELDS: { key: keyof ContactInfo; label: string; placeholder: string; hint: string }[] = [
    {
        key: 'headOfficeLines',
        label: 'Head Office Address',
        placeholder: 'Ocean Ceylon Holdings\n123 Galle Road\nColombo 03, Sri Lanka',
        hint: 'One line per row, shown in that order on the Contact page.',
    },
    {
        key: 'phones',
        label: 'Phone Numbers',
        placeholder: '+94 11 234 5678\n+94 77 123 4567',
        hint: 'One phone number per line.',
    },
    {
        key: 'emails',
        label: 'Email Addresses',
        placeholder: 'info@oceanlk.com\ncareers@oceanlk.com',
        hint: 'One email address per line.',
    },
];

type ContactInfoText = Record<keyof ContactInfo, string>;

const toLines = (value: string[]) => value.join('\n');
const fromLines = (value: string) =>
    value.split('\n').map((line) => line.trim()).filter(Boolean);

const infoToText = (info: ContactInfo): ContactInfoText => ({
    headOfficeLines: toLines(info.headOfficeLines),
    phones: toLines(info.phones),
    emails: toLines(info.emails),
});

const ContactInfoManagement = () => {
    const [text, setText] = useState<ContactInfoText>(infoToText(DEFAULT_CONTACT_INFO));
    const [savedText, setSavedText] = useState<ContactInfoText>(text);
    const [errors, setErrors] = useState<Partial<Record<keyof ContactInfo, string>>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [pendingSubmission, setPendingSubmission] = useState<PendingChangeSummary | null>(null);

    // sessionStorage is read in an effect, not at render time: this component is
    // prerendered on the server, where sessionStorage does not exist.
    useEffect(() => {
        setIsSuperAdmin(sessionStorage.getItem('adminRole') === 'SUPER_ADMIN');
    }, []);

    const fetchInfo = useCallback(async () => {
        try {
            const res = await fetch(
                NEXT_PUBLIC_API_BASE_URL.CONTENT_BY_SECTION(CONTACT_INFO_PAGE, CONTACT_INFO_SECTION),
            );
            // 404 simply means no admin has saved the row yet -> keep the defaults.
            const parsed = res.ok ? parseContactInfo((await res.json())?.content) : { ...DEFAULT_CONTACT_INFO };
            const asText = infoToText(parsed);
            setText(asText);
            setSavedText(asText);
        } catch {
            toast.error('Could not load the current contact info');
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
                    (c.changeData ?? '').includes(CONTACT_INFO_SECTION),
            );
            setPendingSubmission(mine ?? null);
        } catch {
            // Non-critical: the banner is an aid, not a gate.
        }
    }, []);

    useEffect(() => {
        fetchInfo();
        fetchPendingSubmission();
    }, [fetchInfo, fetchPendingSubmission]);

    const handleChange = (key: keyof ContactInfo, value: string) => {
        setText((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    const validate = () => {
        const next: Partial<Record<keyof ContactInfo, string>> = {};
        for (const { key, label } of FIELDS) {
            if (fromLines(text[key]).length === 0) next[key] = `${label} needs at least one line`;
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const isDirty = FIELDS.some(({ key }) => text[key] !== savedText[key]);

    const handleSave = async () => {
        if (!validate()) {
            toast.error('Please fix the highlighted fields');
            return;
        }

        setSaving(true);
        try {
            const payload: ContactInfo = {
                headOfficeLines: fromLines(text.headOfficeLines),
                phones: fromLines(text.phones),
                emails: fromLines(text.emails),
            };

            const res = await fetch(NEXT_PUBLIC_API_BASE_URL.CONTENT_UPDATE, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    // Uppercase is required: the backend upserts on these exact strings.
                    pageIdentifier: CONTACT_INFO_PAGE,
                    sectionIdentifier: CONTACT_INFO_SECTION,
                    title: 'Contact Info',
                    content: JSON.stringify(payload),
                }),
            });

            if (!res.ok) {
                toast.error('Failed to save contact info');
                return;
            }

            const data = await res.json();

            if (data?.pendingChange) {
                // Admin path: nothing is live until a super admin approves.
                toast.success('Submitted for approval');
                setPendingSubmission(data.pendingChange as PendingChangeSummary);
            } else {
                // Super admin path: applied immediately.
                toast.success('Contact info updated');
                setSavedText(text);
            }
        } catch {
            toast.error('An error occurred while saving');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setText(savedText);
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
                    className={`text-xs px-3 py-1.5 rounded-full border ${
                        isSuperAdmin
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
                        You have a contact info edit awaiting approval. The site keeps showing the
                        current details until a super admin approves it in{' '}
                        <span className="font-medium">Pending Changes</span>.
                    </p>
                </div>
            )}

            <div className="bg-[#0B1120] rounded-lg border border-gray-800 divide-y divide-gray-800/60">
                {FIELDS.map(({ key, label, placeholder, hint }, index) => (
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="p-5"
                    >
                        <label htmlFor={`contact-${key}`} className="block text-sm font-medium text-gray-300 mb-2">
                            {label}
                        </label>
                        <textarea
                            id={`contact-${key}`}
                            rows={3}
                            value={text[key]}
                            placeholder={placeholder}
                            onChange={(e) => handleChange(key, e.target.value)}
                            className={`w-full bg-[#151C2C] border rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none transition-colors resize-y ${
                                errors[key]
                                    ? 'border-rose-500/60 focus:border-rose-500'
                                    : 'border-gray-700 focus:border-emerald-500'
                            }`}
                        />
                        <p className="text-xs text-gray-500 mt-1.5">{hint}</p>
                        {errors[key] && <p className="text-xs text-rose-400 mt-1">{errors[key]}</p>}
                    </motion.div>
                ))}
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

export default ContactInfoManagement;
