import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import SectionWrapper from '../../components/SectionWrapper';
import {
    ArrowLeft, ExternalLink, Users, TrendingUp, Award,
    Ship, Anchor, Package, Briefcase, PieChart, Wrench,
    CheckCircle, Globe, Map, Activity, MapPin, Smile,
    Compass, Layout, BarChart, ChevronDown, Calendar,
    DollarSign, Building2, Heart, Play, X, Instagram
} from 'lucide-react';
import { oceanData } from '../../data/mockData';

// Map string icon names to Lucide components
const IconMap: Record<string, any> = {
    Ship, Anchor, Package, Briefcase, PieChart, TrendingUp,
    Wrench, Users, CheckCircle, Globe, Map, Activity,
    MapPin, Smile, Compass, Layout, BarChart, Award
};

// ── Animated Count-Up Component ──────────────────────────────────────────────
const CountUp = ({ value, duration = 1.8 }: { value: string; duration?: number }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });
    const numeric = parseFloat(value.replace(/[^0-9.]/g, ''));
    const suffix = value.replace(/[0-9.]/g, '');
    const [displayed, setDisplayed] = useState(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!isInView || numeric === 0) return;
        let start: number | null = null;
        let raf: number;
        const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayed(Math.round(eased * numeric));
            if (progress < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [isInView]);

    return <span ref={ref}>{displayed}{suffix}</span>;
};

