import type { Metadata } from 'next';
import { AboutContent } from './AboutContent';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about me and my journey.',
};

export default function AboutPage() {
  return <AboutContent />;
}