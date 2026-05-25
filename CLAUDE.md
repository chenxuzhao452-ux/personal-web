# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Start dev server (Turbopack, port 3000)
npm run build         # Production build
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
npm test              # Vitest unit/integration tests
npm run test:watch    # Vitest in watch mode
npm run test:coverage # Vitest with coverage (80% threshold)
npm run test:e2e      # Playwright E2E tests
```

Single test: `npx vitest run -t "test name pattern"`

## Architecture

### Route Pages (`src/app/`)
Server components export metadata; client components are extracted into sibling files (e.g., `AboutContent.tsx`) to keep metadata working.

```
src/app/
  layout.tsx          # Root layout: providers, noise overlay, anti-flash theme script
  page.tsx            # Client component — uses useTranslation for hero content
  about/              # AboutContent.tsx (client) + page.tsx (server, metadata)
  projects/           # ProjectsGrid + SkillCloud
  contact/            # ContactContent.tsx (client) + page.tsx (server)
  blog/               # [slug]/page.tsx for dynamic routes
```

### Feature Modules (`src/features/`)
Each feature is self-contained: components, hooks, types, data. Features: `hero`, `about`, `projects`, `contact`, `blog`.

```
features/hero/
  components/         # HeroSection, ParticleCanvas, ParticleField, ParticleLayer, HeroHeading, HeroCta
  hooks/              # useParticleConfig (returns {bg, fg, useBloom} per device/motion)
  types.ts            # HeroContent interface
```

### Shared Components (`src/components/`)
- `layout/` — Header, HeaderWrapper, Footer, Navigation, PageShell
- `three/` — CanvasWrapper (dynamic R3F import), LoadingFallback, BackgroundParticles
- `ThemeProvider.tsx` — 3-state theme (system/dark/light), `data-theme` attribute
- `LanguageProvider.tsx` — i18n context (en/zh/ja), `useTranslation()` hook
- `MotionProvider.tsx` — LazyMotion + domAnimation for code-split framer-motion
- `SettingsMenu.tsx` — Gear icon → panel with Theme + Language rows (click to expand)

### Styling
- **CSS custom properties** in `src/styles/tokens.css` + `tokens-light.css` (`[data-theme="light"]`). Spacing: 4px base unit. Typography: `clamp()` fluid scale.
- **styled-jsx** for component-scoped styles (most components)
- **CSS Modules** for layout components (Footer, PageShell) where styles don't need dynamic tokens
- `src/styles/globals.css` imports: tokens → tokens-light → reset → typography → animations → utilities
- Noise overlay via SVG `feTurbulence` in `utilities.css`

### 3D / Three.js Patterns
- **Dynamic import**: R3F Canvas and all drei/postprocessing components are dynamically imported via `useEffect` + `useState` — never imported at module level. `CanvasWrapper.tsx` handles the loading fallback.
- **Shaders**: Inline GLSL strings in component files (no `.glsl` files). `ParticleLayer.tsx` is the parameterized base; `ParticleField.tsx` renders two layers (bg + fg).
- **OrbitControls**: Dynamically loaded from `@react-three/drei`. Stored in state as `Record<string, React.ComponentType<any>> | null`.
- **Bloom**: `@react-three/postprocessing` dynamically loaded. Desktop only (`useBloom` from `useParticleConfig`).
- **Reduced motion**: `useReducedMotion()` hook gates all particle rendering (returns 0-count configs).
- **SSR safety**: All R3F is client-side only. Canvas renders a pulsing `<LoadingFallback />` until mounted.

### Key Patterns
- `@/` alias maps to `src/`
- `cn()` from `src/utils/cn.ts` wraps `clsx` for class merging
- Translation keys in `src/i18n/translations.ts`; `useTranslation()` returns `{ t, lang, setLang }`
- `<html>` has `suppressHydrationWarning` for Dark Reader extension compatibility
- framer-motion uses `m` component (SSR-safe), not `motion`

## R3F Dynamic Import Recipe
```tsx
const [comp, setComp] = useState<Record<string, React.ComponentType<any>> | null>(null);
useEffect(() => {
  import('@react-three/drei').then((mod) => setComp({ Foo: mod.Foo }));
}, []);
const Foo = comp?.Foo;
// Render: {Foo && <Foo ... />}
```
