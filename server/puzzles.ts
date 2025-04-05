import { storage } from "./storage";
import { PuzzleWithSolution, insertPuzzleSchema, insertDailyPuzzleSchema } from "@shared/schema";
import { startOfDay, format } from "date-fns";

// Initial puzzle set for development
const INITIAL_PUZZLES: PuzzleWithSolution[] = [
  {
    id: 1,
    fen: "r3k2r/pp3p2/2nbpp2/3p3p/3P4/2NBPP2/PP3P1P/R3K2R w KQkq - 0 1",
    difficulty: "easy",
    toMove: "w",
    solution: "e1g1" // Castle kingside
  },
  {
    id: 2,
    fen: "r4rk1/pp1q1ppp/2n1p3/2PpP3/8/P2QB3/1P3PPP/R4RK1 w - - 0 1",
    difficulty: "medium",
    toMove: "w",
    solution: "d3h7" // Queen to h7 checkmate
  },
  {
    id: 3,
    fen: "r3kb1r/ppq2ppp/2p1b3/4P3/3p4/2NB4/PPP2PPP/R1BQK2R w KQkq - 0 1",
    difficulty: "hard",
    toMove: "w",
    solution: "d3g6" // Bishop to g6, fork
  },
  {
    id: 4,
    fen: "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 1",
    difficulty: "medium",
    toMove: "w",
    solution: "c3d5" // Knight to d5, attacking the bishop
  },
  {
    id: 5,
    fen: "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1",
    difficulty: "easy",
    toMove: "w",
    solution: "c4f7" // Bishop to f7 fork
  }
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
    return puzzle;
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
