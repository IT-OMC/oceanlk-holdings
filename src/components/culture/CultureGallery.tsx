import { motion } from 'framer-motion';

const images = [
    {
        id: 1,
        src: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Office Collaboration',
        span: 'col-span-1 md:col-span-2 row-span-2'
    },
    {
        id: 2,
        src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        alt: 'Meeting Room',
        span: 'col-span-1 md:col-span-1 row-span-1'
    },
    {
        id: 3,
        src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        alt: 'Team Lunch',
        span: 'col-span-1 md:col-span-1 row-span-1'
    },
    {
        id: 4,
        src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        alt: 'Brainstorming Session',
        span: 'col-span-1 md:col-span-1 row-span-2'
    },
    {
        id: 5,
        src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        alt: 'Conference',
        span: 'col-span-1 md:col-span-1 row-span-1'
    },
    {
        id: 6,
        src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Workstation',
        span: 'col-span-1 md:col-span-2 row-span-1'
    },
];

const CultureGallery = () => {
    return (
        <section className="py-20 px-4 md:px-6 max-w-[95%] mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl font-bold mb-4 text-gray-900">Captured Moments</h2>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    A glimpse into the daily life, celebrations, and collaborative spirit that defines our culture.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[200px] gap-4">
                {images.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className={`relative rounded-2xl overflow-hidden group ${item.span}`}
                    >
                        <img
                            src={item.src}
                            alt={item.alt}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                            <span className="text-white font-medium text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                {item.alt}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default CultureGallery;
