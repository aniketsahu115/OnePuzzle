import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formats seconds into MM:SS display
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Format algebraic notation for display
export function formatAlgebraicNotation(move: string): string {
  if (!move || move.length < 4) return move;
  
  // Standard algebraic notation is 4 characters: fromSquare + toSquare
  // e.g., "e2e4" for "pawn from e2 to e4"
  const fromSquare = move.substring(0, 2);
  const toSquare = move.substring(2, 4);
  
  // Convert to more readable format: e2-e4
  return `${fromSquare}-${toSquare}`;
}

// Convert date to ISO date string (YYYY-MM-DD)
export function toISODateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Truncate string with ellipsis
export function truncateString(str: string, maxLength: number = 8): string {
  if (!str || str.length <= maxLength) return str;
  const halfLength = Math.floor(maxLength / 2);
  return `${str.substring(0, halfLength)}...${str.substring(str.length - halfLength)}`;
}

// Generate a random puzzle difficulty
export function getRandomDifficulty(): 'easy' | 'medium' | 'hard' {
  const difficulties = ['easy', 'medium', 'hard'];
  const randomIndex = Math.floor(Math.random() * difficulties.length);
  return difficulties[randomIndex] as 'easy' | 'medium' | 'hard';
}
