import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            className={`relative p-2 rounded-xl border transition-all duration-200 flex items-center justify-center ${
                isDark
                    ? 'bg-zinc-900 text-amber-300 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 shadow-sm'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 shadow-sm'
            } ${className}`}
        >
            <div className="w-4 h-4 flex items-center justify-center">
                {isDark ? (
                    <Sun size={16} className="text-amber-400" />
                ) : (
                    <Moon size={16} className="text-zinc-700" />
                )}
            </div>
        </button>
    );
};

export default ThemeToggle;
