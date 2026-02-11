
import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  colorClass?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label, colorClass = "bg-violet-500" }) => {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs font-medium text-slate-400 mb-1.5 px-1">
          <span>{label}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
        <div 
          className={`h-full ${colorClass} transition-all duration-1000 ease-out relative`}
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
