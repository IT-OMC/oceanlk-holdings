import { motion } from 'framer-motion';

interface QuickAction {
    id: string;
    label: string;
    question: string;
}

interface QuickActionsProps {
    onSelect: (question: string) => void;
}

const quickActions: QuickAction[] = [
    {
        id: '1',
        label: '🏢 About OceanLK',
        question: 'Tell me about Ocean Ceylon Holdings and what you do',
    },
    {
        id: '2',
        label: '💼 Our Services',
        question: 'What services does OceanLK offer?',
    },
    {
        id: '3',
        label: '🌍 Global Reach',
        question: 'What is OceanLK\'s global presence and partnerships?',
    },
    {
        id: '4',
        label: '💚 Sustainability',
        question: 'Tell me about OceanLK\'s sustainability initiatives',
    },
    {
        id: '5',
        label: '📞 Contact Info',
        question: 'How can I contact OceanLK?',
    },
    {
        id: '6',
        label: '🎯 Career Opportunities',
        question: 'What career opportunities are available at OceanLK?',
    },
];

/**
 * Quick action suggestion chips for common questions
 */
const QuickActions = ({ onSelect }: QuickActionsProps) => {
    return (
        <div className="px-4 pb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
                Quick questions:
            </p>
            <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                    <motion.button
                        key={action.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onSelect(action.question)}
                        className="p-2.5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 
                                 border border-gray-200 dark:border-gray-700 rounded-xl text-left text-xs 
                                 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md
                                 transition-all duration-200 active:scale-95 group"
                    >
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium">
                            {action.label}
                        </span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
