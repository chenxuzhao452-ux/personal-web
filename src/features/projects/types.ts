export interface Project {
  id: string;
  nameKey: string;
  descKey: string;
  technologies: string[];
  category: 'web' | 'mobile' | 'design' | 'other';
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}
