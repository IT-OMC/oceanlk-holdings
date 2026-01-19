import { Play, ArrowRight, Globe } from 'lucide-react';

const NewCultureHero = () => {
    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Background Image - Full Viewport */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] hover:scale-105"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
                }}
            >
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-blue-950/70 mix-blend-multiply" />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content Container */}
            <div className="relative h-full flex flex-col items-center justify-center text-center px-4 md:px-6 z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="tracking-tight">
                        {/* Animated Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-sm font-bold tracking-widest text-cyan-300 uppercase bg-blue-900/40 backdrop-blur-md rounded-full border border-cyan-500/30 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-cyan-400" />
                            Life at OCH
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-none drop-shadow-2xl">
                            Empowering People.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                                Shaping Horizons.
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-md">
                            Dive into a culture where innovation meets impact. <br className="hidden md:block" />
                            At Ocean Ceylon Holdings, we don't just ride the waves—we create them.
                        </p>

                        {/* Interactive Buttons */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            {/* Primary Button */}
                            <button
                                className="group relative px-8 py-4 bg-white text-blue-950 rounded-full font-bold text-lg overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative flex items-center gap-3">
                                    Explore Careers
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>

                            {/* Secondary Button */}
                            <button
                                className="group flex items-center gap-3 px-8 py-4 bg-white/10 text-white rounded-full font-bold text-lg backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <Play size={16} fill="currentColor" className="ml-0.5" />
                                </span>
                                Watch Our Story
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Gradient Fade */}


            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2 animate-bounce cursor-pointer hover:text-white transition-colors">
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-current to-transparent" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Scroll Down</span>
            </div>
        </section>
    );
};

export default NewCultureHero;
