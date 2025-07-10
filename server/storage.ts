import { 
  puzzles, users, attempts, dailyPuzzles,
  type User, type InsertUser, 
  type Puzzle, type InsertPuzzle, type PuzzleWithSolution,
  type Attempt, type InsertAttempt,
  type DailyPuzzle, type InsertDailyPuzzle,
  type AttemptWithPuzzle
} from "@shared/schema";
import { db } from './db';
import { eq, and, isNotNull } from 'drizzle-orm';

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserSessionKey(walletAddress: string, sessionKey: string): Promise<User | undefined>;
  updateUserPreferences(walletAddress: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Puzzle operations
  getPuzzle(id: number): Promise<Puzzle | undefined>;
  getAllPuzzles(): Promise<Puzzle[]>;
  createPuzzle(puzzle: InsertPuzzle): Promise<Puzzle>;
  getPuzzlesByDifficulty(difficulty: string): Promise<Puzzle[]>;
  getPuzzlesByThemes(themes: string[]): Promise<Puzzle[]>;
  
  // Attempt operations
  getAttempt(id: number): Promise<Attempt | undefined>;
  getAttemptsByUserAndPuzzle(userId: string, puzzleId: number): Promise<Attempt[]>;
  getAllAttemptsByUser(userId: string): Promise<Attempt[]>;
  getAllAttemptsByUserWithPuzzle(userId: string): Promise<AttemptWithPuzzle[]>;
  createAttempt(attempt: InsertAttempt): Promise<Attempt>;
  updateAttemptMintStatus(attemptId: number, mintedNftAddress: string): Promise<Attempt | undefined>;
  getMintedAttemptsForUser(userId: string): Promise<Attempt[]>;
  
  // Daily puzzle operations
  getDailyPuzzleByDate(dateStr: string): Promise<DailyPuzzle | undefined>;
  createDailyPuzzle(dailyPuzzle: InsertDailyPuzzle): Promise<DailyPuzzle>;
  getRecommendedPuzzleForUser(walletAddress: string): Promise<PuzzleWithSolution | null>;
}

class PgStorage implements IStorage {
  // User operations
  async getUser(id: number) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  async getUserByWalletAddress(walletAddress: string) {
    const result = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return result[0];
  }
  async createUser(user: InsertUser) {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
  async updateUserSessionKey(walletAddress: string, sessionKey: string) {
    const result = await db.update(users).set({ sessionKey }).where(eq(users.walletAddress, walletAddress)).returning();
    return result[0];
  }
  async updateUserPreferences(walletAddress: string, updates: Partial<User>) {
    const result = await db.update(users).set(updates).where(eq(users.walletAddress, walletAddress)).returning();
    return result[0];
  }

  // Puzzle operations
  async getPuzzle(id: number) {
    const result = await db.select().from(puzzles).where(eq(puzzles.id, id));
    return result[0];
  }
  async getAllPuzzles() {
    return await db.select().from(puzzles);
  }
  async createPuzzle(puzzle: InsertPuzzle) {
    const result = await db.insert(puzzles).values(puzzle).returning();
    return result[0];
  }
  async getPuzzlesByDifficulty(difficulty: string) {
    return await db.select().from(puzzles).where(eq(puzzles.difficulty, difficulty));
  }
  async getPuzzlesByThemes(themes: string[]) {
    // This is a simple filter; for more advanced, use array overlap in SQL
    const all = await db.select().from(puzzles);
    return all.filter(p => p.themes && p.themes.some(t => themes.includes(t)));
  }

  // Attempt operations
  async getAttempt(id: number) {
    const result = await db.select().from(attempts).where(eq(attempts.id, id));
    return result[0];
  }
  async getAttemptsByUserAndPuzzle(userId: string, puzzleId: number) {
    return await db.select().from(attempts).where(and(eq(attempts.userId, userId), eq(attempts.puzzleId, puzzleId)));
  }
  async getAllAttemptsByUser(userId: string) {
    return await db.select().from(attempts).where(eq(attempts.userId, userId));
  }
  async getAllAttemptsByUserWithPuzzle(userId: string) {
    const userAttempts = await db.select().from(attempts).where(eq(attempts.userId, userId));
    const allPuzzles = await db.select().from(puzzles);
    return userAttempts.map(attempt => {
      const puzzle = allPuzzles.find(p => p.id === attempt.puzzleId);
      return { ...attempt, puzzle: puzzle! };
    });
  }
  async createAttempt(attempt: InsertAttempt) {
    const result = await db.insert(attempts).values(attempt).returning();
    return result[0];
  }
  async updateAttemptMintStatus(attemptId: number, mintedNftAddress: string) {
    const result = await db.update(attempts).set({ mintedNftAddress }).where(eq(attempts.id, attemptId)).returning();
    return result[0];
  }
  async getMintedAttemptsForUser(userId: string) {
    return await db.select().from(attempts).where(and(eq(attempts.userId, userId), isNotNull(attempts.mintedNftAddress)));
  }

  // Daily puzzle operations
  async getDailyPuzzleByDate(dateStr: string) {
    const date = new Date(dateStr);
    const result = await db.select().from(dailyPuzzles).where(eq(dailyPuzzles.puzzleDate, date));
    return result[0];
  }
  async createDailyPuzzle(dailyPuzzle: InsertDailyPuzzle) {
    const result = await db.insert(dailyPuzzles).values(dailyPuzzle).returning();
    return result[0];
  }
  async getRecommendedPuzzleForUser(walletAddress: string) {
    // You can copy the logic from MemStorage or keep it simple for now
    return null;
  }
}

export const storage = new PgStorage();
