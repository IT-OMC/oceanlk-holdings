'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Particle {
    x1: number;
    y1: number;
    scale: number;
    x2: number;
    y2: number;
    duration: number;
}

export default function NotFound() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [particlesReady, setParticlesReady] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        setParticles([...Array(20)].map(() => ({
            x1: Math.random() * window.innerWidth,
            y1: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5,
            x2: Math.random() * window.innerWidth,
            y2: Math.random() * window.innerHeight,
            duration: Math.random() * 20 + 10
        })));
        setParticlesReady(true);

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#1a2847] relative overflow-hidden flex flex-col items-center justify-center">
            {/* Animated Gradient Mesh Background */}
            <div className="absolute inset-0 opacity-30 z-0 pointer-events-none">
                <div
                    className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] animate-pulse"
                    style={{
                        background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)',
                        transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
                        animationDuration: '8s'
                    }}
                />
                <div
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse"
                    style={{
                        background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
                        animationDelay: '2s',
                        transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)`,
                        animationDuration: '8s'
                    }}
                />
                <div
                    className="absolute top-1/2 left-1/2 w-[700px] h-[700px] rounded-full blur-[150px] animate-pulse"
                    style={{
                        background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
                        animationDelay: '4s',
                        animationDuration: '8s'
                    }}
                />
            </div>

            {/* Floating Particles */}
            {particlesReady && particles.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/20 rounded-full z-0 pointer-events-none"
                    initial={{
                        x: p.x1,
                        y: p.y1,
                        scale: p.scale
                    }}
                    animate={{
                        y: [null, p.y2],
                        x: [null, p.x2],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
            ))}

            <div className="relative z-10 flex flex-col items-center justify-center gap-6 text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-8xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 mb-4"
                        style={{ filter: 'drop-shadow(0 10px 20px rgba(16,185,129,0.2))' }}
                    >
                        404
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Page Not Found
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400 max-w-md mx-auto mb-8">
                        The page you are looking for has drifted away or doesn't exist.
                    </p>
                    
                    <Link href="/">
                        <motion.button
                            className="px-8 py-4 rounded-full text-white font-semibold flex items-center gap-2 mx-auto"
                            style={{
                                background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(5,150,105,0.2) 100%)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(16,185,129,0.3)',
                                boxShadow: '0 8px 32px rgba(16,185,129,0.2)'
                            }}
                            whileHover={{
                                scale: 1.05,
                                background: 'linear-gradient(135deg, rgba(16,185,129,0.4) 0%, rgba(5,150,105,0.4) 100%)',
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Back to Homepage &rarr;
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
