
import { GoogleGenAI, Type } from "@google/genai";
import { JobPosting, SearchCriteria, GroundingSource } from "../types";

export const searchJobs = async (criteria: SearchCriteria): Promise<{ jobs: JobPosting[], sources: GroundingSource[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Act as an expert Job Recruiter and Scraper. 
  SEARCH: Find active job postings for "${criteria.role}" in "${criteria.location}". 
  FILTERS: Focus on ${criteria.jobType} roles, ${criteria.experienceLevel} level, posted within ${criteria.dateRange}.
  PRIORITIZE SOURCES: LinkedIn, Indeed, Glassdoor, and Company Career Pages.
  
  EVALUATION CRITERIA:
  - Users skills: "${criteria.skills}"
  - Calculate an AI Relevance Score (0-100) based on how well the role and description match the title AND the required skills.
  
  PROCESS:
  1. Scrape data from multiple portals.
  2. Filter by Role, Skills, and Experience.
  3. Deduplicate identical listings.
  4. Calculate AI Relevance Score.
  5. Sort by Relevance Score descending.

  OUTPUT: Return exactly 10-15 results in a JSON array.
  Each object MUST have: title, company, location, salary, description, datePosted, sourceUrl, relevanceScore (number), matchedSkills (array of strings found in the posting).
  
  Return ONLY the JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const sources: GroundingSource[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || "Source",
        uri: chunk.web?.uri || ""
      })).filter((s: GroundingSource) => s.uri) || [];

    const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s);
    let jobs: JobPosting[] = [];
    
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        jobs = parsed.map((j: any, index: number) => ({
          id: `job-${Date.now()}-${index}`,
          title: j.title || "Unknown Title",
          company: j.company || "Unknown Company",
          location: j.location || "Unknown Location",
          salary: j.salary || "N/A",
          description: j.description || "",
          datePosted: j.datePosted || "Recently",
          sourceUrl: j.sourceUrl || "",
          relevanceScore: j.relevanceScore || 0,
          matchedSkills: Array.isArray(j.matchedSkills) ? j.matchedSkills : []
        }));
      } catch (e) {
        console.error("Failed to parse jobs JSON", e);
      }
    }
    
    return { jobs, sources };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};
