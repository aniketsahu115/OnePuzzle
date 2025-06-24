import React from 'react';
import { Button } from '@/components/ui/button';

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <div className="container-solana">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">How it Works</h2>
          <div className="h-1 w-24 bg-solana-gradient mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            OnePuzzle combines chess training with on-chain achievements in an elegant, simple format
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-solana-purple bg-opacity-10 rounded-full flex items-center justify-center mx-auto overflow-hidden">
                <div className="w-20 h-20 bg-solana-purple rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-10 h-10">
                    <path d="M12 2v8" />
                    <path d="M8 10V4h8v6" />
                    <path d="M4 22V10h16v12" />
                    <path d="M4 14h16" />
                    <path d="M4 18h16" />
                    <path d="M9 14v4" />
                    <path d="M15 14v4" />
                  </svg>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-solana-purple rounded-full flex items-center justify-center text-white">
                ♟
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3 text-black dark:text-white">One Puzzle Daily</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Each day, a new chess puzzle of random difficulty awaits. Just one per day - quality over quantity.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-solana-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto overflow-hidden">
                <div className="w-20 h-20 bg-solana-green rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-10 h-10">
                    <path d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 15V17.5M17.5 21V20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-solana-green rounded-full flex items-center justify-center text-white">
                ♟
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3 text-black dark:text-white">Three Attempts</h3>
            <p className="text-gray-700 dark:text-gray-300">
              You get three chances to solve each puzzle. The system records your best performance for minting.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-solana-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto overflow-hidden">
                <div className="w-20 h-20 bg-solana-blue rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-10 h-10">
                    <path d="M21 8V21H3V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 10L12 3L23 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 21V13H15V21" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-solana-blue rounded-full flex items-center justify-center text-white">
                ♟
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3 text-black dark:text-white">Mint Your Result</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Your best attempt is automatically minted as a compressed NFT on Solana, creating your permanent chess history.
            </p>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Start building your on-chain chess reputation with just a few minutes each day
          </p>
          
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
