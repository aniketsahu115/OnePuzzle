import React, { useState, useEffect, useCallback } from 'react';
import { Chess, Move, Square } from 'chess.js';
import { useChessAudio } from '@/lib/useChessAudio';

interface ChessBoardProps {
  fen: string;
  orientation?: 'white' | 'black';
  onMove?: (move: string) => void;
  selectedMove?: string | null;
  interactionEnabled?: boolean;
  showCoordinates?: boolean;
  showLastMove?: boolean;
  showMoveHints?: boolean;
  allowFullGame?: boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  fen,
  orientation = 'white',
  onMove,
  selectedMove = null,
  interactionEnabled = true,
  showCoordinates = true,
  showLastMove = true,
  showMoveHints = true,
  allowFullGame = false
}) => {
  const [chess, setChess] = useState(new Chess(fen));
  const [selectedPiece, setSelectedPiece] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);
  const [highlightedMove, setHighlightedMove] = useState<{from: Square, to: Square} | null>(null);
  const [moveHistory, setMoveHistory] = useState<{from: Square, to: Square}[]>([]);
  const [gameOver, setGameOver] = useState<{status: string, winner?: string} | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Initialize audio functionality
  const { playSound, isMuted, toggleMute } = useChessAudio();

  // Update the chess position when the FEN string changes
  useEffect(() => {
    try {
      const newChess = new Chess(fen);
      setChess(newChess);
      // Reset game state when position changes
      setSelectedPiece(null);
      setPossibleMoves([]);
      setMoveHistory([]);
      setGameOver(null);
    } catch (e) {
      console.error('Invalid FEN string:', e);
    }
  }, [fen]);

  // Check for game over conditions after each move
  useEffect(() => {
    if (!allowFullGame) return;
    
    if (chess.isGameOver()) {
      let status = '';
      let winner = undefined;
      
      if (chess.isCheckmate()) {
        status = 'Checkmate';
        winner = chess.turn() === 'w' ? 'black' : 'white'; // Opposite of current turn
      } else if (chess.isDraw()) {
        status = 'Draw';
        if (chess.isStalemate()) {
          status += ' - Stalemate';
        } else if (chess.isThreefoldRepetition()) {
          status += ' - Threefold Repetition';
        } else if (chess.isInsufficientMaterial()) {
          status += ' - Insufficient Material';
        }
      }
      
      setGameOver({ status, winner });
    }
  }, [chess, allowFullGame]);

  // Handle highlighting the selected move
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
  
  // Timer functionality
  useEffect(() => {
    // Start the timer when interactionEnabled is true and game is not over
    if (interactionEnabled && !gameOver) {
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
  }, [interactionEnabled, gameOver]);
  
  // Timer counter
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (timerActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  const handlePieceClick = (square: Square) => {
    // If game is over or interaction is disabled, don't allow moves
    if (!interactionEnabled || gameOver) return;
    
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
        // Create move object with proper structure for chess.js v1.1.0
        const moveObj: any = {
          from: selectedPiece,
          to: square
        };
        
        // Check if this is a pawn promotion move
        const pieceAtFrom = chess.get(selectedPiece);
        if (pieceAtFrom && pieceAtFrom.type === 'p') {
          // Check if pawn is moving to the last rank
          const rank = square.charAt(1);
          if ((pieceAtFrom.color === 'w' && rank === '8') || (pieceAtFrom.color === 'b' && rank === '1')) {
            moveObj.promotion = 'q'; // Auto-queen for simplicity
          }
        }
        
        try {
          const moveResult = chess.move(moveObj);
          
          if (moveResult) {
            // Record the move in history
            const newMove = { from: selectedPiece, to: square };
            setMoveHistory(prevHistory => [...prevHistory, newMove]);
            setHighlightedMove(newMove);
            
            // Play appropriate sound effect based on move type
            if (moveResult.captured) {
              // Piece capture sound
              playSound('capture');
            } else if (moveResult.san.includes('+')) {
              // Check sound
              playSound('check');
            } else if (moveResult.san.includes('O-O')) {
              // Castle sound
              playSound('castle');
            } else {
              // Regular move sound
              playSound('move');
            }
            
            // Call the parent's onMove callback if provided
            if (onMove) {
              console.log('Move made:', {
                from: selectedPiece,
                to: square,
                coordinateNotation: `${selectedPiece}${square}`,
                algebraicNotation: moveResult.san,
                moveResult
              });
              onMove(moveResult.san);
            }
          } else {
            // Move was not successful
            playSound('error');
            console.error('Move failed');
          }
        } catch (e) {
          // Play error sound for invalid moves
          playSound('error');
          console.error('Invalid move:', e);
        }
        
        setSelectedPiece(null);
        setPossibleMoves([]);
        return;
      }
    }
    
    // If the clicked square has a piece and it's the correct color to move
    if (piece && ((piece.color === 'w' && chess.turn() === 'w') || (piece.color === 'b' && chess.turn() === 'b'))) {
      // Play selection sound effect (subtle move sound for piece selection)
      playSound('move');
      
      setSelectedPiece(square);
      
      // Find possible moves for this piece
      try {
        const moves = chess.moves({ square, verbose: true });
        const validSquares = moves.map(move => move.to as Square);
        setPossibleMoves(showMoveHints ? validSquares : []);
      } catch (e) {
        console.error('Error getting moves for square:', square, e);
        setPossibleMoves([]);
      }
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
        if (color === 'w') {
          return <path d="M22.5,9c-2.21,0-4,1.79-4,4c0,0.89,0.29,1.71,0.78,2.38C17.33,16.5,16,18.59,16,21c0,2.03,0.94,3.84,2.41,5.03 C15.41,27.09,11,31.58,11,39.5H34c0-7.92-4.41-12.41-7.41-13.47C28.06,24.84,29,23.03,29,21c0-2.41-1.33-4.5-3.28-5.62 C26.21,14.71,26.5,13.89,26.5,13C26.5,10.79,24.71,9,22.5,9z" fill="white" stroke="black" strokeWidth="1.5" strokeLinecap="round" />;
        } else {
          return <path d="M22.5,9c-2.21,0-4,1.79-4,4c0,0.89,0.29,1.71,0.78,2.38C17.33,16.5,16,18.59,16,21c0,2.03,0.94,3.84,2.41,5.03 C15.41,27.09,11,31.58,11,39.5H34c0-7.92-4.41-12.41-7.41-13.47C28.06,24.84,29,23.03,29,21c0-2.41-1.33-4.5-3.28-5.62 C26.21,14.71,26.5,13.89,26.5,13C26.5,10.79,24.71,9,22.5,9z" fill="black" stroke="black" strokeWidth="1.5" strokeLinecap="round" />;
        }
      case 'r': // Rook
        if (color === 'w') {
          return <path d="M9,39h27v-3H9V39z M12,36v-4h21v4H12z M12,13.5V9h3v1h6V9h3v1h6V9h3v4.5H12z M11,16.5h23v-3H11V16.5z M12,19.5v11h21v-11H12z" fill="white" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />;
        } else {
          return <path d="M9,39h27v-3H9V39z M12,36v-4h21v4H12z M12,13.5V9h3v1h6V9h3v1h6V9h3v4.5H12z M11,16.5h23v-3H11V16.5z M12,19.5v11h21v-11H12z" fill="black" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />;
        }
      case 'n': // Knight
        if (color === 'w') {
          return <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" fill="white" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />;
        } else {
          return <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" fill="black" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />;
        }
      case 'b': // Bishop
        if (color === 'w') {
          return <g fill="white" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z" /><path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z" /><path d="M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z" /></g>;
        } else {
          return <g fill="black" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z" /><path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z" /><path d="M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z" /></g>;
        }
      case 'q': // Queen
        if (color === 'w') {
          return <g fill="white" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="12" r="2.75" /><circle cx="14" cy="9" r="2.75" /><circle cx="22.5" cy="8" r="2.75" /><circle cx="31" cy="9" r="2.75" /><circle cx="39" cy="12" r="2.75" /><path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z" /><path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z" /><path d="M 11,38.5 A 35,35 1 0 0 34,38.5" fill="none" /></g>;
        } else {
          return <g fill="black" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="12" r="2.75" /><circle cx="14" cy="9" r="2.75" /><circle cx="22.5" cy="8" r="2.75" /><circle cx="31" cy="9" r="2.75" /><circle cx="39" cy="12" r="2.75" /><path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z" /><path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z" /><path d="M 11,38.5 A 35,35 1 0 0 34,38.5" fill="none" /></g>;
        }
      case 'k': // King
        if (color === 'w') {
          return <g fill="white" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M 22.5,11.63 L 22.5,6" /><path d="M 20,8 L 25,8" /><path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" /><path d="M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37" /><path d="M 12.5,30 C 18,27 27,27 32.5,30" /><path d="M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5" /><path d="M 12.5,37 C 18,34 27,34 32.5,37" /></g>;
        } else {
          return <g fill="black" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M 22.5,11.63 L 22.5,6" stroke="white" /><path d="M 20,8 L 25,8" stroke="white" /><path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" /><path d="M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37" /><path d="M 12.5,30 C 18,27 27,27 32.5,30" /><path d="M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5" /><path d="M 12.5,37 C 18,34 27,34 32.5,37" /></g>;
        }
      default:
        return null;
    }
  };

  // Helper function to format time for display (mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Game information display
  const renderGameInfo = () => {
    if (!allowFullGame) return null;
    
    return (
      <div className="mt-4 p-4 bg-white shadow-md rounded-md">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-medium">Turn: </span>
            <span className={`${chess.turn() === 'w' ? 'text-black' : 'text-gray-700'} font-bold`}>
              {chess.turn() === 'w' ? 'White' : 'Black'}
            </span>
          </div>
          
          {/* Timer display */}
          <div className="text-center">
            <span className="font-medium">Time: </span>
            <span className={`font-mono ${timerActive ? 'text-accent' : 'text-gray-500'}`}>
              {formatTime(timer)}
            </span>
          </div>
          
          {gameOver && (
            <div className="text-right">
              <span className="font-medium">Game Over: </span>
              <span className="font-bold text-accent">{gameOver.status}</span>
              {gameOver.winner && (
                <span className="ml-1 font-bold">(Winner: {gameOver.winner})</span>
              )}
            </div>
          )}
        </div>
        
        {/* Display last move */}
        {moveHistory.length > 0 && showLastMove && (
          <div className="mt-2">
            <span className="font-medium">Last move: </span>
            <span className="font-mono bg-gray-100 px-1 rounded">
              {`${moveHistory[moveHistory.length-1].from}${moveHistory[moveHistory.length-1].to}`}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="chess-board-container p-4 sm:p-6 flex flex-col items-center">
      <div className="chess-board relative w-full max-w-md aspect-square border-2 border-primary rounded">
        {/* Chess Board Squares and Pieces */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
          {renderSquares()}
        </div>
        
        {/* Sound toggle button */}
        <button 
          onClick={toggleMute}
          className="absolute -top-10 right-0 p-2 bg-slate-100 hover:bg-slate-200 rounded-full shadow-sm transition-colors"
          title={isMuted ? "Unmute sound effects" : "Mute sound effects"}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>
        
        {/* Game over overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-bold">{gameOver.status}</h3>
              {gameOver.winner && (
                <p className="text-lg mt-2">{gameOver.winner} wins!</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Game information panel */}
      {renderGameInfo()}
    </div>
  );
};

export default ChessBoard;
