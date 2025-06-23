import React from 'react';

interface SVGBackgroundProps {
  className?: string;
}

export const ChessPattern: React.FC<SVGBackgroundProps> = ({ className = '' }) => (
  <svg 
    className={`absolute inset-0 w-full h-full ${className}`} 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <defs>
      <pattern id="chess" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="5" height="5" fill="rgba(153, 69, 255, 0.1)"/>
        <rect x="5" y="5" width="5" height="5" fill="rgba(153, 69, 255, 0.1)"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#chess)" opacity="0.3"/>
  </svg>
);

export const CircuitPattern: React.FC<SVGBackgroundProps> = ({ className = '' }) => (
  <svg 
    className={`absolute inset-0 w-full h-full ${className}`} 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(153, 69, 255, 0.2)" />
        <stop offset="50%" stopColor="rgba(20, 241, 149, 0.2)" />
        <stop offset="100%" stopColor="rgba(0, 194, 255, 0.2)" />
      </linearGradient>
    </defs>
    <g fill="none" stroke="url(#circuitGradient)" strokeWidth="0.5" opacity="0.4">
      <path d="M10 20 L30 20 L30 40 L50 40 L50 60 L70 60 L70 80" />
      <path d="M20 10 L20 30 L40 30 L40 50 L60 50 L60 70 L80 70" />
      <circle cx="30" cy="20" r="2" fill="rgba(153, 69, 255, 0.6)" />
      <circle cx="50" cy="40" r="2" fill="rgba(20, 241, 149, 0.6)" />
      <circle cx="70" cy="60" r="2" fill="rgba(0, 194, 255, 0.6)" />
    </g>
  </svg>
);

export const WavePattern: React.FC<SVGBackgroundProps> = ({ className = '' }) => (
  <svg 
    className={`absolute inset-0 w-full h-full ${className}`} 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(153, 69, 255, 0.1)" />
        <stop offset="50%" stopColor="rgba(20, 241, 149, 0.1)" />
        <stop offset="100%" stopColor="rgba(0, 194, 255, 0.1)" />
      </linearGradient>
    </defs>
    <path 
      d="M0 50 Q25 30 50 50 T100 50 L100 100 L0 100 Z" 
      fill="url(#waveGradient)"
      opacity="0.6"
    >
    </path>
  </svg>
);

export const ParticleField: React.FC<SVGBackgroundProps> = ({ className = '' }) => (
  <svg 
    className={`absolute inset-0 w-full h-full ${className}`} 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <defs>
      <radialGradient id="particleGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(153, 69, 255, 0.3)" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
    </defs>
    {Array.from({ length: 20 }).map((_, i) => (
      <circle
        key={i}
        cx={Math.random() * 100}
        cy={Math.random() * 100}
        r="0.5"
        fill="rgba(153, 69, 255, 0.6)"
        opacity="0.8"
      />
    ))}
  </svg>
);

export const GeometricPattern: React.FC<SVGBackgroundProps> = ({ className = '' }) => (
  <svg 
    className={`absolute inset-0 w-full h-full ${className}`} 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="geoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(153, 69, 255, 0.1)" />
        <stop offset="100%" stopColor="rgba(20, 241, 149, 0.1)" />
      </linearGradient>
    </defs>
    <g fill="url(#geoGradient)" opacity="0.4">
      <polygon points="20,20 30,10 40,20 30,30" />
      <polygon points="60,20 70,10 80,20 70,30" />
      <polygon points="40,60 50,50 60,60 50,70" />
      <polygon points="80,60 90,50 100,60 90,70" />
    </g>
  </svg>
);

export const FloatingShapes: React.FC<SVGBackgroundProps> = ({ className = '' }) => (
  <svg 
    className={`absolute inset-0 w-full h-full ${className}`} 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="shapeGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(153, 69, 255, 0.2)" />
        <stop offset="100%" stopColor="rgba(20, 241, 149, 0.2)" />
      </linearGradient>
      <linearGradient id="shapeGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(0, 194, 255, 0.2)" />
        <stop offset="100%" stopColor="rgba(153, 69, 255, 0.2)" />
      </linearGradient>
    </defs>
    
    {/* Floating circles */}
    <circle cx="20" cy="30" r="3" fill="url(#shapeGradient1)" opacity="0.6"/>
    
    <circle cx="80" cy="70" r="2" fill="url(#shapeGradient2)" opacity="0.6"/>
    
    <circle cx="60" cy="20" r="2.5" fill="url(#shapeGradient1)" opacity="0.6"/>
    
    {/* Floating squares */}
    <rect x="10" y="60" width="4" height="4" fill="url(#shapeGradient2)" opacity="0.6"/>
    
    <rect x="70" y="10" width="3" height="3" fill="url(#shapeGradient1)" opacity="0.6"/>
  </svg>
); 