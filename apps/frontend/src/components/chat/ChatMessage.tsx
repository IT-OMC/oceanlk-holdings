import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, RotateCw, ThumbsUp, ThumbsDown, Check, User, Bot } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: Date;
}

interface ChatMessageProps {
    message: Message;
    onRegenerate?: () => void;
    isLastAgentMessage?: boolean;
}

/**
 * Individual chat message component with actions and markdown rendering
 */
const ChatMessage = ({ message, onRegenerate, isLastAgentMessage }: ChatMessageProps) => {
    const [copied, setCopied] = useState(false);
    const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
    const isUser = message.sender === 'user';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleFeedback = (type: 'up' | 'down') => {
        setFeedback(feedback === type ? null : type);
        // TODO: Send feedback to backend
        console.log(`Feedback: ${type} for message:`, message.id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
        >
            <div className={`flex gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser
                        ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                        : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800'
                        }`}
                >
                    {isUser ? (
                        <User size={16} className="text-white" />
                    ) : (
                        <Bot size={16} className="text-gray-600 dark:text-gray-300" />
                    )}
                </div>

                {/* Message Content */}
                <div className="flex flex-col gap-1">
                    <div className="relative">
                        {/* Message Bubble with Tail */}
                        <div
                            className={`px-3 py-2 text-sm leading-relaxed shadow-sm relative ${isUser
                                ? 'bg-[#DCF8C6] dark:bg-[#005C4B] text-gray-800 dark:text-gray-100 rounded-lg rounded-tr-none'
                                : 'bg-white dark:bg-[#202C33] text-gray-800 dark:text-gray-100 rounded-lg rounded-tl-none'
                                }`}
                            style={{
                                borderRadius: isUser ? '7.5px 7.5px 7.5px 7.5px' : '7.5px 7.5px 7.5px 7.5px',
                                borderTopRightRadius: isUser ? '0px' : '7.5px',
                                borderTopLeftRadius: isUser ? '7.5px' : '0px',
                            }}
                        >
                            {/* Message Tail */}
                            <div
                                className={`absolute top-0 ${isUser ? '-right-[8px]' : '-left-[8px]'
                                    }`}
                            >
                                <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d={isUser
                                            ? "M 0 0 L 8 0 L 0 13 Z"
                                            : "M 8 0 L 0 0 L 8 13 Z"
                                        }
                                        className={
                                            isUser
                                                ? 'fill-[#DCF8C6] dark:fill-[#005C4B]'
                                                : 'fill-white dark:fill-[#202C33]'
                                        }
                                    />
                                </svg>
                            </div>

                            {/* Message Text */}
                            {isUser ? (
                                <p className="whitespace-pre-wrap pr-12">{message.text}</p>
                            ) : (
                                <div className="markdown-content pr-12">
                                    <MarkdownRenderer content={message.text} />
                                </div>
                            )}

                            {/* Timestamp and Status (Inside Bubble) */}
                            <div className={`absolute bottom-1 right-2 flex items-center gap-1`}>
                                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                    {new Date(message.timestamp).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                    })}
                                </span>
                                {isUser && (
                                    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.071 0.929L6 6l-1.071-1.071-1.414 1.414L6 8.828l6.485-6.485-1.414-1.414z" fill="#53BDEB" className="dark:fill-[#53BDEB]" />
                                        <path d="M15.071 0.929L10 6l-1.071-1.071-1.414 1.414L10 8.828l6.485-6.485-1.414-1.414z" fill="#53BDEB" className="dark:fill-[#53BDEB]" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons (only for agent messages) */}
                    {!isUser && (
                        <div className="flex items-center gap-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Copy Button */}
                            <button
                                onClick={handleCopy}
                                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="Copy message"
                            >
                                {copied ? (
                                    <Check size={12} className="text-green-600" />
                                ) : (
                                    <Copy size={12} className="text-gray-400 dark:text-gray-500" />
                                )}
                            </button>

                            {/* Regenerate Button (only for last agent message) */}
                            {isLastAgentMessage && onRegenerate && (
                                <button
                                    onClick={onRegenerate}
                                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Regenerate response"
                                >
                                    <RotateCw size={12} className="text-gray-400 dark:text-gray-500" />
                                </button>
                            )}

                            {/* Feedback Buttons */}
                            <div className="flex items-center gap-0.5 ml-1">
                                <button
                                    onClick={() => handleFeedback('up')}
                                    className={`p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${feedback === 'up' ? 'bg-green-100 dark:bg-green-900/30' : ''
                                        }`}
                                    title="Good response"
                                >
                                    <ThumbsUp
                                        size={12}
                                        className={
                                            feedback === 'up'
                                                ? 'text-green-600 fill-green-600'
                                                : 'text-gray-400 dark:text-gray-500'
                                        }
                                    />
                                </button>
                                <button
                                    onClick={() => handleFeedback('down')}
                                    className={`p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${feedback === 'down' ? 'bg-red-100 dark:bg-red-900/30' : ''
                                        }`}
                                    title="Bad response"
                                >
                                    <ThumbsDown
                                        size={12}
                                        className={
                                            feedback === 'down'
                                                ? 'text-red-600 fill-red-600'
                                                : 'text-gray-400 dark:text-gray-500'
                                        }
                                    />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ChatMessage;
