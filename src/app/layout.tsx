import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { HeaderWrapper } from '@/components/layout';
import { Footer } from '@/components/layout';
import { MotionProvider } from '@/components/MotionProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/components/LanguageProvider';
import { StructuredData } from '@/components/StructuredData';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const SITE_NAME = 'Nebula Terminal';
const SITE_DESCRIPTION = 'A personal portfolio at the intersection of design and technology.';

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: '/favicon.svg',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute('data-theme','dark')`,
          }}
        />
      </head>
      <body>
        <StructuredData />
        <div className="noise-overlay" aria-hidden="true" />
        <ThemeProvider>
          <LanguageProvider>
            <MotionProvider>
              <HeaderWrapper />
              {children}
              <Footer currentYear={new Date().getFullYear()} />
            </MotionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
