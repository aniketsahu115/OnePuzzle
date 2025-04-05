import { useState, useEffect } from 'react';
import PuzzleCard from "@/components/PuzzleCard";
import AttemptCard from "@/components/AttemptCard";
import NFTPreviewCard from "@/components/NFTPreviewCard";
import HowItWorks from "@/components/HowItWorks";
import { useWallet } from "@/lib/useWallet";
import { useChessPuzzle } from "@/lib/useChessPuzzle";
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { toast } = useToast();
  const { connected, walletAddress } = useWallet();
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

  // Simplified page logic by removing type assertions
  const attemptResult = bestAttempt ? bestAttempt.isCorrect : null;

  return (
    <main className="py-10 bg-solana-light animate-fade-in">
      <div className="container-solana">
        {/* Hero Section with Puzzle of the Day */}
        <section className="text-center mb-12 animate-slide-up">
          <div className="inline-block mb-4">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              Daily Chess <span className="text-solana-gradient">Puzzle</span>
            </h1>
            <div className="h-1 w-32 bg-solana-gradient mx-auto rounded-full"></div>
          </div>
          <p className="text-lg text-gray-600 mb-6 animate-fade-in">{currentDate}</p>
        </section>

        {/* Chess Puzzle Card */}
        <section className="mb-16 max-w-4xl mx-auto animate-slide-up">
          {isLoading ? (
            <div className="card-solana p-8 text-center">
              <div className="flex flex-col items-center justify-center p-12">
                <div className="w-16 h-16 border-4 border-solana-purple border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-lg">Loading today's puzzle...</p>
              </div>
            </div>
          ) : !connected ? (
            <div className="card-solana p-8 animate-fade-in">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-8xl mb-6 animate-pulse-slow">♟</div>
                <h3 className="text-2xl font-bold mb-4 text-solana-purple">Connect Your Wallet</h3>
                <p className="mb-6 text-center max-w-md text-gray-600">
                  Connect your Solana wallet to access today's puzzle and start earning NFT achievements for your chess skills!
                </p>
                <Button className="btn-solana-gradient px-8 py-6 text-lg">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" />
                    <path d="M22 10H4" stroke="currentColor" strokeWidth="2" />
                    <path d="M20 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Connect Wallet
                </Button>
              </div>
            </div>
          ) : puzzle ? (
            <div className="animate-fade-in">
              <PuzzleCard
                puzzle={puzzle || {}}
                selectedMove={selectedMove}
                setSelectedMove={setSelectedMove}
                onReset={resetBoard}
                onSubmit={handleSubmitMove}
                elapsedTime={elapsedTime}
                currentAttempt={currentAttempt || 0}
                isCheckingMove={isCheckingMove}
              />
            </div>
          ) : (
            <div className="card-solana p-8 text-center animate-fade-in">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-6 animate-float">🏆</div>
                <h3 className="text-2xl font-bold mb-4 text-solana-purple">All Done For Today!</h3>
                <p className="mb-4 text-center max-w-md text-gray-600">
                  You've completed today's puzzle. Come back tomorrow for a new challenge!
                </p>
                <div className="inline-block bg-gray-100 px-4 py-2 rounded-md text-sm text-gray-500">
                  Next puzzle: {format(new Date(new Date().setDate(new Date().getDate() + 1)), 'MMMM d, yyyy')}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Results & History Section */}
        {connected && puzzle && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            <div className="animate-slide-left">
              <AttemptCard 
                selectedMove={selectedMove} 
                elapsedTime={elapsedTime}
                isCheckingMove={isCheckingMove}
                currentAttempt={currentAttempt || 0}
                result={attemptResult}
              />
            </div>
            <div className="animate-slide-right">
              <NFTPreviewCard 
                bestAttempt={bestAttempt} 
                attempts={attempts || []}
              />
            </div>
          </section>
        )}

        {/* How It Works Section */}
        <section className="max-w-5xl mx-auto animate-slide-up">
          <HowItWorks />
        </section>
        
        {/* Stats Section - Show only when connected */}
        {connected && walletAddress && (
          <section className="py-16 mt-16 bg-white rounded-lg shadow-sm animate-slide-up">
            <div className="container-solana">
              <h2 className="text-3xl font-bold text-center mb-12">Your Chess Journey</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-6 rounded-lg bg-gray-50 hover:shadow-md transition-all duration-300 animate-slide-up delay-100">
                  <div className="w-16 h-16 mx-auto bg-solana-purple bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-solana-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{Array.isArray(attempts) ? attempts.length : 0}</h3>
                  <p className="text-gray-600">Total Attempts</p>
                </div>
                
                <div className="p-6 rounded-lg bg-gray-50 hover:shadow-md transition-all duration-300 animate-slide-up delay-200">
                  <div className="w-16 h-16 mx-auto bg-solana-green bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-solana-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {Array.isArray(attempts) ? attempts.filter(a => a.isCorrect).length : 0}
                  </h3>
                  <p className="text-gray-600">Correct Solutions</p>
                </div>
                
                <div className="p-6 rounded-lg bg-gray-50 hover:shadow-md transition-all duration-300 animate-slide-up delay-300">
                  <div className="w-16 h-16 mx-auto bg-solana-blue bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-solana-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {Array.isArray(attempts) ? attempts.filter(a => a.mintedNftAddress).length : 0}
                  </h3>
                  <p className="text-gray-600">NFTs Earned</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
