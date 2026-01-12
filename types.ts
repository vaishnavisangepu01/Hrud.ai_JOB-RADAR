
export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  source: string;
  url: string;
  postedDate: string;
  postedHoursAgo: number;
  relevanceScore: number;
  descriptionSnippet: string;
  jobType: 'Full-time' | 'Contract' | 'Remote' | 'Part-time';
  skills: string[];
  status?: 'New' | 'Priority' | 'Applied' | 'Rejected';
}

export interface SearchCriteria {
  role: string;
  skills: string;
  experienceLevel: string;
  location: string;
  jobType: string;
  postedWithin: string;
}

export interface DashboardStats {
  totalJobsScraped: number;
}
