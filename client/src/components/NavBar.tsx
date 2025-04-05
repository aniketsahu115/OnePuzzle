import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import WalletConnector from './WalletConnector';

const NavBar: React.FC = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path ? 'font-bold text-accent' : 'text-gray-600 hover:text-gray-900';
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Link href="/" className="flex items-center">
            <span className="font-bold text-2xl text-primary mr-2">♟</span>
            <span className="font-bold text-xl text-primary">OnePuzzle</span>
          </Link>
        </div>
        
        <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-10 items-center">
          <div className="flex space-x-6">
            <Link href="/" className={`${isActive('/')} transition-colors`}>
              Home
            </Link>
            <Link href="/learn" className={`${isActive('/learn')} transition-colors`}>
              Learn
            </Link>
            <Link href="/resources" className={`${isActive('/resources')} transition-colors`}>
              Resources
            </Link>
            <Link href="/dashboard" className={`${isActive('/dashboard')} transition-colors`}>
              Dashboard
            </Link>
            <Link href="/blog" className={`${isActive('/blog')} transition-colors`}>
              Blog
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <WalletConnector />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;