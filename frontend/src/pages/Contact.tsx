import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import SectionWrapper from '../components/SectionWrapper';
import { Phone, Mail, Send, Building2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Contact = () => {
    const { t } = useTranslation();

    const contactInfo = [
        {
            icon: Building2,
            title: t('contact.info.headOffice'),
            details: ['Ocean Ceylon Holdings', '123 Galle Road', 'Colombo 03, Sri Lanka']
        },
        {
            icon: Phone,
            title: t('contact.info.phone'),
            details: ['+94 11 234 5678', '+94 77 123 4567']
        },
        {
            icon: Mail,
            title: t('contact.info.email'),
            details: ['info@oceanlk.com', 'careers@oceanlk.com']
        }
    ];
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

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
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                        scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{
                        y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
                        x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
                    }}
                    transition={{
                        duration: Math.random() * 20 + 10,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
            ))}

            <SectionWrapper id="contact" className="pt-32 pb-20 relative z-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
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
                            boxShadow: '0 8px 32px rgba(16,185,129,0.2)'
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Sparkles className="w-4 h-4 text-emerald-400 relative z-10" />
                        <span className="text-sm font-semibold text-white relative z-10">{t('contact.badge')}</span>
                    </motion.div>

                    {/* Hero Title */}
                    <motion.h1
                        className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-blue-200">
                            {t('contact.heroTitle1')}
                        </span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-emerald-200 to-white">
                            {t('contact.heroTitle2')}
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
                    >
                        {t('contact.heroDescription')}
                    </motion.p>
                </motion.div>

                {/* Contact Info Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-20">
                    {contactInfo.map((info, index) => {
                        const Icon = info.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                                className="group relative"
                                whileHover={{ scale: 1.03 }}
                            >
                                {/* Glow Effect on Hover */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />

                                {/* Card */}
                                <div
                                    className="relative p-8 rounded-2xl text-center transition-all duration-500"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        backdropFilter: 'blur(24px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        boxShadow: '0 15px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)',
                                    }}
                                >
                                    <motion.div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(5,150,105,0.1) 100%)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(16,185,129,0.3)'
                                        }}
                                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Icon className="w-8 h-8 text-emerald-400" />
                                    </motion.div>
                                    <h3 className="text-xl font-bold mb-3 text-white">{info.title}</h3>
                                    {info.details.map((detail, i) => (
                                        <p key={i} className="text-gray-300 text-sm">
                                            {detail}
                                        </p>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 1 }}
                        className="group relative"
                    >
                        <h2 className="text-3xl font-bold mb-6 text-white">{t('contact.form.title')}</h2>

                        {/* Form Container */}
                        <div
                            className="p-8 rounded-2xl"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
                                backdropFilter: 'blur(24px)',
                                border: '1px solid rgba(255,255,255,0.25)',
                                boxShadow: '0 25px 70px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
                            }}
                        >
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-200">
                                        {t('contact.form.nameLabel')} {t('contact.form.required')}
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all"
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                        }}
                                        placeholder={t('contact.form.namePlaceholder')}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-200">
                                            {t('contact.form.emailLabel')} {t('contact.form.required')}
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all"
                                            style={{
                                                background: 'rgba(255,255,255,0.05)',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                            }}
                                            placeholder={t('contact.form.emailPlaceholder')}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-semibold mb-2 text-gray-200">
                                            {t('contact.form.phoneLabel')}
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all"
                                            style={{
                                                background: 'rgba(255,255,255,0.05)',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                            }}
                                            placeholder={t('contact.form.phonePlaceholder')}
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="subject" className="block text-sm font-semibold mb-2 text-gray-200">
                                        {t('contact.form.subjectLabel')} {t('contact.form.required')}
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl text-white focus:outline-none transition-all"
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                        }}
                                    >
                                        <option value="" className="bg-[#0f1e3a]">{t('contact.form.subjectPlaceholder')}</option>
                                        <option value="general" className="bg-[#0f1e3a]">{t('contact.form.subjectGeneral')}</option>
                                        <option value="partnership" className="bg-[#0f1e3a]">{t('contact.form.subjectPartnership')}</option>
                                        <option value="investment" className="bg-[#0f1e3a]">{t('contact.form.subjectInvestment')}</option>
                                        <option value="career" className="bg-[#0f1e3a]">{t('contact.form.subjectCareer')}</option>
                                        <option value="other" className="bg-[#0f1e3a]">{t('contact.form.subjectOther')}</option>
                                    </select>
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="message" className="block text-sm font-semibold mb-2 text-gray-200">
                                        {t('contact.form.messageLabel')} {t('contact.form.required')}
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all resize-none"
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                        }}
                                        placeholder={t('contact.form.messagePlaceholder')}
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    className="w-full px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-white relative overflow-hidden group/button"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(16,185,129,0.8) 0%, rgba(5,150,105,0.8) 100%)',
                                        boxShadow: '0 8px 20px rgba(16,185,129,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                                        border: '1px solid rgba(255,255,255,0.3)'
                                    }}
                                    whileHover={{
                                        scale: 1.02,
                                        boxShadow: '0 12px 30px rgba(16,185,129,0.5), inset 0 1px 0 rgba(255,255,255,0.3)'
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {t('contact.form.submitButton')}
                                    <Send className="w-5 h-5 group-hover/button:translate-x-1 transition-transform" />
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Map Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 1.1 }}
                    >
                        <h2 className="text-3xl font-bold mb-6 text-white">{t('contact.map.title')}</h2>
                        <div
                            className="rounded-2xl overflow-hidden h-[600px] relative"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                backdropFilter: 'blur(24px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 15px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)',
                            }}
                        >
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798654815843!2d79.8591902!3d6.8894773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25ba5601730b9%3A0xa80e7f25c7cdc489!2sOcean%20Maritime%20Ceylon%20%7C%20Ship%20Agency%20%26%20Chandlers%20-%20Sri%20Lanka%20%7C%20OMC!5e0!3m2!1sen!2slk!4v1737029000000!5m2!1sen!2slk"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full"
                                title="Ocean Maritime Ceylon Location"
                            />
                        </div>
                    </motion.div>
                </div>
            </SectionWrapper>
        </div>
    );
};

export default Contact;
