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
      ? 'font-bold text-white border-b-2 border-white shadow-sm' 
      : 'text-white hover:text-solana-green transition-all duration-300 hover:scale-105';
  };

  return (
    <header className="sticky top-0 bg-solana-gradient shadow-md py-3 px-6 z-50 border-b border-purple-500/20">
      <div className="container-solana flex flex-col md:flex-row justify-between items-center relative z-10">
        <div className="flex items-center mb-4 md:mb-0">
          <Link href="/" className="flex items-center unstyled">
            <div className="mr-3 w-10 h-10 bg-white rounded-lg flex items-center justify-center text-solana-purple text-2xl font-black shadow">
              ♟
            </div>
            <div className="font-bold text-2xl tracking-tight text-white" style={{textShadow: '0 2px 8px rgba(0,0,0,0.18), 0 1px 0 rgba(0,0,0,0.12)'}}>
              OnePuzzle
            </div>
          </Link>
        </div>
        
        <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-10 items-center">
          <div className="flex space-x-6">
            <Link href="/" className={`${isActive('/')} py-2 px-3 rounded-lg transition-all duration-300 text-white`}>
              Home
            </Link>
            <Link href="/learn" className={`${isActive('/learn')} py-2 px-3 rounded-lg transition-all duration-300 text-white`}>
              Learn
            </Link>
            <Link href="/resources" className={`${isActive('/resources')} py-2 px-3 rounded-lg transition-all duration-300 text-white`}>
              Resources
            </Link>
            <Link href="/dashboard" className={`${isActive('/dashboard')} py-2 px-3 rounded-lg transition-all duration-300 text-white`}>
              Dashboard
            </Link>
            <Link href="/blog" className={`${isActive('/blog')} py-2 px-3 rounded-lg transition-all duration-300 text-white`}>
              Blog
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <WalletConnector />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;