// ── Video Modal Component ─────────────────────────────────────────────────────
const VideoModal = ({ src, poster, onClose }: { src: string; poster: string; onClose: () => void }) => (
    <motion.div
        className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
    >
        <motion.div
            className="relative w-full max-w-5xl rounded-2xl overflow-hidden"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/40 backdrop-blur text-white rounded-full p-2 transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
            <video src={src} poster={poster} autoPlay controls className="w-full aspect-video" />
        </motion.div>
    </motion.div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const CompanySingle = () => {
    const { id } = useParams<{ id: string }>();
    const company = oceanData.sectors.find((c: any) => c.id === id);
    const [videoOpen, setVideoOpen] = useState(false);

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // Sections refs for scroll-trigger
    const statsRef = useRef(null);
    const servicesRef = useRef(null);
    const igRef = useRef(null);

    const statsInView = useInView(statsRef, { once: true, margin: '-100px' });
    const servicesInView = useInView(servicesRef, { once: true, margin: '-100px' });
    const igInView = useInView(igRef, { once: true, margin: '-100px' });

    // Filtered Instagram posts
    const igPosts = oceanData.instagramUpdates.filter((p: any) => p.companyId === id);
    // Related companies (other companies excluding current)
    const relatedCompanies = oceanData.sectors.filter((c: any) => c.id !== id).slice(0, 3);

    if (!company) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-8xl mb-6">🌊</div>
                    <h1 className="text-4xl font-bold mb-4 text-gray-900">Company Not Found</h1>
                    <Link to="/companies" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Companies
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">

            {/* ── 1. CINEMATIC HERO ─────────────────────────────────────────── */}
            <div ref={heroRef} className="relative h-screen overflow-hidden">
                <motion.div className="absolute inset-0" style={{ y: heroY }}>
                    {company.video ? (
                        <video
                            src={company.video}
                            autoPlay loop muted playsInline
                            className="w-full h-full object-cover scale-110"
                        />
                    ) : (
                        <img
                            src={company.image}
                            alt={company.title}
                            className="w-full h-full object-cover scale-110"
                        />
                    )}
                </motion.div>

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-gray-900/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-transparent" />

                <motion.div
                    className="absolute inset-0 flex flex-col justify-end pb-24"
                    style={{ opacity: heroOpacity }}
                >
                    <SectionWrapper>
                        {/* Back link */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Link
                                to="/companies"
                                className="inline-flex items-center gap-2 text-white/70 hover:text-accent transition-colors mb-8 group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-sm font-medium tracking-wider uppercase">All Companies</span>
                            </Link>
                        </motion.div>

                        {/* Category badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <span className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 text-accent text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 backdrop-blur-sm">
                                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                                {company.category}
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            className="text-5xl md:text-7xl font-bold text-white mb-5 leading-tight"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                        >
                            {company.title}
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            className="text-xl text-white/80 max-w-2xl leading-relaxed mb-10"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                        >
                            {company.desc}
                        </motion.p>

                        {/* Quick stats pills */}
                        <motion.div
                            className="flex flex-wrap gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                        >
                            {[
                                { icon: Calendar, label: 'Founded', value: company.founded },
                                { icon: Users, label: 'Team', value: company.employees },
                                { icon: DollarSign, label: 'Revenue', value: company.revenue },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3">
                                    <item.icon className="w-4 h-4 text-accent" />
                                    <span className="text-white/60 text-sm">{item.label}:</span>
                                    <span className="text-white font-bold">{item.value}</span>
                                </div>
                            ))}
                        </motion.div>
                    </SectionWrapper>
                </motion.div>

                {/* Scroll chevron */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                >
                    <ChevronDown className="w-7 h-7" />
                </motion.div>
            </div>

            {/* ── 2. ABOUT SECTION ──────────────────────────────────────────── */}
            <section className="py-24 bg-white">
                <SectionWrapper>
                    <div className="grid lg:grid-cols-5 gap-16 items-start">
                        {/* Left – Logo + identity */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                                className="sticky top-28"
                            >
                                <div className="bg-gray-50 border border-gray-100 rounded-3xl p-10 shadow-sm mb-8">
                                    <img
                                        src={company.logo}
                                        alt={`${company.title} logo`}
                                        className="w-28 h-28 object-contain mx-auto mb-8"
                                    />
                                    <div className="space-y-5">
                                        {[
                                            { icon: Calendar, label: 'Founded', value: company.founded },
                                            { icon: Users, label: 'Employees', value: company.employees },
                                            { icon: DollarSign, label: 'Annual Revenue', value: company.revenue },
                                            { icon: Building2, label: 'Industry', value: company.category },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
                                                <div className="p-2.5 bg-primary/8 rounded-xl">
                                                    <item.icon className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{item.label}</p>
                                                    <p className="text-gray-900 font-semibold text-lg">{item.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <a
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 group"
                                >
                                    Visit Official Website
                                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </a>
                            </motion.div>
                        </div>

                        {/* Right – About text + stats */}
                        <div className="lg:col-span-3">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                            >
                                <span className="text-accent font-semibold text-sm uppercase tracking-widest">About Us</span>
                                <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">
                                    Who We Are
                                </h2>
                                <div className="w-12 h-1 bg-accent rounded-full mb-8" />
                                <p className="text-lg text-gray-600 leading-relaxed mb-12">
                                    {company.longDescription}
                                </p>

                                {/* Animated Stat Cards */}
                                <div ref={statsRef} className="grid sm:grid-cols-3 gap-5">
                                    {company.stats && company.stats.map((stat: any, index: number) => {
                                        const Icon = IconMap[stat.icon] || Award;
                                        return (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                                className="group relative bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white overflow-hidden hover:-translate-y-1 transition-transform duration-300"
                                            >
                                                {/* Background glow */}
                                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

                                                <Icon className="w-7 h-7 text-accent mb-4 relative z-10" />
                                                <div className="text-4xl font-bold mb-1 relative z-10">
                                                    <CountUp value={stat.value} />
                                                </div>
                                                <div className="text-white/70 text-sm font-medium relative z-10">{stat.label}</div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </SectionWrapper>
            </section>

            {/* ── 3. KEY SERVICES / HIGHLIGHTS ─────────────────────────────── */}
            <section className="py-24 bg-gray-50" ref={servicesRef}>
                <SectionWrapper>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <span className="text-accent font-semibold text-sm uppercase tracking-widest">What We Do</span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-2">Core Strengths</h2>
                        <div className="w-12 h-1 bg-accent rounded-full mt-4 mx-auto" />
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {company.stats && company.stats.map((stat: any, index: number) => {
                            const Icon = IconMap[stat.icon] || Award;
                            const descriptions: string[] = [
                                `Industry-leading performance with ${stat.value} ${stat.label.toLowerCase()} and growing.`,
                                `A dedicated team committed to quality and operational excellence across every project.`,
                                `Consistently delivering results that exceed client expectations and industry benchmarks.`,
                            ];
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.6, delay: 0.1 + index * 0.15 }}
                                    className="group bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="w-14 h-14 bg-primary/8 group-hover:bg-primary rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                                        <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{stat.label}</h3>
                                    <p className="text-gray-500 leading-relaxed text-sm">{descriptions[index % 3]}</p>
                                    <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-3xl font-extrabold text-primary">
                                            <CountUp value={stat.value} />
                                        </span>
                                        <span className="text-xs text-gray-400 uppercase tracking-wider">and counting</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            </section>

            {/* ── 4. MEDIA SPOTLIGHT ────────────────────────────────────────── */}
            {company.video && (
                <section className="py-24 bg-white overflow-hidden">
                    <SectionWrapper>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="text-center mb-12"
                        >
                            <span className="text-accent font-semibold text-sm uppercase tracking-widest">Media</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-2">See Us In Action</h2>
                            <div className="w-12 h-1 bg-accent rounded-full mt-4 mx-auto" />
                        </motion.div>

                        <motion.div
                            className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-2xl shadow-gray-900/20"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            onClick={() => setVideoOpen(true)}
                        >
                            <img
                                src={company.image}
                                alt={company.title}
                                className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-gray-900/20 group-hover:from-gray-900/70 transition-colors" />

                            {/* Play button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300"
                                    animate={{ boxShadow: ['0 0 0 0 rgba(255,255,255,0.4)', '0 0 0 20px rgba(255,255,255,0)', '0 0 0 0 rgba(255,255,255,0)'] }}
                                    transition={{ repeat: Infinity, duration: 2.5 }}
                                >
                                    <Play className="w-8 h-8 text-primary ml-1" fill="currentColor" />
                                </motion.div>
                            </div>

                            {/* Caption overlay */}
                            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                                <div>
                                    <p className="text-white text-2xl font-bold">{company.title}</p>
                                    <p className="text-white/70 text-sm">{company.category}</p>
                                </div>
                                <span className="bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Watch Video</span>
                            </div>
                        </motion.div>
                    </SectionWrapper>

                    {/* Video Modal */}
                    {videoOpen && (
                        <VideoModal
                            src={company.video}
                            poster={company.image}
                            onClose={() => setVideoOpen(false)}
                        />
                    )}
                </section>
            )}

            {/* ── 5. INSTAGRAM HIGHLIGHTS ───────────────────────────────────── */}
            {igPosts.length > 0 && (
                <section className="py-24 bg-gray-50" ref={igRef}>
                    <SectionWrapper>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={igInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
                        >
                            <div>
                                <span className="text-accent font-semibold text-sm uppercase tracking-widest">Social</span>
                                <h2 className="text-4xl font-bold text-gray-900 mt-2">Latest Highlights</h2>
                                <div className="w-12 h-1 bg-accent rounded-full mt-4" />
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                                <Instagram className="w-5 h-5 text-pink-500" />
                                <span>From our Instagram</span>
                            </div>
                        </motion.div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {igPosts.map((post: any, index: number) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={igInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.6, delay: index * 0.12 }}
                                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-gray-900/8 hover:-translate-y-1 transition-all duration-300"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.caption}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {/* Instagram icon overlay */}
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full p-1.5">
                                            <Instagram className="w-4 h-4 text-pink-500" />
                                        </div>
                                    </div>
                                    {/* Caption */}
                                    <div className="p-5">
                                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">{post.caption}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                                                <Heart className="w-4 h-4 text-red-400" fill="currentColor" />
                                                <span>{post.likes.toLocaleString()}</span>
                                            </div>
                                            <span className="text-xs text-gray-300">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </SectionWrapper>
                </section>
            )}

            {/* ── 6. RELATED COMPANIES ──────────────────────────────────────── */}
            <section className="py-24 bg-white">
                <SectionWrapper>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-12"
                    >
                        <span className="text-accent font-semibold text-sm uppercase tracking-widest">Explore More</span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-2">Other Companies</h2>
                        <div className="w-12 h-1 bg-accent rounded-full mt-4 mx-auto" />
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedCompanies.map((rc: any, index: number) => (
                            <motion.div
                                key={rc.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link to={`/companies/${rc.id}`} className="group block">
                                    <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                                        <img
                                            src={rc.image}
                                            alt={rc.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
                                        {/* Logo badge */}
                                        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur rounded-xl p-2 shadow">
                                            <img src={rc.logo} alt={rc.title} className="w-8 h-8 object-contain" />
                                        </div>
                                        {/* Category */}
                                        <div className="absolute top-3 right-3">
                                            <span className="bg-primary/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                {rc.category}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">{rc.title}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2">{rc.desc}</p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </SectionWrapper>
            </section>

            {/* ── 7. CTA BAND ───────────────────────────────────────────────── */}
            <section className="relative py-28 bg-primary overflow-hidden">
                {/* Decorative orbs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <SectionWrapper>
                    <div className="relative text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <img
                                src={company.logo}
                                alt={company.title}
                                className="w-20 h-20 object-contain mx-auto mb-6 brightness-0 invert opacity-80"
                            />
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Partner with {company.title}
                            </h2>
                            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
                                Ready to explore what we can achieve together? Reach out to our team today.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5"
                                >
                                    Get In Touch
                                    <ExternalLink className="w-4 h-4" />
                                </Link>
                                <Link
                                    to="/companies"
                                    className="inline-flex items-center gap-2 border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl transition-all duration-300"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    All Companies
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </SectionWrapper>
            </section>

        </div>
    );
};

export default CompanySingle;
