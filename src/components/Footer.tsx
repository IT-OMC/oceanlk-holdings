import { motion } from 'framer-motion';
import { oceanData } from '../data/mockData';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-navy border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
                <div className="grid md:grid-cols-4 gap-12">
                    {/* Company Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="md:col-span-2"
                    >
                        <img
                            src="/och-logo.png"
                            alt={oceanData.company.name}
                            className="h-16 w-auto mb-3"
                        />
                        <p className="text-lg text-slate-400 mb-4 italic">
                            {oceanData.company.tagline}
                        </p>
                        <p className="text-slate-400 text-sm max-w-md">
                            {oceanData.company.heroDescription}
                        </p>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {oceanData.navigation.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.path}
                                        className="text-slate-400 hover:text-accent transition-colors text-sm"
                                    >
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
                    >
                        <h4 className="text-white font-semibold text-lg mb-4">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-slate-400 text-sm">
                                <Mail className="w-4 h-4 text-accent" />
                                info@oceanlk.com
                            </li>
                            <li className="flex items-center gap-2 text-slate-400 text-sm">
                                <Phone className="w-4 h-4 text-accent" />
                                +94 11 234 5678
                            </li>
                            <li className="flex items-center gap-2 text-slate-400 text-sm">
                                <MapPin className="w-4 h-4 text-accent" />
                                Colombo, Sri Lanka
                            </li>
                        </ul>

                        {/* Social Media */}
                        <div className="flex gap-3 mt-6">
                            <motion.a
                                whileHover={{ scale: 1.1, y: -2 }}
                                href="#"
                                className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-accent/20 transition-colors"
                            >
                                <Linkedin className="w-4 h-4 text-accent" />
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.1, y: -2 }}
                                href="#"
                                className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-accent/20 transition-colors"
                            >
                                <Twitter className="w-4 h-4 text-accent" />
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.1, y: -2 }}
                                href="#"
                                className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-accent/20 transition-colors"
                            >
                                <Facebook className="w-4 h-4 text-accent" />
                            </motion.a>
                        </div>
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
