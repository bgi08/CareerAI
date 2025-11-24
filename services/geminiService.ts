import { GoogleGenAI } from "@google/genai";
import { UserProfile, GroundingChunk, JobOpportunity, TrendMetrics } from "../types";

const apiKey = process.env.API_KEY;

const ai = new GoogleGenAI({ apiKey: apiKey });

export const generateCareerAdvice = async (
  prompt: string,
  profile: UserProfile,
  history: { role: string; parts: { text: string }[] }[]
): Promise<{ text: string; groundingChunks?: GroundingChunk[] }> => {
  
  const userContext = `
    User Profile Context:
    - Current Role: ${profile.currentRole}
    - Experience: ${profile.experienceYears} years
    - Current Company Type: ${profile.currentCompanyType}
    - Target Salary: ${profile.targetSalary}
    - Target Role: ${profile.targetRole || "Undecided"}
    - Location: ${profile.location}
    - Key Skills: ${profile.skills}
    - Primary Concerns: ${profile.concerns}
  `;

  const finalPrompt = `
    ${userContext}
    
    User Query: ${prompt}

    Task:
    You are a Global Career Counselor.
    1. USE YOUR THINKING PROCESS to deeply analyze the user's specific gap based on their PROFILE.
    2. SEARCH for real-time data for THEIR location: ${profile.location || "Global"}.
    3. Prioritize sources like LinkedIn, Glassdoor, AmbitionBox, Levels.fyi.
    
    Format the output with clear Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: finalPrompt }] }
      ],
      config: {
        thinkingConfig: {
          thinkingBudget: 32768, 
        },
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || "I couldn't generate a response at this time.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;

    return { text, groundingChunks };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

export const findCareerOpportunities = async (
  criteria: { salary: string; role: string; location: string; experience: string }
): Promise<{ opportunities: JobOpportunity[]; groundingChunks?: GroundingChunk[]; rawText: string }> => {
  
  // Strict check
  if (!criteria.role || !criteria.salary) {
      return { opportunities: [], rawText: "Please provide a role and salary." };
  }

  // Optimized prompt for Gemini 2.5 Flash
  const prompt = `
    Find 6 distinct companies actively hiring or paying ${criteria.salary} for "${criteria.role}" roles with ${criteria.experience} experience in ${criteria.location || "the world"}.
    
    Use Google Search to verify LIVE data from LinkedIn, Glassdoor, Levels.fyi.
    
    CRITICAL: Return ONLY a valid JSON array.
    [
      {
        "company": "Company Name",
        "role": "Exact Role",
        "salary_range": "Range in local currency",
        "experience_required": "Yrs",
        "location": "City",
        "match_reason": "One sentence fit",
        "skills_needed": ["Skill1", "Skill2"]
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || "[]";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;

    let cleanJson = text.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let opportunities: JobOpportunity[] = [];
    try {
      opportunities = JSON.parse(cleanJson);
    } catch (e) {
      console.warn("JSON Parse failed, returning raw text.", e);
    }

    return { opportunities, groundingChunks, rawText: text };

  } catch (error) {
    console.error("Error fetching opportunities:", error);
    throw error;
  }
};

export const fetchMarketTrends = async (role: string, location: string): Promise<{ trends: TrendMetrics | null; groundingChunks?: GroundingChunk[] }> => {
  
  // Fail fast if no input
  if (!role) return { trends: null };

  const prompt = `
    Get REAL-TIME salary/demand data for "${role}" in "${location || "Global"}".
    Use Glassdoor, LinkedIn, Payscale. Detect local currency.

    Return valid JSON (NO Markdown):
    {
      "role": "${role}",
      "currency": "CURRENCY_CODE",
      "salaryByExperience": [
        { "level": "0-2y", "min": 0, "max": 0, "avg": 0 },
        { "level": "2-5y", "min": 0, "max": 0, "avg": 0 },
        { "level": "5-8y", "min": 0, "max": 0, "avg": 0 },
        { "level": "8+y", "min": 0, "max": 0, "avg": 0 }
      ],
      "demandTrend": [
        { "month": "Month", "index": 0 }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "{}";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;

    let cleanJson = text.trim();
    if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let trends: TrendMetrics | null = null;
    try {
        trends = JSON.parse(cleanJson);
    } catch (e) {
        console.error("Failed to parse market trends JSON", e);
    }

    return { trends, groundingChunks };

  } catch (error) {
    console.error("Error fetching market trends:", error);
    return { trends: null };
  }
};