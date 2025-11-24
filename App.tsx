import React, { useState } from 'react';
import { ViewMode, UserProfile, Message } from './types';
import { ProfilePanel } from './components/ProfilePanel';
import { ChatArea } from './components/ChatArea';
import { MarketTrends } from './components/MarketTrends';
import { CareerDiscovery } from './components/CareerDiscovery';
import { generateCareerAdvice } from './services/geminiService';
import { LayoutDashboard, MessageSquareText, TrendingUp, User, GraduationCap, Briefcase } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const initialProfile: UserProfile = {
  currentRole: "",
  experienceYears: "",
  currentCompanyType: "",
  targetSalary: "",
  targetRole: "",
  location: "",
  skills: "",
  concerns: ""
};

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.PROFILE);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill helper for demo purposes
  const demoFill = () => {
    setProfile({
        currentRole: "Functional Consultant",
        experienceYears: "2",
        currentCompanyType: "Consulting Firm",
        targetSalary: "$120,000",
        targetRole: "Product Manager",
        location: "New York",
        skills: "Analysis, SQL, Communication, Agile",
        concerns: "I want to pivot from consulting to a product role in a tech company. Is my salary expectation realistic?"
    });
  };

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      role: 'user',
      text: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const { text: responseText, groundingChunks } = await generateCareerAdvice(text, profile, history);

      const botMessage: Message = {
        id: uuidv4(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
        groundingSources: groundingChunks
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'model',
        text: "I encountered an error while analyzing the data. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSave = () => {
    // After saving, go to Discovery to show them what's possible first, then they can chat
    setViewMode(ViewMode.DISCOVERY);
  };

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col items-center lg:items-start transition-all duration-300 shadow-xl z-20">
        <div className="p-6 flex items-center gap-3 w-full justify-center lg:justify-start border-b border-slate-800">
          <div className="bg-brand-500 p-2 rounded-lg">
            <GraduationCap size={24} className="text-white" />
          </div>
          <h1 className="hidden lg:block text-xl font-bold tracking-tight">Career AI</h1>
        </div>

        <nav className="flex-1 w-full py-6 space-y-2 px-3">
          <button
            onClick={() => setViewMode(ViewMode.PROFILE)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
              viewMode === ViewMode.PROFILE ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <User size={20} />
            <span className="hidden lg:block font-medium">My Profile</span>
          </button>

          <button
            onClick={() => setViewMode(ViewMode.DISCOVERY)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
              viewMode === ViewMode.DISCOVERY ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Briefcase size={20} />
            <span className="hidden lg:block font-medium">Global Discovery</span>
          </button>

          <button
            onClick={() => setViewMode(ViewMode.CHAT)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
              viewMode === ViewMode.CHAT ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MessageSquareText size={20} />
            <span className="hidden lg:block font-medium">AI Career Guide</span>
          </button>

          <button
            onClick={() => setViewMode(ViewMode.TRENDS)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
              viewMode === ViewMode.TRENDS ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <TrendingUp size={20} />
            <span className="hidden lg:block font-medium">Market Trends</span>
          </button>
        </nav>

        <div className="p-6 border-t border-slate-800 w-full">
            <div className="hidden lg:block bg-slate-800 rounded-xl p-4 text-xs text-slate-400">
                <p className="mb-2"><strong>Pro Tip:</strong> Use Discovery to find companies worldwide, then Chat to plan your strategy.</p>
                <button onClick={demoFill} className="text-brand-400 hover:underline">Auto-fill Demo Data</button>
            </div>
            <button onClick={demoFill} className="lg:hidden text-brand-400 text-xs text-center w-full">Demo</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                {viewMode === ViewMode.PROFILE && "Profile Setup"}
                {viewMode === ViewMode.DISCOVERY && "Global Opportunity Discovery"}
                {viewMode === ViewMode.CHAT && "Strategy Session"}
                {viewMode === ViewMode.TRENDS && "Market Intelligence"}
            </h2>
            <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 shadow-sm animate-pulse">
                    LIVE GLOBAL DATA
                </span>
            </div>
        </header>

        <div className="h-[calc(100vh-64px)] relative bg-slate-50">
            {viewMode === ViewMode.PROFILE && (
                <div className="h-full flex justify-center p-6">
                    <div className="w-full max-w-2xl">
                        <ProfilePanel 
                            profile={profile} 
                            setProfile={setProfile} 
                            onSave={handleProfileSave} 
                        />
                    </div>
                </div>
            )}

            {viewMode === ViewMode.DISCOVERY && (
                <div className="h-full max-w-7xl mx-auto">
                    <CareerDiscovery 
                        defaultRole={profile.targetRole || profile.currentRole}
                        defaultSalary={profile.targetSalary}
                        defaultLocation={profile.location}
                    />
                </div>
            )}

            {viewMode === ViewMode.CHAT && (
                <ChatArea 
                    messages={messages} 
                    isLoading={isLoading} 
                    onSendMessage={handleSendMessage} 
                />
            )}

            {viewMode === ViewMode.TRENDS && (
                <div className="h-full flex justify-center p-6">
                    <div className="w-full max-w-4xl h-full">
                        <MarketTrends role={profile.targetRole || profile.currentRole} location={profile.location} />
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}