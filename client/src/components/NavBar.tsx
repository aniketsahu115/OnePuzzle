import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import WalletConnector from './WalletConnector';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '@/lib/useTheme';

const NavBar: React.FC = () => {
  const [location] = useLocation();
  const { theme } = useTheme();

  const isActive = (path: string) => {
    return location === path 
      ? 'font-bold text-solana-purple border-b-2 border-solana-purple dark:text-purple-400 dark:border-purple-400' 
      : 'text-gray-700 hover:text-solana-purple transition-colors dark:text-gray-300 dark:hover:text-purple-400';
  };

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-900 shadow-md py-4 px-6 animate-fade-in z-50 transition-colors duration-300">
      <div className="container-solana flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0 animate-slide-right">
          <Link href="/" className="flex items-center group unstyled">
            <div className="mr-3 w-10 h-10 bg-solana-gradient rounded-full flex items-center justify-center text-white text-xl transition-all duration-300 group-hover:ring-solana-glow">
              ♟
            </div>
            <div className="font-bold text-xl tracking-tight">
              <span className="text-solana-gradient">One</span>
              <span className="text-solana-dark dark:text-gray-200">Puzzle</span>
            </div>
          </Link>
        </div>
        
        <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-10 items-center">
          <div className="flex space-x-6 animate-slide-up">
            <Link href="/" className={`${isActive('/')} py-1`}>
              Home
            </Link>
            <Link href="/learn" className={`${isActive('/learn')} py-1`}>
              Learn
            </Link>
            <Link href="/resources" className={`${isActive('/resources')} py-1`}>
              Resources
            </Link>
            <Link href="/dashboard" className={`${isActive('/dashboard')} py-1`}>
              Dashboard
            </Link>
            <Link href="/blog" className={`${isActive('/blog')} py-1`}>
              Blog
            </Link>
          </div>
          
          <div className="flex items-center space-x-3 animate-slide-left">
            <ThemeToggle />
            <WalletConnector />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;