import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="
        group relative
        flex h-10 w-10
        items-center justify-center
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-gray-50
        text-gray-600
        shadow-sm
        transition-all duration-300

        hover:-translate-y-0.5
        hover:border-blue-300
        hover:bg-blue-50
        hover:text-blue-600

        dark:border-white/10
        dark:bg-white/[0.05]
        dark:text-gray-300
        dark:hover:border-cyan-400/30
        dark:hover:bg-cyan-400/10
        dark:hover:text-cyan-300
      "
    >
      {/* Glow */}
      <span
        className="
          pointer-events-none
          absolute inset-0
          rounded-xl
          bg-blue-400/10
          opacity-0
          blur-md
          transition
          group-hover:opacity-100
          dark:bg-cyan-400/10
        "
      />

      <span className="relative z-10">
        {isDark ? (
          /* Sun */
          <svg
            className="
              h-5 w-5
              transition-transform duration-500
              group-hover:rotate-45
            "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="12" cy="12" r="4" />

            <path
              strokeLinecap="round"
              d="
                M12 2v2
                M12 20v2
                M4.93 4.93l1.42 1.42
                M17.65 17.65l1.42 1.42
                M2 12h2
                M20 12h2
                M4.93 19.07l1.42-1.42
                M17.65 6.35l1.42-1.42
              "
            />
          </svg>
        ) : (
          /* Moon */
          <svg
            className="
              h-5 w-5
              transition-transform duration-500
              group-hover:-rotate-12
            "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12.79A9 9 0 1 1 11.21 3
                 7 7 0 0 0 21 12.79Z"
            />
          </svg>
        )}
      </span>
    </button>
  );
}