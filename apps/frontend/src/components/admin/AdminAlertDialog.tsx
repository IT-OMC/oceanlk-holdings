'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export interface AdminAlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'warning';
}

const AdminAlertDialog: React.FC<AdminAlertDialogProps> = ({
    isOpen,
    onClose,
    title,
    message,
    type = 'success'
}) => {
    const getConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: <CheckCircle className="text-emerald-500 w-10 h-10" />,
                    bg: 'bg-emerald-500/10',
                    border: 'border-emerald-500/20'
                };
            case 'error':
                return {
                    icon: <XCircle className="text-rose-500 w-10 h-10" />,
                    bg: 'bg-rose-500/10',
                    border: 'border-rose-500/20'
                };
            case 'warning':
                return {
                    icon: <AlertTriangle className="text-amber-500 w-10 h-10" />,
                    bg: 'bg-amber-500/10',
                    border: 'border-amber-500/20'
                };
        }
    };

    const config = getConfig();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-[#151C2C] border border-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col items-center p-8 text-center"
                    >
                        <div className={`w-20 h-20 rounded-full ${config.bg} border ${config.border} flex items-center justify-center mb-5`}>
                            {config.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                        <p className="text-gray-400 text-sm mb-8 leading-relaxed">{message}</p>
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors border border-gray-700 shadow-lg"
                        >
                            Okay
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AdminAlertDialog;
