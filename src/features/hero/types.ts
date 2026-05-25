export interface HeroContent {
  greeting: string;
  name: string;
  tagline: string;
  cta: {
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
}
