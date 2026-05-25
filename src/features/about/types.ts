export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  tags?: string[];
}

export interface AboutContent {
  bio: string[];
  timeline: TimelineEntry[];
}
