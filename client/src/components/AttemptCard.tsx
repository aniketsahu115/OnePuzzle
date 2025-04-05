import React from 'react';
import { formatTime } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface AttemptCardProps {
  selectedMove: string | null;
  elapsedTime: number;
  isCheckingMove: boolean;
  currentAttempt: number;
  result?: boolean | null;
}

const AttemptCard: React.FC<AttemptCardProps> = ({
  selectedMove,
  elapsedTime,
  isCheckingMove,
  currentAttempt,
  result
}) => {
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

  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-primary p-4 text-white">
        <h3 className="font-bold">Current Attempt</h3>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between mb-4">
          <div>
            <span className="text-sm text-slate-600">Selected Move</span>
            <p className="font-mono text-lg">{selectedMove || '—'}</p>
          </div>
          <div>
            <span className="text-sm text-slate-600">Time</span>
            <p className="font-mono text-lg">{formatTime(elapsedTime)}</p>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-4">
          {renderResultContent()}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttemptCard;
