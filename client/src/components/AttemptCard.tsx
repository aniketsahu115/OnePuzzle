import React, { useState, useEffect } from 'react';
import { formatTime, formatAlgebraicNotation } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, MoveHorizontal, RotateCcw } from 'lucide-react';
import { Attempt } from '@shared/schema';

interface AttemptCardProps {
  selectedMove: string | null;
  elapsedTime: number;
  isCheckingMove: boolean;
  currentAttempt: number;
  result?: boolean | null;
  attempts?: Attempt[];
}

const AttemptCard: React.FC<AttemptCardProps> = ({
  selectedMove,
  elapsedTime,
  isCheckingMove,
  currentAttempt,
  result,
  attempts = []
}) => {
  // Keep track of previous attempts to display history
  const [previousAttempts, setPreviousAttempts] = useState<Attempt[]>([]);
  
  // Update previous attempts when the attempts prop changes
  useEffect(() => {
    if (Array.isArray(attempts) && attempts.length > 0) {
      setPreviousAttempts(attempts);
    }
  }, [attempts]);
  
  const renderResultContent = () => {
    if (isCheckingMove) {
      return (
        <div className="flex items-center mb-2 text-slate-700">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 mr-2 animate-spin">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
          </svg>
          <span>Checking your move...</span>
        </div>
      );
    }
    
    if (result === undefined || result === null) {
      return (
        <>
          <div className="flex items-center mb-2 text-slate-700">
            <Clock className="w-5 h-5 mr-2" />
            <span>Waiting for submission...</span>
          </div>
          <p className="text-sm text-slate-600">Submit your move to see if it's correct</p>
        </>
      );
    }
    
    if (result === true) {
      return (
        <>
          <div className="flex items-center mb-2 text-green-600">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>Correct move!</span>
          </div>
          <p className="text-sm text-slate-600">Well done! This is the best move.</p>
        </>
      );
    }
    
    if (result === false) {
      return (
        <>
          <div className="flex items-center mb-2 text-red-600">
            <XCircle className="w-5 h-5 mr-2" />
            <span>Incorrect move</span>
          </div>
          <p className="text-sm text-slate-600">
            {currentAttempt < 3 
              ? `You have ${3 - currentAttempt} more attempts remaining.` 
              : "You've used all your attempts for today."}
          </p>
        </>
      );
    }
  };

  // Format move notation for display
  const formatMove = (move: string) => {
    try {
      return formatAlgebraicNotation(move);
    } catch (e) {
      return move;
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-primary p-4 text-white flex justify-between items-center">
        <h3 className="font-bold">Current Attempt</h3>
        <span className="text-sm bg-white/20 rounded px-2 py-0.5">{currentAttempt}/3</span>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between mb-4">
          <div>
            <span className="text-sm text-slate-600">Selected Move</span>
            <p className="font-mono text-lg">{selectedMove ? formatMove(selectedMove) : '—'}</p>
          </div>
          <div>
            <span className="text-sm text-slate-600">Time</span>
            <p className="font-mono text-lg">{formatTime(elapsedTime)}</p>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-4 mb-4">
          {renderResultContent()}
        </div>
        
        {/* Previous Attempts History */}
        {previousAttempts.length > 0 && (
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Previous Attempts</h4>
            <div className="space-y-2">
              {previousAttempts.map((attempt, index) => (
                <div key={attempt.id} className="flex items-center justify-between text-sm bg-slate-50 rounded p-2">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center mr-2 text-xs">
                      {attempt.attemptNumber}
                    </div>
                    <div className="font-mono">{formatMove(attempt.move)}</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center text-slate-600">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{formatTime(attempt.timeTaken)}</span>
                    </div>
                    {attempt.isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttemptCard;
