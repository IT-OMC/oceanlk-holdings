import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronRight } from 'lucide-react';

const PageContentManager = () => {
    // This will be implemented in the next iteration due to complexity
    // It requires a rich text editor or structured form builder
    const pages = ['Home', 'Corporate Profile', 'Culture', 'Contact'];
    const [selectedPage, setSelectedPage] = useState(pages[0]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white">Page Content Management</h2>
                <p className="text-gray-400">Edit text and images for static pages</p>
            </div>

            <div className="flex gap-6">
                {/* Page Selector Sidebar */}
                <div className="w-64 bg-[#0f1e3a] rounded-xl p-4 border border-white/10 h-fit">
                    <h3 className="font-bold text-white mb-4 px-2">Select Page</h3>
                    <div className="space-y-1">
                        {pages.map(page => (
                            <button
                                key={page}
                                onClick={() => setSelectedPage(page)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${selectedPage === page
                                        ? 'bg-blue-600/20 text-blue-400'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {page}
                                {selectedPage === page && <ChevronRight size={14} />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Editor Area */}
                <div className="flex-1 bg-white/5 rounded-xl p-8 border border-white/10 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="text-center max-w-md">
                        <FileText size={48} className="mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Content Editor Coming Soon</h3>
                        <p className="text-gray-400">
                            The generic page content editor is currently under development.
                            Please use the specific management tools for Leadership, Stats, and Partners.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageContentManager;
