import React from 'react';
import { Check, X, ArrowRight } from 'lucide-react';

interface ChangeVisualizerProps {
    entityType: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    changeData: string;
    originalData?: string;
}

const ChangeVisualizer: React.FC<ChangeVisualizerProps> = ({
    entityType,
    action,
    changeData,
    originalData
}) => {
    const parseJSON = (data: string | undefined) => {
        if (!data) return null;
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error('Error parsing JSON:', e);
            return null;
        }
    };

    const newData = parseJSON(changeData);
    const oldData = parseJSON(originalData);

    // Get all unique keys from both objects
    const allKeys = Array.from(new Set([
        ...Object.keys(oldData || {}),
        ...Object.keys(newData || {})
    ])).filter(key => key !== 'id' && key !== '_id' && key !== '__v');

    const formatValue = (value: any): string | React.ReactNode => {
        if (value === null || value === undefined) return <span className="text-gray-600 italic">None</span>;
        if (typeof value === 'boolean') return value ? <Check size={16} className="text-emerald-500" /> : <X size={16} className="text-rose-500" />;
        if (Array.isArray(value)) return `Array (${value.length} items)`;
        if (typeof value === 'object') return 'Complex Object';
        return String(value);
    };

    const isChanged = (key: string) => {
        if (action === 'CREATE' || action === 'DELETE') return false;
        const oldVal = JSON.stringify(oldData?.[key]);
        const newVal = JSON.stringify(newData?.[key]);
        return oldVal !== newVal;
    };

    return (
        <div className="bg-[#0B1120] rounded-lg border border-gray-800 overflow-hidden shadow-inner">
            <div className="px-6 py-3 bg-[#151C2C]/30 border-b border-gray-800 flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Field Comparison</span>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">{entityType}</span>
            </div>
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase bg-[#151C2C]/50 border-b border-gray-800">
                    <tr>
                        <th className="px-6 py-3 font-semibold">Field</th>
                        {action !== 'CREATE' && <th className="px-6 py-3 font-semibold">Current / Old</th>}
                        {action !== 'DELETE' && <th className="px-6 py-3 font-semibold">New / Proposed</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                    {allKeys.map(key => {
                        const changed = isChanged(key);

                        return (
                            <tr key={key} className={`group ${changed ? 'bg-blue-500/5' : 'hover:bg-gray-800/20'}`}>
                                <td className="px-6 py-4 font-medium text-gray-400 capitalize whitespace-nowrap">
                                    {key.replace(/([A-Z])/g, ' $1')}
                                </td>
                                {action !== 'CREATE' && (
                                    <td className={`px-6 py-4 font-mono text-xs ${changed ? 'text-red-400 opacity-80 line-through' : 'text-gray-500'}`}>
                                        {formatValue(oldData?.[key])}
                                    </td>
                                )}
                                {action !== 'DELETE' && (
                                    <td className={`px-6 py-4 font-mono text-xs ${changed ? 'text-emerald-400 bg-emerald-500/5' : 'text-gray-300'}`}>
                                        <div className="flex items-center gap-2">
                                            {changed && <ArrowRight size={12} className="text-emerald-500/50" />}
                                            {formatValue(newData?.[key])}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {allKeys.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                    <p>No accessible data fields detected in this change.</p>
                </div>
            )}
        </div>
    );
};

export default ChangeVisualizer;
