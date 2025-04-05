import { 
  puzzles, users, attempts, dailyPuzzles,
  type User, type InsertUser, 
  type Puzzle, type PuzzleWithSolution, type InsertPuzzle,
  type Attempt, type InsertAttempt,
  type DailyPuzzle, type InsertDailyPuzzle 
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserSessionKey(walletAddress: string, sessionKey: string): Promise<User | undefined>;
  
  // Puzzle operations
  getPuzzle(id: number): Promise<PuzzleWithSolution | undefined>;
  getAllPuzzles(): Promise<PuzzleWithSolution[]>;
  createPuzzle(puzzle: InsertPuzzle): Promise<PuzzleWithSolution>;
  
  // Attempt operations
  getAttempt(id: number): Promise<Attempt | undefined>;
  getAttemptsByUserAndPuzzle(userId: string, puzzleId: number): Promise<Attempt[]>;
  createAttempt(attempt: InsertAttempt): Promise<Attempt>;
  updateAttemptMintStatus(attemptId: number, mintedNftAddress: string): Promise<Attempt | undefined>;
  
  // Daily puzzle operations
  getDailyPuzzleByDate(dateStr: string): Promise<DailyPuzzle | undefined>;
  createDailyPuzzle(dailyPuzzle: InsertDailyPuzzle): Promise<DailyPuzzle>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private puzzles: Map<number, PuzzleWithSolution>;
  private attempts: Map<number, Attempt>;
  private dailyPuzzles: Map<string, DailyPuzzle>;
  
  private userIdCounter: number;
  private puzzleIdCounter: number;
  private attemptIdCounter: number;
  private dailyPuzzleIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.puzzles = new Map();
    this.attempts = new Map();
    this.dailyPuzzles = new Map();
    
    this.userIdCounter = 1;
    this.puzzleIdCounter = 1;
    this.attemptIdCounter = 1;
    this.dailyPuzzleIdCounter = 1;
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserSessionKey(walletAddress: string, sessionKey: string): Promise<User | undefined> {
    const user = await this.getUserByWalletAddress(walletAddress);
    if (!user) return undefined;
    
    const updatedUser: User = { ...user, sessionKey };
    this.users.set(user.id, updatedUser);
    return updatedUser;
  }
  
  // Puzzle operations
  async getPuzzle(id: number): Promise<PuzzleWithSolution | undefined> {
    return this.puzzles.get(id);
  }
  
  async getAllPuzzles(): Promise<PuzzleWithSolution[]> {
    return Array.from(this.puzzles.values());
  }
  
  async createPuzzle(insertPuzzle: InsertPuzzle): Promise<PuzzleWithSolution> {
    const id = this.puzzleIdCounter++;
    const puzzle: PuzzleWithSolution = { ...insertPuzzle as PuzzleWithSolution, id };
    this.puzzles.set(id, puzzle);
    return puzzle;
  }
  
  // Attempt operations
  async getAttempt(id: number): Promise<Attempt | undefined> {
    return this.attempts.get(id);
  }
  
  async getAttemptsByUserAndPuzzle(userId: string, puzzleId: number): Promise<Attempt[]> {
    return Array.from(this.attempts.values()).filter(
      (attempt) => attempt.userId === userId && attempt.puzzleId === puzzleId
    );
  }
  
  async createAttempt(insertAttempt: InsertAttempt): Promise<Attempt> {
    const id = this.attemptIdCounter++;
    const now = new Date();
    const attempt: Attempt = { 
      ...insertAttempt,
      id,
      attemptDate: insertAttempt.attemptDate || now
    };
    this.attempts.set(id, attempt);
    return attempt;
  }
  
  async updateAttemptMintStatus(attemptId: number, mintedNftAddress: string): Promise<Attempt | undefined> {
    const attempt = await this.getAttempt(attemptId);
    if (!attempt) return undefined;
    
    const updatedAttempt: Attempt = { ...attempt, mintedNftAddress };
    this.attempts.set(attemptId, updatedAttempt);
    return updatedAttempt;
  }
  
  // Daily puzzle operations
  async getDailyPuzzleByDate(dateStr: string): Promise<DailyPuzzle | undefined> {
    const date = new Date(dateStr);
    return Array.from(this.dailyPuzzles.values()).find(
      (dailyPuzzle) => {
        const puzzleDate = new Date(dailyPuzzle.puzzleDate);
        return puzzleDate.toISOString().split('T')[0] === date.toISOString().split('T')[0];
      }
    );
  }
  
  async createDailyPuzzle(insertDailyPuzzle: InsertDailyPuzzle): Promise<DailyPuzzle> {
    const id = this.dailyPuzzleIdCounter++;
    const dailyPuzzle: DailyPuzzle = { ...insertDailyPuzzle, id };
    
    // Use date string as key for easier lookup
    const dateStr = dailyPuzzle.puzzleDate.toISOString().split('T')[0];
    this.dailyPuzzles.set(dateStr, dailyPuzzle);
    
    return dailyPuzzle;
  }
}

export const storage = new MemStorage();
