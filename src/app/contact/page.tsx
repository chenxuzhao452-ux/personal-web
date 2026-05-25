import type { Metadata } from 'next';
import type { SocialLink } from '@/features/contact';
import { ContactContent } from './ContactContent';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with me.',
};

const socialLinks: SocialLink[] = [
  { name: 'GitHub', url: 'https://github.com/chenxuzhao452-ux', label: 'View my GitHub profile' },
];

export default function ContactPage() {
  return <ContactContent socialLinks={socialLinks} />;
}
