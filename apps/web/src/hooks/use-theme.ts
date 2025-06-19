'use client';

import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useCallback } from 'react';

export function useTheme() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextTheme();

  // Get the current theme, accounting for system preference
  const getCurrentTheme = useCallback(() => {
    return theme === 'system' ? systemTheme : theme;
  }, [theme, systemTheme]);

  // Sync theme changes with the settings
  const updateTheme = useCallback((newTheme: string) => {
    setTheme(newTheme);
  }, [setTheme]);

  // Apply theme class to document element
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    const currentTheme = getCurrentTheme();
    if (currentTheme) {
      root.classList.add(currentTheme);
    }
  }, [getCurrentTheme]);

  return {
    theme,
    systemTheme,
    resolvedTheme: resolvedTheme as 'light' | 'dark' | undefined,
    setTheme: updateTheme,
    isDark: resolvedTheme === 'dark',
  };
}
