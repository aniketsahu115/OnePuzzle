import React from 'react';
import { cn } from '@/lib/utils';

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent';
  hover?: boolean;
}

const GradientCard: React.FC<GradientCardProps> = ({ 
  children, 
  className = '', 
  variant = 'primary',
  hover = true
}) => {
  const baseClasses = "relative overflow-hidden rounded-2xl backdrop-blur-sm border";
  
  const variantClasses = {
    primary: "bg-gradient-to-br from-purple-900/40 via-indigo-900/50 to-blue-900/40 border-purple-500/30",
    secondary: "bg-gradient-to-br from-emerald-900/40 via-teal-900/50 to-cyan-900/40 border-emerald-500/30",
    accent: "bg-gradient-to-br from-pink-900/40 via-rose-900/50 to-red-900/40 border-pink-500/30"
  };

  const hoverClasses = hover ? "transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25" : "";

  return (
    <div className={cn(baseClasses, variantClasses[variant], hoverClasses, className)}>
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 animate-pulse-very-slow"></div>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full animate-shimmer"></div>
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-br-full"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-blue-500/20 to-transparent rounded-tl-full"></div>
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
};

export default GradientCard; 