import { motion } from 'framer-motion';
import { Globe, Award, ChevronRight, Quote } from 'lucide-react';

const LifeAtHolding = () => {
    return (
        <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Life at OCH</h2>
                    <p className="text-gray-500">A glimpse into our daily rhythm and values.</p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                    <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600">
                        <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                            <div className="bg-current rounded-[1px]"></div>
                            <div className="bg-current rounded-[1px]"></div>
                            <div className="bg-current rounded-[1px]"></div>
                            <div className="bg-current rounded-[1px]"></div>
                        </div>
                    </button>
                    <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600">
                        <div className="w-5 h-5 flex flex-col justify-between py-0.5">
                            <div className="h-0.5 w-full bg-current rounded-full"></div>
                            <div className="h-0.5 w-full bg-current rounded-full"></div>
                            <div className="h-0.5 w-full bg-current rounded-full"></div>
                        </div>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(200px,auto)]">
                {/* Large Card - Annual Retreat */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-3xl"
                >
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8 text-white">
                        <span className="inline-block px-3 py-1 mb-4 text-xs font-bold bg-blue-500 rounded-full">
                            Highlight
                        </span>
                        <h3 className="text-3xl font-bold mb-2">Annual Retreat 2023</h3>
                        <p className="text-gray-200 line-clamp-2">Bringing our global teams together for a week of strategy, bonding, and adventure in the mountains.</p>
                    </div>
                </motion.div>

                {/* Stats Card - Remote Workforce */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-blue-50 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden"
                >
                    <div className="absolute top-4 right-4 text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded">FLEXIBILITY</div>
                    <Globe className="text-blue-500 mb-4" size={32} />
                    <div className="text-5xl font-bold text-blue-600 mb-2">40%</div>
                    <div className="text-gray-600 font-medium">Remote Workforce</div>
                </motion.div>

                {/* Image Card - Community Day */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="md:row-span-2 relative group overflow-hidden rounded-3xl"
                >
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur rounded-xl p-2 text-center text-xs font-bold shadow-lg">
                        <div className="text-gray-400 uppercase tracking-widest text-[10px]">OCT</div>
                        <div className="text-xl text-gray-900">12</div>
                    </div>
                    <div className="absolute bottom-0 left-0 p-6 text-white text-center w-full">
                        <h3 className="text-xl font-bold mb-1">Community Day</h3>
                        <p className="text-sm text-gray-200">Giving back to our local parks.</p>
                    </div>
                </motion.div>

                {/* Core Value Card */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-yellow-50 rounded-3xl p-8 flex flex-col justify-center"
                >
                    <Award className="text-yellow-500 mb-4" size={32} />
                    <div className="text-xs font-bold text-gray-400 uppercase mb-1">CORE VALUE</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Integrity First.</h3>
                    <p className="text-gray-600 text-sm">Doing the right thing, even when no one is watching.</p>
                </motion.div>

                {/* Testimonial Card */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="md:col-span-2 bg-white border border-gray-100 shadow-xl shadow-gray-100/50 rounded-3xl p-8 flex items-center gap-8"
                >
                    <div className="flex-shrink-0">
                        <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                            alt="Employee"
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                    </div>
                    <div className="relative">
                        <Quote className="absolute -top-4 -left-2 text-gray-100 rotate-180" size={60} fill="currentColor" />
                        <p className="text-lg text-gray-700 italic relative z-10 mb-4">
                            "Working here feels like being part of a family that pushes you to grow. The mentorship I've received is unmatched."
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">Sarah Jenkins</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="text-blue-500 font-medium text-sm">Product Lead</span>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Card - Offices */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8 flex flex-col justify-center"
                >
                    <div className="text-5xl font-bold text-gray-900 mb-2 flex items-baseline gap-1">
                        5<span className="text-blue-500 text-2xl">.</span>
                    </div>
                    <div className="text-gray-500 font-medium mb-4">Global Offices</div>
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`w-3 h-3 rounded-full ${i === 1 ? 'bg-blue-200' : i === 2 ? 'bg-blue-300' : 'bg-blue-400'}`} />
                        ))}
                    </div>
                </motion.div>

                {/* Dark Card - Hackathon */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-[#0f172a] text-white rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent" />
                    <div className="flex justify-between items-start relative z-10">
                        <span className="px-2 py-1 bg-red-500 text-[10px] font-bold rounded">UPCOMING</span>
                        <ChevronRight className="text-gray-500" size={16} />
                    </div>
                    <div className="relative z-10 mt-12">
                        <h3 className="text-xl font-bold mb-1">Winter Hackathon</h3>
                        <button className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors flex items-center gap-1 mt-2">
                            Register Now <ChevronRight size={12} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default LifeAtHolding;
