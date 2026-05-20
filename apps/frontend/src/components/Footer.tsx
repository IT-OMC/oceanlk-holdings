import { motion } from 'framer-motion';
import { oceanData } from '../data/mockData';
import { Mail, Phone, MapPin, Linkedin, Facebook, ArrowRight, Instagram, Youtube } from 'lucide-react';

const XIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
);

const WeChatIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M8.691 2.188C12.872 2.188 16.3 5.033 16.3 8.7c0 3.666-3.428 6.512-7.609 6.512-.86 0-1.68-.106-2.45-.296l-3.08 1.636.566-2.583c-2.228-1.53-3.613-3.799-3.613-6.27 0-3.667 3.428-6.512 7.577-6.512zm9.143 7.028c-2.41 0-4.522 1.09-5.918 2.852.368.167.747.28 1.139.317.073.003.146.01.219.01 4.966 0 9.06 3.036 9.06 6.918 0 1.25-.429 2.42-1.182 3.44l.43 2.126-2.338-1.242c-.93.308-1.922.484-2.96.484-5.266 0-9.492-3.238-9.492-7.394 0-4.156 4.226-7.394 9.492-7.394zm-11.45 4.062c-.456 0-.825-.333-.825-.744 0-.411.37-.744.825-.744s.825.333.825.744c0 .411-.369.744-.825.744zm3.903 0c-.456 0-.825-.333-.825-.744 0-.411.37-.744.825-.744s.825.333.825.744c0 .411-.37.744-.825.744zm7.26 7.647c-.378 0-.684-.277-.684-.618 0-.341.306-.618.684-.618.378 0 .684.277.684.618 0 .341-.306.618-.684.618zm3.235 0c-.378 0-.684-.277-.684-.618 0-.341.306-.618.684-.618.378 0 .684.277.684.618 0 .341-.306.618-.684.618z" />
    </svg>
);

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
                            {[
                                { Icon: Facebook, href: '#' },
                                { Icon: Linkedin, href: '#' },
                                { Icon: Instagram, href: '#' },
                                { Icon: XIcon, href: '#' },
                                { Icon: WeChatIcon, href: '#' },
                                { Icon: Youtube, href: '#' }
                            ].map(({ Icon, href }, index) => (
                                <motion.a
                                    key={index}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    href={href}
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
