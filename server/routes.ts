import { Request, Response, NextFunction, Express } from 'express';
import * as http from 'http';
import { storage } from './storage';
import { insertAttemptSchema } from "@shared/schema";
import { getPuzzleOfTheDay, selectPuzzleForDate } from "./puzzles";
import { ZodError } from "zod";
import { fromZodError } from 'zod-validation-error';
import { Attempt, Puzzle, InsertAttempt, PuzzleWithSolution } from '@shared/schema';
import { Transaction } from '@solana/web3.js';
import { connection, mintCNFT } from './solana';
import { Buffer } from 'buffer';

// Define custom types for request body
interface AttemptRequestBody {
  attemptId: string;
  puzzleId: string;
  userWalletAddress: string;
}

interface WalletAuthRequestBody {
  walletAddress: string;
}

export async function registerRoutes(app: Express): Promise<http.Server> {
  // Set a global timeout for all routes (5 minutes)
  app.set('timeout', 300000);

  // API routes
  
  // Get today's puzzle (without solution)
  app.get('/api/puzzles/today', async (req: Request, res: Response) => {
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
  app.get('/api/puzzles/recommended', async (req: Request, res: Response) => {
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
      
      // Return puzzle without solution (and with recommendation flags)
      const { solution, ...puzzleWithoutSolution } = recommendedPuzzle as PuzzleWithSolution;
      
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

  // Get user's overall stats
  app.get('/api/stats', async (req: Request, res: Response) => {
    try {
      const walletAddress = req.query.walletAddress as string;

      if (!walletAddress) {
        return res.status(400).json({ message: "Wallet address is required" });
      }

      // Fetch all attempts for the user
      const allAttempts = await storage.getAllAttemptsByUser(walletAddress);

      if (allAttempts.length === 0) {
        return res.json({
          totalPuzzles: 0,
          correctPuzzles: 0,
          successRate: 0,
          currentStreak: 0,
          longestStreak: 0,
          avgSolveTime: 0,
        });
      }

      // Calculate stats
      const totalPuzzles = allAttempts.length;
      const correctPuzzles = allAttempts.filter(a => a.isCorrect).length;
      const successRate = totalPuzzles > 0 ? Math.round((correctPuzzles / totalPuzzles) * 100) : 0;
      const avgSolveTime = allAttempts.reduce((acc, a) => acc + a.timeTaken, 0) / totalPuzzles;

      // NOTE: Streak calculations would require more complex logic and daily tracking
      // For now, we'll return placeholder values.
      const currentStreak = 0; 
      const longestStreak = 0;

      res.json({
        totalPuzzles,
        correctPuzzles,
        successRate,
        currentStreak,
        longestStreak,
        avgSolveTime,
      });

    } catch (error) {
      res.status(500).json({ 
        message: "Failed to get user stats", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get user's attempts for today's puzzle
  app.get('/api/attempts', async (req: Request, res: Response) => {
    try {
      const walletAddress = req.query.walletAddress as string;
      
      if (!walletAddress) {
        return res.status(400).json({ message: "Wallet address is required" });
      }
      
      // Use the new method to get attempts with puzzle data
      const attempts = await storage.getAllAttemptsByUserWithPuzzle(walletAddress);
      
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to get attempts", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Submit an attempt
  app.post('/api/attempts', async (req: Request, res: Response) => {
    try {
      const attemptData: InsertAttempt = insertAttemptSchema.parse(req.body);
      
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

  // Mint NFT for an attempt
  app.post('/api/nft/mint', async (req: Request<{}, {}, AttemptRequestBody>, res: Response) => {
    try {
      const { attemptId, puzzleId, userWalletAddress } = req.body;
      
      if (!attemptId || !puzzleId || !userWalletAddress) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields' 
        });
      }

      // Get the attempt from storage
      const attempt = await storage.getAttempt(Number(attemptId));
      if (!attempt) {
        return res.status(404).json({ 
          success: false, 
          message: 'Attempt not found' 
        });
      }

      // Check if attempt is already minted
      if (attempt.mintedNftAddress) {
        return res.status(409).json({ 
          success: false, 
          message: 'Attempt already minted',
          nftAddress: attempt.mintedNftAddress
        });
      }

      // Get the puzzle data
      const puzzle = await storage.getPuzzle(Number(puzzleId));
      if (!puzzle) {
        return res.status(404).json({ 
          success: false, 
          message: 'Puzzle not found' 
        });
      }

      // Create NFT metadata and mint it directly on the server
      const nftAddress = await mintCNFT(attempt, puzzle);
      
      // Update the attempt with the minted NFT address
      await storage.updateAttemptMintStatus(attempt.id, nftAddress);

      // Return the minted NFT address
      return res.status(201).json({
        success: true,
        nftAddress: nftAddress
      });
    } catch (error) {
      console.error('Error in /api/nft/mint:', error);
      return res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to mint NFT' 
      });
    }
  });

  // Wallet authentication (simulated)
  app.post('/api/auth/wallet', async (req: Request<{}, {}, WalletAuthRequestBody>, res: Response) => {
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

  // Confirm NFT minting - for client-side minting with wallet signing
  app.post('/api/nft/confirm', async (req, res) => {
    try {
      const { attemptId, signedTransaction } = req.body;
      
      if (!attemptId || !signedTransaction) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields' 
        });
      }

      if (!connection) {
        return res.status(500).json({ 
          success: false, 
          message: 'Solana connection not initialized' 
        });
      }

      // Get the attempt to verify it exists and isn't already minted
      const attempt = await storage.getAttempt(Number(attemptId));
      if (!attempt) {
        return res.status(404).json({ 
          success: false, 
          message: 'Attempt not found' 
        });
      }

      if (attempt.mintedNftAddress) {
        return res.status(409).json({ 
          success: false, 
          message: 'Attempt already minted',
          txSignature: attempt.mintedNftAddress
        });
      }

      // Deserialize the signed transaction
      const transaction = Transaction.from(Buffer.from(signedTransaction, 'base64'));

      // Send the transaction
      const txSignature = await connection.sendRawTransaction(transaction.serialize());

      // Confirm the transaction
      await connection.confirmTransaction(txSignature, 'confirmed');

      // Update the attempt with the transaction signature
      await storage.updateAttemptMintStatus(attempt.id, txSignature);

      return res.status(200).json({
        success: true,
        txSignature: txSignature,
        message: 'NFT minted and confirmed successfully'
      });
    } catch (error) {
      console.error('Error in /api/nft/confirm:', error);
      return res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to confirm NFT mint' 
      });
    }
  });

  // Associate a minted NFT with an attempt
  app.post('/api/nft/associate', async (req, res) => {
    try {
      const { attemptId, mintAddress } = req.body;

      if (!attemptId || !mintAddress) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      await storage.updateAttemptMintStatus(Number(attemptId), mintAddress);

      return res.status(200).json({
        success: true,
        message: 'NFT address associated with attempt successfully'
      });
    } catch (error) {
      console.error('Error in /api/nft/associate:', error);
      return res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to associate NFT' 
      });
    }
  });

  // Get all of a user's minted NFTs
  app.get('/api/nfts/:walletAddress', async (req: Request, res: Response) => {
    try {
      const { walletAddress } = req.params;
      if (!walletAddress) {
        return res.status(400).json({ message: "Wallet address is required" });
      }

      // This storage method should return all attempts that have a mint address
      const mintedAttempts = await storage.getMintedAttemptsForUser(walletAddress);
      
      res.json({ nfts: mintedAttempts });

    } catch (error) {
      res.status(500).json({ 
        message: "Failed to get user's NFTs", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = http.createServer(app);
  return httpServer;
}