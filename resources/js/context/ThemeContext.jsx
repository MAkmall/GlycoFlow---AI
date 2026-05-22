import React, { createContext, useContext, useState, useEffect } from 'react';

// Konfigurasi Tema Medis Master
export const MEDICAL_THEMES = {
  clinicalBlue: {
    name: 'Hospital Trust (Standard)',
    primary: '#0284c7',
    primaryGlow: 'rgba(2, 132, 199, 0.2)',
    accent: '#0ea5e9',
    isDark: false,
    bgGradient: 'linear-gradient(-45deg, #f0f9ff, #e0f2fe, #e0f2fe, #f8fafc)',
    // Ditambahkan mapping untuk Tailwind utilities agar halaman non-inline style ikut tersinkron
    tw: {
      text: 'text-sky-500',
      bg: 'bg-sky-600',
      bgHover: 'hover:bg-sky-500',
      bgOpacity: 'bg-sky-500/10',
      border: 'border-sky-500/30',
      borderFocus: 'focus:border-sky-500',
      ring: 'focus:ring-sky-500/30',
      chatUser: 'bg-sky-600/80 border-sky-500/50',
      accent: 'accent-sky-500 hover:accent-sky-400',
      aurora: '#0c4a6e'
    }
  },
  cyberEndocrine: {
    name: 'Bio-Informatics (Holographic)',
    primary: '#d946ef',
    primaryGlow: 'rgba(217, 70, 239, 0.2)',
    accent: '#06b6d4',
    isDark: true,
    bgGradient: 'linear-gradient(-45deg, #1e1b4b, #2e1065, #0f172a, #020617)',
    tw: {
      text: 'text-fuchsia-400',
      bg: 'bg-fuchsia-600',
      bgHover: 'hover:bg-fuchsia-500',
      bgOpacity: 'bg-fuchsia-500/10',
      border: 'border-fuchsia-500/30',
      borderFocus: 'focus:border-fuchsia-500',
      ring: 'focus:ring-fuchsia-500/30',
      chatUser: 'bg-fuchsia-600/80 border-fuchsia-500/50',
      accent: 'accent-fuchsia-500 hover:accent-fuchsia-400',
      aurora: '#2e1065'
    }
  },
  circadianZen: {
    name: 'Circadian Homeostasis (Relaxed)',
    primary: '#15803d',
    primaryGlow: 'rgba(21, 128, 61, 0.15)',
    accent: '#f59e0b',
    isDark: false,
    bgGradient: 'linear-gradient(-45deg, #f4f7f4, #e8efe9, #f0f4f1, #ffffff)',
    tw: {
      text: 'text-green-600',
      bg: 'bg-green-700',
      bgHover: 'hover:bg-green-600',
      bgOpacity: 'bg-green-700/10',
      border: 'border-green-700/30',
      borderFocus: 'focus:border-green-700',
      ring: 'focus:ring-green-700/30',
      chatUser: 'bg-green-700/80 border-green-600/50',
      accent: 'accent-green-700 hover:accent-green-600',
      aurora: '#14532d'
    }
  },
  bloodPlasma: {
    name: 'Metabolic Flow (Premium Dark)',
    primary: '#e11d48',
    primaryGlow: 'rgba(225, 29, 72, 0.2)',
    accent: '#fbbf24',
    isDark: true,
    bgGradient: 'linear-gradient(-45deg, #4c0519, #1c1917, #0c0a09, #020617)',
    tw: {
      text: 'text-rose-400',
      bg: 'bg-rose-600',
      bgHover: 'hover:bg-rose-500',
      bgOpacity: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      borderFocus: 'focus:border-rose-500',
      ring: 'focus:ring-rose-500/30',
      chatUser: 'bg-rose-600/80 border-rose-500/50',
      accent: 'accent-rose-500 hover:accent-rose-400',
      aurora: '#4c0519'
    }
  }
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Ambil data tema persisten dari localStorage agar saat refresh halaman warna tidak reset
  const [activeThemeKey, setActiveThemeKey] = useState(() => {
    return localStorage.getItem('glyco_theme_key') || 'clinicalBlue';
  });

  const currentTheme = MEDICAL_THEMES[activeThemeKey] || MEDICAL_THEMES.clinicalBlue;

  useEffect(() => {
    localStorage.setItem('glyco_theme_key', activeThemeKey);
  }, [activeThemeKey]);

  return (
    <ThemeContext.Provider value={{ activeThemeKey, setActiveThemeKey, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useGlobalTheme() {
  return useContext(ThemeContext);
}