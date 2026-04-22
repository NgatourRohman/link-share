'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl glass-pill flex items-center justify-center opacity-40">
        <Sun size={20} className="text-[var(--muted)]" />
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        "w-10 h-10 rounded-xl glass-pill flex items-center justify-center transition-all duration-300",
        "text-[var(--muted)] hover:text-[var(--fg)] border-[var(--pill-border)] hover:border-[var(--accent)]/30",
        "shadow-lg hover:shadow-indigo-500/10",
        "relative overflow-hidden group"
      )}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5">
        <Sun 
          size={20} 
          className={cn(
            "absolute inset-0 transition-transform duration-500",
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          )} 
        />
        <Moon 
          size={20} 
          className={cn(
            "absolute inset-0 transition-transform duration-500",
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          )} 
        />
      </div>
    </button>
  );
}
