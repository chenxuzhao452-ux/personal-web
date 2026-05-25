'use client';

import { createContext, useContext } from 'react';

type Theme = 'dark';
type ResolvedTheme = 'dark';

interface ThemeContextValue {
  theme: Theme;
  resolved: ResolvedTheme;
  setTheme: (_next: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const noop = () => {};

const value: ThemeContextValue = {
  theme: 'dark',
  resolved: 'dark',
  setTheme: noop,
  toggleTheme: noop,
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
