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
              <div className="w-20 h-20 bg-solana-purple bg-opacity-10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-solana-purple">1</span>
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
              <div className="w-20 h-20 bg-solana-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-solana-green">2</span>
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
              <div className="w-20 h-20 bg-solana-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-solana-blue">3</span>
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
