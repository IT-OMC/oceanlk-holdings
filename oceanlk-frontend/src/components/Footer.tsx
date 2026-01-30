import { motion } from 'framer-motion';
import { oceanData } from '../data/mockData';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, ArrowRight } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-navy border-t border-white/10">
            <div className="w-full px-4 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Company Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-4"
                    >
                        <img
                            src="/och-logo.png"
                            alt={oceanData.company.name}
                            className="h-16 w-auto mb-3"
                        />
                        <p className="text-lg text-slate-400 mb-4 italic">
                            {oceanData.company.tagline}
                        </p>
                        <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                            {oceanData.company.heroDescription}
                        </p>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2"
                    >
                        <h4 className="text-white font-semibold text-lg mb-6 relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent rounded-full"></span>
                        </h4>
                        <ul className="space-y-3">
                            {oceanData.navigation.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.path}
                                        className="text-slate-400 hover:text-accent transition-colors text-sm flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent/50 group-hover:bg-accent transition-colors"></span>
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-3"
                    >
                        <h4 className="text-white font-semibold text-lg mb-6 relative inline-block">
                            Contact
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent rounded-full"></span>
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-slate-400 text-sm group">
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-accent/10 transition-colors mt-1">
                                    <Mail className="w-4 h-4 text-accent" />
                                </div>
                                <div>
                                    <span className="block text-slate-500 text-xs mb-0.5">Email</span>
                                    info@oceanlk.com
                                </div>
                            </li>
                            <li className="flex items-start gap-3 text-slate-400 text-sm group">
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-accent/10 transition-colors mt-1">
                                    <Phone className="w-4 h-4 text-accent" />
                                </div>
                                <div>
                                    <span className="block text-slate-500 text-xs mb-0.5">Phone</span>
                                    +94 11 234 5678
                                </div>
                            </li>
                            <li className="flex items-start gap-3 text-slate-400 text-sm group">
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-accent/10 transition-colors mt-1">
                                    <MapPin className="w-4 h-4 text-accent" />
                                </div>
                                <div>
                                    <span className="block text-slate-500 text-xs mb-0.5">Address</span>
                                    Colombo, Sri Lanka
                                </div>
                            </li>
                        </ul>

                        {/* Social Media - Moved here from Contact */}
                        <div className="flex gap-3 mt-8">
                            {[Linkedin, Twitter, Facebook].map((Icon, index) => (
                                <motion.a
                                    key={index}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    href="#"
                                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-all text-slate-400"
                                >
                                    <Icon className="w-4 h-4" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Subscribe Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-3"
                    >
                        <h4 className="text-white font-semibold text-lg mb-6 relative inline-block">
                            Newsletter
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent rounded-full"></span>
                        </h4>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            Subscribe to our newsletter to receive the latest news, updates, and exclusive offers directly in your inbox.
                        </p>
                        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pl-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 group"
                            >
                                Subscribe Now
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
                >
                    <p className="text-slate-500 text-sm">
                        © {currentYear} {oceanData.company.name}. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <a href="#" className="text-slate-500 hover:text-accent transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-slate-500 hover:text-accent transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
