import React from 'react';
import { useTheme } from '@/lib/useTheme';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-9 h-9 rounded-full p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-gray-700 hover:text-gray-900 transition-colors" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-300 hover:text-yellow-400 transition-colors" />
      )}
      <span className="sr-only">
        {theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
      </span>
    </Button>
  );
};

export default ThemeToggle;