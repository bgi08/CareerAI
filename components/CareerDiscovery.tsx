import React, { useState, useEffect } from 'react';
import { JobOpportunity, GroundingChunk } from '../types';
import { findCareerOpportunities } from '../services/geminiService';
import { Search, MapPin, Briefcase, DollarSign, Clock, ExternalLink, Loader2, Sparkles, Globe, Filter, Building2, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface CareerDiscoveryProps {
  defaultRole?: string;
  defaultSalary?: string;
  defaultLocation?: string;
}

const loadingMessages = [
  "Scanning global job markets...",
  "Searching Glassdoor, LinkedIn & regional boards...",
  "Analyzing salary brackets...",
  "Filtering for high-growth companies...",
  "Curating best matches for you..."
];

export const CareerDiscovery: React.FC<CareerDiscoveryProps> = ({ defaultRole, defaultSalary, defaultLocation }) => {
  const [criteria, setCriteria] = useState({
    role: defaultRole || '',
    salary: defaultSalary || '',
    location: defaultLocation || '',
    experience: ''
  });
  
  const [results, setResults] = useState<JobOpportunity[]>([]);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rawText, setRawText] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1000); // Faster checks
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSearch = async () => {
    if (!criteria.role || !criteria.salary) return;
    
    setIsLoading(true);
    setHasSearched(true);
    setResults([]);
    setRawText('');
    setLoadingMsgIndex(0);
    
    try {
      const data = await findCareerOpportunities(criteria);
      setResults(data.opportunities);
      setGroundingChunks(data.groundingChunks || []);
      if (data.opportunities.length === 0) {
        setRawText(data.rawText);
      }
    } catch (error) {
      console.error("Failed to fetch opportunities", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Filters Header - Sticky & Clean */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 shadow-sm z-10 sticky top-0">
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-5 text-brand-700">
            <div className="p-2 bg-brand-50 rounded-lg">
                <Globe size={20} className="text-brand-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Global Opportunity Scanner</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-1 group">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Target Package</label>
                <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                <input 
                    type="text" 
                    value={criteria.salary}
                    onChange={(e) => setCriteria({...criteria, salary: e.target.value})}
                    placeholder="e.g. $120k, 25 LPA"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm font-medium text-slate-900 placeholder-slate-400 shadow-sm transition-all"
                />
                </div>
            </div>

            <div className="lg:col-span-1 group">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Target Role</label>
                <div className="relative">
                <Briefcase size={16} className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                <input 
                    type="text" 
                    value={criteria.role}
                    onChange={(e) => setCriteria({...criteria, role: e.target.value})}
                    placeholder="e.g. Product Manager"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm font-medium text-slate-900 placeholder-slate-400 shadow-sm transition-all"
                />
                </div>
            </div>

            <div className="lg:col-span-1 group">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Experience</label>
                <div className="relative">
                <Clock size={16} className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                <input 
                    type="text" 
                    value={criteria.experience}
                    onChange={(e) => setCriteria({...criteria, experience: e.target.value})}
                    placeholder="e.g. 3-5 Years"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm font-medium text-slate-900 placeholder-slate-400 shadow-sm transition-all"
                />
                </div>
            </div>

            <div className="lg:col-span-1 group">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Region</label>
                <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                <input 
                    type="text" 
                    value={criteria.location}
                    onChange={(e) => setCriteria({...criteria, location: e.target.value})}
                    placeholder="e.g. Berlin, Remote"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm font-medium text-slate-900 placeholder-slate-400 shadow-sm transition-all"
                />
                </div>
            </div>

            <div className="lg:col-span-1 flex items-end">
                <button 
                onClick={handleSearch}
                disabled={isLoading || !criteria.salary || !criteria.role}
                className="w-full py-3 px-6 bg-brand-600 text-white rounded-xl font-semibold shadow-md shadow-brand-500/20 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/30 transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                {isLoading ? "Searching..." : "Find Matches"}
                </button>
            </div>
            </div>
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto h-full">
            {!hasSearched && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-70">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-slate-100">
                    <Filter size={40} className="text-brand-200" />
                </div>
                <h3 className="text-xl font-semibold text-slate-600 mb-2">Ready to explore?</h3>
                <p className="text-base font-medium max-w-md text-center">Enter your target salary and role above to scan the global market for matching opportunities.</p>
            </div>
            )}

            {hasSearched && isLoading && (
            <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-brand-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <div className="w-20 h-20 border-4 border-slate-100 border-t-brand-600 rounded-full animate-spin relative z-10 bg-white shadow-sm"></div>
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <Sparkles size={28} className="text-brand-600" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 animate-pulse transition-all duration-300 text-center px-4">
                    {loadingMessages[loadingMsgIndex]}
                </h3>
                <p className="text-slate-400 mt-3 font-medium">Powered by live search</p>
            </div>
            )}

            {hasSearched && !isLoading && results.length > 0 && (
            <div className="space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Top Matches Found</h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Based on live data for <strong>{criteria.salary}</strong> in <strong>{criteria.location || "Global Market"}</strong>.
                        </p>
                    </div>
                    <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-bold border border-brand-100">
                        {results.length} Opportunities
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((job, idx) => (
                    <div key={idx} className="group bg-white rounded-2xl p-6 shadow-card hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 border border-slate-200/60 hover:border-brand-200 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-brand-600 group-hover:bg-brand-50 transition-colors">
                                    <Building2 size={20} />
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-brand-700 transition-colors">{job.company}</h3>
                            </div>
                        </div>
                        
                        <div className="mb-4 relative z-10">
                            <h4 className="text-brand-600 font-bold text-base mb-1 flex items-center gap-2">
                                {job.role}
                            </h4>
                            <span className="inline-block bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-md font-bold border border-green-100 mt-1">
                                {job.salary_range}
                            </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-slate-500 mb-5 relative z-10">
                            <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded"><MapPin size={12} /> {job.location}</span>
                            <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded"><Clock size={12} /> {job.experience_required}</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-5 relative z-10">
                            <p className="text-sm text-slate-600 italic leading-relaxed">
                                "{job.match_reason}"
                            </p>
                        </div>

                        <div className="mt-auto relative z-10">
                            <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                                <CheckCircle2 size={10} /> Required Skills
                            </p>
                            <div className="flex flex-wrap gap-2">
                            {job.skills_needed?.map((skill, sIdx) => (
                                <span key={sIdx} className="text-xs font-medium bg-white text-slate-600 px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
                                {skill}
                                </span>
                            ))}
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>
            )}

            {/* Fallback if JSON parsing fails but we have text */}
            {hasSearched && !isLoading && results.length === 0 && rawText && (
            <div className="bg-white p-8 rounded-2xl shadow-card border border-slate-200 prose prose-slate max-w-none">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Search size={24} className="text-brand-600" />
                    Market Search Results
                </h3>
                <ReactMarkdown>{rawText}</ReactMarkdown>
            </div>
            )}

            {/* Sources Footer */}
            {hasSearched && !isLoading && groundingChunks.length > 0 && (
                <div className="mt-12 pt-6 border-t border-slate-200">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <ExternalLink size={12} /> Verified Data Sources
                    </h4>
                    <div className="flex flex-wrap gap-3">
                    {groundingChunks.map((source, idx) => (
                        source.web?.uri ? (
                        <a
                            key={idx}
                            href={source.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-white hover:bg-brand-50 text-slate-600 hover:text-brand-700 px-3 py-2 rounded-lg border border-slate-200 hover:border-brand-200 transition-all shadow-sm flex items-center gap-2 max-w-[300px] truncate"
                        >   
                            <img 
                                src={`https://www.google.com/s2/favicons?domain=${new URL(source.web.uri).hostname}`} 
                                alt="" 
                                className="w-3 h-3 opacity-60"
                            />
                            <span className="truncate">{source.web.title || new URL(source.web.uri).hostname}</span>
                        </a>
                        ) : null
                    ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};