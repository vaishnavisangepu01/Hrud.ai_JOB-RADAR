
import React, { useState } from 'react';
import { JobListing } from '../types';
import { generateOutreach } from '../services/geminiService';

interface JobCardProps {
  job: JobListing;
  onUpdateStatus: (id: string, status: JobListing['status']) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onUpdateStatus }) => {
  const [pitch, setPitch] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePitch = async () => {
    setIsGenerating(true);
    const result = await generateOutreach(job);
    setPitch(result);
    setIsGenerating(false);
  };

  const getSourceStyle = (source: string) => {
    const s = source.toLowerCase();
    if (s.includes('linkedin')) return 'bg-[#0077b5] text-white';
    if (s.includes('naukri')) return 'bg-[#4a90e2] text-white';
    if (s.includes('indeed')) return 'bg-[#2164f3] text-white';
    if (s.includes('foundit') || s.includes('monster')) return 'bg-[#6e2bef] text-white';
    if (s.includes('glassdoor')) return 'bg-[#0caa41] text-white';
    return 'bg-sky-900 text-white';
  };

  return (
    <div className="job-card-sky rounded-2xl overflow-hidden transition-all group flex flex-col h-full bg-white shadow-sm hover:shadow-xl border border-sky-50">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-sm border border-sky-100 bg-sky-950 text-white`}>
              {job.company[0]}
            </div>
            <div>
              <h3 className="font-bold text-sky-900 leading-tight group-hover:text-sky-600 transition-colors text-sm truncate max-w-[150px]">{job.title}</h3>
              <p className="text-xs font-medium text-sky-600/80 truncate max-w-[150px]">{job.company}</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <span className={`text-[8px] font-black px-1.5 py-1 rounded uppercase tracking-tighter ${getSourceStyle(job.source)} shadow-sm`}>
              {job.source}
            </span>
            <span className="text-[7px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 uppercase tracking-widest flex items-center">
              <i className="fa-solid fa-location-dot mr-1"></i> Verified Location
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-4">
           <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded flex items-center border border-emerald-100">
            <i className="fa-solid fa-clock mr-1.5 animate-pulse text-emerald-500"></i>
            {job.postedHoursAgo === 0 ? 'Just Now' : `${job.postedHoursAgo}h ago`}
          </span>
          <span className="text-[9px] text-slate-400 font-medium">Synced 24h</span>
        </div>

        <div className="mb-4">
          <p className="text-[10px] text-slate-500 font-semibold mb-1 uppercase tracking-wider">Location Found:</p>
          <p className="text-[11px] text-sky-900 font-bold bg-sky-50 p-2 rounded-lg border border-sky-100">{job.location}</p>
        </div>

        <p className="text-[11px] text-slate-600 line-clamp-2 mb-4 italic leading-relaxed">"{job.descriptionSnippet}"</p>

        <div className="flex flex-wrap gap-1 mb-4">
          {job.skills.slice(0, 3).map((skill, i) => (
            <span key={i} className="px-2 py-0.5 bg-sky-50 text-sky-700 rounded text-[9px] border border-sky-100 font-semibold">
              {skill}
            </span>
          ))}
        </div>

        {pitch && (
          <div className="mb-4 p-3 bg-sky-50 rounded-xl border border-sky-200 animate-in fade-in slide-in-from-bottom-2">
            <p className="text-[10px] text-sky-800 font-medium leading-relaxed italic">
              <i className="fa-solid fa-wand-magic-sparkles mr-2 text-sky-500"></i>
              {pitch}
            </p>
          </div>
        )}
      </div>

      <div className="bg-sky-50/50 p-4 flex gap-2 border-t border-sky-100 mt-auto">
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center py-2.5 sky-gradient text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:shadow-sky-200 shadow-md transition-all flex items-center justify-center active:scale-95"
        >
          View & Apply <i className="fa-solid fa-up-right-from-square ml-2 text-[9px]"></i>
        </a>
        <button
          onClick={handleGeneratePitch}
          className="p-2.5 bg-white border border-sky-200 text-sky-500 rounded-xl hover:bg-sky-50 transition-colors shadow-sm active:scale-95"
          title="Smart Outreach"
        >
          {isGenerating ? <i className="fa-solid fa-spinner fa-spin text-xs"></i> : <i className="fa-solid fa-comment-dots text-xs"></i>}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
