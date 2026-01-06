
export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  sourceUrl: string;
  datePosted: string;
  relevanceScore: number; // 0-100
  matchedSkills: string[];
}

export interface SearchCriteria {
  role: string;
  skills: string;
  location: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'All';
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'All';
  dateRange: 'Past 24h' | 'Past Week' | 'Past Month' | 'Anytime';
}

export interface GroundingSource {
  title: string;
  uri: string;
}
