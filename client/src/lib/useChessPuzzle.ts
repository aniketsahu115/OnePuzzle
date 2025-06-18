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
  
  // Core state
  const [selectedMove, setSelectedMove] = useState<string | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<number>(1);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isLoadingState, setIsLoadingState] = useState(true);
  const [showRecommendation, setShowRecommendation] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  
  // Achievement tracking
  const [showAchievement, setShowAchievement] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [totalSolved, setTotalSolved] = useState<number>(0);
  const [latestAttempt, setLatestAttempt] = useState<Attempt | null>(null);
  
  // Fetch daily puzzle with automatic refetch
  const {
    data: puzzleData,
    isLoading: isPuzzleLoading,
    refetch: refetchPuzzle,
    error: puzzleError
  } = useQuery({
    queryKey: ['/api/puzzles/today'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/puzzles/today');
      if (!response.ok) throw new Error('Failed to fetch daily puzzle');
      const puzzle = await response.json();
      const { solution, ...puzzleWithoutSolution } = puzzle;
      return puzzleWithoutSolution;
    },
    enabled: connected,
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
    staleTime: 10 * 60 * 1000, // Consider data stale after 10 minutes
  });

  const puzzle = !isPuzzleLoading ? puzzleData : null;

  // Simulate loading delay with proper cleanup
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingState(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [connected]);

  // Fetch attempts with real-time updates
  const {
    data: attemptsData,
    refetch: refetchAttempts,
    error: attemptsError
  } = useQuery({
    queryKey: ['/api/attempts', walletAddress, puzzle?.id],
    queryFn: async () => {
      if (!walletAddress || !puzzle?.id) return [];
      const response = await apiRequest('GET', `/api/attempts?walletAddress=${walletAddress}&puzzleId=${puzzle.id}`);
      if (!response.ok) throw new Error('Failed to fetch attempts');
      return await response.json();
    },
    enabled: !!walletAddress && !!puzzle?.id,
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    staleTime: 60 * 1000, // Consider data stale after 1 minute
  });

  // Keep attempts state in sync with backend
  useEffect(() => {
    if (attemptsData) {
      setAttempts(attemptsData);
      // Update achievement stats
      const correctAttempts = attemptsData.filter((a: Attempt) => a.isCorrect).length;
      setTotalSolved(correctAttempts);
      
      // Calculate streak
      const sortedAttempts = [...attemptsData].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      let currentStreak = 0;
      for (const attempt of sortedAttempts) {
        if (attempt.isCorrect) currentStreak++;
        else break;
      }
      setStreakCount(currentStreak);
    }
  }, [attemptsData]);

  // Reset attempts when wallet or puzzle changes
  useEffect(() => {
    if (walletAddress && puzzle?.id) {
      refetchAttempts();
    } else {
      setAttempts([]);
    }
  }, [walletAddress, puzzle, refetchAttempts]);

  // Get best attempt with proper typing
  const bestAttempt = attempts && attempts.length > 0
    ? attempts.reduce((best: Attempt | null, current: Attempt) => {
        if (!best) return current;
        if (current.isCorrect && !best.isCorrect) return current;
        if (current.isCorrect && best.isCorrect && current.timeTaken < best.timeTaken) return current;
        return best;
      }, null)
    : null;

  // Timer management with proper cleanup
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let previousTime = Date.now();
    let accumulatedTime = elapsedTime;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        const currentTime = Date.now();
        const deltaTime = (currentTime - previousTime) / 1000;
        previousTime = currentTime;
        accumulatedTime += deltaTime;
        setElapsedTime(Math.floor(accumulatedTime));
      }, 200);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, elapsedTime]);

  // Start/stop timer based on game state
  useEffect(() => {
    if (connected && puzzle && attempts.length < 3 && !bestAttempt?.isCorrect) {
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }
    
    setCurrentAttempt(attempts.length + 1);
  }, [connected, puzzle, attempts, bestAttempt]);

  // Submit attempt mutation with enhanced error handling
  const { mutate: submitAttempt, isPending: isCheckingMove } = useMutation({
    mutationFn: async () => {
      if (!puzzle || !selectedMove || !walletAddress) {
        throw new Error('Missing required data for submission');
      }
      
      const response = await apiRequest('POST', '/api/attempts', {
        userId: walletAddress,
        puzzleId: puzzle.id,
        move: selectedMove,
        timeTaken: elapsedTime,
        attemptNumber: currentAttempt,
        isCorrect: false // This will be set by the server based on the solution
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit attempt');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      if (data) {
        setLatestAttempt(data);
        setAttempts(prev => [...prev, data]);
        
        if (data.isCorrect) {
          setStreakCount(prev => prev + 1);
          setTotalSolved(prev => prev + 1);
          setShowAchievement(true);
          toast({
            title: "Correct move!",
            description: "You found the best move for this position.",
            variant: "default",
          });
        } else {
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
      setIsTimerRunning(false);
      setSelectedMove(null);
      queryClient.invalidateQueries({ queryKey: ['/api/attempts', walletAddress] });
    },
    onError: (error) => {
      toast({
        title: "Error submitting move",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive",
      });
      setIsTimerRunning(false);
    }
  });

  // Reset board with proper cleanup
  const resetBoard = useCallback(() => {
    setSelectedMove(null);
  }, []);

  // Make attempt with validation
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

  // Toggle recommendation with memoization
  const toggleRecommendation = useCallback(() => {
    setShowRecommendation(prev => !prev);
  }, []);
  
  // Get recommended puzzle with proper error handling
  const getRecommendedPuzzle = useCallback(async (): Promise<PuzzleWithoutSolution | null> => {
    if (!connected || !walletAddress) return null;
    
    try {
      const response = await apiRequest('GET', `/api/puzzles/recommended?walletAddress=${walletAddress}`);
      if (!response.ok) throw new Error('Failed to get recommended puzzle');
      return await response.json();
    } catch (error) {
      console.error('Failed to get recommended puzzle:', error);
      toast({
        title: "Error fetching recommendation",
        description: "Could not load puzzle recommendation. Please try again later.",
        variant: "destructive",
      });
      return null;
    }
  }, [connected, walletAddress, toast]);
  
  // Close achievement with memoization
  const closeAchievement = useCallback(() => {
    setShowAchievement(false);
  }, []);
  
  return {
    puzzle,
    isLoading: isPuzzleLoading || isLoadingState,
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
    showRecommendation,
    toggleRecommendation,
    getRecommendedPuzzle,
    showAchievement,
    closeAchievement,
    streakCount,
    totalSolved,
    latestAttempt,
    error: puzzleError || attemptsError
  };
}
