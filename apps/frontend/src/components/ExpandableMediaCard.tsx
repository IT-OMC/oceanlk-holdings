'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Calendar, X, ArrowUpRight } from 'lucide-react';

export interface MediaCardData {
    id: string;
    category: string;
    title: string;
    description: string;
    dateLabel: string;
    mediaTypeLabel: string;
    typeIcon: ReactNode;
    detailHref: string;
    media: ReactNode;
    span?: string;
    isLarge?: boolean;
}

const LAYOUT_TRANSITION = { type: 'spring' as const, stiffness: 300, damping: 30, mass: 0.8 };

interface MediaCardProps {
    data: MediaCardData;
    onOpen: (data: MediaCardData) => void;
}

export function MediaCard({ data, onOpen }: MediaCardProps) {
    const { id, category, title, dateLabel, mediaTypeLabel, typeIcon, media, span, isLarge } = data;

    return (
        <motion.div
            layoutId={`media-card-${id}`}
            transition={LAYOUT_TRANSITION}
            onClick={() => onOpen(data)}
            whileTap={{ scale: 0.98 }}
            className="group relative w-full h-full rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-100/50 cursor-pointer text-left"
        >
            {/* layoutId="media-image-{id}" morphs into the modal's hero image */}
            <motion.div layoutId={`media-image-${id}`} transition={LAYOUT_TRANSITION} className="absolute inset-0">
                {media}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            </motion.div>

            <div className="absolute top-6 left-6 flex items-center gap-2">
                {/* layoutId="media-category-{id}" morphs into the modal's category label */}
                <motion.span
                    layoutId={`media-category-${id}`}
                    transition={LAYOUT_TRANSITION}
                    className="bg-purple-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                >
                    {typeIcon}
                    {category}
                </motion.span>
                {isLarge && (
                    <span className="bg-black/40 backdrop-blur-sm text-gray-200 px-3 py-1 rounded-full text-xs font-medium">
                        {mediaTypeLabel}
                    </span>
                )}
            </div>

            <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                <div className="flex items-center gap-2 text-sm text-gray-300 mb-3 font-medium">
                    <Calendar className="w-4 h-4" />
                    {dateLabel}
                </div>

                {/* layoutId="media-title-{id}" morphs into the modal's title */}
                <motion.h3
                    layoutId={`media-title-${id}`}
                    transition={LAYOUT_TRANSITION}
                    className={`font-bold leading-tight ${span?.includes('col-span-2') ? 'text-3xl' : 'text-xl'}`}
                >
                    {title}
                </motion.h3>

                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-white">
                    <ArrowUpRight className="w-5 h-5" />
                </div>
            </div>
        </motion.div>
    );
}

interface MediaCardModalProps {
    data: MediaCardData;
    onClose: () => void;
}

export function MediaCardModal({ data, onClose }: MediaCardModalProps) {
    const { id, category, title, description, dateLabel, mediaTypeLabel, typeIcon, detailHref, media } = data;
    const cardRef = useRef<HTMLDivElement>(null);

    // Edge cases: Escape key, click-outside, and body scroll lock while expanded.
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (cardRef.current && !cardRef.current.contains(e.target as Node)) onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`media-title-${id}`}
        >
            <motion.div
                ref={cardRef}
                layoutId={`media-card-${id}`}
                transition={LAYOUT_TRANSITION}
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <motion.div layoutId={`media-image-${id}`} transition={LAYOUT_TRANSITION} className="relative h-72 md:h-96 w-full">
                    {media}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-6">
                        <motion.span
                            layoutId={`media-category-${id}`}
                            transition={LAYOUT_TRANSITION}
                            className="bg-purple-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                        >
                            {typeIcon}
                            {category}
                        </motion.span>
                    </div>
                </motion.div>

                <div className="p-6 md:p-8">
                    <motion.h2
                        id={`media-title-${id}`}
                        layoutId={`media-title-${id}`}
                        transition={LAYOUT_TRANSITION}
                        className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight"
                    >
                        {title}
                    </motion.h2>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-3 mb-2">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {dateLabel}
                        </span>
                        <span className="flex items-center gap-1.5">
                            {typeIcon}
                            {mediaTypeLabel}
                        </span>
                    </div>

                    {/* Description staggers in after the header morph settles. */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                    >
                        <p className="text-gray-600 leading-relaxed mt-4">{description}</p>

                        <Link
                            href={detailHref}
                            className="inline-flex items-center gap-1.5 mt-6 text-purple-600 font-semibold hover:underline"
                        >
                            View full details
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export function ExpandableMediaCards({
    items,
    activeId,
    onActiveChange,
    className,
}: {
    items: MediaCardData[];
    activeId: string | null;
    onActiveChange: (id: string | null) => void;
    className?: string;
}) {
    const active = items.find((item) => item.id === activeId) ?? null;

    return (
        <>
            <div className={className}>
                {items.map((item) => (
                    <MediaCard key={item.id} data={item} onOpen={(d) => onActiveChange(d.id)} />
                ))}
            </div>
            <AnimatePresence>
                {active && <MediaCardModal data={active} onClose={() => onActiveChange(null)} />}
            </AnimatePresence>
        </>
    );
}
