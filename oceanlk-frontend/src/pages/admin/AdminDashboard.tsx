import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Briefcase, Image, ArrowUpRight, Mail, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import TimePeriodDropdown, { TimePeriod } from '../../components/admin/TimePeriodDropdown';
import { API_ENDPOINTS } from '../../utils/api';
import { TalentPoolApplication, JobOpportunity, MediaItem, ContactMessage } from '../../types/api';

const AdminDashboard = () => {
    const [rawData, setRawData] = useState<{
        applications: TalentPoolApplication[],
        jobs: JobOpportunity[],
        media: MediaItem[],
        contactMessages: ContactMessage[]
    }>({
        applications: [],
        jobs: [],
        media: [],
        contactMessages: []
    });

    const [selectedPeriods, setSelectedPeriods] = useState<{
        applications: TimePeriod;
        jobs: TimePeriod;
        media: TimePeriod;
        contactMessages: TimePeriod;
    }>({
        applications: 'Last 30 Days',
        jobs: 'Last 30 Days',
        media: 'Last 30 Days',
        contactMessages: 'Last 30 Days'
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch stats from backend
        const fetchStats = async () => {
            const token = localStorage.getItem('adminToken');
            try {
                const [appsRes, jobsRes, mediaRes, contactRes] = await Promise.all([
                    fetch(API_ENDPOINTS.TALENT_POOL_APPLICATIONS, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(API_ENDPOINTS.ADMIN_JOBS, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(API_ENDPOINTS.ADMIN_MEDIA, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(API_ENDPOINTS.CONTACT_MESSAGES, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                const apps = appsRes.ok ? await appsRes.json() : [];
                const jobs = jobsRes.ok ? await jobsRes.json() : [];
                const media = mediaRes.ok ? await mediaRes.json() : [];
                const contactMessages = contactRes.ok ? await contactRes.json() : [];

                setRawData({
                    applications: Array.isArray(apps) ? apps : [],
                    jobs: Array.isArray(jobs) ? jobs : [],
                    media: Array.isArray(media) ? media : [],
                    contactMessages: Array.isArray(contactMessages) ? contactMessages : []
                });
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);


    const filterData = (data: any[], period: TimePeriod, dateField: string) => {
        if (!data || !Array.isArray(data)) return [];
        if (period === 'All Time') return data;

        const now = new Date();
        const cutoff = new Date();

        if (period === 'Last 7 Days') cutoff.setDate(now.getDate() - 7);
        else if (period === 'Last 30 Days') cutoff.setDate(now.getDate() - 30);
        else if (period === 'Last 3 Months') cutoff.setMonth(now.getMonth() - 3);

        return data.filter(item => {
            const itemDate = new Date(item[dateField]);
            return itemDate >= cutoff;
        });
    };

    const stats = useMemo(() => ({
        applications: filterData(rawData.applications, selectedPeriods.applications, 'submittedDate').length,
        jobs: filterData(rawData.jobs, selectedPeriods.jobs, 'postedDate').length,
        media: filterData(rawData.media, selectedPeriods.media, 'publishedDate').length,
        contactMessages: filterData(rawData.contactMessages, selectedPeriods.contactMessages, 'submittedDate').length
    }), [rawData, selectedPeriods]);

    const handlePeriodChange = (key: keyof typeof selectedPeriods, period: TimePeriod) => {
        setSelectedPeriods(prev => ({ ...prev, [key]: period }));
    };

    const containerVars = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVars = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const statCards = [
        {
            key: 'applications' as const,
            title: "Total Applications",
            value: stats.applications,
            icon: FileText,
            color: "from-blue-500 to-blue-600",
            link: "/admin/hr/applications",
            delay: 0
        },
        {
            key: 'jobs' as const,
            title: "Active Job Openings",
            value: stats.jobs,
            icon: Briefcase,
            color: "from-emerald-500 to-emerald-600",
            link: "/admin/hr/jobs",
            delay: 0.1
        },
        {
            key: 'media' as const,
            title: "Media Items",
            value: stats.media,
            icon: Image,
            color: "from-purple-500 to-purple-600",
            link: "/admin/media",
            delay: 0.2
        },
        {
            key: 'contactMessages' as const,
            title: "Contact Messages",
            value: stats.contactMessages,
            icon: Mail,
            color: "from-orange-500 to-orange-600",
            link: "/admin/contact-messages",
            delay: 0.3
        }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVars}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={itemVars}
                        whileHover={{ y: -5 }}
                        className="relative group"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
                        <div className="relative p-4 md:p-6 bg-[#0f1e3a] border border-white/10 rounded-2xl overflow-visible hover:border-white/20 transition-colors z-0">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} p-2.5 flex items-center justify-center shadow-lg`}>
                                    <stat.icon className="text-white w-6 h-6" />
                                </div>
                                <TimePeriodDropdown
                                    selected={selectedPeriods[stat.key]}
                                    onSelect={(period) => handlePeriodChange(stat.key, period)}
                                />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</h3>
                            <p className="text-gray-400 text-sm mb-4">{stat.title}</p>

                            <Link
                                to={stat.link}
                                className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                                View Details <ArrowUpRight size={16} />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions / Recent Activity could go here */}
            <motion.div variants={itemVars} className="grid grid-cols-1 gap-6 md:gap-8">
                <div className="bg-[#0f1e3a] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                    <div className="space-y-4">
                        <Link
                            to="/admin/hr/jobs"
                            className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                <PlusIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Post New Job</h4>
                                <p className="text-sm text-gray-400">Create a new job opportunity listing</p>
                            </div>
                            <ChevronRight className="ml-auto text-gray-500 group-hover:text-white" />
                        </Link>

                        <Link
                            to="/admin/media"
                            className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                <Image className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Add Media Item</h4>
                                <p className="text-sm text-gray-400">Upload new gallery or news item</p>
                            </div>
                            <ChevronRight className="ml-auto text-gray-500 group-hover:text-white" />
                        </Link>
                    </div>
                </div>

                {/* System Status or Recent Applications preview */}
                <div className="bg-[#0f1e3a] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">System Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-gray-300">Backend API</span>
                            </div>
                            <span className="text-emerald-400 text-sm font-medium">Operational</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-gray-300">Database Connection</span>
                            </div>
                            <span className="text-emerald-400 text-sm font-medium">Connected</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-gray-300">Email Service</span>
                            </div>
                            <span className="text-emerald-400 text-sm font-medium">Active</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Helper for the icon
const PlusIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
);

export default AdminDashboard;
