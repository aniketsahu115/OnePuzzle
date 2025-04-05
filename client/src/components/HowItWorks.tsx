import React from 'react';

const HowItWorks: React.FC = () => {
  return (
    <section className="mt-12 p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-primary mb-4">How it Works</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mb-3">
            <span className="text-white font-bold">1</span>
          </div>
          <h4 className="font-bold mb-2">One Puzzle Daily</h4>
          <p className="text-slate-600 text-sm">Each day, you get exactly one new chess puzzle of random difficulty</p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mb-3">
            <span className="text-white font-bold">2</span>
          </div>
          <h4 className="font-bold mb-2">Three Attempts</h4>
          <p className="text-slate-600 text-sm">You have three chances to solve the puzzle, with your best attempt recorded</p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mb-3">
            <span className="text-white font-bold">3</span>
          </div>
          <h4 className="font-bold mb-2">Mint Your Result</h4>
          <p className="text-slate-600 text-sm">Your best attempt is minted as a cNFT on Solana, creating your chess history</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
