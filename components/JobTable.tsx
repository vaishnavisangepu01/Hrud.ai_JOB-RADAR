
import React from 'react';
import { JobPosting } from '../types';
import { Target, CheckCircle2, ExternalLink } from 'lucide-react';

interface JobTableProps {
  jobs: JobPosting[];
}

const JobTable: React.FC<JobTableProps> = ({ jobs }) => {
  if (jobs.length === 0) return null;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50 border-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-100';
    return 'text-slate-500 bg-slate-50 border-slate-100';
  };

  return (
    <div className="overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200 mt-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role & Company</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">AI Relevance</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Skills Found</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Location/Salary</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</span>
                    <span className="text-xs text-slate-500 mt-0.5">{job.company}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold text-xs ${getScoreColor(job.relevanceScore)}`}>
                    <Target className="w-3.5 h-3.5" />
                    {job.relevanceScore}%
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {job.matchedSkills.length > 0 ? (
                      job.matchedSkills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" /> {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-[10px]">No skills detected</span>
                    )}
                    {job.matchedSkills.length > 3 && <span className="text-[10px] text-slate-400 font-medium">+{job.matchedSkills.length - 3} more</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-700 font-medium">{job.location}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{job.salary}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <a 
                    href={job.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-all shadow-sm"
                  >
                    View <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobTable;
