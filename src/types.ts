export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'fullstack' | 'ai';
  url: string;
  tags: string[];
  date: string;
  highlights: string[];
  image?: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  score: string;
}

export interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  highlights: string[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

export interface AnalyticsStats {
  resumeDownloads: number;
  contactSubmissions: number;
  pageViews: number;
}
