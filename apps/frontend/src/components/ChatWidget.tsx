import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ChevronDown, Bot, Trash2, ArrowDown } from 'lucide-react';
import { useWhatsApp } from '../hooks/useWhatsApp';
import ChatMessage from './chat/ChatMessage';
import QuickActions from './chat/QuickActions';
import WhatsAppBackground from './chat/WhatsAppBackground';

// Define message type
interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: Date;
}

const ChatWidget = () => {
    const { config, loading, error } = useWhatsApp();
    const [isOpen, setIsOpen] = useState(false);
    const [showBubble, setShowBubble] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = (smooth = true) => {
        messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    };

    // Check if user has scrolled up
    const handleScroll = () => {
        if (messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            setShowScrollButton(!isNearBottom && messages.length > 3);
        }
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

    // Auto-focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    if (error) {
        console.error('Chat Widget Error:', error);
        return null;
    }

    if (loading || !config?.active) return null;

    const handleSendMessage = async (messageText?: string) => {
        const textToSend = messageText || inputValue.trim();

        if (!textToSend) return;

        setInputValue('');

        // Add User Message
        const userMsg: Message = {
            id: Date.now().toString(),
            text: textToSend,
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
                body: JSON.stringify({ message: textToSend }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
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
                text: "I apologize, but I'm having trouble connecting to the server right now. Please try again later or contact support at info@oceanlk.com.",
                sender: 'agent',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleQuickAction = (question: string) => {
        setInputValue(question);
        setTimeout(() => {
            handleSendMessage(question);
        }, 100);
    };

    const handleClearChat = () => {
        setMessages([
            {
                id: 'welcome',
                text: config?.welcomeMessage || 'Hello! How can I help you today?',
                sender: 'agent',
                timestamp: new Date()
            }
        ]);
    };

    const handleRegenerateLastMessage = () => {
        // Find the last user message
        const userMessages = messages.filter(m => m.sender === 'user');
        if (userMessages.length > 0) {
            const lastUserMessage = userMessages[userMessages.length - 1];
            // Remove the last agent response
            setMessages(prev => {
                const lastUserIndex = prev.findIndex(m => m.id === lastUserMessage.id);
                return prev.slice(0, lastUserIndex + 1);
            });
            // Resend the last user message
            handleSendMessage(lastUserMessage.text);
        }
    };

    const agentMessages = messages.filter(m => m.sender === 'agent');
    const lastAgentMessageId = agentMessages.length > 0 ? agentMessages[agentMessages.length - 1].id : null;

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
                        className="absolute bottom-16 right-0 mb-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-2xl border border-gray-100 dark:border-gray-700 cursor-pointer min-w-[220px] backdrop-blur-sm z-10"
                    >
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowBubble(false);
                                }}
                                className="absolute -top-2 -right-2 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                            >
                                <X size={14} />
                            </button>
                            <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-1">We're Online!</h4>
                            <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                                Ask us anything about OceanLK Holdings!
                            </p>
                            <div className="absolute -bottom-6 right-6 w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45 border-r border-b border-gray-100 dark:border-gray-700" />
                        </div>
                    </motion.div>
                )}

                {/* Main Chat Window */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[400px] h-[600px] flex flex-col overflow-hidden border border-gray-100 dark:border-gray-700 mb-4 backdrop-blur-lg"
                    >
                        {/* Header */}
                        <div className="bg-[#075E54] dark:bg-[#1F2C34] p-4 text-white flex items-center justify-between shadow-lg z-10">
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
                            <div className="flex items-center gap-1">
                                {messages.length > 1 && (
                                    <button
                                        onClick={handleClearChat}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                        title="Clear chat"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <ChevronDown size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div
                            ref={messagesContainerRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto p-4 bg-[#E5DDD5] dark:bg-[#0B141A] space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 relative"
                        >
                            <WhatsAppBackground />
                            {messages.map((msg) => (
                                <ChatMessage
                                    key={msg.id}
                                    message={msg}
                                    onRegenerate={msg.sender === 'agent' && msg.id === lastAgentMessageId ? handleRegenerateLastMessage : undefined}
                                    isLastAgentMessage={msg.sender === 'agent' && msg.id === lastAgentMessageId}
                                />
                            ))}

                            {isTyping && (
                                <div className="flex justify-start relative z-10">
                                    <div className="bg-white dark:bg-[#202C33] p-4 rounded-lg rounded-tl-none shadow-sm flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}

                            {/* Show Quick Actions when chat is empty or just welcome message */}
                            {messages.length <= 1 && !isTyping && (
                                <div className="relative z-10">
                                    <QuickActions onSelect={handleQuickAction} />
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Scroll to Bottom Button */}
                        <AnimatePresence>
                            {showScrollButton && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    onClick={() => scrollToBottom()}
                                    className="absolute bottom-24 right-8 p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
                                >
                                    <ArrowDown size={18} className="text-gray-600 dark:text-gray-300" />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Footer / Input */}
                        <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
                            <div className="relative flex items-center gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message... (Enter to send)"
                                    disabled={isTyping}
                                    className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50"
                                />
                                <button
                                    aria-label="Send message"
                                    onClick={() => handleSendMessage()}
                                    disabled={!inputValue.trim() || isTyping}
                                    className={`p-3 rounded-xl transition-all shadow-md ${!inputValue.trim() || isTyping
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                        : 'bg-[#25D366] text-white hover:bg-[#20BD5A] active:scale-95'
                                        }`}
                                >
                                    <Send size={18} className={inputValue.trim() && !isTyping ? 'ml-0.5' : ''} />
                                </button>
                            </div>
                            <div className="text-center mt-2 pb-1">
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                                    Powered by Gemini AI • Press Escape to minimize
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Toggle Button */}
            <motion.button
                aria-label="Toggle chat"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isOpen
                    ? 'bg-gray-800 dark:bg-gray-700 text-white rotate-90'
                    : 'bg-[#25D366] text-white hover:shadow-xl hover:bg-[#20BD5A]'
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
            </motion.button>
        </div>
    );
};

export default ChatWidget;
