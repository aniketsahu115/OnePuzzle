import React, { useState, useEffect } from 'react';
import { Chess, Move, Square } from 'chess.js';

interface ChessBoardProps {
  fen: string;
  orientation?: 'white' | 'black';
  onMove?: (move: string) => void;
  selectedMove?: string | null;
  interactionEnabled?: boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  fen,
  orientation = 'white',
  onMove,
  selectedMove = null,
  interactionEnabled = true
}) => {
  const [chess] = useState(new Chess(fen));
  const [selectedPiece, setSelectedPiece] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);
  const [highlightedMove, setHighlightedMove] = useState<{from: Square, to: Square} | null>(null);

  useEffect(() => {
    if (selectedMove) {
      // Parse the move to get from and to squares
      try {
        const from = selectedMove.substring(0, 2) as Square;
        const to = selectedMove.substring(2, 4) as Square;
        setHighlightedMove({ from, to });
      } catch (e) {
        setHighlightedMove(null);
      }
    } else {
      setHighlightedMove(null);
    }
  }, [selectedMove]);

  const handlePieceClick = (square: Square) => {
    if (!interactionEnabled) return;
    
    const piece = chess.get(square);
    
    // If there's already a selected piece
    if (selectedPiece) {
      // If the same piece is clicked again, deselect it
      if (square === selectedPiece) {
        setSelectedPiece(null);
        setPossibleMoves([]);
        return;
      }
      
      // If clicking a possible move square, make the move
      if (possibleMoves.includes(square)) {
        const move = {
          from: selectedPiece,
          to: square,
          promotion: 'q' // Auto-queen for simplicity
        };
        
        try {
          const moveResult = chess.move(move);
          if (moveResult && onMove) {
            onMove(`${selectedPiece}${square}`);
          }
        } catch (e) {
          // Invalid move
        }
        
        setSelectedPiece(null);
        setPossibleMoves([]);
        return;
      }
    }
    
    // If the clicked square has a piece and it's the correct color to move
    if (piece && ((piece.color === 'w' && chess.turn() === 'w') || (piece.color === 'b' && chess.turn() === 'b'))) {
      setSelectedPiece(square);
      
      // Find possible moves for this piece
      const moves = chess.moves({ square, verbose: true });
      const validSquares = moves.map(move => move.to as Square);
      setPossibleMoves(validSquares);
    }
  };

  const renderSquares = () => {
    const squares = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    
    // Reverse ranks if orientation is black
    const displayRanks = orientation === 'black' ? [...ranks].reverse() : ranks;
    const displayFiles = orientation === 'black' ? [...files].reverse() : files;
    
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const square = `${displayFiles[f]}${displayRanks[r]}` as Square;
        const piece = chess.get(square);
        const isLight = (r + f) % 2 === 0;
        const isSelected = square === selectedPiece;
        const isPossibleMove = possibleMoves.includes(square);
        const isHighlighted = highlightedMove && (square === highlightedMove.from || square === highlightedMove.to);
        
        squares.push(
          <div 
            key={square} 
            className={`chess-square ${isLight ? 'bg-secondary' : 'bg-primary-light'} flex items-center justify-center relative`}
            onClick={() => handlePieceClick(square)}
          >
            {/* Coordinate labels */}
            {f === 0 && (
              <span className={`absolute top-0 left-1 text-xs ${isLight ? 'text-slate-500' : 'text-slate-200'}`}>
                {displayRanks[r]}
              </span>
            )}
            {r === 7 && (
              <span className="absolute bottom-0 right-1 text-xs text-slate-500">
                {displayFiles[f]}
              </span>
            )}
            
            {/* Chess pieces */}
            {piece && (
              <div 
                className={`chess-piece w-[85%] h-[85%] flex items-center justify-center ${interactionEnabled ? 'cursor-pointer' : ''} ${isSelected ? 'ring-2 ring-accent' : ''}`}
              >
                <svg 
                  viewBox="0 0 45 45" 
                  className={`w-full h-full ${isHighlighted ? 'ring-2 ring-accent rounded-sm' : ''}`}
                >
                  {renderPieceSVG(piece.type, piece.color)}
                </svg>
              </div>
            )}
            
            {/* Highlight for possible moves */}
            {isPossibleMove && (
              <div className="absolute w-1/3 h-1/3 rounded-full bg-accent bg-opacity-40"></div>
            )}
            
            {/* Highlight for move visualization */}
            {isHighlighted && (
              <div className="absolute inset-0 ring-4 ring-accent rounded-sm bg-accent bg-opacity-20 pointer-events-none"></div>
            )}
          </div>
        );
      }
    }
    
    return squares;
  };

  const renderPieceSVG = (type: string, color: 'w' | 'b') => {
    // SVG paths for chess pieces
    switch (type) {
      case 'p': // Pawn
        return color === 'w' 
          ? <path d="M22.5,9c-2.21,0-4,1.79-4,4c0,0.89,0.29,1.71,0.78,2.38C17.33,16.5,16,18.59,16,21c0,2.03,0.94,3.84,2.41,5.03 C15.41,27.09,11,31.58,11,39.5H34c0-7.92-4.41-12.41-7.41-13.47C28.06,24.84,29,23.03,29,21c0-2.41-1.33-4.5-3.28-5.62 C26.21,14.71,26.5,13.89,26.5,13C26.5,10.79,24.71,9,22.5,9z" fill={color === 'w' ? 'white' : 'black'} stroke="black" strokeWidth="1.5" strokeLinecap="round" />
          : <path d="M22.5,9c-2.21,0-4,1.79-4,4c0,0.89,0.29,1.71,0.78,2.38C17.33,16.5,16,18.59,16,21c0,2.03,0.94,3.84,2.41,5.03 C15.41,27.09,11,31.58,11,39.5H34c0-7.92-4.41-12.41-7.41-13.47C28.06,24.84,29,23.03,29,21c0-2.41-1.33-4.5-3.28-5.62 C26.21,14.71,26.5,13.89,26.5,13C26.5,10.79,24.71,9,22.5,9z" fill={color === 'w' ? 'white' : 'black'} stroke="black" strokeWidth="1.5" strokeLinecap="round" />
      case 'r': // Rook
        return color === 'w'
          ? <path d="M9,39h27v-3H9V39z M12,36v-4h21v4H12z M12,13.5V9h3v1h6V9h3v1h6V9h3v4.5H12z M11,16.5h23v-3H11V16.5z M12,19.5v11h21v-11H12z" fill="white" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          : <path d="M9,39h27v-3H9V39z M12,36v-4h21v4H12z M12,13.5V9h3v1h6V9h3v1h6V9h3v4.5H12z M11,16.5h23v-3H11V16.5z M12,19.5v11h21v-11H12z" fill="black" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      case 'n': // Knight
        return color === 'w'
          ? <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" fill="white" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          : <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" fill="black" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      case 'b': // Bishop
        return color === 'w'
          ? <g fill="white" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z" /><path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z" /><path d="M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z" /></g>
          : <g fill="black" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z" /><path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z" /><path d="M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z" /></g>
      case 'q': // Queen
        return color === 'w'
          ? <g fill="white" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="12" r="2.75" /><circle cx="14" cy="9" r="2.75" /><circle cx="22.5" cy="8" r="2.75" /><circle cx="31" cy="9" r="2.75" /><circle cx="39" cy="12" r="2.75" /><path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z" /><path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z" /><path d="M 11,38.5 A 35,35 1 0 0 34,38.5" fill="none" /></g>
          : <g fill="black" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="12" r="2.75" /><circle cx="14" cy="9" r="2.75" /><circle cx="22.5" cy="8" r="2.75" /><circle cx="31" cy="9" r="2.75" /><circle cx="39" cy="12" r="2.75" /><path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z" /><path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z" /><path d="M 11,38.5 A 35,35 1 0 0 34,38.5" fill="none" /></g>
      case 'k': // King
        return color === 'w'
          ? <g fill="white" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M 22.5,11.63 L 22.5,6" /><path d="M 20,8 L 25,8" /><path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" /><path d="M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37" /><path d="M 12.5,30 C 18,27 27,27 32.5,30" /><path d="M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5" /><path d="M 12.5,37 C 18,34 27,34 32.5,37" /></g>
          : <g fill="black" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M 22.5,11.63 L 22.5,6" stroke="white" /><path d="M 20,8 L 25,8" stroke="white" /><path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" /><path d="M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37" /><path d="M 12.5,30 C 18,27 27,27 32.5,30" /><path d="M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5" /><path d="M 12.5,37 C 18,34 27,34 32.5,37" /></g>
      default:
        return null;
    }
  };

  return (
    <div className="chess-board-container p-4 sm:p-6 flex justify-center">
      <div className="chess-board relative w-full max-w-md aspect-square border-2 border-primary rounded">
        {/* Chess Board Squares and Pieces */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
          {renderSquares()}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
