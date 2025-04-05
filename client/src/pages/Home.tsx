import { useState, useEffect } from 'react';
import Logo from "@/components/Logo";
import WalletConnector from "@/components/WalletConnector";
import PuzzleCard from "@/components/PuzzleCard";
import AttemptCard from "@/components/AttemptCard";
import NFTPreviewCard from "@/components/NFTPreviewCard";
import HowItWorks from "@/components/HowItWorks";
import { useWallet } from "@/lib/useWallet";
import { useChessPuzzle } from "@/lib/useChessPuzzle";
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { toast } = useToast();
  const { connected } = useWallet();
  const {
    puzzle,
    isLoading,
    currentAttempt,
    attempts,
    selectedMove,
    setSelectedMove,
    makeAttempt,
    resetBoard,
    elapsedTime,
    isCheckingMove,
    bestAttempt
  } = useChessPuzzle();

  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(format(new Date(), 'MMMM d, yyyy'));
  }, []);

  const handleSubmitMove = async () => {
    if (!selectedMove) {
      toast({
        title: "No move selected",
        description: "Please select a move before submitting",
        variant: "destructive"
      });
      return;
    }

    await makeAttempt();
  };

  return (
    <div className="bg-slate-100 min-h-screen font-sans text-slate-800">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* App Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <Logo />
          <WalletConnector />
        </header>

        {/* Main Content */}
        <main>
          {/* Welcome / Date Section */}
          <section className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-primary mb-2">Today's Chess Puzzle</h2>
            <p className="text-slate-600">{currentDate}</p>
          </section>

          {/* Chess Puzzle Card */}
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 p-8 text-center">
              <p>Loading today's puzzle...</p>
            </div>
          ) : !connected ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 p-8 text-center">
              <p className="mb-4">Connect your wallet to see today's puzzle</p>
            </div>
          ) : puzzle ? (
            <PuzzleCard
              puzzle={puzzle}
              selectedMove={selectedMove}
              setSelectedMove={setSelectedMove}
              onReset={resetBoard}
              onSubmit={handleSubmitMove}
              elapsedTime={elapsedTime}
              currentAttempt={currentAttempt}
              isCheckingMove={isCheckingMove}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 p-8 text-center">
              <p>No puzzle available for today. Please check back tomorrow!</p>
            </div>
          )}

          {/* Results & History Section */}
          {connected && puzzle && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AttemptCard 
                selectedMove={selectedMove} 
                elapsedTime={elapsedTime}
                isCheckingMove={isCheckingMove}
                currentAttempt={currentAttempt}
                result={currentAttempt?.isCorrect}
              />
              <NFTPreviewCard 
                bestAttempt={bestAttempt} 
                attempts={attempts}
              />
            </section>
          )}

          {/* How It Works Section */}
          <HowItWorks />

          {/* Footer */}
          <footer className="mt-12 text-center text-slate-500 text-sm">
            <p>OnePuzzle &copy; {new Date().getFullYear()} - Consistency through simplicity</p>
            <div className="mt-2 flex justify-center space-x-4">
              <a href="#" className="hover:text-primary">About</a>
              <a href="#" className="hover:text-primary">FAQ</a>
              <a href="#" className="hover:text-primary">Privacy</a>
              <a href="#" className="hover:text-primary">Terms</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
