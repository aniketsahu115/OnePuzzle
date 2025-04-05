import React from 'react';

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-white rounded-xl shadow-md">
      <div className="container-solana">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl font-bold mb-6">How it Works</h2>
          <div className="h-1 w-24 bg-solana-gradient mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            OnePuzzle combines chess training with on-chain achievements in an elegant, simple format
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="card-solana p-8 text-center animate-slide-up delay-100">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-solana-purple bg-opacity-10 rounded-full flex items-center justify-center mx-auto overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#9945FF" strokeWidth="1.5" className="w-12 h-12">
                  <path d="M8 6h13" />
                  <path d="M8 12h13" />
                  <path d="M8 18h13" />
                  <path d="M3 6h.01" />
                  <path d="M3 12h.01" />
                  <path d="M3 18h.01" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-solana-purple rounded-full flex items-center justify-center text-white animate-pulse-slow">
                ♟
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3">One Puzzle Daily</h3>
            <p className="text-gray-600">
              Each day, a new chess puzzle of random difficulty awaits. Just one per day - quality over quantity.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="card-solana p-8 text-center animate-slide-up delay-200">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-solana-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#14F195" strokeWidth="1.5" className="w-12 h-12">
                  <path d="M7.75 8.75l2.25 2.25-4.5 4.5-2.25-2.25L7.75 8.75z"></path>
                  <path d="M12.75 3.75l2.25 2.25-8.5 8.5-2.25-2.25L12.75 3.75z"></path>
                  <path d="M17.75 8.75l2.25 2.25-8.5 8.5-2.25-2.25L17.75 8.75z"></path>
                  <path d="M17.75 15.75l-1.5 6h-9.5l-1.5-6"></path>
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-solana-green rounded-full flex items-center justify-center text-white animate-pulse-slow">
                ♟
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3">Three Attempts</h3>
            <p className="text-gray-600">
              You get three chances to solve each puzzle. The system records your best performance for minting.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="card-solana p-8 text-center animate-slide-up delay-300">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-solana-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#03A9F4" strokeWidth="1.5" className="w-12 h-12">
                  <path d="M17 7a5 5 0 0 0-5-5c-2.76 0-5 2.24-5 5s2.24 5 5 5c.42 0 .83-.05 1.22-.15"></path>
                  <path d="M18.18 15.18A5 5 0 1 0 22 19"></path>
                  <path d="M19 15 17 8l-2 7"></path>
                  <path d="m7 18-2 4"></path>
                  <path d="m9 18 2 4"></path>
                  <path d="M8 22v-5"></path>
                  <path d="m2 19 4-7"></path>
                  <path d="m14 19-4-7"></path>
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-solana-blue rounded-full flex items-center justify-center text-white animate-pulse-slow">
                ♟
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3">Mint Your Result</h3>
            <p className="text-gray-600">
              Your best attempt is automatically minted as a compressed NFT on Solana, creating your permanent chess history.
            </p>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-12 animate-slide-up delay-400">
          <p className="text-gray-600 mb-6">
            Start building your on-chain chess reputation with just a few minutes each day
          </p>
          <div className="inline-block">
            <div className="btn-solana-gradient px-8 py-3 rounded-md font-medium text-lg inline-flex items-center shadow-lg hover:shadow-xl cursor-pointer">
              <span className="mr-2">♟</span>
              <span>Connect Wallet to Begin</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
