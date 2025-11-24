export interface UserProfile {
  currentRole: string;
  experienceYears: string;
  currentCompanyType: string; // e.g., "Service Based", "Product", "Consulting"
  targetSalary: string;
  targetRole: string;
  location: string;
  skills: string;
  concerns: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
  groundingSources?: GroundingChunk[];
}

export enum ViewMode {
  CHAT = 'CHAT',
  PROFILE = 'PROFILE',
  TRENDS = 'TRENDS',
  DISCOVERY = 'DISCOVERY',
}

export interface JobOpportunity {
  company: string;
  role: string;
  salary_range: string;
  experience_required: string;
  location: string;
  match_reason: string;
  skills_needed: string[];
}

export interface TrendMetrics {
  role: string;
  currency: string;
  salaryByExperience: {
    level: string; // e.g. "Entry", "Mid-Level"
    min: number;
    max: number;
    avg: number;
  }[];
  demandTrend: {
    month: string;
    index: number; // 0-100
  }[];
}