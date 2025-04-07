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
  updateUserPreferences(walletAddress: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Puzzle operations
  getPuzzle(id: number): Promise<PuzzleWithSolution | undefined>;
  getAllPuzzles(): Promise<PuzzleWithSolution[]>;
  createPuzzle(puzzle: InsertPuzzle): Promise<PuzzleWithSolution>;
  getPuzzlesByDifficulty(difficulty: string): Promise<PuzzleWithSolution[]>;
  getPuzzlesByThemes(themes: string[]): Promise<PuzzleWithSolution[]>;
  
  // Attempt operations
  getAttempt(id: number): Promise<Attempt | undefined>;
  getAttemptsByUserAndPuzzle(userId: string, puzzleId: number): Promise<Attempt[]>;
  getAllAttemptsByUser(userId: string): Promise<Attempt[]>;
  createAttempt(attempt: InsertAttempt): Promise<Attempt>;
  updateAttemptMintStatus(attemptId: number, mintedNftAddress: string): Promise<Attempt | undefined>;
  
  // Daily puzzle operations
  getDailyPuzzleByDate(dateStr: string): Promise<DailyPuzzle | undefined>;
  createDailyPuzzle(dailyPuzzle: InsertDailyPuzzle): Promise<DailyPuzzle>;
  getRecommendedPuzzleForUser(walletAddress: string): Promise<PuzzleWithSolution | null>;
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
  
  async updateUserPreferences(walletAddress: string, updates: Partial<User>): Promise<User | undefined> {
    const user = await this.getUserByWalletAddress(walletAddress);
    if (!user) return undefined;
    
    const updatedUser: User = { ...user, ...updates };
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
    // Type assertion to handle additional properties
    const puzzleData = insertPuzzle as any;
    const puzzle: PuzzleWithSolution = { 
      id,
      fen: puzzleData.fen,
      difficulty: puzzleData.difficulty,
      toMove: puzzleData.toMove,
      solution: puzzleData.solution,
      themes: puzzleData.themes || [],
      rating: puzzleData.rating || 1500,
      popularity: puzzleData.popularity || 0, 
      successPercentage: puzzleData.successPercentage || 0
    };
    this.puzzles.set(id, puzzle);
    return puzzle;
  }
  
  async getPuzzlesByDifficulty(difficulty: string): Promise<PuzzleWithSolution[]> {
    return Array.from(this.puzzles.values()).filter(
      (puzzle) => puzzle.difficulty === difficulty
    );
  }
  
  async getPuzzlesByThemes(themes: string[]): Promise<PuzzleWithSolution[]> {
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
    
    // Determine preferred difficulty based on success rate
    let preferredDifficulty: string;
    if (successRate >= 80) {
      preferredDifficulty = 'hard';
    } else if (successRate >= 40) {
      preferredDifficulty = 'medium';
    } else {
      preferredDifficulty = 'easy';
    }
    
    // Update user preferences
    await this.updateUserPreferences(walletAddress, {
      successRate,
      completedPuzzles: completedPuzzleIds.size,
      preferredThemes,
      preferredDifficulty,
      lastRecommendationDate: new Date()
    });
    
    // Algorithm to select next puzzle
    // 1. First try to find a puzzle matching their preferred difficulty and a theme they do well with
    // 2. If none found, select a puzzle of their preferred difficulty
    // 3. If still none, select a puzzle from a difficulty level below their preferred one
    // 4. Finally, if all else fails, select a random puzzle they haven't completed
    
    // Get all puzzles
    const allPuzzles = await this.getAllPuzzles();
    
    // Filter out puzzles the user has already completed
    const uncompletedPuzzles = allPuzzles.filter(
      puzzle => !completedPuzzleIds.has(puzzle.id)
    );
    
    if (uncompletedPuzzles.length === 0) {
      // If user has completed all puzzles, just return a random one
      const randomIndex = Math.floor(Math.random() * allPuzzles.length);
      const recommendedPuzzle = { ...allPuzzles[randomIndex], isRecommended: true };
      return recommendedPuzzle;
    }
    
    // Try to find a puzzle matching preferred difficulty and themes
    if (preferredThemes.length > 0) {
      const matchingPuzzles = uncompletedPuzzles.filter(
        puzzle => 
          puzzle.difficulty === preferredDifficulty && 
          puzzle.themes && 
          puzzle.themes.some(theme => preferredThemes.includes(theme))
      );
      
      if (matchingPuzzles.length > 0) {
        const randomIndex = Math.floor(Math.random() * matchingPuzzles.length);
        const recommendedPuzzle = { 
          ...matchingPuzzles[randomIndex], 
          isRecommended: true,
          recommendationReason: `This puzzle features a ${preferredThemes[0]} tactic that matches your strengths.`
        };
        return recommendedPuzzle;
      }
    }
    
    // Try to find a puzzle matching just the preferred difficulty
    const difficultyPuzzles = uncompletedPuzzles.filter(
      puzzle => puzzle.difficulty === preferredDifficulty
    );
    
    if (difficultyPuzzles.length > 0) {
      const randomIndex = Math.floor(Math.random() * difficultyPuzzles.length);
      const recommendedPuzzle = { 
        ...difficultyPuzzles[randomIndex], 
        isRecommended: true,
        recommendationReason: `This ${preferredDifficulty} puzzle is a good match for your current skill level.`
      };
      return recommendedPuzzle;
    }
    
    // If no matching difficulty, go one level easier
    let easierDifficulty: string;
    if (preferredDifficulty === 'hard') {
      easierDifficulty = 'medium';
    } else {
      easierDifficulty = 'easy';
    }
    
    const easierPuzzles = uncompletedPuzzles.filter(
      puzzle => puzzle.difficulty === easierDifficulty
    );
    
    if (easierPuzzles.length > 0) {
      const randomIndex = Math.floor(Math.random() * easierPuzzles.length);
      const recommendedPuzzle = { 
        ...easierPuzzles[randomIndex], 
        isRecommended: true,
        recommendationReason: `This puzzle will help you build skills before tackling harder challenges.`
      };
      return recommendedPuzzle;
    }
    
    // Fallback: return any uncompleted puzzle
    const randomIndex = Math.floor(Math.random() * uncompletedPuzzles.length);
    const recommendedPuzzle = { 
      ...uncompletedPuzzles[randomIndex], 
      isRecommended: true,
      recommendationReason: `This is a new puzzle for you to try.`
    };
    return recommendedPuzzle;
  }
}

export const storage = new MemStorage();
