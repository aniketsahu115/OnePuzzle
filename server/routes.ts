import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAttemptSchema } from "@shared/schema";
import { getPuzzleOfTheDay, selectPuzzleForDate } from "./puzzles";
import { mintCNFT, setupSolanaConnection } from "./solana";
import { ZodError } from "zod";
import { fromZodError } from 'zod-validation-error';

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up Solana connection
  setupSolanaConnection();

  // API routes
  
  // Get today's puzzle (without solution)
  app.get('/api/puzzles/today', async (req, res) => {
    try {
      const puzzle = await getPuzzleOfTheDay();
      
      if (!puzzle) {
        return res.status(404).json({ 
          message: "No puzzle available for today"
        });
      }
      
      // Return puzzle without the solution
      const { solution, ...puzzleWithoutSolution } = puzzle;
      
      res.json(puzzleWithoutSolution);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to get today's puzzle", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });
  
  // Get personalized recommended puzzle for user
  app.get('/api/puzzles/recommended', async (req, res) => {
    try {
      const walletAddress = req.query.walletAddress as string;
      
      if (!walletAddress) {
        return res.status(400).json({ message: "Wallet address is required" });
      }
      
      // Get a user-specific recommended puzzle
      const recommendedPuzzle = await storage.getRecommendedPuzzleForUser(walletAddress);
      
      if (!recommendedPuzzle) {
        return res.status(404).json({ message: "No recommendation available" });
      }
      
      // Return puzzle without solution
      const { solution, ...puzzleWithoutSolution } = recommendedPuzzle;
      
      res.json({
        ...puzzleWithoutSolution,
        isRecommended: true,
        recommendationReason: recommendedPuzzle.recommendationReason || "This puzzle is recommended based on your skill level."
      });
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to get recommended puzzle", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get user's attempts for today's puzzle
  app.get('/api/attempts', async (req, res) => {
    try {
      const walletAddress = req.query.walletAddress as string;
      
      if (!walletAddress) {
        return res.status(400).json({ message: "Wallet address is required" });
      }
      
      const dailyPuzzle = await getPuzzleOfTheDay();
      
      if (!dailyPuzzle) {
        return res.status(404).json({ message: "No puzzle available for today" });
      }
      
      const attempts = await storage.getAttemptsByUserAndPuzzle(walletAddress, dailyPuzzle.id);
      
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to get attempts", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Submit an attempt
  app.post('/api/attempts', async (req, res) => {
    try {
      const attemptData = insertAttemptSchema.parse(req.body);
      
      // Get the puzzle to check the solution
      const puzzle = await storage.getPuzzle(attemptData.puzzleId);
      
      if (!puzzle) {
        return res.status(404).json({ message: "Puzzle not found" });
      }
      
      // Check if user has already made 3 attempts
      const existingAttempts = await storage.getAttemptsByUserAndPuzzle(
        attemptData.userId, 
        attemptData.puzzleId
      );
      
      if (existingAttempts.length >= 3) {
        return res.status(400).json({ 
          message: "You've already used all 3 attempts for today's puzzle" 
        });
      }
      
      // Check if the move is correct
      const isCorrect = attemptData.move.toLowerCase() === puzzle.solution.toLowerCase();
      
      // Create the attempt
      const attempt = await storage.createAttempt({
        ...attemptData,
        isCorrect,
      });
      
      res.status(201).json(attempt);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Invalid attempt data", 
          error: validationError.message 
        });
      }
      
      res.status(500).json({ 
        message: "Failed to submit attempt", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Mint NFT from attempt
  app.post('/api/nft/mint', async (req, res) => {
    try {
      const { attemptId } = req.body;
      
      if (!attemptId) {
        return res.status(400).json({ message: "Attempt ID is required" });
      }
      
      // Get the attempt
      const attempt = await storage.getAttempt(attemptId);
      
      if (!attempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }
      
      // Check if attempt is already minted
      if (attempt.mintedNftAddress) {
        return res.status(400).json({ 
          message: "This attempt has already been minted", 
          txSignature: attempt.mintedNftAddress 
        });
      }
      
      // Get the puzzle
      const puzzle = await storage.getPuzzle(attempt.puzzleId);
      
      if (!puzzle) {
        return res.status(404).json({ message: "Puzzle not found" });
      }
      
      // Mint the NFT
      const txSignature = await mintCNFT(attempt, puzzle);
      
      // Update the attempt with the NFT address
      await storage.updateAttemptMintStatus(attemptId, txSignature);
      
      res.json({ 
        success: true, 
        txSignature,
        message: "NFT minted successfully" 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Failed to mint NFT", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Wallet authentication (simulated)
  app.post('/api/auth/wallet', async (req, res) => {
    try {
      const { walletAddress } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({ 
          message: "Wallet address is required" 
        });
      }
      
      // In a real implementation, this would verify with Seed Vault
      // For now, just check if the user exists or create a new one
      let user = await storage.getUserByWalletAddress(walletAddress);
      
      if (!user) {
        user = await storage.createUser({
          walletAddress,
          sessionKey: 'simulated-session-key', // In real app, would use Gum session key
        });
      }
      
      res.json({ 
        verified: true, 
        user 
      });
    } catch (error) {
      res.status(500).json({ 
        verified: false,
        message: "Failed to verify wallet", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
