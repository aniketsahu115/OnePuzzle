import { useState, useEffect, ReactNode } from 'react';
import PuzzleCard from "@/components/PuzzleCard";
import AttemptCard from "@/components/AttemptCard";
import NFTPreviewCard from "@/components/NFTPreviewCard";
import HowItWorks from "@/components/HowItWorks";
import { useWallet } from "@/lib/useWallet";
import { useChessPuzzle } from "@/lib/useChessPuzzle";
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Attempt, PuzzleWithoutSolution } from '@shared/schema';

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

  const [currentDate, setCurrentDate] = useState<string>('');

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

  // Add type assertion to handle TypeScript error
  const attemptResult = bestAttempt ? (bestAttempt as Attempt).isCorrect : null;

  return (
    <main className="py-10 bg-gradient-to-b from-[#1C1929] via-[#231e3e] to-[#282256] text-white animate-fade-in">
      <div className="container-solana">
        {/* Hero Section with Puzzle of the Day */}
        <section className="text-center mb-16 animate-slide-up relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-10 w-48 h-48 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="inline-block mb-6 relative">
            <h1 className="text-4xl md:text-7xl font-extrabold mb-6 leading-tight">
              Daily Chess <span className="text-solana-gradient font-black">Puzzle</span>
            </h1>
            <div className="h-1.5 w-48 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 mx-auto rounded-full"></div>
          </div>
          <p className="text-xl text-indigo-100 mb-6 animate-fade-in max-w-xl mx-auto">{currentDate} • Challenge your chess skills and earn NFTs with each correct solution</p>
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
            <div className="card-solana p-8 shadow-xl border border-purple-600/20 animate-fade-in relative overflow-hidden backdrop-blur-sm">
              {/* Decorative background elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-600 to-indigo-800 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-600 to-indigo-800 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
                <div className="w-full h-full bg-indigo-900/10 backdrop-blur-3xl"></div>
              </div>

              <div className="flex flex-col items-center justify-center py-12 relative z-10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center mb-8 shadow-lg">
                  <div className="text-7xl animate-pulse-slow">♟</div>
                </div>
                
                <h3 className="text-3xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">
                  Connect Your Wallet
                </h3>
                
                <p className="mb-8 text-center max-w-md text-indigo-100">
                  Connect your Solana wallet to access today's puzzle and start earning NFT achievements for your chess skills!
                </p>
                
                <Button 
                  className="btn-solana-gradient px-8 py-6 text-lg font-bold group shadow-lg hover:shadow-xl transition-all rounded-xl"
                  onClick={() => document.getElementById('wallet-connector')?.querySelector('button')?.click()}
                >
                  <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" />
                    <path d="M22 10H4" stroke="currentColor" strokeWidth="2" />
                    <path d="M20 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform">Connect Wallet</span>
                </Button>
              </div>
            </div>
          ) : puzzle && typeof puzzle === 'object' && puzzle !== null && 'id' in puzzle && 'fen' in puzzle ? (
            <div className="animate-fade-in">
              <PuzzleCard
                puzzle={puzzle as PuzzleWithoutSolution}
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
        {connected && puzzle && typeof puzzle === 'object' && puzzle !== null && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            <div className="animate-slide-left">
              <AttemptCard 
                selectedMove={selectedMove} 
                elapsedTime={elapsedTime}
                isCheckingMove={isCheckingMove}
                currentAttempt={currentAttempt || 0}
                result={attemptResult}
                attempts={Array.isArray(attempts) ? attempts : []}
              />
            </div>
            <div className="animate-slide-right">
              <NFTPreviewCard 
                bestAttempt={bestAttempt} 
                attempts={Array.isArray(attempts) ? attempts : []}
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
              <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Your Chess Journey</h2>
              <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                Track your progress and achievements on your chess puzzle journey
              </p>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
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
                    {attempts && Array.isArray(attempts) ? 
                      attempts.filter(a => a.isCorrect).length : 0}
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
                    {attempts && Array.isArray(attempts) ? 
                      attempts.filter(a => a.mintedNftAddress).length : 0}
                  </h3>
                  <p className="text-gray-600">NFTs Earned</p>
                </div>
              </div>
              
              {/* Recent Activity */}
              {Array.isArray(attempts) && attempts.length > 0 && (
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Recent Puzzle Activity</h3>
                  <div className="overflow-hidden bg-white shadow-sm rounded-lg">
                    <div className="divide-y divide-gray-200">
                      {attempts.slice(0, 5).map((attempt, index) => (
                        <div key={attempt.id || index} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              attempt.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              {attempt.isCorrect ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                              ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {attempt.isCorrect ? 'Correct Solution' : 'Incorrect Attempt'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(attempt.attemptDate).toLocaleDateString()} - Move: {attempt.move}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {formatTime(attempt.timeTaken)}
                            </span>
                            {attempt.mintedNftAddress && (
                              <span className="text-xs text-gray-500 mt-1">
                                NFT Minted ✓
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {Array.isArray(attempts) && attempts.length === 0 && (
                        <div className="p-6 text-center">
                          <p className="text-gray-500">No puzzle activity yet. Start solving puzzles to build your journey!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Empty state if no attempts */}
              {Array.isArray(attempts) && attempts.length === 0 && (
                <div className="max-w-md mx-auto text-center p-6 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Chess Journey</h3>
                  <p className="text-gray-600">Complete your first puzzle attempt to begin building your chess journey stats.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
