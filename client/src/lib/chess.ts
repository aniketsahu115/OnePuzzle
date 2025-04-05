import { Chess, Move } from 'chess.js';

// Determines if a user's move is correct compared to solution
export function isMoveCorrect(fen: string, userMove: string, solution: string): boolean {
  // Standard algebraic notation
  // e.g., "e2e4" for "pawn to e4" or "g1f3" for "knight from g1 to f3"
  const fromSquare = userMove.substring(0, 2);
  const toSquare = userMove.substring(2, 4);
  
  // Check if solution matches user move (ignoring case)
  const normalizedUserMove = userMove.toLowerCase();
  const normalizedSolution = solution.toLowerCase();
  
  return normalizedUserMove === normalizedSolution;
}

// Gets all legal moves for a piece at a specific position
export function getLegalMoves(fen: string, square: string): string[] {
  try {
    const chess = new Chess(fen);
    const moves = chess.moves({ square, verbose: true });
    return moves.map(move => `${move.from}${move.to}`);
  } catch (error) {
    console.error('Error getting legal moves:', error);
    return [];
  }
}

// Make a move on a board and return the new FEN
export function makeMove(fen: string, move: string): string {
  try {
    const chess = new Chess(fen);
    const fromSquare = move.substring(0, 2);
    const toSquare = move.substring(2, 4);
    
    chess.move({ from: fromSquare, to: toSquare });
    return chess.fen();
  } catch (error) {
    console.error('Error making move:', error);
    return fen; // Return original FEN if move is invalid
  }
}

// Determine whose turn it is based on the FEN
export function getTurn(fen: string): 'w' | 'b' {
  try {
    const chess = new Chess(fen);
    return chess.turn();
  } catch (error) {
    console.error('Error getting turn:', error);
    return 'w'; // Default to white's turn if there's an error
  }
}
