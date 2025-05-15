import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import solanaPNG from '../assets/sol-logo.png';

const Resources: React.FC = () => {
  const chessBooks = [
    {
      title: "My System",
      author: "Aron Nimzowitsch",
      description:
        "A foundational work on positional chess that has influenced generations of players.",
      level: "Intermediate",
      year: "1925",
      category: "Strategy",
    },
    {
      title: "Bobby Fischer Teaches Chess",
      author: "Bobby Fischer",
      description:
        "A programmed learning approach to tactical chess with exercises of increasing difficulty.",
      level: "Beginner",
      year: "1966",
      category: "Tactics",
    },
    {
      title: "Zurich International Chess Tournament 1953",
      author: "David Bronstein",
      description:
        "Detailed analysis of one of the most important tournaments in chess history.",
      level: "Advanced",
      year: "1979",
      category: "Tournament Books",
    },
    {
      title: "Modern Chess Openings",
      author: "Nick de Firmian",
      description:
        "A comprehensive reference of chess openings and variations.",
      level: "All Levels",
      year: "2008",
      category: "Openings",
    },
    {
      title: "Endgame Strategy",
      author: "Mikhail Shereshevsky",
      description: "A classic guide to mastering strategic endgame play.",
      level: "Intermediate",
      year: "1985",
      category: "Endgames",
    },
    {
      title: "The Art of Attack in Chess",
      author: "Vladimir Vukovic",
      description: "A systematic exploration of attacking techniques in chess.",
      level: "Intermediate",
      year: "1965",
      category: "Tactics",
    },
  ];

  const chessWebsites = [
    {
      name: "Chess.com",
      description:
        "Play online, learn with lessons, and follow major chess tournaments.",
      url: "https://www.chess.com",
      features: ["Online Play", "Puzzles", "Video Lessons"],
    },
    {
      name: "Lichess.org",
      description:
        "Free, open-source chess server with analysis, puzzles, and studies.",
      url: "https://lichess.org",
      features: ["Open Source", "Free Analysis", "Study Creation"],
    },
    {
      name: "Chess24",
      description:
        "Premium chess content, tournament coverage, and video series from top grandmasters.",
      url: "https://chess24.com",
      features: ["Tournament Coverage", "GM Analysis", "Video Series"],
    },
    {
      name: "ChessBase",
      description: "The professional's choice for database and analysis tools.",
      url: "https://chessbase.com",
      features: ["Database", "Analysis Tools", "Opening Reports"],
    },
  ];

  const chessSoftware = [
    {
      name: "Stockfish",
      description:
        "The powerful open-source chess engine used by professionals worldwide.",
      type: "Engine",
      platforms: ["Windows", "macOS", "Linux", "Web"],
    },
    {
      name: "ChessBase",
      description:
        "Professional database software for managing chess games and preparing openings.",
      type: "Database",
      platforms: ["Windows"],
    },
    {
      name: "SCID vs PC",
      description:
        "Free, open-source chess database application with powerful search capabilities.",
      type: "Database",
      platforms: ["Windows", "macOS", "Linux"],
    },
    {
      name: "Chess.com App",
      description:
        "Mobile chess platform for playing, learning, and solving puzzles on the go.",
      type: "Mobile App",
      platforms: ["iOS", "Android"],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
          Chess Resources
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover the best books, websites, software, and tools to enhance your
          chess learning journey
        </p>
      </div>

      <Tabs defaultValue="books" className="w-full mb-12">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="websites">Websites</TabsTrigger>
          <TabsTrigger value="software">Software</TabsTrigger>
        </TabsList>

        {/* Books Tab */}
        <TabsContent value="books">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chessBooks.map((book, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="p-6 md:w-3/4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold">{book.title}</h3>
                        <Badge
                          variant={
                            book.level === "Beginner"
                              ? "default"
                              : book.level === "Intermediate"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {book.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        By {book.author} ({book.year})
                      </p>
                      <p className="text-gray-600 mb-4">{book.description}</p>
                      <Badge variant="outline">{book.category}</Badge>
                    </div>
                    <div className="bg-gray-100 md:w-1/4 flex items-center justify-center p-6">
                      <div className="w-24 h-36 bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                        <span className="text-2xl text-gray-400">📚</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button className="bg-primary text-white">
              Browse More Chess Books
            </Button>
          </div>
        </TabsContent>

        {/* Websites Tab */}
        <TabsContent value="websites">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chessWebsites.map((site, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{site.name}</h3>
                  <p className="text-gray-600 mb-4">{site.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {site.features.map((feature, fidx) => (
                      <Badge key={fidx} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => window.open(site.url, "_blank")}
                  >
                    Visit Website
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 bg-gray-50 p-6 rounded-lg dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 dark:text-white">
              Chess Communities
            </h3>
            <p className="mb-4">
              Join online chess communities to discuss games, share insights,
              and connect with other players.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="w-full dark:text-black">
                Chess.com Forums
              </Button>
              <Button variant="outline" className="w-full dark:text-black">
                Reddit r/chess
              </Button>
              <Button variant="outline" className="w-full dark:text-black">
                Chess Discord Servers
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Software Tab */}
        <TabsContent value="software">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {chessSoftware.map((software, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{software.name}</h3>
                  <Badge className="mb-3">{software.type}</Badge>
                  <p className="text-gray-600 mb-4">{software.description}</p>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Available on: </span>
                    {software.platforms.join(", ")}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Integration with Solana</h3>
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-3/4 mb-6 md:mb-0 md:pr-6">
                  <h4 className="text-xl font-bold mb-3">
                    OnePuzzle NFT Collection
                  </h4>
                  <p className="text-gray-700 mb-4">
                    Our OnePuzzle app utilizes Solana's blockchain technology to
                    mint your daily puzzle accomplishments as compressed NFTs,
                    creating a permanent record of your chess journey.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-white">
                      Solana Integration
                    </Badge>
                    <Badge variant="outline" className="bg-white">
                      Compressed NFTs
                    </Badge>
                    <Badge variant="outline" className="bg-white">
                      Performance Tracking
                    </Badge>
                  </div>
                </div>
                <div className="md:w-1/4 flex justify-center">
                  <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
                    <img
                      src={solanaPNG}
                      alt="Solana Logo"
                      className="w-14 h-14"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Newsletter */}
      <div className="bg-gray-900 text-white rounded-xl p-8 mb-12">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-3">Stay Updated</h2>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter to receive chess resources, puzzle
              alerts, and news about the intersection of chess and blockchain.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white flex-grow focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="bg-primary text-white hover:bg-primary/90">
                Subscribe
              </Button>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="bg-gray-800 w-32 h-32 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-12 h-12 text-primary"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Join Our Chess Community
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-8 h-8 text-primary"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Discord Server</h3>
              <p className="text-gray-600 mb-4">
                Join our active Discord community to discuss puzzles, share
                insights, and connect with other players.
              </p>
              <Button variant="outline" className="w-full">
                Join Discord
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-8 h-8 text-primary"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Weekly Webinars</h3>
              <p className="text-gray-600 mb-4">
                Attend our free weekly webinars where chess experts discuss
                strategy, analyze games, and answer questions.
              </p>
              <Button variant="outline" className="w-full">
                View Schedule
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-8 h-8 text-primary"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">OnePuzzle Blog</h3>
              <p className="text-gray-600 mb-4">
                Read our blog for in-depth articles on chess improvement, NFTs,
                and the evolving chess ecosystem.
              </p>
              <Button variant="outline" className="w-full">
                Visit Blog
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Resources;
