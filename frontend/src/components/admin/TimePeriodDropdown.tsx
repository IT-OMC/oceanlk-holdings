import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type TimePeriod = 'Last 7 Days' | 'Last 30 Days' | 'Last 3 Months' | 'All Time';

interface TimePeriodDropdownProps {
    selected: TimePeriod;
    onSelect: (period: TimePeriod) => void;
    className?: string;
}

const TimePeriodDropdown = ({ selected, onSelect, className = '' }: TimePeriodDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const periods: TimePeriod[] = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'All Time'];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                type="button"
            >
                {selected}
                <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-32 bg-[#0f1e3a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 py-1"
                    >
                        {periods.map((period) => (
                            <button
                                key={period}
                                onClick={() => {
                                    onSelect(period);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs transition-colors ${selected === period
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {period}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TimePeriodDropdown;
