import { motion } from 'framer-motion';
import { oceanData } from '../data/mockData';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
    const { t } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);
    const sectors = oceanData.sectors;

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % sectors.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + sectors.length) % sectors.length);
    };

    // Auto-advance slides
    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [sectors.length]);

    return (
        <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden group">
            {/* Full Viewport Background - No rounded rectangle */}
            <div className="absolute inset-0 overflow-hidden bg-navy">
                {/* Carousel Background Image - Changes based on selected sector */}
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0"
                >
                    <motion.img
                        src={sectors[currentSlide].image}
                        alt={sectors[currentSlide].title}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 8, ease: "easeOut" }}
                    />
                </motion.div>

                {/* Dark Overlay for better contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

                {/* Center Content */}
                <div className="absolute inset-x-0 top-20 md:top-24 bottom-32 md:bottom-36 lg:bottom-40 flex flex-col items-center justify-center z-10 px-4 md:px-8 lg:px-12">
                    {/* Company Logo - Dynamic based on sector */}
                    <motion.div
                        key={`logo-${currentSlide}`}
                        initial={{ scale: 0, rotate: 180, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, rotate: -180, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-4 md:mb-5 lg:mb-6 p-4 md:p-5 lg:p-6 bg-white rounded-full shadow-lg"
                    >
                        <img
                            src={sectors[currentSlide].logo}
                            alt={`${sectors[currentSlide].title} logo`}
                            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
                        />
                    </motion.div>

                    {/* Main Heading - Dynamic based on sector */}
                    <motion.h1
                        key={`title-${currentSlide}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white text-center leading-tight mb-3 md:mb-4 lg:mb-5"
                    >
                        {sectors[currentSlide].title}
                    </motion.h1>

                    {/* Subtitle - Dynamic based on sector */}
                    <motion.p
                        key={`desc-${currentSlide}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/90 text-center max-w-sm md:max-w-md lg:max-w-2xl mb-6 md:mb-8 lg:mb-9 px-2 md:px-4"
                    >
                        {sectors[currentSlide].desc}
                    </motion.p>

                    {/* CTA Button */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="px-5 md:px-6 lg:px-8 py-2.5 md:py-3 lg:py-3.5 bg-white/10 backdrop-blur-sm text-white text-sm lg:text-base font-medium rounded-full border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105"
                    >
                        {t('hero.exploreButton')}
                    </motion.button>
                </div>

                {/* Carousel Navigation Arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/20 transition-all duration-300 group opacity-0 group-hover:opacity-100"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7 text-white group-hover:scale-110 transition-transform" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/20 transition-all duration-300 group opacity-0 group-hover:opacity-100"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6 lg:w-7 lg:h-7 text-white group-hover:scale-110 transition-transform" />
                </button>



                {/* Social Media Sidebar */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-6 py-6 px-3 bg-white rounded-l-2xl shadow-lg transform translate-x-0 transition-transform duration-300">
                    {/* Facebook */}
                    <a href="#" className="hover:scale-110 transition-transform">
                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#1877F2">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                    </a>
                    {/* LinkedIn */}
                    <a href="#" className="hover:scale-110 transition-transform">
                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#0A66C2">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.234-1.66-2.234-.906 0-1.446.61-1.683 1.197-.086.21-.107.502-.107.795v5.811H9.89s.048-9.422 0-10.42h3.554v1.477c.472-.731 1.325-1.776 3.219-1.776 2.348 0 4.109 1.534 4.109 4.832v5.887zM5.337 8.533c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 11.919H3.555V10.033h3.564v10.419z" />
                        </svg>
                    </a>
                    {/* Instagram */}
                    <a href="#" className="hover:scale-110 transition-transform text-white">
                        <svg className="w-7 h-7" viewBox="0 0 24 24">
                            <defs>
                                <linearGradient id="ig-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#833ab4" />
                                    <stop offset="50%" stopColor="#fd1d1d" />
                                    <stop offset="100%" stopColor="#fcb045" />
                                </linearGradient>
                            </defs>
                            <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
                            <path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm5.25-9a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
                            <path fill="currentColor" fillRule="evenodd" d="M16 3H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5zm5 13a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8z" clipRule="evenodd" />
                        </svg>
                    </a>
                    {/* X (Twitter) */}
                    <a href="#" className="hover:scale-110 transition-transform">
                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="black">
                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                        </svg>
                    </a>
                    {/* WeChat */}
                    <a href="#" className="hover:scale-110 transition-transform">
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#07C160">
                            <path d="M8.5 13.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm5 0c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm-6.5-6c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm5 0c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z" />
                            <path fillRule="evenodd" d="M17.5 12c-2.48 0-4.5 1.79-4.5 4s2.02 4 4.5 4c.54 0 1.06-.09 1.54-.25l1.96 1.05v-1.89c1.5-1.07 2.5-2.65 2.5-4.41-.03-2.21-2.04-4.5-5.5-4.5zM8 3C3.58 3 0 6.13 0 10c0 2.21 1.17 4.17 3.03 5.46L2.5 19l3.48-1.74c1.03.4 2.14.63 3.3.56.33-2.61 2.55-4.83 5.22-4.83.6 0 1.18.11 1.73.31C16.89 5.8 12.87 3 8 3z" clipRule="evenodd" />
                        </svg>
                    </a>
                    {/* YouTube */}
                    <a href="#" className="hover:scale-110 transition-transform">
                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#FF0000">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Bottom Navigation Circles */}
            <div className="absolute bottom-16 lg:bottom-24 left-0 right-0 z-20 px-4 lg:px-6">
                <div className="w-full max-w-[98%] mx-auto flex justify-between items-center overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 gap-4 no-scrollbar">
                    {sectors.map((sector, index) => {
                        const isActive = currentSlide === index;
                        return (
                            <button
                                key={sector.id}
                                onClick={() => setCurrentSlide(index)}
                                className="group flex-1 flex items-center gap-4 focus:outline-none min-w-fit lg:min-w-0"
                            >
                                <div className="relative">
                                    {/* Dotted Outline Ring - Only Visible when Active */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeRing"
                                            className="absolute -inset-2 rounded-full border-2 border-dotted border-secondary"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}

                                    {/* Image Circle - Active much larger, inactive smaller */}
                                    <motion.div
                                        animate={{
                                            scale: isActive ? 1 : 0.6,
                                            opacity: isActive ? 1 : 0.5
                                        }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className={`relative ${isActive ? 'w-14 h-14 lg:w-16 lg:h-16' : 'w-10 h-10 lg:w-12 lg:h-12'} rounded-full overflow-hidden border-2 ${isActive ? 'border-secondary' : 'border-white/50 group-hover:opacity-100'} bg-white flex items-center justify-center p-2`}
                                    >
                                        <img
                                            src={sector.logo}
                                            alt={sector.title}
                                            className="w-full h-full object-contain"
                                        />
                                    </motion.div>
                                </div>

                                {/* Sector Name Label - Always Visible */}
                                <span className={`font-medium text-sm lg:text-base whitespace-nowrap transition-colors duration-300 hidden lg:block ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white/90'}`}>
                                    {sector.title}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Scroll Down Indicator - Below Circles */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2"
                >
                    <motion.div
                        animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-1.5 h-1.5 bg-white rounded-full"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
