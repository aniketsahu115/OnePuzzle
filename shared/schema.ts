import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Chess puzzles table
export const puzzles = pgTable("puzzles", {
  id: serial("id").primaryKey(),
  fen: text("fen").notNull(), // Position in FEN notation
  pgn: text("pgn").notNull(), // Full puzzle PGN
  difficulty: text("difficulty").notNull(), // easy, medium, hard
  solution: text("solution").notNull(), // Solution in algebraic notation
  dateAssigned: timestamp("date_assigned").notNull(),
  toMove: text("to_move").notNull(), // 'w' for white, 'b' for black
  themes: text("themes").array(), // Chess themes (tactics) like "fork", "pin", "discovery", etc.
  rating: integer("rating").default(1500), // Rating of the puzzle (difficulty measure)
  popularity: integer("popularity").default(0), // How many times the puzzle has been played
  successPercentage: integer("success_percentage").default(0), // Success rate for this puzzle
});

// User attempts table
export const attempts = pgTable("attempts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Solana public key
  puzzleId: integer("puzzle_id").notNull(),
  move: text("move").notNull(), // The move attempted
  isCorrect: boolean("is_correct").notNull(),
  timeTaken: integer("time_taken").notNull(), // Time in seconds
  attemptDate: timestamp("attempt_date").defaultNow().notNull(),
  attemptNumber: integer("attempt_number").notNull(), // 1, 2, or 3
  mintedNftAddress: text("minted_nft_address"), // Address of the minted NFT, if any
});

// User profiles table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(), // Solana public key
  username: text("username"), // Optional username
  lastPuzzleDate: timestamp("last_puzzle_date"), // Last date a puzzle was attempted
  sessionKey: text("session_key"), // Gum session key
  skillLevel: text("skill_level").default('beginner'), // beginner, intermediate, advanced
  preferredDifficulty: text("preferred_difficulty").default('medium'), // easy, medium, hard
  successRate: integer("success_rate").default(0), // 0-100 percentage
  completedPuzzles: integer("completed_puzzles").default(0), // Count of puzzles completed
  preferredThemes: text("preferred_themes").array(), // Tactical themes the user excels at or prefers
  lastRecommendationDate: timestamp("last_recommendation_date"), // When the last recommendation was made
});

// Daily puzzle records table
export const dailyPuzzles = pgTable("daily_puzzles", {
  id: serial("id").primaryKey(),
  puzzleId: integer("puzzle_id").notNull(),
  puzzleDate: timestamp("puzzle_date").notNull().unique(),
});

// Schemas for data insertion
export const insertPuzzleSchema = createInsertSchema(puzzles).omit({
  id: true,
});

export const insertAttemptSchema = createInsertSchema(attempts).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertDailyPuzzleSchema = createInsertSchema(dailyPuzzles).omit({
  id: true,
});

// Types for database operations
export type InsertPuzzle = z.infer<typeof insertPuzzleSchema>;
export type Puzzle = typeof puzzles.$inferSelect;

export type InsertAttempt = z.infer<typeof insertAttemptSchema>;
export type Attempt = typeof attempts.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDailyPuzzle = z.infer<typeof insertDailyPuzzleSchema>;
export type DailyPuzzle = typeof dailyPuzzles.$inferSelect;

// Type for puzzle with solution data
export type PuzzleWithSolution = {
  id: number;
  fen: string;
  pgn: string;
  difficulty: string;
  toMove: string;
  solution: string;
  dateAssigned: Date;
  themes: string[] | null;
  rating: number | null;
  popularity: number | null;
  successPercentage: number | null;
  isRecommended?: boolean;
  recommendationReason?: string;
};

// Type for puzzle without solution data (for client)
export type PuzzleWithoutSolution = {
  id: number;
  fen: string;
  difficulty: string;
  toMove: string;
  themes: string[] | null;
  isRecommended?: boolean;
  recommendationReason?: string;
};

// Type for a complete attempt record with puzzle
export type AttemptWithPuzzle = Attempt & {
  puzzle: Puzzle;
};
