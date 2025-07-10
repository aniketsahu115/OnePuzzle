import React, { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import solanaLogo from '../assets/solana-logo.png';
import { GeometricPattern } from './SVGBackgrounds';

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would call an API to subscribe the user
    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter",
    });

    setEmail("")
  };

  return (
    <footer className="relative bg-solana-dark pt-16 pb-8 overflow-hidden">
      {/* Removed animated geometric background for minimalism */}
      
      <div className="container-solana relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1 animate-slide-up">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-solana-purple rounded-2xl flex items-center justify-center text-white mr-3 text-xl shadow-lg">
                <span className="z-10">♟</span>
              </div>
              <div className="font-bold text-xl tracking-tight">
                <span className="text-solana-purple">One</span>
                <span className="text-white">Puzzle</span>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed text-crisp">
              Daily chess puzzles with NFT achievements on Solana. Improve your
              skills one puzzle at a time.
            </p>
            <div className="flex space-x-5 mt-6">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="unstyled group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 hover:from-purple-800/70 hover:to-indigo-800/70 rounded-2xl flex items-center justify-center transition-all duration-500 hover:ring-solana-glow hover:scale-110 hover:rotate-3 border border-purple-500/30">
                  <svg
                    className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                  </svg>
                </div>
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="unstyled group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 hover:from-purple-800/70 hover:to-indigo-800/70 rounded-2xl flex items-center justify-center transition-all duration-500 hover:ring-solana-glow hover:scale-110 hover:rotate-3 border border-purple-500/30">
                  <svg
                    className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 00-.079.036c-.21.39-.444.977-.608 1.414a18.566 18.566 0 00-5.487 0 12.38 12.38 0 00-.617-1.415.077.077 0 00-.079-.036c-1.714.29-3.354.8-4.885 1.491a.07.07 0 00-.032.027C.533 9.69-.32 14.76.099 19.766a.082.082 0 00.031.057 20.03 20.03 0 006.023 3.042.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.995a.076.076 0 00-.041-.106 13.226 13.226 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.099.246.198.373.292a.077.077 0 01-.006.127 12.39 12.39 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.029 19.964 19.964 0 006.024-3.042.077.077 0 00.032-.057c.5-5.177-.838-10.209-3.549-14.349a.061.061 0 00-.031-.028zM8.02 16.77c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.332-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.332-.946 2.418-2.157 2.418z" />
                  </svg>
                </div>
              </a>
              <a
                href="https://github.com/aniketsahu115/OnePuzzle"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="unstyled group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 hover:from-purple-800/70 hover:to-indigo-800/70 rounded-2xl flex items-center justify-center transition-all duration-500 hover:ring-solana-glow hover:scale-110 hover:rotate-3 border border-purple-500/30">
                  <svg
                    className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* Resources */}
          <div className="col-span-1 animate-slide-up delay-100">
            <h3 className="text-solana-purple font-bold text-lg mb-5 border-b border-purple-500/30 pb-2">
              Resources
            </h3>
            <ul className="space-y-3">
              <li className="animate-slide-up delay-100">
                <Link
                  href="/tutorials"
                  className="text-gray-300 hover:text-solana-green transition-all duration-300 flex items-center group hover:scale-105"
                >
                  <span className="mr-2 text-solana-purple group-hover:scale-110 transition-transform">▸</span>
                  <span>Tutorials</span>
                </Link>
              </li>
              <li className="animate-slide-up delay-200">
                <Link
                  href="/resources"
                  className="text-gray-300 hover:text-solana-green transition-all duration-300 flex items-center group hover:scale-105"
                >
                  <span className="mr-2 text-solana-purple group-hover:scale-110 transition-transform">▸</span>
                  <span>Chess Library</span>
                </Link>
              </li>
              <li className="animate-slide-up delay-300">
                <Link
                  href="/learn"
                  className="text-gray-300 hover:text-solana-green transition-all duration-300 flex items-center group hover:scale-105"
                >
                  <span className="mr-2 text-solana-purple group-hover:scale-110 transition-transform">▸</span>
                  <span>Learning Hub</span>
                </Link>
              </li>
              <li className="animate-slide-up delay-400">
                <Link
                  href="/faq"
                  className="text-gray-300 hover:text-solana-green transition-all duration-300 flex items-center group hover:scale-105"
                >
                  <span className="mr-2 text-solana-purple group-hover:scale-110 transition-transform">▸</span>
                  <span>FAQ</span>
                </Link>
              </li>
              <li className="animate-slide-up delay-500">
                <Link
                  href="/support"
                  className="text-gray-300 hover:text-solana-green transition-all duration-300 flex items-center group hover:scale-105"
                >
                  <span className="mr-2 text-solana-purple group-hover:scale-110 transition-transform">▸</span>
                  <span>Support</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="col-span-1 animate-slide-up delay-200">
            <h3 className="text-solana-green font-bold text-lg mb-5 border-b border-green-500/30 pb-2">
              Community
            </h3>
            <ul className="space-y-3">
              <li className="animate-slide-up delay-100">
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-solana-green transition-all duration-300 flex items-center group hover:scale-105"
                >
                  <span className="mr-2 text-solana-purple group-hover:scale-110 transition-transform">▸</span>
                  <span>About Us</span>
                </Link>
              </li>
              <li className="animate-slide-up delay-200">
                <Link
                  href="/blog"
                  className="text-gray-300 hover:text-solana-green transition-all duration-300 flex items-center group hover:scale-105"
                >
                  <span className="mr-2 text-solana-purple group-hover:scale-110 transition-transform">▸</span>
                  <span>Blog</span>
                </Link>
              </li>
              <li className="animate-slide-up delay-300">
                <Link
                  href="/careers"
                  className="text-gray-300 hover:text-solana-green transition-all duration-300 flex items-center group hover:scale-105"
                >
                  <span className="mr-2 text-solana-purple group-hover:scale-110 transition-transform">▸</span>
                  <span>Support</span>
                </Link>
              </li>
              <li className="animate-slide-up delay-400">
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-solana-green transition-all duration-300 flex items-center group hover:scale-105"
                >
                  <span className="mr-2 text-solana-purple group-hover:scale-110 transition-transform">▸</span>
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li className="animate-slide-up delay-500">
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-solana-green transition-all duration-300 flex items-center group hover:scale-105"
                >
                  <span className="mr-2 text-solana-purple group-hover:scale-110 transition-transform">▸</span>
                  <span>Terms of Service</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1 animate-slide-up delay-300">
            <h3 className="text-solana-blue font-bold text-lg mb-5 border-b border-blue-500/30 pb-2">
              Stay Updated
            </h3>
            <p className="text-gray-300 mb-4">
              Get the latest chess puzzles and updates delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/50 backdrop-blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-md blur-sm -z-10"></div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-purple-500/30">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 OnePuzzle. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <img src={solanaLogo} alt="Solana" className="h-6 opacity-60 hover:opacity-100 transition-opacity" />
              <span className="text-gray-400 text-sm">Powered by Solana</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
