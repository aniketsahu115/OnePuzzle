import { storage } from "./storage";
import { PuzzleWithSolution, insertPuzzleSchema, insertDailyPuzzleSchema } from "@shared/schema";
import { startOfDay, format } from "date-fns";

// Initial puzzle set for development
const INITIAL_PUZZLES: PuzzleWithSolution[] = [
  {
    id: 1,
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4",
    pgn: "1. e4 e5 2. Nf3 Nc6 3. Bc4",
    dateAssigned: new Date("2025-06-01"),
    difficulty: "easy",
    toMove: "w",
    solution: "Bxf7+",
    themes: ["opening", "tactics"],
    rating: 1200,
    popularity: 80,
    successPercentage: 65,
  },
  {
    id: 2,
    fen: "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR b KQkq - 2 3",
    pgn: "1. e4 e5 2. Bc4 Nf6",
    dateAssigned: new Date("2025-06-02"),
    difficulty: "easy",
    toMove: "b",
    solution: "Nxe4",
    themes: ["tactics"],
    rating: 1100,
    popularity: 70,
    successPercentage: 60,
  },
  {
    id: 3,
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4",
    pgn: "1. e4 e5 2. Nf3 Nc6 3. Bc4",
    dateAssigned: new Date("2025-06-03"),
    difficulty: "medium",
    toMove: "w",
    solution: "Ng5",
    themes: ["attack"],
    rating: 1300,
    popularity: 75,
    successPercentage: 55,
  },
  {
    id: 4,
    fen: "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR b KQkq - 2 3",
    pgn: "1. e4 e5 2. Bc4 Nf6",
    dateAssigned: new Date("2025-06-04"),
    difficulty: "medium",
    toMove: "b",
    solution: "Bc5",
    themes: ["defense"],
    rating: 1250,
    popularity: 60,
    successPercentage: 50,
  },
  {
    id: 5,
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4",
    pgn: "1. e4 e5 2. Nf3 Nc6 3. Bc4",
    dateAssigned: new Date("2025-06-05"),
    difficulty: "hard",
    toMove: "w",
    solution: "d4",
    themes: ["center"],
    rating: 1400,
    popularity: 50,
    successPercentage: 40,
  },
  {
    id: 6,
    fen: "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR b KQkq - 2 3",
    pgn: "1. e4 e5 2. Bc4 Nf6",
    dateAssigned: new Date("2025-06-06"),
    difficulty: "hard",
    toMove: "b",
    solution: "Nxe4",
    themes: ["tactics", "defense"],
    rating: 1350,
    popularity: 45,
    successPercentage: 35,
  },
  {
    id: 7,
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4",
    pgn: "1. e4 e5 2. Nf3 Nc6 3. Bc4",
    dateAssigned: new Date("2025-06-07"),
    difficulty: "easy",
    toMove: "w",
    solution: "Bc4",
    themes: ["opening"],
    rating: 1200,
    popularity: 80,
    successPercentage: 65,
  },
  {
    id: 8,
    fen: "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR b KQkq - 2 3",
    pgn: "1. e4 e5 2. Bc4 Nf6",
    dateAssigned: new Date("2025-06-08"),
    difficulty: "easy",
    toMove: "b",
    solution: "e4",
    themes: ["tactics"],
    rating: 1100,
    popularity: 70,
    successPercentage: 60,
  },
  {
    id: 9,
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4",
    pgn: "1. e4 e5 2. Nf3 Nc6 3. Bc4",
    dateAssigned: new Date("2025-06-09"),
    difficulty: "medium",
    toMove: "w",
    solution: "Nc3",
    themes: ["development"],
    rating: 1300,
    popularity: 75,
    successPercentage: 55,
  },
  {
    id: 10,
    fen: "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR b KQkq - 2 3",
    pgn: "1. e4 e5 2. Bc4 Nf6",
    dateAssigned: new Date("2025-06-10"),
    difficulty: "medium",
    toMove: "b",
    solution: "d5",
    themes: ["center"],
    rating: 1250,
    popularity: 60,
    successPercentage: 50,
  },
];

// Initialize puzzles in storage
export async function initializePuzzles() {
  try {
    // Check if we already have puzzles in storage
    const existingPuzzles = await storage.getAllPuzzles();
    
    if (existingPuzzles.length === 0) {
      // Seed initial puzzles
      for (const puzzleData of INITIAL_PUZZLES) {
        await storage.createPuzzle(puzzleData);
      }
      console.log("Initialized puzzles in storage");
    }
  } catch (error) {
    console.error("Failed to initialize puzzles:", error);
  }
}

// Get the puzzle for today
export async function getPuzzleOfTheDay(): Promise<PuzzleWithSolution | null> {
  try {
    const today = startOfDay(new Date());
    const todayStr = format(today, 'yyyy-MM-dd');
    
    // Check if we already have a puzzle assigned for today
    let dailyPuzzle = await storage.getDailyPuzzleByDate(todayStr);
    
    if (!dailyPuzzle) {
      // Select a new puzzle for today
      const puzzle = await selectPuzzleForDate(today);
      
      if (!puzzle) {
        return null;
      }
      
      return puzzle;
    }
    
    // Get the full puzzle data
    const puzzle = await storage.getPuzzle(dailyPuzzle.puzzleId);
    return puzzle ?? null;
  } catch (error) {
    console.error("Failed to get puzzle of the day:", error);
    return null;
  }
}

// Select a random puzzle for a specific date
export async function selectPuzzleForDate(date: Date): Promise<PuzzleWithSolution | null> {
  try {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Get all puzzles
    const puzzles = await storage.getAllPuzzles();
    
    if (puzzles.length === 0) {
      await initializePuzzles();
      return selectPuzzleForDate(date);
    }
    
    // Seed the random generator with the date for consistent selection
    const dateNumber = new Date(dateStr).getTime();
    const randomIndex = dateNumber % puzzles.length;
    
    const selectedPuzzle = puzzles[randomIndex];
    
    // Record this as the daily puzzle
    await storage.createDailyPuzzle({
      puzzleId: selectedPuzzle.id,
      puzzleDate: new Date(dateStr),
    });
    
    return selectedPuzzle;
  } catch (error) {
    console.error("Failed to select puzzle for date:", error);
    return null;
  }
}
