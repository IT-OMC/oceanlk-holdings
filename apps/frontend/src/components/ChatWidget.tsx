import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ChevronDown, Bot } from 'lucide-react';
import { useWhatsApp } from '../hooks/useWhatsApp';

// Define message type
interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: Date;
}

const ChatWidget = () => {
    // We reuse the existing hook for basic config like agent name/welcome message
    // even though we aren't using the phone number anymore.
    const { config, loading, error } = useWhatsApp();
    const [isOpen, setIsOpen] = useState(false);
    const [showBubble, setShowBubble] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isOpen]);

    useEffect(() => {
        // Show the initial bubble after a short delay
        const timer = setTimeout(() => {
            if (config?.active) {
                setShowBubble(true);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [config]);

    // Initialize with welcome message when opened/loaded
    useEffect(() => {
        if (config?.welcomeMessage && messages.length === 0) {
            setMessages([
                {
                    id: 'welcome',
                    text: config.welcomeMessage,
                    sender: 'agent',
                    timestamp: new Date()
                }
            ]);
        }
    }, [config, messages.length]);

    if (error) {
        console.error('Chat Widget Error:', error);
        return null;
    }

    if (loading || !config?.active) return null;

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!inputValue.trim()) return;

        const userMsgText = inputValue.trim();
        setInputValue('');

        // Add User Message
        const userMsg: Message = {
            id: Date.now().toString(),
            text: userMsgText,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:8080/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMsgText }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Add Agent Message
            const agentMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: data.response,
                sender: 'agent',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, agentMsg]);

        } catch (error) {
            console.error('Error sending message:', error);
            // Add Error Message
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "I apologize, but I'm having trouble connecting to the server right now. Please try again later.",
                sender: 'agent',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    // Auto-focus input when opened
    // const inputRef = useRef<HTMLInputElement>(null);
    // useEffect(() => {
    //     if (isOpen) {
    //         setTimeout(() => inputRef.current?.focus(), 300);
    //     }
    // }, [isOpen]);

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
                                className="absolute -top-2 -right-2 p-1 text-gray-400 hover:text-gray-600"
                            >
                                <X size={14} />
                            </button>
                            <h4 className="font-bold text-gray-800 text-sm mb-1">We're Online!</h4>
                            <p className="text-gray-500 text-xs leading-relaxed">
                                Ask us anything about OceanLK!
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
                        className="bg-white rounded-2xl shadow-2xl w-[380px] h-[500px] flex flex-col overflow-hidden border border-gray-100 mb-4"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between shadow-md z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                                    <Bot size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base leading-tight">{config?.agentName || 'Ocean Assistant'}</h3>
                                    <div className="flex items-center gap-1.5 opacity-90">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-xs font-medium">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <ChevronDown size={20} />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Footer / Input */}
                        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100">
                            <div className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-gray-700 placeholder-gray-400"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className={`p-3 rounded-xl transition-all shadow-md ${!inputValue.trim() || isTyping
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                                        }`}
                                >
                                    <Send size={18} className={inputValue.trim() && !isTyping ? 'ml-0.5' : ''} />
                                </button>
                            </div>
                            <div className="text-center mt-2 pb-1">
                                <p className="text-[10px] text-gray-400 font-medium">Powered by Gemini AI</p>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isOpen ? 'bg-gray-800 text-white rotate-90' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
            </motion.button>
        </div>
    );
};

export default ChatWidget;
