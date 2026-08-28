'use client';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NEXT_PUBLIC_API_BASE_URL } from '@/utils/api';
import { Testimonial } from '@/types/api';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    useEffect(() => {
        fetch(NEXT_PUBLIC_API_BASE_URL.TESTIMONIALS)
            .then(res => res.json())
            .then(data => setTestimonials(data))
            .catch(error => console.log(error));
    }, []);

    return (
        <section className="py-8 lg:py-24 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold text-navy mb-4">
                        Client <span className="text-accent">Testimonials</span>
                    </h2>
                    <p className="text-navy text-xl max-w-2xl mx-auto">
                        Success stories from our valued partners around the globe
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials?.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-8 rounded-2xl bg-navy hover:bg-navy/95 transition-all duration-300 group"
                        >
                            <div className="flex justify-between mb-4">
                                {/* Quote Icon */}
                                <div className="relative">
                                    <Quote className="w-10 h-10 text-accent/30 absolute -top-2 -left-2" />
                                </div>

                                {/* Rating */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < testimonial.rating ? 'fill-accent text-accent' : 'text-accent/30'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Quote Text */}
                            <p className="text-slate-200 text-base leading-relaxed mb-6 italic">
                                "{testimonial.quote}"
                            </p>

                            {/* Client Info */}
                            <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-14 h-14 rounded-full object-cover ring-2 ring-accent/30 group-hover:ring-accent transition-all duration-300"
                                />
                                <div>
                                    <h4 className="text-white font-semibold text-xl">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-slate-400 text-sm">
                                        {testimonial.position}
                                    </p>
                                    <p className="text-accent text-xs font-medium mt-1">
                                        {testimonial.company}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
