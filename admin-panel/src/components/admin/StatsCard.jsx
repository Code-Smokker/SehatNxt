import { LucideIcon } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color, subText }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-xl ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                {subText && <p className="text-xs text-slate-400 mt-1">{subText}</p>}
            </div>
        </div>
    );
};

export default StatsCard;
