import React from 'react';
import { formatTime } from '@/lib/utils';
import ChessBoard from './ChessBoard';
import { PuzzleWithoutSolution } from '@shared/schema';
import { Button } from '@/components/ui/button';

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
  elapsedTime,
  currentAttempt,
  isCheckingMove
}) => {
  // Map difficulty to display name and color
  const difficultyMap = {
    'easy': { name: 'EASY', color: 'bg-green-500' },
    'medium': { name: 'MEDIUM', color: 'bg-accent' },
    'hard': { name: 'HARD', color: 'bg-red-500' }
  };
  
  const difficulty = difficultyMap[puzzle.difficulty as keyof typeof difficultyMap] || 
    { name: puzzle.difficulty.toUpperCase(), color: 'bg-accent' };

  const toMoveName = puzzle.toMove === 'w' ? 'White' : 'Black';

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
      {/* Puzzle Info Bar */}
      <div className="bg-primary p-4 text-white flex justify-between items-center">
        <div className="flex items-center">
          <span className={`${difficulty.color} text-primary font-bold px-2 py-1 rounded text-sm mr-3`}>{difficulty.name}</span>
          <span className="text-sm">{toMoveName} to Move</span>
        </div>
        <div className="flex items-center">
          <div className="flex items-center mr-4" title="Timer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 mr-1">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span id="timer" className="font-mono">{formatTime(elapsedTime)}</span>
          </div>
          <div className="flex items-center" title="Attempts">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 mr-1">
              <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
              <path d="M12 19l9-5-9-5-9 5 9 5z"></path>
            </svg>
            <span id="attempts-counter" className="font-mono">{currentAttempt}/3</span>
          </div>
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
        <div>
          <span className="text-sm text-slate-600">Find the best move for {toMoveName.toLowerCase()}</span>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={onReset} 
            variant="outline"
            disabled={isCheckingMove || currentAttempt > 3}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Reset
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={!selectedMove || isCheckingMove || currentAttempt > 3}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
          >
            {isCheckingMove ? 'Submitting...' : 'Submit Move'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PuzzleCard;
