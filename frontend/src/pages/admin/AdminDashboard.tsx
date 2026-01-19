import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Briefcase, Image, ArrowUpRight, Mail, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        applications: 0,
        jobs: 0,
        media: 0,
        contactMessages: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch stats from backend
        const fetchStats = async () => {
            const token = localStorage.getItem('adminToken');
            try {
                // In a real app, you might have a dedicated stats endpoint
                // For now, we'll just check the list lengths if endpoints support it, 
                // or just mock it/fetch lists.
                // Let's assume we can fetch lists.
                const [appsRes, jobsRes, mediaRes, contactRes] = await Promise.all([
                    fetch('http://localhost:8080/api/talent-pool/applications', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('http://localhost:8080/api/admin/jobs', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('http://localhost:8080/api/admin/media', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('http://localhost:8080/api/contact/stats', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                const apps = appsRes.ok ? await appsRes.json() : [];
                const jobs = jobsRes.ok ? await jobsRes.json() : [];
                const media = mediaRes.ok ? await mediaRes.json() : [];
                const contactStats = contactRes.ok ? await contactRes.json() : { total: 0 };

                setStats({
                    applications: Array.isArray(apps) ? apps.length : 0,
                    jobs: Array.isArray(jobs) ? jobs.length : 0,
                    media: Array.isArray(media) ? media.length : 0,
                    contactMessages: contactStats.total || 0
                });
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

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
            title: "Total Applications",
            value: stats.applications,
            icon: FileText,
            color: "from-blue-500 to-blue-600",
            link: "/admin/applications",
            delay: 0
        },
        {
            title: "Active Job Openings",
            value: stats.jobs,
            icon: Briefcase,
            color: "from-emerald-500 to-emerald-600",
            link: "/admin/jobs",
            delay: 0.1
        },
        {
            title: "Media Items",
            value: stats.media,
            icon: Image,
            color: "from-purple-500 to-purple-600",
            link: "/admin/media",
            delay: 0.2
        },
        {
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={itemVars}
                        whileHover={{ y: -5 }}
                        className="relative group"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
                        <div className="relative p-6 bg-[#0f1e3a] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} p-2.5 flex items-center justify-center shadow-lg`}>
                                    <stat.icon className="text-white w-6 h-6" />
                                </div>
                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/5 text-gray-400">
                                    Last 30 Days
                                </span>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
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
            <motion.div variants={itemVars} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#0f1e3a] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                    <div className="space-y-4">
                        <Link
                            to="/admin/jobs"
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
