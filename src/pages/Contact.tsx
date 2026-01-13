import { motion } from 'framer-motion';
import { useState } from 'react';
import SectionWrapper from '../components/SectionWrapper';
import { MapPin, Phone, Mail, Send, Building2 } from 'lucide-react';

const contactInfo = [
    {
        icon: Building2,
        title: 'Head Office',
        details: ['OceanLK Holdings', '123 Galle Road', 'Colombo 03, Sri Lanka']
    },
    {
        icon: Phone,
        title: 'Phone',
        details: ['+94 11 234 5678', '+94 77 123 4567']
    },
    {
        icon: Mail,
        title: 'Email',
        details: ['info@oceanlk.com', 'careers@oceanlk.com']
    }
];

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

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
        <div className="min-h-screen">
            <SectionWrapper id="contact" className="pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
                    <p className="text-xl text-gray-300 mb-12 max-w-3xl">
                        Get in touch with us. We'd love to hear from you and discuss how we can work together.
                    </p>

                    <div className="grid lg:grid-cols-3 gap-8 mb-16">
                        {contactInfo.map((info, index) => {
                            const Icon = info.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="glass p-8 rounded-xl text-center"
                                >
                                    <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-8 h-8 text-accent" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{info.title}</h3>
                                    {info.details.map((detail, i) => (
                                        <p key={i} className="text-gray-300">
                                            {detail}
                                        </p>
                                    ))}
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="glass p-8 rounded-xl">
                                <div className="mb-6">
                                    <label htmlFor="name" className="block text-sm font-semibold mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-md bg-primary-light border border-white/10 focus:border-accent outline-none transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-md bg-primary-light border border-white/10 focus:border-accent outline-none transition-colors"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-md bg-primary-light border border-white/10 focus:border-accent outline-none transition-colors"
                                            placeholder="+94 71 234 5678"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="subject" className="block text-sm font-semibold mb-2">
                                        Subject *
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-md bg-primary-light border border-white/10 focus:border-accent outline-none transition-colors"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="partnership">Partnership Opportunity</option>
                                        <option value="investment">Investment Inquiry</option>
                                        <option value="career">Career Opportunity</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="message" className="block text-sm font-semibold mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-md bg-primary-light border border-white/10 focus:border-accent outline-none transition-colors resize-none"
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-accent text-white px-8 py-4 rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-accent/90 transition-all"
                                >
                                    Send Message
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </motion.div>

                        {/* Map */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <h2 className="text-3xl font-bold mb-6">Find Us</h2>
                            <div className="glass rounded-xl overflow-hidden h-[600px]">
                                <div className="w-full h-full bg-primary-light flex items-center justify-center">
                                    <div className="text-center">
                                        <MapPin className="w-16 h-16 text-accent mx-auto mb-4" />
                                        <p className="text-gray-400">Map integration placeholder</p>
                                        <p className="text-sm text-gray-500 mt-2">Colombo 03, Sri Lanka</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </SectionWrapper>
        </div>
    );
};

export default Contact;
