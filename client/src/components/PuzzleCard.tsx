import React, { useState, useEffect } from 'react';
import { formatTime } from '@/lib/utils';
import ChessBoard from './ChessBoard';
import { PuzzleWithoutSolution } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface PuzzleCardProps {
  puzzle: PuzzleWithoutSolution;
  selectedMove: string | null;
  setSelectedMove: (move: string) => void;
  onReset: () => void;
  onSubmit: () => void;
  elapsedTime: number;
  currentAttempt: number;
  isCheckingMove: boolean;
}

const PuzzleCard: React.FC<PuzzleCardProps> = ({
  puzzle,
  selectedMove,
  setSelectedMove,
  onReset,
  onSubmit,
  elapsedTime: propElapsedTime,
  currentAttempt,
  isCheckingMove
}) => {
  // Add local timer state as backup
  const [localElapsedTime, setLocalElapsedTime] = useState<number>(propElapsedTime || 0);
  
  // Use incoming prop for initial value, but keep track locally too
  useEffect(() => {
    setLocalElapsedTime(propElapsedTime);
  }, [propElapsedTime]);
  
  // Backup timer that runs when the component is mounted and stops when unmounted
  useEffect(() => {
    // Only run the timer if we're allowed to make moves
    if (currentAttempt <= 3 && !isCheckingMove) {
      console.log('PuzzleCard starting local timer at:', localElapsedTime);
      // Store reference time for accurate timing
      const startTime = Date.now();
      const initialTime = localElapsedTime;
      
      // Use a ref to avoid recreating the interval
      const timerInterval = setInterval(() => {
        // Calculate elapsed time since interval started, add to initial time
        const elapsedSinceStart = Math.floor((Date.now() - startTime) / 1000);
        const newTime = initialTime + elapsedSinceStart;
        setLocalElapsedTime(newTime);
      }, 1000);
      
      return () => {
        console.log('PuzzleCard cleaning up local timer');
        clearInterval(timerInterval);
      };
    }
    // Returning undefined (no cleanup) when we're not supposed to run
    return undefined;
    
  }, [currentAttempt, isCheckingMove]);
  
  // Map difficulty to display name, color, and animation properties
  const difficultyMap = {
    'easy': { 
      name: 'EASY', 
      color: 'bg-green-500',
      glow: 'rgba(34, 197, 94, 0.6)',
      pulse: 'slow',
      scale: 1.03
    },
    'medium': { 
      name: 'MEDIUM', 
      color: 'bg-accent',
      glow: 'rgba(124, 58, 237, 0.6)',
      pulse: 'medium',
      scale: 1.05
    },
    'hard': { 
      name: 'HARD', 
      color: 'bg-red-500',
      glow: 'rgba(239, 68, 68, 0.7)',
      pulse: 'fast',
      scale: 1.08
    }
  };
  
  const difficulty = difficultyMap[puzzle.difficulty as keyof typeof difficultyMap] || 
    { 
      name: puzzle.difficulty.toUpperCase(), 
      color: 'bg-accent',
      glow: 'rgba(124, 58, 237, 0.5)',
      pulse: 'medium',
      scale: 1.05
    };

  const toMoveName = puzzle.toMove === 'w' ? 'White' : 'Black';
  
  // Use either the prop time or our local time, whichever is larger
  const displayTime = Math.max(propElapsedTime, localElapsedTime);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
      {/* Puzzle Info Bar */}
      <div className="bg-primary p-4 text-white flex justify-between items-center">
        <div className="flex items-center">
          <motion.div
            className="relative mr-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 10,
              delay: 0.1
            }}
          >
            {/* Animated glow effect */}
            <motion.div 
              className="absolute inset-0 rounded-md blur-sm -z-10"
              animate={{ 
                boxShadow: [
                  `0 0 0px ${difficulty.glow}`,
                  `0 0 8px ${difficulty.glow}`,
                  `0 0 2px ${difficulty.glow}`
                ],
                scale: [1, difficulty.scale, 1]
              }}
              transition={{ 
                duration: difficulty.pulse === 'fast' ? 1.5 : difficulty.pulse === 'medium' ? 2.5 : 3.5, 
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
            <motion.span 
              className={`${difficulty.color} text-primary font-bold px-3 py-1 rounded text-sm relative z-10 inline-block`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {difficulty.name}
            </motion.span>
          </motion.div>
          <span className="text-sm">{toMoveName} to Move</span>
        </div>
        <div className="flex items-center">
          <motion.div 
            className="flex items-center mr-4" 
            title="Timer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className="w-5 h-5 mr-1"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                repeatDelay: 5
              }}
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </motion.svg>
            <motion.span 
              id="timer" 
              className="font-mono"
              key={displayTime} // Add key to force re-render on time change
              initial={{ opacity: 0.7, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              {formatTime(displayTime)}
            </motion.span>
          </motion.div>
          
          <motion.div 
            className="flex items-center" 
            title="Attempts"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className="w-5 h-5 mr-1"
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
              <path d="M12 19l9-5-9-5-9 5 9 5z"></path>
            </motion.svg>
            <motion.span 
              id="attempts-counter" 
              className="font-mono"
              key={currentAttempt} // Add key to force re-render on attempt change
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              {currentAttempt}/3
            </motion.span>
          </motion.div>
        </div>
      </div>

      {/* Chess Board */}
      <ChessBoard 
        fen={puzzle.fen} 
        orientation={puzzle.toMove === 'w' ? 'white' : 'black'}
        onMove={setSelectedMove}
        selectedMove={selectedMove}
        interactionEnabled={currentAttempt <= 3 && !isCheckingMove}
        showCoordinates={true}
        showMoveHints={true}
        showLastMove={true}
      />

      {/* Action Buttons */}
      <div className="p-4 sm:p-6 border-t border-slate-200 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <span className="text-sm text-slate-600">Find the best move for {toMoveName.toLowerCase()}</span>
        </motion.div>
        <motion.div 
          className="flex space-x-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, type: "spring" }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Button 
              onClick={onReset} 
              variant="outline"
              disabled={isCheckingMove || currentAttempt > 3}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Reset
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ 
              scale: selectedMove && !isCheckingMove && currentAttempt <= 3 ? 1.05 : 1,
              y: selectedMove && !isCheckingMove && currentAttempt <= 3 ? -2 : 0,
            }}
            whileTap={{ 
              scale: selectedMove && !isCheckingMove && currentAttempt <= 3 ? 0.95 : 1 
            }}
            animate={selectedMove && !isCheckingMove && currentAttempt <= 3 ? {
              boxShadow: [
                "0px 0px 0px rgba(124, 58, 237, 0)",
                "0px 0px 8px rgba(124, 58, 237, 0.5)",
                "0px 0px 0px rgba(124, 58, 237, 0)"
              ]
            } : {}}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 10,
              boxShadow: {
                repeat: Infinity,
                duration: 2,
                repeatDelay: 1
              }
            }}
          >
            <Button 
              onClick={onSubmit}
              disabled={!selectedMove || isCheckingMove || currentAttempt > 3}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
            >
              {isCheckingMove ? (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  Submitting...
                </motion.span>
              ) : (
                'Submit Move'
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PuzzleCard;
