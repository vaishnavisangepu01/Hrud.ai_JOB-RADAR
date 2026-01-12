
import React, { useState, useRef } from 'react';
import { JobListing, SearchCriteria, DashboardStats } from './types';
import { fetchLiveJobs } from './services/geminiService';
import StatsCard from './components/StatsCard';
import SearchFilters from './components/SearchFilters';
import JobCard from './components/JobCard';

const App: React.FC = () => {
  const [criteria, setCriteria] = useState<SearchCriteria>({
    role: 'Frontend Developer',
    skills: 'React, Tailwind, TypeScript',
    experienceLevel: '1 to 3 years of experience',
    location: 'Bangalore, India',
    jobType: 'Full-time',
    postedWithin: 'Last 24 Hours',
  });

  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string>('https://api.dicebear.com/7.x/avataaars/svg?seed=marketing');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats: DashboardStats = {
    totalJobsScraped: jobs.length,
  };

  const handleCriteriaChange = (key: keyof SearchCriteria, value: any) => {
    setCriteria(prev => ({ ...prev, [key]: value }));
  };

  const updateJobStatus = (id: string, status: JobListing['status']) => {
    setJobs(prev => prev.map(job => job.id === id ? { ...job, status } : job));
  };

  const performScrape = async () => {
    setIsLoading(true);
    setError(null);
    setJobs([]); 
    try {
      const results = await fetchLiveJobs(criteria);
      if (results.length === 0) {
        setError("No recent jobs found for these criteria. Try broadening your search terms.");
      }
      setJobs(results);
    } catch (err) {
      console.error("Scrape failed", err);
      setError("AI Engine encountered an error while searching. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCSV = () => {
    if (jobs.length === 0) return;
    const headers = ['Title', 'Company', 'Source', 'Location', 'URL', 'Posted (Hours Ago)'];
    const rows = jobs.map(j => [
      `"${j.title.replace(/"/g, '""')}"`,
      `"${j.company.replace(/"/g, '""')}"`,
      `"${j.source.replace(/"/g, '""')}"`,
      `"${j.location.replace(/"/g, '""')}"`,
      `"${j.url.replace(/"/g, '""')}"`,
      `"${j.postedHoursAgo}h ago"`
    ]);
    const csvString = headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `verified_global_jobs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-['Inter'] selection:bg-purple-200">
      <header className="bg-white border-b border-purple-100 sticky top-0 z-50 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sky-gradient rounded-xl flex items-center justify-center shadow-lg shadow-sky-100">
              <i className="fa-solid fa-radar text-white text-lg"></i>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tighter uppercase text-sky-900 leading-none">Job Radar</h1>
              <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">Verified Global Accuracy Sync</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 rounded-full ring-2 ring-purple-100 overflow-hidden cursor-pointer hover:ring-purple-300 transition-all bg-purple-50"
            >
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 py-10 flex-grow">
        <div className="mb-10">
          <StatsCard 
            label="Verified Global Results (Current Scan)" 
            value={stats.totalJobsScraped} 
            icon="fa-globe" 
            isLarge={true}
          />
        </div>

        <div className="purple-section rounded-3xl p-10 mb-12 shadow-md border border-purple-100">
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-1">
              <h3 className="font-black text-purple-950 flex items-center text-[22px] uppercase tracking-tight">
                <span className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mr-5 shadow-xl">
                  <i className="fa-solid fa-location-dot text-lg"></i>
                </span>
                Precision AI Search Engine
              </h3>
              <p className="text-[10px] text-purple-500 font-bold uppercase tracking-widest ml-16">
                Analyzing Live Web Results • Cross-Platform Grounding • Smart Relevance Scoring
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 hidden md:flex items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-3"></div>
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Gemini Grounding Active</span>
            </div>
          </div>

          <SearchFilters
            criteria={criteria}
            onCriteriaChange={handleCriteriaChange}
            onSearch={performScrape}
            isLoading={isLoading}
          />
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <h4 className="font-black text-sky-900 uppercase tracking-widest text-xs flex items-center">
                <i className="fa-solid fa-check-double mr-3 text-emerald-500"></i>
                Verified AI Findings
              </h4>
              {jobs.length > 0 && (
                <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md flex items-center animate-in fade-in zoom-in">
                  <i className="fa-solid fa-shield-check mr-2"></i>
                  {jobs.length} REAL-TIME MATCHES
                </span>
              )}
            </div>
            <button 
              onClick={downloadCSV}
              disabled={jobs.length === 0}
              className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-white sky-gradient px-6 py-3.5 rounded-2xl hover:shadow-xl transition-all disabled:opacity-30 active:scale-95 shadow-md"
            >
              <i className="fa-solid fa-download"></i>
              <span>Export Precision Report</span>
            </button>
          </div>

          {isLoading ? (
            <div className="sky-section rounded-[2.5rem] border-2 border-dashed border-sky-200 p-32 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm">
              <div className="relative">
                 <div className="w-24 h-24 border-[6px] border-sky-100 border-t-sky-500 rounded-full animate-spin shadow-xl"></div>
                 <i className="fa-solid fa-earth-americas absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-500 text-xl animate-bounce"></i>
              </div>
              <p className="font-black text-sky-900 uppercase tracking-tighter mt-12 text-3xl text-center">Grounding Search Results...</p>
              <p className="text-xs text-sky-600 mt-5 font-bold uppercase tracking-[0.25em] text-center px-10 leading-relaxed max-w-2xl">
                CRAWLING GOOGLE SEARCH FOR {criteria.role.toUpperCase()} IN {criteria.location.toUpperCase()}. 
                ANALYZING SOURCE URLS AND CALCULATING RELEVANCE SCORES.
              </p>
            </div>
          ) : error ? (
            <div className="sky-section rounded-[2.5rem] border-2 border-dashed border-red-200 p-28 text-center bg-red-50/30">
              <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-red-400 mx-auto mb-8 shadow-sm border border-red-50">
                <i className="fa-solid fa-triangle-exclamation text-3xl"></i>
              </div>
              <p className="font-black text-red-900 text-xl uppercase tracking-tight">Signal Interrupted</p>
              <p className="text-sm text-red-600 mt-3 font-medium text-center max-w-md mx-auto leading-relaxed">
                {error}
              </p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map(job => (
                <JobCard key={job.id} job={job} onUpdateStatus={updateJobStatus} />
              ))}
            </div>
          ) : (
            <div className="sky-section rounded-[2.5rem] border-2 border-dashed border-sky-100 p-28 text-center bg-white/30">
              <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-sky-300 mx-auto mb-8 shadow-sm border border-sky-50">
                <i className="fa-solid fa-magnifying-glass-location text-3xl"></i>
              </div>
              <p className="font-black text-sky-900 text-xl uppercase tracking-tight">AI Radar Standby</p>
              <p className="text-sm text-sky-600 mt-3 font-medium italic text-center max-w-md mx-auto leading-relaxed">
                Enter your desired role and location, then click Execute to activate the Gemini Search Radar.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-purple-50 py-16 mt-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[11px] font-black text-purple-300 uppercase tracking-[0.6em]">
            Job Radar AI Global Precision • Gemini Grounding Sync • No External Server Required
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
