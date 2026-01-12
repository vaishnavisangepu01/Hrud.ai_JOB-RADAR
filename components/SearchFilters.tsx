
import React from 'react';
import { SearchCriteria } from '../types';

interface SearchFiltersProps {
  criteria: SearchCriteria;
  onCriteriaChange: (key: keyof SearchCriteria, value: any) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ criteria, onCriteriaChange, onSearch, isLoading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <div className="space-y-2">
        <label className="text-[14px] font-black text-purple-800 uppercase tracking-widest ml-1 block">Target Role</label>
        <div className="relative">
          <i className="fa-solid fa-briefcase absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 text-xs"></i>
          <input
            type="text"
            placeholder="e.g. AI Engineer"
            className="w-full pl-10 pr-4 py-4 rounded-2xl transition-all text-sm font-bold shadow-sm"
            value={criteria.role}
            onChange={(e) => onCriteriaChange('role', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[14px] font-black text-purple-800 uppercase tracking-widest ml-1 block">Primary Skills</label>
        <div className="relative">
          <i className="fa-solid fa-code absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 text-xs"></i>
          <input
            type="text"
            placeholder="Python, React..."
            className="w-full pl-10 pr-4 py-4 rounded-2xl transition-all text-sm font-bold shadow-sm"
            value={criteria.skills}
            onChange={(e) => onCriteriaChange('skills', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[14px] font-black text-purple-800 uppercase tracking-widest ml-1 block">Target role experience</label>
        <div className="relative">
          <i className="fa-solid fa-layer-group absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 text-xs"></i>
          <select
            className="w-full pl-10 pr-10 py-4 rounded-2xl transition-all text-sm font-bold appearance-none shadow-sm cursor-pointer"
            value={criteria.experienceLevel}
            onChange={(e) => onCriteriaChange('experienceLevel', e.target.value)}
          >
            <option value="0 to 1 year of experience">0 to 1 year of experience</option>
            <option value="1 to 3 years of experience">1 to 3 years of experience</option>
            <option value="3 to 5 years of experience">3 to 5 years of experience</option>
            <option value="5+ years of experience">5+ years of experience</option>
          </select>
          <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 text-[10px] pointer-events-none"></i>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[14px] font-black text-purple-800 uppercase tracking-widest ml-1 block">Work Location</label>
        <div className="relative">
          <i className="fa-solid fa-location-arrow absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 text-xs"></i>
          <input
            type="text"
            placeholder="Remote or City"
            className="w-full pl-10 pr-4 py-4 rounded-2xl transition-all text-sm font-bold shadow-sm"
            value={criteria.location}
            onChange={(e) => onCriteriaChange('location', e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-end">
        <button
          onClick={onSearch}
          disabled={isLoading}
          className={`w-full py-4.5 h-[60px] rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white transition-all transform active:scale-95 shadow-lg shadow-sky-200 flex items-center justify-center space-x-3 ${isLoading ? 'bg-sky-200 shadow-none cursor-not-allowed text-sky-500' : 'sky-gradient hover:opacity-95'}`}
        >
          {isLoading ? (
            <>
              <i className="fa-solid fa-circle-notch fa-spin"></i>
              <span>Bot Executing...</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-play"></i>
              <span>Execute</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;
