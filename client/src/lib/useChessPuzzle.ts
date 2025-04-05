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
  
  // Sample puzzle for development
  const samplePuzzle: PuzzleWithoutSolution = {
    id: 1,
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
    difficulty: 'medium',
    toMove: 'w'
  };
  
  // Simulate loading delay
  useEffect(() => {
    if (connected) {
      const timer = setTimeout(() => {
        setIsLoadingState(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
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
  const puzzleData = connected && !isLoadingState ? samplePuzzle : null;
  const isLoading = isLoadingState;
  const refetchPuzzle = () => console.log('Refetching puzzle...');
  
  // Type assertion for puzzle
  const puzzle = (puzzleData || {}) as PuzzleWithoutSolution;

  // Sample attempts for development
  const sampleAttempts: Attempt[] = connected ? [
    {
      id: 1,
      puzzleId: 1,
      userId: walletAddress || 'user123',
      move: 'd4',
      timeTaken: 45,
      isCorrect: true,
      attemptNumber: 1,
      attemptDate: new Date(),
      mintedNftAddress: null
    }
  ] : [];
  
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
    if (connected && puzzle && attempts.length < 3 && !bestAttempt?.isCorrect) {
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }
    
    // Set current attempt based on attempts history
    if (attempts.length > 0) {
      setCurrentAttempt(attempts.length + 1);
    } else {
      setCurrentAttempt(1);
    }
  }, [connected, puzzle, attempts, bestAttempt]);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedTime(time => time + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

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
      // Show success/failure message
      if (data?.isCorrect) {
        toast({
          title: "Correct move!",
          description: "You found the best move for this position.",
          variant: "default",
        });
      } else {
        toast({
          title: "Incorrect move",
          description: currentAttempt < 3 
            ? `You have ${3 - currentAttempt} more attempts remaining.` 
            : "You've used all your attempts for today.",
          variant: "destructive",
        });
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
    refetchAttempts
  };
}
