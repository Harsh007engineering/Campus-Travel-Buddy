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
            className={`relative p-2 rounded-xl border transition-all duration-300 flex items-center justify-center ${
                isDark
                    ? 'bg-[#1a1635] text-amber-300 border-purple-800/40 hover:bg-[#251f47] hover:border-amber-400/40 shadow-sm'
                    : 'bg-white text-indigo-600 border-slate-200 hover:bg-slate-50 hover:border-indigo-300 shadow-sm'
            } ${className}`}
        >
            <div className="relative w-5 h-5 flex items-center justify-center">
                {isDark ? (
                    <Sun size={18} className="transition-transform duration-300 rotate-0 hover:rotate-45" />
                ) : (
                    <Moon size={18} className="transition-transform duration-300 -rotate-12 hover:rotate-0 text-slate-700" />
                )}
            </div>
        </button>
    );
};

export default ThemeToggle;
