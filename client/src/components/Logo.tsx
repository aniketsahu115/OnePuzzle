import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center mb-4 sm:mb-0">
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-6 h-6">
          <path d="M9 8a1 1 0 0 1-1-1V5a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1Z"></path>
          <path d="M15 8a1 1 0 0 1-1-1V5a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1Z"></path>
          <path d="M17 8h-1.5a.5.5 0 0 0-.5.5V10a3 3 0 1 1-6 0V8.5a.5.5 0 0 0-.5-.5H7a4 4 0 0 0-4 4v8h18v-8a4 4 0 0 0-4-4Z"></path>
        </svg>
      </div>
      <h1 className="text-xl font-bold text-primary">
        One<span className="text-accent">Puzzle</span>
      </h1>
    </div>
  );
};

export default Logo;
