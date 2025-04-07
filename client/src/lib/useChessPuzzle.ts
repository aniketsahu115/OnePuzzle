import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from './queryClient';
import { queryClient } from './queryClient';
import { useWallet } from './useWallet';
import { Attempt, PuzzleWithoutSolution } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export function useChessPuzzle() {
  const { connected, walletAddress } = useWallet();
  const { toast } = useToast();
  
  // All state hooks need to be called before any other hooks or logic
  const [selectedMove, setSelectedMove] = useState<string | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<number>(1);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isLoadingState, setIsLoadingState] = useState(true);
  const [showRecommendation, setShowRecommendation] = useState<boolean>(false);
  
  // Achievement tracking
  const [showAchievement, setShowAchievement] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [totalSolved, setTotalSolved] = useState<number>(0);
  const [latestAttempt, setLatestAttempt] = useState<Attempt | null>(null);
  
  // Various chess positions for a more dynamic experience
  const chessPuzzles = [
    {
      id: 1,
      fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
      difficulty: 'medium',
      toMove: 'w'
    },
    {
      id: 2,
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      difficulty: 'easy',
      toMove: 'w'
    },
    {
      id: 3,
      fen: 'rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 4',
      difficulty: 'hard',
      toMove: 'w'
    },
    {
      id: 4,
      fen: 'r1bqk2r/ppp2ppp/2n1pn2/3p4/1bPP4/2NBP3/PP3PPP/R1BQK1NR b KQkq - 1 5',
      difficulty: 'medium',
      toMove: 'b'
    },
    {
      id: 5,
      fen: 'r3kb1r/pp3ppp/2pp1n2/4p3/8/3P1N2/PPP2PPP/R1B1K2R b KQkq - 0 10',
      difficulty: 'hard',
      toMove: 'b'
    },
  ];
  
  // Generate a dynamic puzzle based on wallet address
  const generatePuzzle = (): PuzzleWithoutSolution => {
    if (!walletAddress) {
      return chessPuzzles[0];
    }
    
    // Use the wallet address to get a consistent puzzle (but different per user)
    const addressSeed = walletAddress ? 
      parseInt(walletAddress.substring(walletAddress.length - 4), 16) : 0;
    
    // Choose a puzzle based on the wallet address
    const puzzleIndex = addressSeed % chessPuzzles.length;
    return chessPuzzles[puzzleIndex];
  };
  
  // Dynamic puzzle based on wallet address
  const samplePuzzle: PuzzleWithoutSolution = generatePuzzle();
  
  // Simulate loading delay
  useEffect(() => {
    // Always set loading state to false after a delay, whether connected or not
    const timer = setTimeout(() => {
      setIsLoadingState(false);
      console.log('Loading state set to false');
    }, 1000);
    return () => clearTimeout(timer);
  }, [connected]);
  
  // Fetch today's puzzle - using sample data for development
  // In production this would use the actual API
  /*
  const {
    data: puzzleData,
    isLoading,
    refetch: refetchPuzzle
  } = useQuery({
    queryKey: ['/api/puzzles/today'],
    enabled: connected,
  });
  */
  
  // Development version
  // Provide a puzzle based on connection status
  const puzzleData = !isLoadingState ? (connected ? samplePuzzle : null) : null;
  const isLoading = isLoadingState;
  const refetchPuzzle = () => console.log('Refetching puzzle...');
  
  // Type assertion for puzzle
  const puzzle = (puzzleData || {}) as PuzzleWithoutSolution;

  // Get a random difficulty for testing purposes
  const getRandomDifficulty = (): 'easy' | 'medium' | 'hard' => {
    const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  };
  
  // Generate dynamic attempts for development based on connected wallet
  const generateAttempts = (): Attempt[] => {
    if (!connected || !walletAddress) return [];
    
    // Use the wallet address to get a consistent number (but different per user)
    const addressSeed = walletAddress ? 
      parseInt(walletAddress.substring(walletAddress.length - 6), 16) : 0;
    
    // Determine number of attempts (0-3) based on the wallet address
    const numAttempts = addressSeed % 4; // 0, 1, 2, or 3 attempts
    
    // Generate attempts
    const attempts: Attempt[] = [];
    
    for (let i = 0; i < numAttempts; i++) {
      const isCorrect = i === numAttempts - 1; // Last attempt is correct
      const possibleMoves = ['d4', 'e5', 'Nf3', 'Qh5', 'Bc4'];
      
      attempts.push({
        id: i + 1,
        puzzleId: 1,
        userId: walletAddress,
        move: possibleMoves[i % possibleMoves.length],
        timeTaken: 20 + (i * 15), // Progressively longer times
        isCorrect: isCorrect,
        attemptNumber: i + 1,
        attemptDate: new Date(Date.now() - (3600000 * (numAttempts - i))), // Spaced out in the past
        mintedNftAddress: isCorrect && (addressSeed % 7 === 0) ? 
          `solana${walletAddress.substring(5, 15)}` : null // 1/7 chance of having a minted NFT
      });
    }
    
    return attempts;
  };
  
  // Dynamic attempts based on wallet address
  const sampleAttempts: Attempt[] = generateAttempts();
  
  // Fetch user's attempts for today's puzzle - using sample data for development
  // In production, this would use the actual API
  /*
  const {
    data: attemptsData = [],
    refetch: refetchAttempts
  } = useQuery({
    queryKey: ['/api/attempts', walletAddress],
    enabled: connected && !!puzzle?.id && !!walletAddress,
  });
  */
  
  // Development version
  const attemptsData = !isLoadingState && walletAddress ? sampleAttempts : [];
  const refetchAttempts = () => console.log('Refetching attempts...');

  // Type assertion for attempts
  const attempts = (attemptsData || []) as Attempt[];

  // Get best attempt (correct and fastest)
  const bestAttempt = attempts && attempts.length > 0
    ? attempts.reduce((best: Attempt | null, current: Attempt) => {
        if (!best) return current;
        if (current.isCorrect && !best.isCorrect) return current;
        if (current.isCorrect && best.isCorrect && current.timeTaken < best.timeTaken) return current;
        return best;
      }, null)
    : null;

  // Start timer when puzzle is loaded and wallet is connected
  useEffect(() => {
    console.log('Timer state check:', { 
      connected, 
      puzzleLoaded: !!puzzle, 
      attemptsLeft: attempts.length < 3, 
      bestCorrect: bestAttempt?.isCorrect 
    });
    
    // Always start the timer if connected and puzzle is loaded and no correct solution yet
    if (connected && puzzle && attempts.length < 3 && !bestAttempt?.isCorrect) {
      console.log('Starting timer for puzzle solving');
      setIsTimerRunning(true);
    } else {
      console.log('Stopping timer');
      setIsTimerRunning(false);
    }
    
    // Set current attempt based on attempts history
    if (attempts.length > 0) {
      setCurrentAttempt(attempts.length + 1);
    } else {
      setCurrentAttempt(1);
    }
  }, [connected, puzzle, attempts, bestAttempt]);

  // Timer logic with more reliable timing
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let previousTime = Date.now();
    let accumulatedTime = elapsedTime;
    
    if (isTimerRunning) {
      console.log('Timer started running with initial time:', elapsedTime);
      
      // Use requestAnimationFrame for more precise timing
      interval = setInterval(() => {
        const currentTime = Date.now();
        const deltaTime = (currentTime - previousTime) / 1000;
        previousTime = currentTime;
        
        // Add the elapsed time to our accumulator
        accumulatedTime += deltaTime;
        
        // Update the state with the integer value
        setElapsedTime(Math.floor(accumulatedTime));
      }, 200); // Run frequently to keep the timer smooth
    }
    
    return () => {
      if (interval) {
        console.log('Clearing timer interval, final time:', Math.floor(accumulatedTime));
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, elapsedTime]);

  // Mutation for submitting an attempt
  const { mutate: submitAttempt, isPending: isCheckingMove } = useMutation({
    mutationFn: async () => {
      if (!puzzle || !selectedMove || !walletAddress) return null;
      
      // This is a temporary simulation for development
      // In production this would make a real API call
      console.log("Submitting attempt with move:", selectedMove);
      
      // Simulate API response for development
      return {
        success: true,
        isCorrect: true,
        id: Date.now(),
        puzzleId: puzzle.id,
        userId: walletAddress,
        move: selectedMove,
        timeTaken: elapsedTime,
        attemptNumber: currentAttempt,
        attemptDate: new Date(),
        mintedNftAddress: null
      };
      
      // Commented out real API call for now
      /*
      const response = await apiRequest('POST', '/api/attempts', {
        userId: walletAddress,
        puzzleId: puzzle.id,
        move: selectedMove,
        timeTaken: elapsedTime,
        attemptNumber: currentAttempt
      });
      
      return response.json();
      */
    },
    onSuccess: (data) => {
      // Store the attempt data for achievement showcase
      if (data) {
        setLatestAttempt(data);
        
        // Update tracking counters
        if (data.isCorrect) {
          // Increment streak count for consecutive correct solutions
          setStreakCount(prev => prev + 1);
          
          // Increment total solved puzzles
          setTotalSolved(prev => prev + 1);
          
          // Show achievement showcase popup
          setShowAchievement(true);
          
          toast({
            title: "Correct move!",
            description: "You found the best move for this position.",
            variant: "default",
          });
        } else {
          // Reset streak on incorrect moves
          setStreakCount(0);
          
          toast({
            title: "Incorrect move",
            description: currentAttempt < 3 
              ? `You have ${3 - currentAttempt} more attempts remaining.` 
              : "You've used all your attempts for today.",
            variant: "destructive",
          });
        }
      }
      
      // Reset timer and selected move
      setIsTimerRunning(false);
      setSelectedMove(null);
      
      // Refresh attempts data
      queryClient.invalidateQueries({ queryKey: ['/api/attempts', walletAddress] });
    },
    onError: (error) => {
      toast({
        title: "Error submitting move",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive",
      });
    }
  });

  // Reset the board
  const resetBoard = useCallback(() => {
    setSelectedMove(null);
    // Don't reset timer, let it continue
  }, []);

  // Make an attempt
  const makeAttempt = useCallback(async () => {
    if (currentAttempt > 3) {
      toast({
        title: "No attempts remaining",
        description: "You've used all your attempts for today.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedMove) {
      toast({
        title: "No move selected",
        description: "Please select a move before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    await submitAttempt();
  }, [currentAttempt, selectedMove, submitAttempt, toast]);

  // Add puzzle recommendation handling
  const toggleRecommendation = useCallback(() => {
    setShowRecommendation(prev => !prev);
  }, []);
  
  // Get recommended puzzle (simulation for development)
  const getRecommendedPuzzle = useCallback(async (): Promise<PuzzleWithoutSolution | null> => {
    if (!connected || !walletAddress) return null;
    
    // This is a temporary simulation for development
    // In a real app, this would call the recommendation API
    const themes = ["fork", "attack", "checkmate", "tactics"];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const difficulties = ["easy", "medium", "hard"];
    const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    
    // Return a sample recommended puzzle
    const recommendedPuzzle: PuzzleWithoutSolution = {
      id: 999, // Special ID for recommended puzzle
      fen: samplePuzzle.fen, // Reuse FEN from sample puzzle
      difficulty: randomDifficulty,
      toMove: samplePuzzle.toMove,
      themes: [randomTheme],
      isRecommended: true,
      recommendationReason: `This is a ${randomDifficulty} puzzle featuring a ${randomTheme} tactic that matches your skill level.`
    };
    
    return recommendedPuzzle;
    
    /* In production, this would be:
    try {
      const response = await apiRequest('GET', `/api/puzzles/recommended?walletAddress=${walletAddress}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to get recommended puzzle:', error);
      return null;
    }
    */
  }, [connected, walletAddress, samplePuzzle]);
  
  // Add function to toggle achievement showcase visibility 
  const closeAchievement = useCallback(() => {
    setShowAchievement(false);
  }, []);
  
  return {
    puzzle,
    isLoading,
    attempts,
    currentAttempt,
    selectedMove,
    setSelectedMove,
    makeAttempt,
    resetBoard,
    elapsedTime,
    isCheckingMove,
    bestAttempt,
    refetchPuzzle,
    refetchAttempts,
    showRecommendation,
    toggleRecommendation,
    getRecommendedPuzzle,
    
    // Achievement related properties
    showAchievement,
    closeAchievement,
    streakCount,
    totalSolved,
    latestAttempt
  };
}
