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
      // Ensure the recommendedPuzzle is correctly typed to include recommendationReason
      const { solution, ...puzzleWithoutSolution } = recommendedPuzzle as PuzzleWithSolution; // Cast to PuzzleWithSolution
      
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
  app.get('/api/attempts', async (req: Request, res: Response) => {
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
  app.post('/api/nft/mint', async (req: Request, res: Response) => {
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
      // Fix: mintCNFT only takes (attempt, puzzle)
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
  app.post('/api/auth/wallet', async (req: Request, res: Response) => {
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

  // Confirm NFT minting - THIS ROUTE IS NO LONGER NEEDED FOR SERVER-SIDE MINTING
  // app.post('/api/nft/confirm', async (req, res) => {
  //   try {
  //     const { attemptId, signedTransaction } = req.body;
  //     
  //     if (!attemptId || !signedTransaction) {
  //       return res.status(400).json({ 
  //         success: false, 
  //         message: 'Missing required fields' 
  //       });
  //     }
  //
  //     if (!connection) {
  //       return res.status(500).json({ 
  //         success: false, 
  //         message: 'Solana connection not initialized' 
  //       });
  //     }
  //
  //     // Deserialize the signed transaction
  //     const transaction = Transaction.from(Buffer.from(signedTransaction, 'base64'));
  //
  //     // Send the transaction
  //     const txSignature = await connection.sendRawTransaction(transaction.serialize());
  //
  //     // Confirm the transaction
  //     await connection.confirmTransaction(txSignature, 'confirmed');
  //
  //     // Update the attempt with the minted NFT address
  //     await storage.updateAttempt(Number(attemptId), { mintedNftAddress: txSignature });
  //
  //     return res.status(200).json({
  //       success: true,
  //       txSignature: txSignature,
  //       message: 'NFT minted and confirmed successfully'
  //     });
  //   } catch (error) {
  //     console.error('Error in /api/nft/confirm:', error);
  //     return res.status(500).json({ 
  //       success: false, 
  //       message: error instanceof Error ? error.message : 'Failed to confirm NFT mint' 
  //     });
  //   }
  // });

  const httpServer = http.createServer(app);
  return httpServer;
}