import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import WalletConnector from './WalletConnector';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '@/lib/useTheme';
import { CircuitPattern } from './SVGBackgrounds';

const NavBar: React.FC = () => {
  const [location] = useLocation();
  const { theme } = useTheme();

  const isActive = (path: string) => {
    return location === path 
      ? 'font-bold text-solana-purple border-b-2 border-solana-purple dark:text-purple-400 dark:border-purple-400 neon-glow-purple' 
      : 'text-gray-700 hover:text-solana-purple transition-all duration-300 dark:text-gray-300 dark:hover:text-purple-400 hover:scale-105';
  };

  return (
    <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg py-4 px-6 animate-fade-in z-50 transition-all duration-300 border-b border-purple-500/20">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <CircuitPattern animated={true} />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5"></div>
      </div>
      
      <div className="container-solana flex flex-col md:flex-row justify-between items-center relative z-10">
        <div className="flex items-center mb-4 md:mb-0 animate-slide-right">
          <Link href="/" className="flex items-center group unstyled">
            <div className="relative mr-3 w-12 h-12 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl transition-all duration-500 group-hover:ring-solana-glow group-hover:scale-110 group-hover:rotate-3 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/50 to-blue-600/50 rounded-2xl animate-pulse-very-slow"></div>
              <div className="relative z-10">♟</div>
              {/* Sparkle effects */}
              <div className="absolute top-0 left-1/4 w-1 h-1 bg-white rounded-full animate-sparkle"></div>
              <div className="absolute bottom-1/4 right-0 w-1 h-1 bg-white rounded-full animate-sparkle" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <div className="font-bold text-2xl tracking-tight">
              <span className="text-solana-gradient neon-glow-purple">One</span>
              <span className="text-solana-dark dark:text-gray-200">Puzzle</span>
            </div>
          </Link>
        </div>
        
        <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-10 items-center">
          <div className="flex space-x-6 animate-slide-up">
            <Link href="/" className={`${isActive('/')} py-2 px-3 rounded-lg transition-all duration-300 hover:bg-purple-500/10`}>
              Home
            </Link>
            <Link href="/learn" className={`${isActive('/learn')} py-2 px-3 rounded-lg transition-all duration-300 hover:bg-purple-500/10`}>
              Learn
            </Link>
            <Link href="/resources" className={`${isActive('/resources')} py-2 px-3 rounded-lg transition-all duration-300 hover:bg-purple-500/10`}>
              Resources
            </Link>
            <Link href="/dashboard" className={`${isActive('/dashboard')} py-2 px-3 rounded-lg transition-all duration-300 hover:bg-purple-500/10`}>
              Dashboard
            </Link>
            <Link href="/blog" className={`${isActive('/blog')} py-2 px-3 rounded-lg transition-all duration-300 hover:bg-purple-500/10`}>
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