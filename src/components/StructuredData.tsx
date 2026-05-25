export function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Chancy Zhao',
    alternateName: 'Zhao Chenxu',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    description:
      'Undergraduate in Electronic Information at Sichuan University, focused on agent technologies, multimodal perception, and embodied intelligence.',
    knowsAbout: [
      'Agent AI',
      'Multimodal Fusion',
      'Embodied Intelligence',
      'Medical Imaging',
      'Deep Learning',
      'Reinforcement Learning',
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Sichuan University',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
