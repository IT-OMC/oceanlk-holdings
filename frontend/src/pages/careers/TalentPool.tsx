import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import SectionWrapper from '../../components/SectionWrapper';
import { Upload, Send, ChevronRight, ChevronLeft, Sparkles, Target, Zap, Users, TrendingUp, Star, Quote } from 'lucide-react';

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

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
        setIsSubmitted(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const canProceedStep1 = formData.fullName && formData.email && formData.phone;
    const canProceedStep2 = formData.position && formData.experience;

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

                {/* Form Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="max-w-3xl mx-auto mb-20"
                >
                    {!isSubmitted ? (
                        <div
                            className="p-1.5 rounded-3xl"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 25px 70px rgba(0,0,0,0.4)'
                            }}
                        >
                            {/* Progress Indicator */}
                            <div className="px-8 pt-8 pb-4">
                                <div className="flex items-center justify-between mb-8">
                                    {[1, 2, 3].map((step) => (
                                        <div key={step} className="flex items-center flex-1">
                                            <motion.div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep >= step
                                                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                                                        : 'bg-white/10 text-gray-400'
                                                    }`}
                                                animate={{
                                                    scale: currentStep === step ? 1.1 : 1
                                                }}
                                            >
                                                {currentStep > step ? '✓' : step}
                                            </motion.div>
                                            {step < 3 && (
                                                <div className="flex-1 h-1 mx-2">
                                                    <div className="h-full bg-white/10 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                                                            initial={{ width: '0%' }}
                                                            animate={{ width: currentStep > step ? '100%' : '0%' }}
                                                            transition={{ duration: 0.4 }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-8">
                                <AnimatePresence mode="wait">
                                    {/* Step 1: Personal Information */}
                                    {currentStep === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <h3 className="text-2xl font-bold text-white mb-6">Personal Information</h3>

                                            <div className="space-y-4">
                                                <div>
                                                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-200 mb-2">
                                                        Full Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="fullName"
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all focus:scale-[1.02]"
                                                        placeholder="John Doe"
                                                        style={{
                                                            background: 'rgba(255,255,255,0.05)',
                                                            backdropFilter: 'blur(10px)',
                                                            border: '1px solid rgba(255,255,255,0.1)',
                                                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                                        }}
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-2">
                                                        Email Address *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all focus:scale-[1.02]"
                                                        placeholder="john@example.com"
                                                        style={{
                                                            background: 'rgba(255,255,255,0.05)',
                                                            backdropFilter: 'blur(10px)',
                                                            border: '1px solid rgba(255,255,255,0.1)',
                                                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                                        }}
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-200 mb-2">
                                                        Phone Number *
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        id="phone"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all focus:scale-[1.02]"
                                                        placeholder="+94 71 234 5678"
                                                        style={{
                                                            background: 'rgba(255,255,255,0.05)',
                                                            backdropFilter: 'blur(10px)',
                                                            border: '1px solid rgba(255,255,255,0.1)',
                                                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-end mt-8">
                                                <motion.button
                                                    type="button"
                                                    onClick={nextStep}
                                                    disabled={!canProceedStep1}
                                                    whileHover={canProceedStep1 ? { scale: 1.05 } : {}}
                                                    whileTap={canProceedStep1 ? { scale: 0.95 } : {}}
                                                    className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${canProceedStep1
                                                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/50'
                                                            : 'bg-white/10 text-gray-400 cursor-not-allowed'
                                                        }`}
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
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <h3 className="text-2xl font-bold text-white mb-6">Professional Details</h3>

                                            <div className="space-y-4">
                                                <div>
                                                    <label htmlFor="position" className="block text-sm font-semibold text-gray-200 mb-2">
                                                        Desired Position *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="position"
                                                        name="position"
                                                        value={formData.position}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all focus:scale-[1.02]"
                                                        placeholder="e.g., Software Engineer"
                                                        style={{
                                                            background: 'rgba(255,255,255,0.05)',
                                                            backdropFilter: 'blur(10px)',
                                                            border: '1px solid rgba(255,255,255,0.1)',
                                                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                                        }}
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="experience" className="block text-sm font-semibold text-gray-200 mb-2">
                                                        Years of Experience *
                                                    </label>
                                                    <select
                                                        id="experience"
                                                        name="experience"
                                                        value={formData.experience}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-3 rounded-xl text-white focus:outline-none transition-all focus:scale-[1.02]"
                                                        style={{
                                                            background: 'rgba(255,255,255,0.05)',
                                                            backdropFilter: 'blur(10px)',
                                                            border: '1px solid rgba(255,255,255,0.1)',
                                                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                                        }}
                                                    >
                                                        <option value="" style={{ background: '#1a2847' }}>Select experience level</option>
                                                        <option value="0-2" style={{ background: '#1a2847' }}>0-2 years</option>
                                                        <option value="3-5" style={{ background: '#1a2847' }}>3-5 years</option>
                                                        <option value="6-10" style={{ background: '#1a2847' }}>6-10 years</option>
                                                        <option value="10+" style={{ background: '#1a2847' }}>10+ years</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label htmlFor="message" className="block text-sm font-semibold text-gray-200 mb-2">
                                                        Tell us about yourself
                                                    </label>
                                                    <textarea
                                                        id="message"
                                                        name="message"
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        rows={5}
                                                        className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all focus:scale-[1.02] resize-none"
                                                        placeholder="Share your skills, experience, and what you're looking for..."
                                                        style={{
                                                            background: 'rgba(255,255,255,0.05)',
                                                            backdropFilter: 'blur(10px)',
                                                            border: '1px solid rgba(255,255,255,0.1)',
                                                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-between mt-8">
                                                <motion.button
                                                    type="button"
                                                    onClick={prevStep}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-8 py-3 rounded-xl font-semibold flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 transition-all"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                    Back
                                                </motion.button>
                                                <motion.button
                                                    type="button"
                                                    onClick={nextStep}
                                                    disabled={!canProceedStep2}
                                                    whileHover={canProceedStep2 ? { scale: 1.05 } : {}}
                                                    whileTap={canProceedStep2 ? { scale: 0.95 } : {}}
                                                    className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${canProceedStep2
                                                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/50'
                                                            : 'bg-white/10 text-gray-400 cursor-not-allowed'
                                                        }`}
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
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <h3 className="text-2xl font-bold text-white mb-6">Upload Your CV</h3>

                                            <div className="mb-8">
                                                <label className="block text-sm font-semibold text-gray-200 mb-4">
                                                    Upload Your CV *
                                                </label>
                                                <div
                                                    className="border-2 border-dashed rounded-2xl p-12 text-center hover:border-emerald-400 transition-all cursor-pointer group"
                                                    style={{
                                                        borderColor: formData.file ? 'rgba(46,204,113,0.5)' : 'rgba(255,255,255,0.2)',
                                                        background: 'rgba(255,255,255,0.02)'
                                                    }}
                                                >
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                        id="cv-upload"
                                                    />
                                                    <label htmlFor="cv-upload" className="cursor-pointer">
                                                        <Upload className="w-16 h-16 text-emerald-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                                        {formData.file ? (
                                                            <div>
                                                                <p className="text-emerald-400 font-semibold mb-2">✓ File Selected</p>
                                                                <p className="text-gray-300">{formData.file.name}</p>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <p className="text-gray-300 mb-2">
                                                                    Click to upload or drag and drop
                                                                </p>
                                                                <p className="text-sm text-gray-400">
                                                                    PDF, DOC, or DOCX (max 5MB)
                                                                </p>
                                                            </div>
                                                        )}
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="flex justify-between mt-8">
                                                <motion.button
                                                    type="button"
                                                    onClick={prevStep}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-8 py-3 rounded-xl font-semibold flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 transition-all"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                    Back
                                                </motion.button>
                                                <motion.button
                                                    type="submit"
                                                    disabled={!formData.file}
                                                    whileHover={formData.file ? { scale: 1.05 } : {}}
                                                    whileTap={formData.file ? { scale: 0.95 } : {}}
                                                    className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${formData.file
                                                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/50'
                                                            : 'bg-white/10 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                >
                                                    Submit Application
                                                    <Send className="w-5 h-5" />
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '1.5rem',
                                boxShadow: '0 25px 70px rgba(0,0,0,0.4)'
                            }}
                        >
                            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Star className="w-10 h-10 text-white" fill="currentColor" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">Application Submitted!</h3>
                            <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
                                Thank you for joining our talent pool. We'll review your profile and be in touch soon!
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
                                className="px-8 py-3 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/20 transition-all"
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
