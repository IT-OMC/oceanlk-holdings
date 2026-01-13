import { motion } from 'framer-motion';
import { useState } from 'react';
import SectionWrapper from '../../components/SectionWrapper';
import { Upload, Send } from 'lucide-react';

const TalentPool = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
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
            <SectionWrapper id="talent-pool" className="pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl font-bold mb-6">Join Our Talent Pool</h1>
                    <p className="text-xl text-gray-300 mb-12">
                        Don't see the right opportunity right now? Submit your CV and we'll keep you in mind
                        for future openings that match your skills and interests.
                    </p>

                    <form onSubmit={handleSubmit} className="glass p-8 md:p-12 rounded-xl">
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-semibold mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-md bg-primary-light border border-white/10 focus:border-accent outline-none transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold mb-2">
                                    Email Address *
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
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-md bg-primary-light border border-white/10 focus:border-accent outline-none transition-colors"
                                    placeholder="+94 71 234 5678"
                                />
                            </div>
                            <div>
                                <label htmlFor="position" className="block text-sm font-semibold mb-2">
                                    Desired Position *
                                </label>
                                <input
                                    type="text"
                                    id="position"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-md bg-primary-light border border-white/10 focus:border-accent outline-none transition-colors"
                                    placeholder="e.g., Software Engineer"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="experience" className="block text-sm font-semibold mb-2">
                                Years of Experience *
                            </label>
                            <select
                                id="experience"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-md bg-primary-light border border-white/10 focus:border-accent outline-none transition-colors"
                            >
                                <option value="">Select experience level</option>
                                <option value="0-2">0-2 years</option>
                                <option value="3-5">3-5 years</option>
                                <option value="6-10">6-10 years</option>
                                <option value="10+">10+ years</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="message" className="block text-sm font-semibold mb-2">
                                Tell us about yourself
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={5}
                                className="w-full px-4 py-3 rounded-md bg-primary-light border border-white/10 focus:border-accent outline-none transition-colors resize-none"
                                placeholder="Share your skills, experience, and what you're looking for..."
                            />
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-semibold mb-2">
                                Upload Your CV *
                            </label>
                            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-accent transition-colors cursor-pointer">
                                <Upload className="w-12 h-12 text-accent mx-auto mb-4" />
                                <p className="text-gray-300 mb-2">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-sm text-gray-400">
                                    PDF, DOC, or DOCX (max 5MB)
                                </p>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="hidden"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-accent text-white px-8 py-4 rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-accent/90 transition-all"
                        >
                            Submit Application
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </motion.div>
            </SectionWrapper>
        </div>
    );
};

export default TalentPool;
