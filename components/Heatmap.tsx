
import React from 'react';

interface HeatmapProps {
  activity: Record<string, number>;
  days?: number;
}

const Heatmap: React.FC<HeatmapProps> = ({ activity, days = 28 }) => {
  const dates = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {dates.map(date => {
        const count = activity[date] || 0;
        let colorClass = "bg-slate-900 border-slate-800";
        if (count > 0 && count <= 2) colorClass = "bg-violet-900/40 border-violet-800/40";
        if (count > 2 && count <= 5) colorClass = "bg-violet-700/60 border-violet-600/60 shadow-[0_0_5px_rgba(139,92,246,0.2)]";
        if (count > 5) colorClass = "bg-violet-500 border-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.4)]";

        return (
          <div 
            key={date}
            title={`${date}: ${count} interactions`}
            className={`w-4 h-4 rounded-sm border transition-all duration-500 hover:scale-125 ${colorClass}`}
          ></div>
        );
      })}
    </div>
  );
};

export default Heatmap;
