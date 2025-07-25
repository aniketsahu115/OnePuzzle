import { useState, useEffect, ReactNode } from 'react';
import PuzzleCard from "@/components/PuzzleCard";
import AttemptCard from "@/components/AttemptCard";
import NFTPreviewCard from "@/components/NFTPreviewCard";
import { RecommendedPuzzleCard } from "@/components/RecommendedPuzzleCard";
import HowItWorks from "@/components/HowItWorks";
import AchievementShowcase from "@/components/AchievementShowcase";
import { useWallet } from "@/lib/useWallet";
import { useChessPuzzle } from "@/lib/useChessPuzzle";
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Attempt, PuzzleWithoutSolution } from '@shared/schema';
import { formatTime } from '@/lib/utils';
import AnimatedBackground from '@/components/AnimatedBackground';
import GradientCard from '@/components/GradientCard';
import ChessPieceIcon from '@/components/ChessPieceIcon';
import { WavePattern, ParticleField, FloatingShapes, CircuitPattern } from '@/components/SVGBackgrounds';

export default function Home() {
  console.log("Rendering Home component");
  const { toast } = useToast();
  const { connected, walletAddress } = useWallet();
  console.log("Wallet state:", { connected, walletAddress });
  
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
    bestAttempt,
    getRecommendedPuzzle,
    // Achievement related properties
    showAchievement,
    closeAchievement,
    streakCount,
    totalSolved,
    latestAttempt,
    resetCounter
  } = useChessPuzzle();
  
  console.log("Chess puzzle state:", { 
    puzzle, 
    isLoading, 
    currentAttempt,
    attemptsCount: attempts?.length,
    selectedMove,
    elapsedTime
  });

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00FFA3]/10 via-[#9945FF]/10 to-[#19FB9B]/10 animate-pulse-very-slow"></div>
      
      {/* Floating Solana particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FFA3]/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-[#9945FF]/5 rounded-full blur-3xl animate-float-slow-reverse"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-[#19FB9B]/5 rounded-full blur-2xl animate-float"></div>
      </div>

      <div className="container-solana relative z-10">
        {/* Hero Section with Puzzle of the Day */}
        <section className="text-center mb-16 relative pt-20">
          <div className="inline-block mb-6 relative">
            <h1 className="text-5xl md:text-8xl font-extrabold mb-6 leading-tight text-white">
              Daily Chess <span className="bg-gradient-to-r from-[#00FFA3] to-[#19FB9B] bg-clip-text text-transparent font-black">Puzzle</span>
            </h1>
            <div className="h-2 w-64 bg-gradient-to-r from-[#00FFA3] via-[#9945FF] to-[#19FB9B] mx-auto rounded-full shadow-lg shadow-[#00FFA3]/25"></div>
          </div>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            {currentDate} • Challenge your chess skills and earn NFTs with each correct solution
          </p>
        </section>

        {/* Chess Puzzle Card */}
        <section className="mb-16 max-w-4xl mx-auto">
          {isLoading ? (
            <GradientCard variant="primary" className="p-8 text-center">
              <div className="flex flex-col items-center justify-center p-12">
                <div className="w-16 h-16 border-4 border-solana-purple border-t-transparent rounded-full mb-6 animate-spin"></div>
                <p className="text-lg text-white">Loading today's puzzle...</p>
              </div>
            </GradientCard>
          ) : !connected ? (
            <GradientCard variant="primary" className="p-6 shadow-xl border border-purple-600/30 animate-fade-in relative overflow-hidden backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center justify-between py-6 relative z-10 gap-8">
                {/* Left side content */}
                <div className="flex flex-col items-center md:items-start md:flex-1 text-left">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center mb-6 shadow-lg transform rotate-3 animate-float-slow">
                    <ChessPieceIcon piece="♟" size="lg" animated={true} />
                  </div>
                  
                  <h3 className="text-4xl font-black mb-4 text-white dark:text-white">
                    Challenge Your Mind
                  </h3>
                  
                  <p className="mb-8 text-indigo-50 text-lg max-w-md leading-relaxed text-crisp">
                    Connect your Solana wallet to access today's puzzle and start earning NFT achievements for your chess mastery!
                  </p>
                  
                  <Button 
                    className="btn-solana-gradient px-8 py-6 text-lg font-bold group shadow-lg hover:shadow-xl transition-all rounded-xl w-full md:w-auto animate-bounce"
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
                
                {/* Right side: Enhanced chess board */}
                <div className="md:flex-1 w-full flex justify-center md:justify-end">
                  <div className="w-full max-w-[400px] relative aspect-square bg-gradient-to-br from-indigo-950 to-gray-900 rounded-xl shadow-2xl overflow-hidden border-2 border-[#9945FF]/30 animate-pulse-very-slow">
                    {/* Add coordinate labels */}
                    <div className="absolute top-0 left-0 right-0 flex justify-around px-4 py-1">
                      {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
                        <div key={letter} className="text-xs text-purple-300/70">{letter}</div>
                      ))}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-around px-4 py-1">
                      {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
                        <div key={letter} className="text-xs text-purple-300/70">{letter}</div>
                      ))}
                    </div>
                    <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-around py-4 px-1">
                      {['8', '7', '6', '5', '4', '3', '2', '1'].map(number => (
                        <div key={number} className="text-xs text-purple-300/70">{number}</div>
                      ))}
                    </div>
                    <div className="absolute top-0 bottom-0 right-0 flex flex-col justify-around py-4 px-1">
                      {['8', '7', '6', '5', '4', '3', '2', '1'].map(number => (
                        <div key={number} className="text-xs text-purple-300/70">{number}</div>
                      ))}
                    </div>
                    
                    <div className="w-full h-full grid grid-cols-8 grid-rows-8">
                      {Array.from({ length: 64 }).map((_, index) => {
                        const row = Math.floor(index / 8);
                        const col = index % 8;
                        const isLight = (row + col) % 2 === 0;
                        
                        // Add chess pieces to the placeholder board for better visual appeal
                        let piece = null;
                        // Back row pieces
                        if (row === 0) {
                          if (col === 0 || col === 7) piece = "♜";
                          else if (col === 1 || col === 6) piece = "♞";
                          else if (col === 2 || col === 5) piece = "♝";
                          else if (col === 3) piece = "♛";
                          else if (col === 4) piece = "♚";
                        } 
                        // Pawns
                        else if (row === 1) {
                          piece = "♟";
                        }
                        // White pieces
                        else if (row === 6) {
                          piece = "♙";
                        }
                        else if (row === 7) {
                          if (col === 0 || col === 7) piece = "♖";
                          else if (col === 1 || col === 6) piece = "♘";
                          else if (col === 2 || col === 5) piece = "♗";
                          else if (col === 3) piece = "♕";
                          else if (col === 4) piece = "♔";
                        }
                        
                        return (
                          <div
                            key={index}
                            className={`flex items-center justify-center ${
                              isLight ? 'bg-amber-200' : 'bg-amber-800'
                            } transition-colors duration-300 hover:bg-opacity-80`}
                          >
                            {piece && (
                              <span className="text-2xl md:text-3xl animate-float-slow">
                                {piece}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </GradientCard>
          ) : (
            (() => {
              if (
                puzzle &&
                typeof puzzle === "object" &&
                puzzle !== null &&
                "id" in puzzle &&
                "fen" in puzzle
              ) {
                if (
                  Array.isArray(attempts) &&
                  (attempts.length >= 3 || (bestAttempt && bestAttempt.isCorrect))
                ) {
                  return (
                    <GradientCard variant="primary" className="p-8 text-center">
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="text-6xl mb-6 animate-float">🏆</div>
                        <h3 className="text-2xl font-bold mb-4 text-solana-purple">
                          All Done For Today!
                        </h3>
                        <p className="mb-4 text-center max-w-md text-indigo-200">
                          You've completed today's puzzle. Come back tomorrow
                          for a new challenge!
                        </p>
                        <div className="inline-block bg-purple-900/50 px-4 py-2 rounded-md text-sm text-indigo-200">
                          Next puzzle:{" "}
                          {format(
                            new Date(new Date().setDate(new Date().getDate() + 1)),
                            "MMMM d, yyyy"
                          )}
                        </div>
                      </div>
                    </GradientCard>
                  );
                }
                return (
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
                      resetCounter={resetCounter}
                    />
                  </div>
                );
              }
              return (
                <GradientCard variant="primary" className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-6xl mb-6 animate-float">♟️</div>
                    <h3 className="text-2xl font-bold mb-4 text-solana-purple">
                      Start Your Chess Journey
                    </h3>
                    <p className="mb-4 text-center max-w-md text-indigo-200">
                      Complete your first puzzle attempt to begin building your
                      chess journey stats.
                    </p>
                  </div>
                </GradientCard>
              );
            })()
          )}
        </section>

        {/* Results & History Section */}
        {connected && puzzle && typeof puzzle === 'object' && puzzle !== null && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            <div>
              <AttemptCard 
                selectedMove={selectedMove} 
                elapsedTime={elapsedTime}
                isCheckingMove={isCheckingMove}
                currentAttempt={currentAttempt || 0}
                result={attemptResult}
                attempts={Array.isArray(attempts) ? attempts : []}
              />
            </div>
            <div>
              <NFTPreviewCard 
                bestAttempt={bestAttempt} 
                attempts={Array.isArray(attempts) ? attempts : []}
              />
            </div>
          </section>
        )}
        
        {/* Personalized Recommendation Section */}
        {connected && walletAddress && (
          <section className="mb-16 max-w-4xl mx-auto animate-slide-up">
            <h2 className="text-3xl font-bold text-center mb-6 text-white">
              <span className="inline-block relative">
                Personalized Recommendations
                <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mt-2"></div>
              </span>
            </h2>
            <p className="text-center text-indigo-200 mb-10 max-w-2xl mx-auto">
              Our AI analyzes your play style and skill level to recommend puzzles that will help you improve
            </p>
            
            <RecommendedPuzzleCard 
              getRecommendedPuzzle={getRecommendedPuzzle} 
              onSelect={(recommendedPuzzle) => {
                toast({
                  title: "Puzzle Selected",
                  description: "You've selected a recommended puzzle.",
                  variant: "default",
                });
                // In a full implementation, this would load the recommended puzzle
                console.log("Selected recommended puzzle:", recommendedPuzzle);
              }}
            />
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
      
      {/* Achievement Showcase Popup */}
      <AchievementShowcase 
        isVisible={showAchievement}
        onClose={closeAchievement}
        attempt={latestAttempt}
        streakCount={streakCount}
        totalSolved={totalSolved}
      />
    </div>
  );
}
