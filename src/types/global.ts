export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface NavItem {
  label: string;
  href: string;
}
