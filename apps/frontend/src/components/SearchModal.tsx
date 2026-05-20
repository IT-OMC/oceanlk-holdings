import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Loader2, Building2, Briefcase, Image, Calendar, MessageSquare, Users, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { debouncedSearch, SearchResponse, SearchResultItem } from '../services/searchService';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    triggerRef?: React.RefObject<HTMLElement>;
}

const SearchModal = ({ isOpen, onClose, triggerRef }: SearchModalProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [position, setPosition] = useState<{ top: number; right: number } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // Calculate position based on trigger ref
    useEffect(() => {
        if (isOpen && triggerRef?.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // Align top of modal (with offset) to bottom of trigger
            // Align right of modal to right of trigger (or close to it)
            // Use window width to calculate 'right' value
            const right = window.innerWidth - rect.right;
            // Add some offset for margin
            setPosition({
                top: rect.bottom + 10,
                right: Math.max(16, right - 100) // Keep at least 16px from right edge, shift left slightly to cover more area
            });
        }
    }, [isOpen, triggerRef]);

    // Category icons and labels
    const categoryConfig: { [key: string]: { icon: any; label: string; color: string } } = {
        companies: { icon: Building2, label: 'Companies', color: 'bg-blue-500' },
        jobs: { icon: Briefcase, label: 'Job Opportunities', color: 'bg-green-500' },
        media: { icon: Image, label: 'Media', color: 'bg-purple-500' },
        events: { icon: Calendar, label: 'Events', color: 'bg-orange-500' },
        testimonials: { icon: MessageSquare, label: 'Testimonials', color: 'bg-pink-500' },
        partners: { icon: Users, label: 'Partners', color: 'bg-indigo-500' },
        leadership: { icon: Award, label: 'Leadership', color: 'bg-red-500' }
    };

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Handle search with debouncing
    useEffect(() => {
        if (query.trim()) {
            setIsLoading(true);
            debouncedSearch(query, (searchResults) => {
                setResults(searchResults);
                setIsLoading(false);
                setSelectedIndex(0);
            });
        } else {
            setResults(null);
            setIsLoading(false);
        }
    }, [query]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const totalResults = getTotalResults();
                setSelectedIndex((prev) => (prev + 1) % totalResults);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const totalResults = getTotalResults();
                setSelectedIndex((prev) => (prev - 1 + totalResults) % totalResults);
            } else if (e.key === 'Enter' && results) {
                e.preventDefault();
                const selectedResult = getResultByIndex(selectedIndex);
                if (selectedResult) {
                    handleResultClick(selectedResult);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedIndex, results]);

    const getTotalResults = () => {
        if (!results?.results) return 0;
        return Object.values(results.results).reduce((sum, items) => sum + items.length, 0);
    };

    const getResultByIndex = (index: number): SearchResultItem | null => {
        if (!results?.results) return null;
        let currentIndex = 0;
        for (const items of Object.values(results.results)) {
            for (const item of items) {
                if (currentIndex === index) return item;
                currentIndex++;
            }
        }
        return null;
    };

    const handleResultClick = (result: SearchResultItem) => {
        navigate(result.url);
        onClose();
        setQuery('');
        setResults(null);
    };

    const handleClose = () => {
        onClose();
        setQuery('');
        setResults(null);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className={`fixed inset-0 z-[100] flex items-start ${position ? '' : 'justify-center pt-20 px-4'}`}>
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20, originX: 1, originY: 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className={`relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden ${position ? 'mr-4' : ''}`}
                    style={{
                        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95))',
                        backdropFilter: 'blur(20px)',
                        position: position ? 'absolute' : 'relative',
                        top: position ? position.top : undefined,
                        right: position ? position.right : undefined,
                        width: position ? 'min(640px, calc(100vw - 32px))' : undefined
                    }}
                >
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
                        <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search companies, jobs, media, events..."
                            className="flex-1 text-lg outline-none bg-transparent text-gray-900 placeholder-gray-400"
                        />
                        {isLoading && <Loader2 className="w-5 h-5 text-blue-500 animate-spin flex-shrink-0" />}
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Results */}
                    <div className="max-h-[60vh] overflow-y-auto">
                        {!query.trim() && (
                            <div className="px-6 py-12 text-center">
                                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">
                                    Start typing to search across companies, jobs, media, and more...
                                </p>
                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                                    <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-200">ESC</kbd>
                                    <span>to close</span>
                                    <span className="mx-2">•</span>
                                    <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-200">↑↓</kbd>
                                    <span>to navigate</span>
                                    <span className="mx-2">•</span>
                                    <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-200">↵</kbd>
                                    <span>to select</span>
                                </div>
                            </div>
                        )}

                        {query.trim() && !isLoading && results && results.totalResults === 0 && (
                            <div className="px-6 py-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-600 font-medium mb-1">No results found</p>
                                <p className="text-gray-400 text-sm">
                                    Try searching with different keywords
                                </p>
                            </div>
                        )}

                        {results && results.totalResults > 0 && (
                            <div className="py-2">
                                {Object.entries(results.results).map(([category, items]) => {
                                    const config = categoryConfig[category];
                                    const Icon = config?.icon || Search;

                                    return (
                                        <div key={category} className="mb-4">
                                            {/* Category Header */}
                                            <div className="px-6 py-2 flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${config?.color || 'bg-gray-400'}`} />
                                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                    {config?.label || category}
                                                </h3>
                                                <span className="text-xs text-gray-400">({items.length})</span>
                                            </div>

                                            {/* Category Results */}
                                            <div className="space-y-1 px-2">
                                                {items.map((item, index) => {
                                                    const globalIndex = Object.entries(results.results)
                                                        .slice(0, Object.keys(results.results).indexOf(category))
                                                        .reduce((sum, [, categoryItems]) => sum + categoryItems.length, 0) + index;

                                                    return (
                                                        <motion.button
                                                            key={item.id}
                                                            onClick={() => handleResultClick(item)}
                                                            className={`w-full flex items-start gap-4 px-4 py-3 rounded-xl transition-all ${globalIndex === selectedIndex
                                                                ? 'bg-blue-50 border-2 border-blue-200'
                                                                : 'hover:bg-gray-50 border-2 border-transparent'
                                                                }`}
                                                            whileHover={{ x: 4 }}
                                                        >
                                                            {/* Icon or Image */}
                                                            <div className={`w-10 h-10 rounded-lg ${config?.color || 'bg-gray-400'} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                                                                {item.imageUrl ? (
                                                                    <img
                                                                        src={item.imageUrl}
                                                                        alt={item.title}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <Icon className="w-5 h-5 text-white" />
                                                                )}
                                                            </div>

                                                            {/* Content */}
                                                            <div className="flex-1 text-left overflow-hidden">
                                                                <h4 className="font-semibold text-gray-900 mb-1 truncate">
                                                                    {item.title}
                                                                </h4>
                                                                {item.description && (
                                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                                        {item.description}
                                                                    </p>
                                                                )}
                                                                {item.category && (
                                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                                                        {item.category}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {results && results.totalResults > 0 && (
                        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                            <p className="text-xs text-gray-500 text-center">
                                Found <span className="font-semibold text-gray-700">{results.totalResults}</span> result{results.totalResults !== 1 ? 's' : ''}
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SearchModal;
