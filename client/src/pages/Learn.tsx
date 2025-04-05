import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const Learn: React.FC = () => {
  const chessBasics = [
    {
      title: "How Chess Pieces Move",
      description: "Learn the foundational rules for moving each piece on the board.",
      icon: "♙",
      link: "/learn/pieces"
    },
    {
      title: "Basic Checkmate Patterns",
      description: "Discover the most common ways to checkmate your opponent.",
      icon: "♚",
      link: "/learn/checkmates"
    },
    {
      title: "Opening Principles",
      description: "Master the key principles that guide strong opening play.",
      icon: "♘",
      link: "/learn/openings"
    }
  ];
  
  const tacticalConcepts = [
    {
      title: "Forks",
      description: "Attack two or more pieces simultaneously with a single piece.",
      icon: "♞",
      link: "/learn/forks"
    },
    {
      title: "Pins",
      description: "Restrict a piece's movement by threatening a more valuable piece behind it.",
      icon: "♝",
      link: "/learn/pins"
    },
    {
      title: "Skewers",
      description: "Attack two pieces in a line, forcing the more valuable piece to move.",
      icon: "♜",
      link: "/learn/skewers"
    }
  ];
  
  const strategicConcepts = [
    {
      title: "Pawn Structure",
      description: "Understand how pawns define the character of the position.",
      icon: "♟️",
      link: "/learn/pawn-structure"
    },
    {
      title: "Piece Coordination",
      description: "Learn to harmonize your pieces for maximum effectiveness.",
      icon: "♕",
      link: "/learn/coordination"
    },
    {
      title: "Prophylaxis",
      description: "Anticipate and prevent your opponent's plans before they execute them.",
      icon: "♖",
      link: "/learn/prophylaxis"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Chess Learning Center</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Improve your chess skills with our comprehensive resources, from basic moves to advanced strategies
        </p>
      </div>
      
      {/* Featured Content */}
      <div className="bg-gradient-to-r from-primary/90 to-primary rounded-xl p-6 md:p-8 shadow-lg mb-12 text-white">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Daily Chess Puzzle Challenge</h2>
            <p className="text-white/90 mb-6">
              Put your tactical skills to the test with our daily puzzle challenge. Solve it correctly to mint your success as an NFT on Solana and track your progress over time.
            </p>
            <Link href="/">
              <Button className="bg-white text-primary hover:bg-white/90 transition-colors font-medium">
                Try Today's Puzzle
              </Button>
            </Link>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="w-48 h-48 bg-white/10 rounded-xl flex items-center justify-center text-6xl">
              ♟️
            </div>
          </div>
        </div>
      </div>
      
      {/* Chess Basics */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Chess Basics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {chessBasics.map((item, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-4 text-primary">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Button variant="outline" className="w-full">Learn More</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Tactical Concepts */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Tactical Concepts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tacticalConcepts.map((item, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-4 text-accent">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Button variant="outline" className="w-full">Learn More</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Strategic Concepts */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Strategic Concepts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {strategicConcepts.map((item, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-4 text-primary/80">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Button variant="outline" className="w-full">Learn More</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Video Resources */}
      <section className="mb-12 bg-gray-50 rounded-xl p-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Video Lessons</h2>
            <p className="text-gray-600 mb-6">
              Watch our curated collection of video lessons from chess masters and improve your game with visual instruction.
            </p>
            <Button className="bg-primary text-white hover:bg-primary/90">
              Browse Video Library
            </Button>
          </div>
          <div className="md:w-1/2 md:pl-8 flex justify-center">
            <div className="w-full max-w-md aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-16 h-16 text-gray-400">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
        </div>
      </section>
      
      {/* Learning Path */}
      <section>
        <div className="bg-gray-900 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Start Your Structured Learning Path</h2>
          <p className="mb-6">
            Follow our step-by-step learning path designed to take you from beginner to advanced player with structured lessons and exercises.
          </p>
          <div className="flex space-x-4">
            <Button className="bg-white text-gray-900 hover:bg-white/90">
              Beginner Path
            </Button>
            <Button className="bg-accent text-white hover:bg-accent/90">
              Intermediate Path
            </Button>
            <Button className="bg-primary text-white hover:bg-primary/90">
              Advanced Path
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Learn;