import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }
    
    // In a real app, this would call an API to subscribe the user
    toast({
      title: 'Subscribed!',
      description: 'Thank you for subscribing to our newsletter',
    });
    
    setEmail('');
  };

  return (
    <footer className="bg-solana-dark pt-16 pb-8">
      <div className="container-solana">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1 animate-slide-up">
            <div className="flex items-center mb-4 group">
              <div className="w-10 h-10 bg-solana-gradient rounded-full flex items-center justify-center text-white mr-3 text-xl shadow-lg">
                ♟
              </div>
              <div className="font-bold text-xl tracking-tight">
                <span className="text-solana-gradient">One</span>
                <span className="text-white">Puzzle</span>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Daily chess puzzles with NFT achievements on Solana. Improve your skills one puzzle at a time.
            </p>
            <div className="flex space-x-5 mt-6">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Twitter"
                className="unstyled"
              >
                <div className="w-10 h-10 bg-[#232D42] hover:bg-[#323E54] rounded-full flex items-center justify-center transition-all duration-300 hover:ring-solana-glow">
                  <svg className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                  </svg>
                </div>
              </a>
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Discord"
                className="unstyled"
              >
                <div className="w-10 h-10 bg-[#232D42] hover:bg-[#323E54] rounded-full flex items-center justify-center transition-all duration-300 hover:ring-solana-glow">
                  <svg className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 00-.079.036c-.21.39-.444.977-.608 1.414a18.566 18.566 0 00-5.487 0 12.38 12.38 0 00-.617-1.415.077.077 0 00-.079-.036c-1.714.29-3.354.8-4.885 1.491a.07.07 0 00-.032.027C.533 9.69-.32 14.76.099 19.766a.082.082 0 00.031.057 20.03 20.03 0 006.023 3.042.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.995a.076.076 0 00-.041-.106 13.226 13.226 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.099.246.198.373.292a.077.077 0 01-.006.127 12.39 12.39 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.029 19.964 19.964 0 006.024-3.042.077.077 0 00.032-.057c.5-5.177-.838-10.209-3.549-14.349a.061.061 0 00-.031-.028zM8.02 16.77c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.332-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.332-.946 2.418-2.157 2.418z" />
                  </svg>
                </div>
              </a>
              <a 
                href="https://github.com/aniketsahu115/OnePuzzle" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="GitHub"
                className="unstyled"
              >
                <div className="w-10 h-10 bg-[#232D42] hover:bg-[#323E54] rounded-full flex items-center justify-center transition-all duration-300 hover:ring-solana-glow">
                  <svg className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
          
          {/* Resources */}
          <div className="col-span-1 animate-slide-up delay-100">
            <h3 className="text-white font-bold text-lg mb-5 border-b border-[#343e54] pb-2">Resources</h3>
            <ul className="space-y-3">
              <li className="animate-slide-up delay-100">
                <Link href="/tutorials" className="text-gray-300 hover:text-solana-green transition-all duration-300 flex items-center">
                  <span className="mr-2 text-solana-purple">▸</span>
                  <span>Tutorials</span>
                </Link>
              </li>
              <li className="animate-slide-up delay-200">
                <Link href="/resources" className="text-gray-300 hover:text-solana-green transition-all duration-300 flex items-center">
                  <span className="mr-2 text-solana-purple">▸</span>
                  <span>Chess Library</span>
                </Link>
              </li>
              <li className="animate-slide-up delay-300">
                <Link href="/learn" className="text-gray-300 hover:text-solana-green transition-all duration-300 flex items-center">
                  <span className="mr-2 text-solana-purple">▸</span>
                  <span>Learning Hub</span>
                </Link>
              </li>
              <li className="animate-slide-up delay-400">
                <Link href="/faq" className="text-gray-300 hover:text-solana-green transition-all duration-300 flex items-center">
                  <span className="mr-2 text-solana-purple">▸</span>
                  <span>FAQ</span>
                </Link>
              </li>
              <li className="animate-slide-up delay-500">
                <Link href="/support" className="text-gray-300 hover:text-solana-green transition-all duration-300 flex items-center">
                  <span className="mr-2 text-solana-purple">▸</span>
                  <span>Support</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Community */}
          <div className="col-span-1 animate-slide-up delay-200">
            <h3 className="text-white font-bold text-lg mb-5 border-b border-[#343e54] pb-2">Community</h3>
            <ul className="space-y-3">
              <li className="animate-slide-up delay-100">
                <Link href="/about" className="text-gray-300 hover:text-solana-green transition-all duration-300 flex items-center">
                  <span className="mr-2 text-solana-purple">▸</span>
                  <span>About Us</span>
                </Link>
              </li>
              <li className="animate-slide-up delay-200">
                <Link href="/blog" className="text-gray-300 hover:text-solana-green transition-all duration-300 flex items-center">
                  <span className="mr-2 text-solana-purple">▸</span>
                  <span>Blog</span>
                </Link>
              </li>
              <li className="animate-slide-up delay-300">
                <Link href="/careers" className="text-gray-300 hover:text-solana-green transition-all duration-300 flex items-center">
                  <span className="mr-2 text-solana-purple">▸</span>
                  <span>Support</span>
                </Link>
              </li>
              <li className="animate-slide-up delay-400">
                <Link href="/privacy" className="text-gray-300 hover:text-solana-green transition-all duration-300 flex items-center">
                  <span className="mr-2 text-solana-purple">▸</span>
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li className="animate-slide-up delay-500">
                <Link href="/terms" className="text-gray-300 hover:text-solana-green transition-all duration-300 flex items-center">
                  <span className="mr-2 text-solana-purple">▸</span>
                  <span>Terms of Service</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="col-span-1 md:col-span-1 animate-slide-up delay-300">
            <h3 className="text-white font-bold text-lg mb-5 border-b border-[#343e54] pb-2">Subscribe</h3>
            <p className="text-gray-300 mb-5">
              Get the latest updates and news about chess puzzles and Solana NFTs.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
              <Input 
                type="email" 
                placeholder="Your email address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="bg-[#232D42] border-[#343e54] text-white focus:border-solana-purple"
              />
              <Button 
                type="submit" 
                className="btn-solana-gradient w-full"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-[#343e54] flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 animate-fade-in">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} OnePuzzle. All rights reserved.
            </p>
          </div>
          <div className="flex items-center animate-fade-in">
            <span className="text-gray-400 text-sm flex items-center">
              <span>Powered by</span>
              <a 
                href="https://solana.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ml-2 flex items-center group hover:text-white text-solana-purple transition-all duration-300 unstyled"
              >
                <span className="group-hover:text-solana-green transition-all duration-300">Solana</span>
                <svg className="h-5 w-5 ml-1 text-solana-purple group-hover:text-solana-green transition-all duration-300" viewBox="0 0 397 311" fill="currentColor">
                  <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h320.5c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zm0-163.6c2.4-2.4 5.7-3.8 9.2-3.8h320.5c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zm328.9-59c-2.4-2.4-5.7-3.8-9.2-3.8H64.6c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h320.5c5.8 0 8.7-7 4.6-11.1l-63.5-62.7z" />
                </svg>
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;