import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ChevronDown } from 'lucide-react';
import { useWhatsApp } from '../hooks/useWhatsApp';

const WhatsAppWidget = () => {
    const { config, loading, error } = useWhatsApp();
    const [isOpen, setIsOpen] = useState(false);
    const [showBubble, setShowBubble] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Show the initial bubble after a short delay
        const timer = setTimeout(() => {
            if (config?.active) {
                setShowBubble(true);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [config]);

    if (loading || error || !config?.active) return null;

    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const encodedMessage = encodeURIComponent(message || config.welcomeMessage);
        const url = `https://wa.me/${config.phoneNumber}?text=${encodedMessage}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        setMessage('');
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            <AnimatePresence>
                {/* Initial "We're Online" Bubble */}
                {showBubble && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 20 }}
                        onClick={() => {
                            setIsOpen(true);
                            setShowBubble(false);
                        }}
                        className="absolute bottom-16 right-0 mb-4 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 cursor-pointer min-w-[200px]"
                    >
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowBubble(false);
                                }}
                                className="absolute -top-6 -right-6 p-1 text-gray-400 hover:text-gray-600"
                            >
                                <X size={14} />
                            </button>
                            <h4 className="font-bold text-gray-800 text-sm mb-1">We're Online!</h4>
                            <p className="text-gray-500 text-xs leading-relaxed">
                                How may I help you today?
                            </p>
                            <div className="absolute -bottom-6 right-6 w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-100" />
                        </div>
                    </motion.div>
                )}

                {/* Main Chat Window */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-3xl shadow-2xl w-[350px] overflow-hidden border border-gray-100 mb-4"
                    >
                        {/* Header */}
                        <div className="bg-[#0070e0] p-6 text-white relative">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 left-4 p-1 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <ChevronDown size={20} />
                            </button>
                            <div className="flex flex-col items-center pt-2">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 relative">
                                    <MessageCircle size={32} />
                                    <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 border-2 border-[#0070e0] rounded-full" />
                                </div>
                                <h3 className="text-xl font-bold">{config.agentName}</h3>
                                <p className="text-white/80 text-sm">Typically replies instantly</p>
                            </div>
                        </div>

                        {/* Body / Chat */}
                        <div className="p-6 bg-[#f0f2f5] min-h-[150px] flex flex-col justify-end">
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[90%] mb-4">
                                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                    {config.welcomeMessage}
                                </p>
                            </div>
                        </div>

                        {/* Footer / Input */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message and hit 'Enter'"
                                className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0070e0] transition-all outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-[#0070e0] text-white p-3 rounded-xl hover:bg-[#0060c0] transition-all shadow-lg active:scale-95"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isOpen ? 'bg-white text-gray-400' : 'bg-[#0070e0] text-white'
                    }`}
            >
                {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
            </motion.button>
        </div>
    );
};

export default WhatsAppWidget;
