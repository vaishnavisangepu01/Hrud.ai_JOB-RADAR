
import React, { useState, useCallback } from 'react';
import { Search, Download, Clipboard, MapPin, Briefcase, Filter, ChevronRight, Loader2, Database, ExternalLink, TrendingUp, Sparkles, Layers, Calendar, Zap } from 'lucide-react';
import { JobPosting, SearchCriteria, GroundingSource } from './types';
import { searchJobs } from './services/geminiService';
import JobTable from './components/JobTable';

const POPULAR_TITLES = [
  'Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'DevOps'
];

const INDIA_HUBS = [
  'Bengaluru', 'Mumbai', 'Hyderabad', 'Pune', 'Noida'
];

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [criteria, setCriteria] = useState<SearchCriteria>({
    role: '',
    skills: '',
    location: '',
    jobType: 'All',
    experienceLevel: 'All',
    dateRange: 'Anytime',
  });

  const handleSearch = async (e?: React.FormEvent, overrideCriteria?: SearchCriteria) => {
    if (e) e.preventDefault();
    const searchParams = overrideCriteria || criteria;
    if (!searchParams.role) return;

    setLoading(true);
    setError(null);
    try {
      const result = await searchJobs(searchParams);
      setJobs(result.jobs);
      setSources(result.sources);
      if (result.jobs.length === 0) {
        setError("Zero matches found. Try broadening your criteria or skills.");
      }
    } catch (err) {
      setError("Radar malfunction. Please check your connection and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setAndSearch = (updates: Partial<SearchCriteria>) => {
    const newCriteria = { ...criteria, ...updates };
    setCriteria(newCriteria);
    if (newCriteria.role) {
      handleSearch(undefined, newCriteria);
    }
  };

  const exportToCSV = useCallback(() => {
    if (jobs.length === 0) return;
    const headers = ["Title", "Company", "Location", "Salary", "Score", "Skills Match", "Source"];
    const rows = jobs.map(j => [
      `"${j.title}"`, `"${j.company}"`, `"${j.location}"`, `"${j.salary}"`, j.relevanceScore, `"${j.matchedSkills.join(', ')}"`, `"${j.sourceUrl}"`
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `JobRadar_${criteria.role.replace(/\s+/g, '_')}.csv`;
    link.click();
  }, [jobs, criteria.role]);

  const copyToClipboard = useCallback(() => {
    if (jobs.length === 0) return;
    const text = jobs.map(j => `${j.title}\t${j.company}\t${j.relevanceScore}%\t${j.sourceUrl}`).join("\n");
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard for Google Sheets!");
  }, [jobs]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-2 rounded-xl shadow-lg">
              <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Job <span className="text-blue-600">Radar</span></h1>
          </div>
          <div className="flex items-center gap-3">
            {jobs.length > 0 && (
              <>
                <button onClick={copyToClipboard} className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1">
                  <Clipboard className="w-3.5 h-3.5" /> Copy Sheets
                </button>
                <button onClick={exportToCSV} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition-all">
                  <Download className="w-3.5 h-3.5" /> Export Data
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar - INPUT CRITERIA */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-24">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" /> Input Criteria
              </h2>
              
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Targeted Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="e.g. Senior Architect"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                      value={criteria.role}
                      onChange={e => setCriteria({...criteria, role: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Required Skills</label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="React, TypeScript, AWS..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                      value={criteria.skills}
                      onChange={e => setCriteria({...criteria, skills: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="City or Remote"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                      value={criteria.location}
                      onChange={e => setCriteria({...criteria, location: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Exp.</label>
                    <select 
                      className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-xs font-bold"
                      value={criteria.experienceLevel}
                      onChange={e => setCriteria({...criteria, experienceLevel: e.target.value as any})}
                    >
                      <option>All</option>
                      <option>Entry</option>
                      <option>Mid</option>
                      <option>Senior</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Posting Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                      <select 
                        className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-xs font-bold appearance-none"
                        value={criteria.dateRange}
                        onChange={e => setCriteria({...criteria, dateRange: e.target.value as any})}
                      >
                        <option>Anytime</option>
                        <option>Past 24h</option>
                        <option>Past Week</option>
                        <option>Past Month</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all mt-4"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Run Scraping <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              {/* Suggestions */}
              <div className="mt-8">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                   <TrendingUp className="w-3 h-3" /> Quick Roles
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_TITLES.map(title => (
                    <button
                      key={title}
                      onClick={() => setAndSearch({ role: title })}
                      className="px-3 py-1.5 text-[10px] font-black bg-slate-100 text-slate-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors uppercase"
                    >
                      {title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Area - PROCESSING & OUTPUT */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center animate-pulse mb-6">
                  <Database className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">AI Pipeline Processing</h3>
                <p className="text-slate-500 max-w-sm text-sm">Searching LinkedIn, Indeed & Career Pages... Calculating Relevance Scores... Sorting by Skill Match...</p>
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Radar Results</h2>
                    <p className="text-sm text-slate-400 font-medium">Found {jobs.length} roles matching your AI relevance threshold.</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-xl uppercase tracking-widest border border-indigo-100 shadow-sm">
                    <Zap className="w-3.5 h-3.5 fill-indigo-600" /> Continuous Update Loop
                  </div>
                </div>

                <JobTable jobs={jobs} />

                {/* Grounding Sources */}
                {sources.length > 0 && (
                  <div className="mt-12 bg-white p-8 rounded-3xl border border-slate-200">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" /> Scraping Map (Source Hubs)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sources.map((source, i) => (
                        <a 
                          key={i} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-4 bg-slate-50 border border-transparent rounded-2xl hover:border-blue-200 hover:bg-white hover:shadow-lg transition-all group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">{new URL(source.uri).hostname.replace('www.', '')}</span>
                            <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" />
                          </div>
                          <p className="text-sm font-bold text-slate-900 truncate">{source.title}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-100 p-12 rounded-[2.5rem] text-center">
                <h3 className="text-red-900 font-black text-xl mb-3 uppercase tracking-tight">Signal Interrupted</h3>
                <p className="text-red-700 text-sm font-medium">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest">Retry Scan</button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-48 text-center bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                <div className="relative mb-8">
                   <div className="absolute -inset-8 bg-blue-100/50 rounded-full blur-3xl" />
                   <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center relative border border-slate-100 shadow-inner">
                     <Search className="w-12 h-12 text-slate-300" />
                   </div>
                </div>
                <h3 className="text-3xl font-black text-slate-300 uppercase italic tracking-tighter">Enter Signal</h3>
                <p className="text-slate-400 max-w-xs mt-3 text-sm font-medium">Define your criteria in the Radar sidebar to start the AI scraping pipeline.</p>
              </div>
            )}
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">Job Radar System // Architecture V2.0 // Gemini-3-Flash</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
