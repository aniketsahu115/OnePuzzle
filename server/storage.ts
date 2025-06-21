import { 
  puzzles, users, attempts, dailyPuzzles,
  type User, type InsertUser, 
  type Puzzle, type InsertPuzzle, type PuzzleWithSolution,
  type Attempt, type InsertAttempt,
  type DailyPuzzle, type InsertDailyPuzzle,
  type AttemptWithPuzzle
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private puzzles: Map<number, Puzzle>;
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
    // Ensure all nullable fields are set to null if undefined
    const user: User = {
      id,
      walletAddress: insertUser.walletAddress,
      username: insertUser.username ?? null,
      lastPuzzleDate: insertUser.lastPuzzleDate ?? null,
      sessionKey: insertUser.sessionKey ?? null,
      skillLevel: insertUser.skillLevel ?? null,
      preferredDifficulty: insertUser.preferredDifficulty ?? null,
      successRate: insertUser.successRate ?? null,
      completedPuzzles: insertUser.completedPuzzles ?? null,
      preferredThemes: insertUser.preferredThemes ?? null,
      lastRecommendationDate: insertUser.lastRecommendationDate ?? null,
    };
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
  
  async updateUserPreferences(walletAddress: string, updates: Partial<User>): Promise<User | undefined> {
    const user = await this.getUserByWalletAddress(walletAddress);
    if (!user) return undefined;
    
    const updatedUser: User = { ...user, ...updates };
    this.users.set(user.id, updatedUser);
    return updatedUser;
  }
  
  // Puzzle operations
  async getPuzzle(id: number): Promise<Puzzle | undefined> {
    return this.puzzles.get(id);
  }
  
  async getAllPuzzles(): Promise<Puzzle[]> {
    return Array.from(this.puzzles.values());
  }
  
  async createPuzzle(insertPuzzle: InsertPuzzle): Promise<Puzzle> {
    const id = this.puzzleIdCounter++;
    // Type assertion to handle additional properties like pgn correctly
    const puzzle: Puzzle = { 
      id,
      fen: insertPuzzle.fen,
      pgn: (insertPuzzle as any).pgn || '', // Ensure pgn is handled
      difficulty: insertPuzzle.difficulty,
      toMove: insertPuzzle.toMove,
      solution: insertPuzzle.solution,
      themes: (insertPuzzle as any).themes || [],
      rating: (insertPuzzle as any).rating || 1500,
      popularity: (insertPuzzle as any).popularity || 0, 
      successPercentage: (insertPuzzle as any).successPercentage || 0,
      dateAssigned: insertPuzzle.dateAssigned
    };
    this.puzzles.set(id, puzzle);
    return puzzle;
  }
  
  async getPuzzlesByDifficulty(difficulty: string): Promise<Puzzle[]> {
    return Array.from(this.puzzles.values()).filter(
      (puzzle) => puzzle.difficulty === difficulty
    );
  }
  
  async getPuzzlesByThemes(themes: string[]): Promise<Puzzle[]> {
    return Array.from(this.puzzles.values()).filter(
      (puzzle) => {
        // Ensure puzzle.themes exists and is an array
        if (!puzzle.themes || !Array.isArray(puzzle.themes)) return false;
        // Return true if any of the requested themes match
        return themes.some(theme => puzzle.themes?.includes(theme));
      }
    );
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
  
  async getAllAttemptsByUser(userId: string): Promise<Attempt[]> {
    return Array.from(this.attempts.values()).filter(
      (attempt) => attempt.userId === userId
    );
  }

  async getAllAttemptsByUserWithPuzzle(userId: string): Promise<AttemptWithPuzzle[]> {
    const userAttempts = Array.from(this.attempts.values()).filter(
      (attempt) => attempt.userId === userId
    );

    return userAttempts.map(attempt => {
      const puzzle = this.puzzles.get(attempt.puzzleId);
      return {
        ...attempt,
        puzzle: puzzle || { 
          id: attempt.puzzleId, 
          fen: '8/8/8/8/8/8/8/8 w - - 0 1',
          solution: '', 
          themes: ['unknown'],
          difficulty: 'Medium',
          rating: 1500,
          pgn: '',
          dateAssigned: new Date(),
          toMove: 'w',
          popularity: 0,
          successPercentage: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        } 
      };
    });
  }
  
  async createAttempt(insertAttempt: InsertAttempt): Promise<Attempt> {
    const id = this.attemptIdCounter++;
    const now = new Date();
    const attempt: Attempt = {
      ...insertAttempt,
      id,
      attemptDate: insertAttempt.attemptDate || now,
      mintedNftAddress: insertAttempt.mintedNftAddress ?? null,
    };
    this.attempts.set(id, attempt);
    return attempt;
  }

  async updateAttemptMintStatus(attemptId: number, mintedNftAddress: string): Promise<Attempt | undefined> {
    const attempt = await this.getAttempt(attemptId);
    if (!attempt) return undefined;
    const updatedAttempt: Attempt = { ...attempt, mintedNftAddress: mintedNftAddress ?? null };
    this.attempts.set(attemptId, updatedAttempt);
    return updatedAttempt;
  }
  
  async getMintedAttemptsForUser(userId: string): Promise<Attempt[]> {
    const userAttempts = Array.from(this.attempts.values()).filter(
      (attempt) => attempt.userId === userId && attempt.mintedNftAddress
    );
    return userAttempts;
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
  
  async getRecommendedPuzzleForUser(walletAddress: string): Promise<PuzzleWithSolution | null> {
    // Get user profile
    const user = await this.getUserByWalletAddress(walletAddress);
    if (!user) return null;
    
    // Get all user's attempts to analyze performance
    const userAttempts = await this.getAllAttemptsByUser(walletAddress);
    
    // Calculate user's success rate
    const totalAttempts = userAttempts.length;
    const successfulAttempts = userAttempts.filter(attempt => attempt.isCorrect).length;
    const successRate = totalAttempts > 0 ? Math.round((successfulAttempts / totalAttempts) * 100) : 50;
    
    // Track completed puzzles
    const completedPuzzleIds = new Set<number>();
    userAttempts.forEach(attempt => {
      if (attempt.isCorrect) {
        completedPuzzleIds.add(attempt.puzzleId);
      }
    });
    
    // Identify themes the user is good at
    const puzzleThemeSuccessMap: Record<string, { success: number, total: number }> = {};
    
    // For each attempt, track theme success rates
    for (const attempt of userAttempts) {
      const puzzle = await this.getPuzzle(attempt.puzzleId);
      if (!puzzle || !puzzle.themes) continue;
      
      for (const theme of puzzle.themes) {
        if (!puzzleThemeSuccessMap[theme]) {
          puzzleThemeSuccessMap[theme] = { success: 0, total: 0 };
        }
        
        puzzleThemeSuccessMap[theme].total++;
        if (attempt.isCorrect) {
          puzzleThemeSuccessMap[theme].success++;
        }
      }
    }
    
    // Determine preferred themes (themes with >60% success rate)
    const preferredThemes: string[] = [];
    for (const [theme, stats] of Object.entries(puzzleThemeSuccessMap)) {
      if (stats.total >= 2 && (stats.success / stats.total) >= 0.6) {
        preferredThemes.push(theme);
      }
    }
    
    // Calculate user's longest streak
    let currentStreak = 0;
    let longestStreak = 0;
    const sortedAttempts = [...userAttempts].sort((a, b) => 
      new Date(a.attemptDate).getTime() - new Date(b.attemptDate).getTime()
    );

    if (sortedAttempts.length > 0) {
      let lastAttemptDate: Date | null = null;
      for (const attempt of sortedAttempts) {
        if (attempt.isCorrect) {
          if (lastAttemptDate) {
            const diffDays = (new Date(attempt.attemptDate).getTime() - lastAttemptDate.getTime()) / (1000 * 60 * 60 * 24);
            if (diffDays === 1) {
              currentStreak++;
            } else if (diffDays > 1) {
              currentStreak = 1; 
            } // else (diffDays === 0) - same day, streak continues
          } else {
            currentStreak = 1;
          }
          longestStreak = Math.max(longestStreak, currentStreak);
          lastAttemptDate = new Date(attempt.attemptDate);
        } else {
          currentStreak = 0;
          lastAttemptDate = null;
        }
      }
    }

    // Find uncompleted puzzles based on user's skill level and preferences
    const allPuzzles = await this.getAllPuzzles();
    const uncompletedPuzzles = allPuzzles.filter(
      (p) => !completedPuzzleIds.has(p.id)
    );

    // Prioritize puzzles with preferred themes or similar difficulty
    let recommendedPuzzle: PuzzleWithSolution | null = null;

    // Try to find a puzzle with a preferred theme
    if (preferredThemes.length > 0) {
      for (const theme of preferredThemes) {
        const themedPuzzles = uncompletedPuzzles.filter(p => p.themes?.includes(theme));
        if (themedPuzzles.length > 0) {
          const selectedPuzzle = themedPuzzles[Math.floor(Math.random() * themedPuzzles.length)];
          recommendedPuzzle = { ...selectedPuzzle, isRecommended: true, recommendationReason: `Based on your success in ${theme} puzzles.` };
          break;
        }
      }
    }

    // Fallback to a random uncompleted puzzle if no themed puzzle found
    if (!recommendedPuzzle && uncompletedPuzzles.length > 0) {
      const selectedPuzzle = uncompletedPuzzles[Math.floor(Math.random() * uncompletedPuzzles.length)];
      recommendedPuzzle = { ...selectedPuzzle, isRecommended: true, recommendationReason: "A random puzzle suggestion based on your uncompleted puzzles." };
    }
    
    // Ensure that all properties of PuzzleWithSolution are present, even if empty or default
    if (recommendedPuzzle) {
      return {
        ...recommendedPuzzle,
        dateAssigned: recommendedPuzzle.dateAssigned || new Date(),
        pgn: recommendedPuzzle.pgn || '',
        solution: recommendedPuzzle.solution || '',
        themes: recommendedPuzzle.themes || [],
        rating: recommendedPuzzle.rating || 1500,
        popularity: recommendedPuzzle.popularity || 0,
        successPercentage: recommendedPuzzle.successPercentage || 0,
        isRecommended: recommendedPuzzle.isRecommended || false,
        recommendationReason: recommendedPuzzle.recommendationReason || '',
      };
    }

    return null;
  }
}

export const storage = new MemStorage();
