import React from 'react';
import { UserProfile } from '../types';
import { Save, UserCircle, Globe, ChevronRight } from 'lucide-react';

interface ProfilePanelProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  onSave: () => void;
}

export const ProfilePanel: React.FC<ProfilePanelProps> = ({ profile, setProfile, onSave }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <div className="h-full overflow-y-auto p-8 bg-white shadow-card rounded-2xl border border-slate-200 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
        <div className="bg-brand-50 p-3 rounded-full">
            <UserCircle size={32} className="text-brand-600" />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-slate-900">Career Profile</h2>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-1.5">
                <Globe size={14} /> Global AI Guidance • Privacy Focused
            </p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="group">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Current Role Title</label>
          <input
            type="text"
            name="currentRole"
            value={profile.currentRole}
            onChange={handleChange}
            placeholder="e.g., Senior Developer, Consultant"
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none text-slate-900 placeholder-slate-400 transition-all shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Years of Experience</label>
            <input
              type="text"
              name="experienceYears"
              value={profile.experienceYears}
              onChange={handleChange}
              placeholder="e.g., 2, 5.5, 10+"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none text-slate-900 placeholder-slate-400 transition-all shadow-sm"
            />
          </div>
          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Current Company Type</label>
            <div className="relative">
                <select
                    name="currentCompanyType"
                    value={profile.currentCompanyType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none text-slate-900 appearance-none shadow-sm transition-all"
                >
                    <option value="">Select Type...</option>
                    <option value="Service Based">Service Based / Agency</option>
                    <option value="Product Based">Product / Tech Company</option>
                    <option value="Consulting Firm">Consulting Firm</option>
                    <option value="Startup">Startup / Scale-up</option>
                    <option value="Enterprise">Large Enterprise</option>
                </select>
                <ChevronRight className="absolute right-4 top-3.5 text-slate-400 rotate-90 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="group">
                <label className="block text-sm font-bold text-brand-600 mb-2">Target Salary</label>
                <input
                    type="text"
                    name="targetSalary"
                    value={profile.targetSalary}
                    onChange={handleChange}
                    placeholder="e.g., $120k, 25 LPA"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none text-slate-900 placeholder-slate-400 transition-all shadow-sm"
                />
            </div>

            <div className="group">
                <label className="block text-sm font-bold text-brand-600 mb-2">Target Role</label>
                <input
                    type="text"
                    name="targetRole"
                    value={profile.targetRole}
                    onChange={handleChange}
                    placeholder="e.g., Product Manager"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none text-slate-900 placeholder-slate-400 transition-all shadow-sm"
                />
            </div>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Preferred Location</label>
          <input
            type="text"
            name="location"
            value={profile.location}
            onChange={handleChange}
            placeholder="e.g., New York, London, Bangalore, Remote"
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none text-slate-900 placeholder-slate-400 transition-all shadow-sm"
          />
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Key Skills</label>
          <textarea
            name="skills"
            value={profile.skills}
            onChange={handleChange}
            placeholder="e.g., Supply Chain, SQL, Python, Project Management"
            rows={2}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none text-slate-900 placeholder-slate-400 transition-all shadow-sm resize-none"
          />
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-slate-700 mb-2">What is confusing you?</label>
          <textarea
            name="concerns"
            value={profile.concerns}
            onChange={handleChange}
            placeholder="e.g., Should I move to the US? Is my salary fair for Berlin?"
            rows={2}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none text-slate-900 placeholder-slate-400 transition-all shadow-sm resize-none"
          />
        </div>

        <div className="pt-4 pb-2">
            <button
            onClick={onSave}
            className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white py-4 rounded-xl hover:bg-brand-700 transition-all font-semibold shadow-lg shadow-brand-500/25 transform active:scale-[0.99] text-lg"
            >
            <Save size={20} />
            Save & Start Exploring
            </button>
        </div>
      </div>
    </div>
  );
};