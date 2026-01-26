import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    ChevronRight,
    Briefcase,
    Users,
    TrendingUp,
    ArrowLeft,
    Layout
} from 'lucide-react';
import PartnerManagement from './PartnerManagement';
import LeadershipManagement from './LeadershipManagement';
import StatsManagement from './StatsManagement';

interface Section {
    id: string;
    title: string;
    description: string;
    icon: any;
    component: React.ReactNode;
}

const PageContentManager = () => {
    const [selectedPage, setSelectedPage] = useState('Home');
    const [selectedSection, setSelectedSection] = useState<string | null>(null);

    const pages = [
        'Home',
        'Corporate Profile',
        'Culture',
        'Contact',
        'Companies',
        'News',
        'Careers'
    ];

    // Define sections for the Home page
    const homeSections: Section[] = [
        {
            id: 'partners',
            title: 'Partners & Memberships',
            description: 'Manage partner logos and membership affiliations displayed on the home page.',
            icon: Briefcase,
            component: <PartnerManagement />
        },
        {
            id: 'leadership',
            title: 'Leadership Team',
            description: 'Manage Board Members, Executives, and Senior Management profiles.',
            icon: Users,
            component: <LeadershipManagement />
        },
        {
            id: 'stats',
            title: 'Global Statistics',
            description: 'Update the key metrics and statistics shown in the hero or stats section.',
            icon: TrendingUp,
            component: <StatsManagement />
        }
    ];

    // Placeholder for other pages (can be expanded later)
    const getSectionsForPage = (page: string) => {
        switch (page) {
            case 'Home':
                return homeSections;
            default:
                return [];
        }
    };

    const currentSections = getSectionsForPage(selectedPage);

    const handleSectionClick = (sectionId: string) => {
        setSelectedSection(sectionId);
    };

    const handleBackToSections = () => {
        setSelectedSection(null);
    };

    const activeSection = currentSections.find(s => s.id === selectedSection);

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    {selectedSection ? (
                        <>
                            <span
                                onClick={handleBackToSections}
                                className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                            >
                                {selectedPage}
                            </span>
                            <ChevronRight size={20} className="text-gray-500" />
                            <span className="text-blue-400">{activeSection?.title}</span>
                        </>
                    ) : (
                        <>
                            Content Management
                            <ChevronRight size={20} className="text-gray-500" />
                            <span className="text-emerald-400">{selectedPage}</span>
                        </>
                    )}
                </h2>
                <p className="text-gray-400 mt-1">
                    {selectedSection
                        ? activeSection?.description
                        : 'Select a section to edit content'}
                </p>
            </div>

            <div className="flex gap-6 flex-1 overflow-hidden">
                {/* Page Selector Sidebar (Only visible when no section is selected for better focus, OR keep it sidebar style) */}
                {/* Let's keep it visible but maybe disabled when editing? Or standard 2-pane. */}
                {/* Going with: Always visible unless editing a section to maximize space for the editor */}

                <AnimatePresence mode="wait">
                    {!selectedSection && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 256, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="w-64 bg-[#0f1e3a] rounded-xl p-4 border border-white/10 h-full overflow-y-auto"
                        >
                            <h3 className="font-bold text-white mb-4 px-2 uppercase text-xs tracking-wider text-gray-500">Pages</h3>
                            <div className="space-y-1">
                                {pages.map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setSelectedPage(page)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${selectedPage === page
                                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Layout size={16} />
                                            {page}
                                        </div>
                                        {selectedPage === page && <ChevronRight size={14} />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content Area */}
                <div className="flex-1 bg-white/5 rounded-xl border border-white/10 overflow-hidden flex flex-col relative">
                    {selectedSection ? (
                        // Editor View
                        <div className="h-full flex flex-col">
                            <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-[#0f1e3a]/50">
                                <button
                                    onClick={handleBackToSections}
                                    className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors flex items-center gap-2 text-sm font-medium"
                                >
                                    <ArrowLeft size={18} />
                                    Back to Sections
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                {activeSection?.component}
                            </div>
                        </div>
                    ) : (
                        // Sections Grid View
                        <div className="p-8 overflow-y-auto h-full">
                            {currentSections.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {currentSections.map(section => (
                                        <motion.button
                                            key={section.id}
                                            onClick={() => handleSectionClick(section.id)}
                                            layoutId={`card-${section.id}`}
                                            className="group flex flex-col items-start p-6 bg-[#0f1e3a] border border-white/10 hover:border-emerald-500/50 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/20 text-left w-full"
                                        >
                                            <div className="p-3 bg-white/5 rounded-lg text-emerald-400 mb-4 group-hover:bg-emerald-500/10 transition-colors">
                                                <section.icon size={24} />
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                                                {section.title}
                                            </h3>
                                            <p className="text-sm text-gray-400 line-clamp-2 group-hover:text-gray-300">
                                                {section.description}
                                            </p>
                                        </motion.button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <FileText size={32} className="text-gray-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">No Sections Available</h3>
                                    <p className="text-gray-400 max-w-md">
                                        Content management for <span className="text-emerald-400">{selectedPage}</span> is not yet configured.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageContentManager;
