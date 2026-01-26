import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SectionWrapper from '../../components/SectionWrapper';
import { Upload, Send, ChevronRight, ChevronLeft, Sparkles, Star, CheckCircle, AlertCircle, FileText, ArrowLeft, Briefcase, MapPin, Clock } from 'lucide-react';

interface JobOpportunity {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    category: string;
    description: string;
    featured: boolean;
    level: string;
}

const JobApplication = () => {
    const { id } = useParams<{ id: string }>();
    const [job, setJob] = useState<JobOpportunity | null>(null);
    const [isLoadingJob, setIsLoadingJob] = useState(true);

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                // Since we don't have a single job endpoint verified, we fetch all and filter
                // Or try single endpoint if available. Let's try fetching all for now as a fallback.
                const response = await fetch('http://localhost:8080/api/jobs');
                if (response.ok) {
                    const jobs = await response.json();
                    const foundJob = jobs.find((j: JobOpportunity) => j.id === id);
                    if (foundJob) {
                        setJob(foundJob);
                        setFormData(prev => ({ ...prev, position: foundJob.title }));
                    }
                }
            } catch (error) {
                console.error("Error fetching job:", error);
            } finally {
                setIsLoadingJob(false);
            }
        };

        if (id) {
            fetchJob();
        }

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [id]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
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

            setIsSubmitted(true);
        } catch (error) {
            console.error('Error submitting application:', error);
            setApiError('Failed to submit application. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
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

    if (isLoadingJob) {
        return (
            <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-[#0a1628] flex items-center justify-center flex-col">
                <h2 className="text-2xl text-white font-bold mb-4">Job Not Found</h2>
                <Link to="/careers/opportunities" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Opportunities
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#1a2847] relative overflow-hidden">
            {/* Animated Gradient Mesh Background */}
            <div className="absolute inset-0 opacity-30">
                <div
                    className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] animate-pulse"
                    style={{
                        background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)',
                        transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
                    }}
                />
                <div
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse"
                    style={{
                        background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
                        animationDelay: '1s',
                        transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)`
                    }}
                />
            </div>

            <SectionWrapper id="job-application" className="pt-32 pb-20 relative z-10">
                {/* Back Button */}
                <div className="mb-8">
                    <Link to="/careers/opportunities" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span>Back to Opportunities</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Job Details Sidebar */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 sticky top-32"
                        >
                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-4">
                                    {job.type}
                                </span>
                                <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                                <p className="text-xl text-gray-300 font-medium">{job.company}</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <MapPin className="w-5 h-5 text-emerald-500" />
                                    <span>{job.location}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Briefcase className="w-5 h-5 text-emerald-500" />
                                    <span>{job.level}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Clock className="w-5 h-5 text-emerald-500" />
                                    <span>Posted recently</span>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-6">
                                <h3 className="text-lg font-bold text-white mb-4">About the Role</h3>
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {job.description}
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Application Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative group/form"
                        >
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
                                {!isSubmitted ? (
                                    <>
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
                                                        <span className={`hidden md:block absolute -bottom-6 text-xs font-medium uppercase tracking-wider ${currentStep >= step ? 'text-emerald-400' : 'text-gray-600'}`}>
                                                            {step === 1 ? 'Personal' : step === 2 ? 'Professional' : 'CV'}
                                                        </span>
                                                    </div>
                                                ))}

                                                {/* Progress Fill Line */}
                                                <div className="absolute top-1/2 left-0 h-1 bg-emerald-500 rounded-full -z-10 transition-all duration-500"
                                                    style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <form onSubmit={handleSubmit} className="p-8 md:p-10">
                                            <AnimatePresence mode="wait">
                                                {/* Step 1: Personal Information */}
                                                {currentStep === 1 && (
                                                    <motion.div
                                                        key="step1"
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                    >
                                                        <h3 className="text-2xl font-bold text-white mb-6">Personal Details</h3>
                                                        <div className="space-y-6">
                                                            {[
                                                                { id: 'fullName', label: 'Full Name', type: 'text', placeholder: 'e.g. Sarah Smith' },
                                                                { id: 'email', label: 'Email Address', type: 'email', placeholder: 'sarah@example.com' },
                                                                { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+94 71 234 5678' }
                                                            ].map((field) => (
                                                                <div key={field.id} className="group">
                                                                    <label htmlFor={field.id} className="block text-sm font-semibold text-gray-300 mb-2 ml-1">
                                                                        {field.label} <span className="text-emerald-500">*</span>
                                                                    </label>
                                                                    <div className="relative">
                                                                        <input
                                                                            type={field.type}
                                                                            id={field.id}
                                                                            name={field.id}
                                                                            value={formData[field.id as keyof typeof formData] as string}
                                                                            onChange={handleChange}
                                                                            className={`w-full px-5 py-4 rounded-xl bg-white/5 border text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all ${errors[field.id] ? 'border-red-500/50' : 'border-white/10 focus:border-emerald-500/50'}`}
                                                                            placeholder={field.placeholder}
                                                                        />
                                                                        {errors[field.id] && (
                                                                            <div className="flex items-center gap-1 mt-2 text-red-400 text-xs">
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
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                className="px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg"
                                                            >
                                                                Next Step <ChevronRight className="w-5 h-5" />
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
                                                    >
                                                        <h3 className="text-2xl font-bold text-white mb-6">Professional Details</h3>
                                                        <div className="space-y-6">
                                                            <div className="group">
                                                                <label className="block text-sm font-semibold text-gray-300 mb-2 ml-1">
                                                                    Applying For
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.position}
                                                                    disabled
                                                                    className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/10 text-gray-400 cursor-not-allowed"
                                                                />
                                                            </div>

                                                            <div className="group">
                                                                <label htmlFor="experience" className="block text-sm font-semibold text-gray-300 mb-2 ml-1">
                                                                    Years of Experience <span className="text-emerald-500">*</span>
                                                                </label>
                                                                <div className="relative">
                                                                    <select
                                                                        id="experience"
                                                                        name="experience"
                                                                        value={formData.experience}
                                                                        onChange={handleChange}
                                                                        className={`w-full px-5 py-4 rounded-xl bg-white/5 border text-white focus:outline-none appearance-none cursor-pointer ${errors.experience ? 'border-red-500/50' : 'border-white/10 focus:border-emerald-500/50'}`}
                                                                    >
                                                                        <option value="" className="bg-[#0f1e3a] text-gray-400">Select experience level</option>
                                                                        <option value="0-2" className="bg-[#0f1e3a] text-white">0-2 years</option>
                                                                        <option value="3-5" className="bg-[#0f1e3a] text-white">3-5 years</option>
                                                                        <option value="6-10" className="bg-[#0f1e3a] text-white">6-10 years</option>
                                                                        <option value="10+" className="bg-[#0f1e3a] text-white">10+ years</option>
                                                                    </select>
                                                                    <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 rotate-90 pointer-events-none" />
                                                                    {errors.experience && (
                                                                        <div className="flex items-center gap-1 mt-2 text-red-400 text-xs">
                                                                            <AlertCircle className="w-3 h-3" />
                                                                            <span>{errors.experience}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="group">
                                                                <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2 ml-1">
                                                                    Cover Letter / Message
                                                                </label>
                                                                <textarea
                                                                    id="message"
                                                                    name="message"
                                                                    value={formData.message}
                                                                    onChange={handleChange}
                                                                    rows={4}
                                                                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                                                                    placeholder="Why are you a good fit for this role?"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-between mt-10">
                                                            <motion.button
                                                                type="button"
                                                                onClick={prevStep}
                                                                className="px-6 py-4 rounded-xl font-semibold flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                                            >
                                                                <ChevronLeft className="w-5 h-5" /> Back
                                                            </motion.button>
                                                            <motion.button
                                                                type="button"
                                                                onClick={nextStep}
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                className="px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg"
                                                            >
                                                                Next Step <ChevronRight className="w-5 h-5" />
                                                            </motion.button>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {/* Step 3: CV Upload */}
                                                {currentStep === 3 && (
                                                    <motion.div
                                                        key="step3"
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                    >
                                                        <h3 className="text-2xl font-bold text-white mb-6">Upload CV</h3>

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
                                                                className="px-6 py-4 rounded-xl font-semibold flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                                            >
                                                                <ChevronLeft className="w-5 h-5" /> Back
                                                            </motion.button>
                                                            <motion.button
                                                                type="submit"
                                                                disabled={!formData.file || isSubmitting}
                                                                whileHover={formData.file && !isSubmitting ? { scale: 1.02 } : {}}
                                                                whileTap={formData.file && !isSubmitting ? { scale: 0.98 } : {}}
                                                                className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300 ${formData.file && !isSubmitting
                                                                    ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg'
                                                                    : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                                                                    }`}
                                                            >
                                                                {isSubmitting ? 'Sending...' : 'Submit Application'}
                                                                {!isSubmitting && <Send className="w-5 h-5" />}
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
                                    </>
                                ) : (
                                    <div className="text-center py-24 px-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-20">
                                            <Sparkles className="w-32 h-32 text-emerald-400 animate-pulse" />
                                        </div>

                                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_10px_40px_rgba(46,204,113,0.4)]">
                                            <Star className="w-12 h-12 text-white" fill="currentColor" />
                                        </div>
                                        <h3 className="text-4xl font-bold text-white mb-4">Application Sent!</h3>
                                        <p className="text-gray-300 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                                            Thank you for applying to <strong>{job.company}</strong>. We've received your application and will review it shortly.
                                        </p>
                                        <Link
                                            to="/careers/opportunities"
                                            className="inline-block px-8 py-3 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/20 transition-all border border-white/5"
                                        >
                                            View More Opportunities
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </SectionWrapper>
        </div>
    );
};

export default JobApplication;
