import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, Loader2, ExternalLink, FileSearch, UserCircle } from 'lucide-react';
import { fetchMarketTrends } from '../services/geminiService';
import { TrendMetrics, GroundingChunk } from '../types';

interface MarketTrendsProps {
    role: string;
    location: string;
}

export const MarketTrends: React.FC<MarketTrendsProps> = ({ role, location }) => {
  const [data, setData] = useState<TrendMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // STRICT: Do not fetch if role is missing. No defaults allowed.
    if (!role) {
        setData(null);
        return;
    }

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Strict usage of user inputs
            const result = await fetchMarketTrends(role, location);
            
            if (result.trends) {
                setData(result.trends);
            } else {
                setError("No market data found for this specific role/location combo. Please try refining your profile.");
            }

            if (result.groundingChunks) {
                setGroundingChunks(result.groundingChunks);
            }
        } catch (err) {
            setError("Failed to retrieve live market data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [role, location]);

  // 1. Empty State - Waiting for user input
  if (!role) {
      return (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
              <div className="bg-white p-6 rounded-full shadow-soft mb-6 border border-slate-100">
                  <UserCircle size={48} className="text-brand-300" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Waiting for Profile Data</h2>
              <p className="text-slate-500 max-w-md mx-auto mb-6">
                  To generate real-time market intelligence, please enter your <strong>Target Role</strong> and <strong>Location</strong> in the Profile tab.
              </p>
              <div className="text-sm bg-brand-50 text-brand-700 px-4 py-2 rounded-lg border border-brand-100 inline-block font-medium">
                  Go to "My Profile" to start
              </div>
          </div>
      );
  }

  // 2. Loading State
  if (loading) {
      return (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-slate-50/50">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <TrendingUp size={24} className="text-brand-600" />
                </div>
              </div>
              <p className="text-lg font-semibold text-slate-800">Analyzing Real-Time Market Data</p>
              <p className="text-sm opacity-75 mt-2">Connecting to live salary databases for <span className="font-bold text-brand-600">{role}</span>...</p>
          </div>
      );
  }

  // 3. Error State
  if (error || !data) {
      return (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center">
              <FileSearch size={48} className="text-slate-300 mb-4" />
              <p className="text-lg font-medium text-slate-700">{error || "Could not load market data."}</p>
              <p className="text-sm mt-2 max-w-sm mx-auto">Gemini could not find sufficient data for this specific query. Try broadening your role name or checking your internet connection.</p>
          </div>
      );
  }

  // 4. Data Display
  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
                Market Intelligence: <span className="text-brand-600">{data.role}</span>
            </h1>
            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                <TrendingUp size={14} /> Analysis based on live data for {location || "Global Market"}
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
             <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600 border border-slate-200 font-bold">
                {data.currency || "Global"}
             </span>
             <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full border border-green-200 font-bold shadow-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> LIVE
             </span>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-200">
            <div className="flex items-center gap-2 mb-6 text-brand-700 border-b border-slate-50 pb-4">
            <div className="p-2 bg-brand-50 rounded-lg">
                <DollarSign size={20} />
            </div>
            <div>
                <h2 className="text-lg font-bold text-slate-800">Salary Benchmark</h2>
                <p className="text-xs text-slate-400 font-normal">Real-time aggregation from Glassdoor & LinkedIn</p>
            </div>
            </div>
            
            <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                data={data.salaryByExperience}
                margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
                barSize={32}
                >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                    dataKey="level" 
                    tick={{fontSize: 12, fill: '#64748b'}} 
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                />
                <YAxis 
                    tickFormatter={(value) => `${value/1000}k`} 
                    label={{ value: data.currency, angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }}
                    tick={{fontSize: 11, fill: '#64748b'}}
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Bar dataKey="min" name="Min" fill="#cbd5e1" radius={[4, 4, 4, 4]} />
                <Bar dataKey="avg" name="Average" fill="#3b82f6" radius={[4, 4, 4, 4]} />
                <Bar dataKey="max" name="Max" fill="#1e3a8a" radius={[4, 4, 4, 4]} />
                </BarChart>
            </ResponsiveContainer>
            </div>
        </div>

        {/* Demand Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-200">
            <div className="flex items-center gap-2 mb-6 text-brand-700 border-b border-slate-50 pb-4">
                <div className="p-2 bg-brand-50 rounded-lg">
                    <TrendingUp size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Hiring Demand</h2>
                    <p className="text-xs text-slate-400 font-normal">6-month trend analysis (Index 0-100)</p>
                </div>
            </div>
            
            <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                data={data.demandTrend}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                    dataKey="month" 
                    tick={{fontSize: 12, fill: '#64748b'}} 
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                />
                <YAxis 
                    domain={[0, 100]} 
                    hide 
                />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line 
                    type="monotone" 
                    dataKey="index" 
                    name="Demand Index" 
                    stroke="#2563eb" 
                    strokeWidth={4} 
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#2563eb' }} 
                />
                </LineChart>
            </ResponsiveContainer>
            </div>
        </div>
      </div>

       {groundingChunks.length > 0 && (
            <div className="pt-6 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <ExternalLink size={12} /> Verified Sources
                </h4>
                <div className="flex flex-wrap gap-2">
                {groundingChunks.map((source, idx) => (
                    source.web?.uri ? (
                    <a
                        key={idx}
                        href={source.web.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-white hover:bg-slate-50 text-slate-500 hover:text-brand-600 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-sm truncate max-w-[200px] flex items-center gap-1.5"
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
  );
};