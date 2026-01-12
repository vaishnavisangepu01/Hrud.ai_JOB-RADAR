
import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: string;
  isLarge?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, isLarge }) => {
  return (
    <div className={`purple-section ${isLarge ? 'p-10 md:p-14' : 'p-6'} rounded-[2.5rem] transition-all hover:shadow-2xl hover:border-purple-300 group`}>
      <div className="flex justify-between items-center mb-6">
        <div className={`${isLarge ? 'w-20 h-20' : 'w-12 h-12'} rounded-[1.5rem] bg-white/70 flex items-center justify-center text-purple-600 shadow-xl border border-purple-200 group-hover:scale-110 transition-transform`}>
          <i className={`fa-solid ${icon} ${isLarge ? 'text-3xl' : 'text-xl'}`}></i>
        </div>
        {isLarge && (
           <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200 uppercase tracking-[0.2em] animate-pulse">
             Direct Accuracy Check
           </span>
        )}
      </div>
      <h3 className={`${isLarge ? 'text-[16px]' : 'text-xs'} text-purple-800 font-black uppercase tracking-[0.3em]`}>{label}</h3>
      <p className={`${isLarge ? 'text-6xl md:text-8xl' : 'text-3xl'} font-black text-purple-950 mt-4 tracking-tighter leading-none`}>
        {value}
      </p>
    </div>
  );
};

export default StatsCard;
