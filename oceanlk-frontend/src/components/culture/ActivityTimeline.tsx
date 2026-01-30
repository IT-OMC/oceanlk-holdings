import { motion } from 'framer-motion';
import { useRef } from 'react';

const activities = [
    {
        year: 'Morning',
        title: 'Team Standup',
        description: 'Kickstarting the day with clear goals and coffee.',
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800'
    },
    {
        year: 'Noon',
        title: 'Lunch & Learn',
        description: 'Weekly sessions sharing knowledge across departments.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
    },
    {
        year: 'PM',
        title: 'Deep Work',
        description: 'Focus time for solving complex challenges.',
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800'
    },
    {
        year: 'Sunset',
        title: 'Team Gaming',
        description: 'Unwinding with FIFA tournaments and board games.',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800'
    }
];

const ActivityTimeline = () => {
    const scrollRef = useRef(null);

    return (
        <div className="py-20 bg-black/20">
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <h2 className="text-4xl font-bold mb-4">A Day at OceanLK</h2>
                <p className="text-gray-400">Experience our daily rhythm</p>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-8 overflow-x-auto pb-8 px-6 no-scrollbar snap-x"
            >
                {activities.map((activity, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="min-w-[350px] md:min-w-[400px] snap-center"
                    >
                        <div className="glass rounded-2xl overflow-hidden h-full group cursor-pointer hover:bg-white/5 transition-colors">
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={activity.image}
                                    alt={activity.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <span className="text-accent font-bold text-sm tracking-wider uppercase">{activity.year}</span>
                                <h3 className="text-2xl font-bold mt-2 mb-3">{activity.title}</h3>
                                <p className="text-gray-400">{activity.description}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ActivityTimeline;
