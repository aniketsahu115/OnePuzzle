import React from 'react';
import { cn } from '@/lib/utils';

interface ChessPieceIconProps {
  piece: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

const ChessPieceIcon: React.FC<ChessPieceIconProps> = ({ 
  piece, 
  size = 'md', 
  animated = true,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl'
  };

  const animationClasses = animated ? 'animate-float-slow' : '';

  // Chess piece gradients
  const pieceGradients = {
    '♔': 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    '♕': 'bg-gradient-to-br from-pink-400 to-pink-600',
    '♖': 'bg-gradient-to-br from-red-400 to-red-600',
    '♗': 'bg-gradient-to-br from-blue-400 to-blue-600',
    '♘': 'bg-gradient-to-br from-green-400 to-green-600',
    '♙': 'bg-gradient-to-br from-gray-300 to-gray-500',
    '♚': 'bg-gradient-to-br from-yellow-600 to-yellow-800',
    '♛': 'bg-gradient-to-br from-pink-600 to-pink-800',
    '♜': 'bg-gradient-to-br from-red-600 to-red-800',
    '♝': 'bg-gradient-to-br from-blue-600 to-blue-800',
    '♞': 'bg-gradient-to-br from-green-600 to-green-800',
    '♟': 'bg-gradient-to-br from-gray-600 to-gray-800'
  };

  return (
    <div className={cn(
      'relative inline-flex items-center justify-center',
      sizeClasses[size],
      animationClasses,
      className
    )}>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-current opacity-20 blur-lg scale-110"></div>
      
      {/* Main piece */}
      <div className={cn(
        'relative z-10 text-white drop-shadow-lg',
        pieceGradients[piece as keyof typeof pieceGradients] || 'bg-gradient-to-br from-purple-400 to-purple-600'
      )}>
        {piece}
      </div>
      
      {/* Sparkle effect */}
      {animated && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-1/4 right-0 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/4 left-0 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      )}
    </div>
  );
};

export default ChessPieceIcon; 