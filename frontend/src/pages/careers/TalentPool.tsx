import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import SectionWrapper from '../../components/SectionWrapper';
import { Upload, Send, ChevronRight, ChevronLeft, Sparkles, Target, Zap, Users, TrendingUp, Star, Quote, FileText, BrainCircuit, Bell, Rocket, CheckCircle, AlertCircle } from 'lucide-react';

const TalentPool = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        message: '',
        file: null as File | null
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState<string | null>(null);

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
            newErrors.phone = 'Invalid phone number';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.position.trim()) newErrors.position = 'Desired Position is required';
        if (!formData.experience) newErrors.experience = 'Experience level is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setApiError(null);

        try {
            const data = new FormData();
            data.append('fullName', formData.fullName);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('position', formData.position);
            data.append('experience', formData.experience);
            data.append('message', formData.message);

            if (formData.file) {
                data.append('file', formData.file);
            }

            const response = await fetch('http://localhost:8080/api/talent-pool/submit', {
                method: 'POST',
                body: data,
            });

            if (!response.ok) {
                throw new Error('Submission failed. Please try again.');
            }

            const result = await response.json();
            console.log('Submission successful:', result);
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error submitting application:', error);
            setApiError('Failed to submit application. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({
                ...formData,
                file: e.target.files[0]
            });
        }
    };

    const nextStep = () => {
        if (currentStep === 1) {
            if (validateStep1()) setCurrentStep(2);
        } else if (currentStep === 2) {
            if (validateStep2()) setCurrentStep(3);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };



    const benefits = [
        {
            icon: Target,
            title: "Personalized Matching",
            description: "We match your skills and aspirations with opportunities across our diverse portfolio of companies.",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: Zap,
            title: "Early Access",
            description: "Get priority consideration for new positions before they're publicly advertised.",
            color: "from-emerald-500 to-emerald-600"
        },
        {
            icon: Users,
            title: "Career Development",
            description: "Access to training resources, mentorship programs, and professional growth opportunities.",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: TrendingUp,
            title: "Fast-Track Process",
            description: "Streamlined recruitment process for talent pool members with faster response times.",
            color: "from-orange-500 to-orange-600"
        }
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Senior Engineer at OEC",
            quote: "Joining the talent pool was the best decision I made. I received a call within two weeks for a role that perfectly matched my skills.",
            image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            name: "Rajesh Kumar",
            role: "Marketing Manager at OMC",
            quote: "The personalized approach and continuous support throughout the hiring process made me feel valued from day one.",
            image: "https://randomuser.me/api/portraits/men/32.jpg"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#1a2847] relative overflow-hidden">
            {/* Animated Gradient Mesh Background */}
            <div className="absolute inset-0 opacity-30">
                <div
                    className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] animate-pulse"
                    style={{
                        background: 'radial-gradient(circle, rgba(46,204,113,0.4) 0%, transparent 70%)',
                        transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
                    }}
                />
                <div
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse"
                    style={{
                        background: 'radial-gradient(circle, rgba(0,86,179,0.4) 0%, transparent 70%)',
                        animationDelay: '1s',
                        transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)`
                    }}
                />
                <div
                    className="absolute top-1/2 left-1/2 w-[700px] h-[700px] rounded-full blur-[150px] animate-pulse"
                    style={{
                        background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
                        animationDelay: '2s'
                    }}
                />
            </div>

            {/* Floating Particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/20 rounded-full"
                    initial={{
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
                        scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{
                        y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)],
                        x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920)],
                    }}
                    transition={{
                        duration: Math.random() * 20 + 10,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
            ))}

            <SectionWrapper id="talent-pool" className="pt-32 pb-20 relative z-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    {/* Animated Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 relative overflow-hidden group"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 8px 32px rgba(46,204,113,0.2)'
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Sparkles className="w-4 h-4 text-emerald-400 relative z-10" />
                        <span className="text-sm font-semibold text-white relative z-10">Join Our Talent Community</span>
                    </motion.div>

                    {/* Hero Title */}
                    <motion.h1
                        className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-blue-200">
                            Your Future
                        </span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-emerald-200 to-white">
                            Starts Here
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
                    >
                        Don't see the perfect role right now? Join our talent pool and be first in line when opportunities arise across our portfolio of innovative companies.
                    </motion.p>
                </motion.div>

                {/* Benefits Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="mb-20"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                        Why Join Our Talent Pool?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="group relative"
                                >
                                    {/* Glow Effect */}
                                    <div className={`absolute -inset-1 bg-gradient-to-r ${benefit.color} rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`} />

                                    {/* Card */}
                                    <div
                                        className="relative h-full p-6 rounded-2xl overflow-hidden"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                            backdropFilter: 'blur(20px)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                                        }}
                                    >
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${benefit.color} p-2.5 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="w-full h-full text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                                        <p className="text-gray-300 text-sm leading-relaxed">{benefit.description}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Journey Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-20 px-4"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
                        Your Journey to Success
                    </h2>
                    <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                        A seamless process designed to connect you with the right opportunities.
                    </p>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-emerald-500/20 -translate-y-1/2" />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                            {[
                                { icon: FileText, title: "Create Profile", desc: "Share your details & CV" },
                                { icon: BrainCircuit, title: "AI Matching", desc: "Our system analyzes skills" },
                                { icon: Bell, title: "Priority Alerts", desc: "Get notified instantly" },
                                { icon: Rocket, title: "Fast-Track", desc: "Direct interview access" }
                            ].map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="relative group"
                                >
                                    <div className="bg-[#0f1e3a] p-6 rounded-2xl border border-white/10 relative z-20 hover:border-emerald-500/50 transition-colors duration-300 h-full flex flex-col items-center text-center">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                                            <step.icon className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                                        <p className="text-sm text-gray-400">{step.desc}</p>

                                        {/* Step Number Badge */}
                                        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#0a1628] border border-white/10 flex items-center justify-center text-xs font-bold text-emerald-400">
                                            {index + 1}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Form Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="max-w-3xl mx-auto mb-20"
                >
                    {!isSubmitted ? (
                        <div className="relative group/form">
                            {/* Animated Border Gradient */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 rounded-3xl opacity-50 blur-lg group-hover/form:opacity-75 transition-opacity duration-500" />

                            <div
                                className="relative p-1.5 rounded-3xl overflow-hidden"
                                style={{
                                    background: 'rgba(15, 30, 58, 0.7)',
                                    backdropFilter: 'blur(24px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                                }}
                            >
                                {/* Glass Shine Effect */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

                                {/* Progress Indicator */}
                                <div className="px-8 pt-8 pb-8 bg-gradient-to-b from-white/5 to-transparent rounded-t-2xl">
                                    <div className="flex items-center justify-between relative">
                                        {/* Background Track */}
                                        <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 rounded-full -z-10" />

                                        {[1, 2, 3].map((step) => (
                                            <div key={step} className="relative flex flex-col items-center">
                                                <motion.div
                                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 relative z-10 border-4 ${currentStep >= step
                                                        ? 'bg-emerald-500 border-[#0f1e3a] text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                                                        : 'bg-[#0f1e3a] border-white/10 text-gray-500'
                                                        }`}
                                                    animate={{
                                                        scale: currentStep === step ? 1.1 : 1,
                                                        borderColor: currentStep >= step ? '#0f1e3a' : 'rgba(255,255,255,0.1)'
                                                    }}
                                                >
                                                    {currentStep > step ? (
                                                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.span>
                                                    ) : (
                                                        step
                                                    )}
                                                </motion.div>
                                                {/* Step Label (Optional) */}
                                                <span className={`absolute -bottom-6 text-xs font-medium uppercase tracking-wider ${currentStep >= step ? 'text-emerald-400' : 'text-gray-600'
                                                    }`}>
                                                    {step === 1 ? 'About' : step === 2 ? 'Experience' : 'CV'}
                                                </span>
                                            </div>
                                        ))}

                                        {/* Progress Fill Line */}
                                        <div className="absolute top-1/2 left-0 h-1 bg-emerald-500 rounded-full -z-10 transition-all duration-500"
                                            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Form Content */}
                                <form onSubmit={handleSubmit} className="p-8 md:p-10">
                                    <AnimatePresence mode="wait">
                                        {/* Step 1: Personal Information */}
                                        {currentStep === 1 && (
                                            <motion.div
                                                key="step1"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="text-center mb-8">
                                                    <h3 className="text-3xl font-bold text-white mb-2">Who are you?</h3>
                                                    <p className="text-gray-400">Let's get to know each other better.</p>
                                                </div>

                                                <div className="space-y-6">
                                                    {[
                                                        { id: 'fullName', label: 'Full Name', type: 'text', placeholder: 'e.g. Sarah Smith' },
                                                        { id: 'email', label: 'Email Address', type: 'email', placeholder: 'sarah@example.com' },
                                                        { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+94 71 234 5678' }
                                                    ].map((field) => (
                                                        <div key={field.id} className="group">
                                                            <label htmlFor={field.id} className="block text-sm font-semibold text-gray-300 mb-2 ml-1 group-focus-within:text-emerald-400 transition-colors">
                                                                {field.label} <span className="text-emerald-500">*</span>
                                                            </label>
                                                            <div className="relative">
                                                                <input
                                                                    type={field.type}
                                                                    id={field.id}
                                                                    name={field.id}
                                                                    value={formData[field.id as keyof typeof formData] as string}
                                                                    onChange={handleChange}
                                                                    required
                                                                    className={`w-full px-5 py-4 rounded-xl bg-white/5 border text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all duration-300 ${errors[field.id] ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-emerald-500/50'}`}
                                                                    placeholder={field.placeholder}
                                                                />
                                                                {errors[field.id] && (
                                                                    <div className="flex items-center gap-1 mt-2 text-red-400 text-xs animate-fadeIn">
                                                                        <AlertCircle className="w-3 h-3" />
                                                                        <span>{errors[field.id]}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex justify-end mt-10">
                                                    <motion.button
                                                        type="button"
                                                        onClick={nextStep}
                                                        whileHover={{ scale: 1.02, x: 5 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300 bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg shadow-emerald-900/40 hover:shadow-emerald-900/60"
                                                    >
                                                        Next Step
                                                        <ChevronRight className="w-5 h-5" />
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Step 2: Professional Details */}
                                        {currentStep === 2 && (
                                            <motion.div
                                                key="step2"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="text-center mb-8">
                                                    <h3 className="text-3xl font-bold text-white mb-2">Your Expertise</h3>
                                                    <p className="text-gray-400">Tell us about your professional background.</p>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="group">
                                                        <label htmlFor="position" className="block text-sm font-semibold text-gray-300 mb-2 ml-1 group-focus-within:text-emerald-400 transition-colors">
                                                            Desired Position <span className="text-emerald-500">*</span>
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                id="position"
                                                                name="position"
                                                                value={formData.position}
                                                                onChange={handleChange}
                                                                required
                                                                className={`w-full px-5 py-4 rounded-xl bg-white/5 border text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all duration-300 ${errors.position ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-emerald-500/50'}`}
                                                                placeholder="e.g. Senior Software Engineer"
                                                            />
                                                            {errors.position && (
                                                                <div className="flex items-center gap-1 mt-2 text-red-400 text-xs animate-fadeIn">
                                                                    <AlertCircle className="w-3 h-3" />
                                                                    <span>{errors.position}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="group">
                                                        <label htmlFor="experience" className="block text-sm font-semibold text-gray-300 mb-2 ml-1 group-focus-within:text-emerald-400 transition-colors">
                                                            Years of Experience <span className="text-emerald-500">*</span>
                                                        </label>
                                                        <div className="relative">
                                                            <select
                                                                id="experience"
                                                                name="experience"
                                                                value={formData.experience}
                                                                onChange={handleChange}
                                                                required
                                                                className={`w-full px-5 py-4 rounded-xl bg-white/5 border text-white focus:outline-none focus:bg-white/10 transition-all duration-300 appearance-none cursor-pointer ${errors.experience ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-emerald-500/50'}`}
                                                            >
                                                                <option value="" className="bg-[#0f1e3a] text-gray-400">Select your experience level</option>
                                                                <option value="0-2" className="bg-[#0f1e3a] text-white">0-2 years (Junior)</option>
                                                                <option value="3-5" className="bg-[#0f1e3a] text-white">3-5 years (Mid-Level)</option>
                                                                <option value="6-10" className="bg-[#0f1e3a] text-white">6-10 years (Senior)</option>
                                                                <option value="10+" className="bg-[#0f1e3a] text-white">10+ years (Expert)</option>
                                                            </select>
                                                            <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 rotate-90 pointer-events-none" />
                                                            {errors.experience && (
                                                                <div className="flex items-center gap-1 mt-2 text-red-400 text-xs animate-fadeIn">
                                                                    <AlertCircle className="w-3 h-3" />
                                                                    <span>{errors.experience}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="group">
                                                        <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2 ml-1 group-focus-within:text-emerald-400 transition-colors">
                                                            Tell us about yourself
                                                        </label>
                                                        <div className="relative">
                                                            <textarea
                                                                id="message"
                                                                name="message"
                                                                value={formData.message}
                                                                onChange={handleChange}
                                                                rows={4}
                                                                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-emerald-500/50 transition-all duration-300 resize-none"
                                                                placeholder="What makes you a great fit for us?"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between mt-10">
                                                    <motion.button
                                                        type="button"
                                                        onClick={prevStep}
                                                        whileHover={{ scale: 1.02, x: -5 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="px-6 py-4 rounded-xl font-semibold flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                                    >
                                                        <ChevronLeft className="w-5 h-5" />
                                                        Back
                                                    </motion.button>
                                                    <motion.button
                                                        type="button"
                                                        onClick={nextStep}
                                                        whileHover={{ scale: 1.02, x: 5 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300 bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg shadow-emerald-900/40 hover:shadow-emerald-900/60"
                                                    >
                                                        Next Step
                                                        <ChevronRight className="w-5 h-5" />
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Step 3: Upload CV */}
                                        {currentStep === 3 && (
                                            <motion.div
                                                key="step3"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="text-center mb-8">
                                                    <h3 className="text-3xl font-bold text-white mb-2">Final Step</h3>
                                                    <p className="text-gray-400">Attach your CV to complete the application.</p>
                                                </div>

                                                <div className="mb-10">
                                                    <div
                                                        className="relative border-2 border-dashed rounded-3xl p-16 text-center hover:border-emerald-400 transition-all duration-300 cursor-pointer group overflow-hidden bg-white/[0.02]"
                                                        style={{
                                                            borderColor: formData.file ? '#10b981' : 'rgba(255,255,255,0.1)'
                                                        }}
                                                    >
                                                        <input
                                                            type="file"
                                                            accept=".pdf,.doc,.docx"
                                                            onChange={handleFileChange}
                                                            className="hidden"
                                                            id="cv-upload"
                                                        />
                                                        <label htmlFor="cv-upload" className="cursor-pointer block relative z-10 w-full h-full">
                                                            {formData.file ? (
                                                                <div className="flex flex-col items-center">
                                                                    <motion.div
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        className="w-24 h-24 mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center"
                                                                    >
                                                                        <CheckCircle className="w-12 h-12 text-emerald-400" />
                                                                    </motion.div>
                                                                    <p className="text-2xl font-bold text-white mb-2">CV Uploaded!</p>
                                                                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                                                        <FileText className="w-4 h-4 text-emerald-400" />
                                                                        <p className="text-emerald-300 font-medium truncate max-w-[200px]">{formData.file.name}</p>
                                                                    </div>
                                                                    <p className="mt-6 text-sm text-gray-400">Click to change file</p>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col items-center">
                                                                    <div className="w-24 h-24 mb-6 rounded-full bg-[#0f1e3a] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-emerald-500/50 transition-all duration-300 shadow-lg">
                                                                        <Upload className="w-10 h-10 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                                                                    </div>
                                                                    <p className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                                                                        Drop your resume here
                                                                    </p>
                                                                    <p className="text-gray-400 mb-6">or click to browse</p>
                                                                    <div className="flex items-center gap-4 text-xs text-gray-500 uppercase tracking-widest font-medium">
                                                                        <span>PDF</span>
                                                                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                                                                        <span>DOC</span>
                                                                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                                                                        <span>DOCX</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between mt-10">
                                                    <motion.button
                                                        type="button"
                                                        onClick={prevStep}
                                                        whileHover={{ scale: 1.02, x: -5 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="px-6 py-4 rounded-xl font-semibold flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                                    >
                                                        <ChevronLeft className="w-5 h-5" />
                                                        Back
                                                    </motion.button>
                                                    <motion.button
                                                        type="submit"
                                                        disabled={!formData.file || isLoading}
                                                        whileHover={formData.file && !isLoading ? { scale: 1.02, x: 5 } : {}}
                                                        whileTap={formData.file && !isLoading ? { scale: 0.98 } : {}}
                                                        className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300 ${formData.file && !isLoading
                                                            ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg shadow-emerald-900/40 hover:shadow-emerald-900/60'
                                                            : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                                                            }`}
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                                Sending...
                                                            </>
                                                        ) : (
                                                            <>
                                                                Submit Application
                                                                <Send className="w-5 h-5" />
                                                            </>
                                                        )}
                                                    </motion.button>
                                                </div>
                                                {apiError && (
                                                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200">
                                                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                                                        <p className="text-sm">{apiError}</p>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-24 px-6 relative overflow-hidden"
                            style={{
                                background: 'rgba(15, 30, 58, 0.7)',
                                backdropFilter: 'blur(24px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '1.5rem',
                                boxShadow: '0 25px 70px rgba(0,0,0,0.4)'
                            }}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-20">
                                <Sparkles className="w-32 h-32 text-emerald-400 animate-pulse" />
                            </div>

                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_10px_40px_rgba(46,204,113,0.4)]">
                                <Star className="w-12 h-12 text-white" fill="currentColor" />
                            </div>
                            <h3 className="text-4xl font-bold text-white mb-4">Application Sent!</h3>
                            <p className="text-gray-300 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                                Thank you for your interest in joining our team. We've received your details and will get back to you shortly.
                            </p>
                            <motion.button
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setCurrentStep(1);
                                    setFormData({
                                        fullName: '',
                                        email: '',
                                        phone: '',
                                        position: '',
                                        experience: '',
                                        message: '',
                                        file: null
                                    });
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-3 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/20 transition-all border border-white/5"
                            >
                                Submit Another Application
                            </motion.button>
                        </motion.div>
                    )}
                </motion.div>

                {/* Testimonials Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-20"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                        Success Stories from Our Talent Pool
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                                whileHover={{ y: -8 }}
                                className="group relative"
                            >
                                {/* Glow */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

                                {/* Card */}
                                <div
                                    className="relative p-8 rounded-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                                    }}
                                >
                                    <Quote className="absolute top-6 right-6 text-emerald-500/20 rotate-180" size={40} fill="currentColor" />

                                    <div className="flex items-center gap-4 mb-6">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-16 h-16 rounded-full border-2 border-emerald-500/30"
                                        />
                                        <div>
                                            <h4 className="text-white font-bold text-lg">{testimonial.name}</h4>
                                            <p className="text-emerald-400 text-sm">{testimonial.role}</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-300 italic leading-relaxed relative z-10">
                                        "{testimonial.quote}"
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {[
                        { label: "Companies in Portfolio", value: "6+" },
                        { label: "Active Employees", value: "500+" },
                        { label: "Open Positions", value: "15+" }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            whileHover={{ scale: 1.05 }}
                            className="text-center p-8 rounded-2xl"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                boxShadow: '0 15px 40px rgba(0,0,0,0.3)'
                            }}
                        >
                            <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400 mb-2">
                                {stat.value}
                            </div>
                            <div className="text-gray-300 font-medium">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </SectionWrapper>
        </div>
    );
};

export default TalentPool;
