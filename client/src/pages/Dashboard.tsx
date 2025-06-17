import React, { useState, useEffect } from 'react';
import { useWallet } from '@/lib/useWallet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { formatTime, truncateString } from '@/lib/utils';
import { 
  Calendar,
  ChevronRight,
  Award,
  Clock,
  TrendingUp,
  BarChart,
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  Crown
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Types
interface Attempt {
  id: number;
  userId: string;
  puzzleId: number;
  move: string;
  timeTaken: number;
  isCorrect: boolean;
  nftAddress?: string;
  timestamp: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface NFT {
  id: number;
  timestamp: string;
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeTaken: number;
  move: string;
  mint: string;
  rarity: 'Common' | 'Uncommon' | 'Rare';
}

interface UserStats {
  totalPuzzles: number;
  correctPuzzles: number;
  successRate: number;
  currentStreak: number;
  longestStreak: number;
  avgSolveTime: number;
}

const Dashboard: React.FC = () => {
  const { connected, walletAddress } = useWallet();
  const [viewMode, setViewMode] = useState('grid');

  // Fetch user stats
  const { data: userStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/stats', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return null;
      const response = await apiRequest('GET', `/api/stats?walletAddress=${walletAddress}`);
      if (!response.ok) throw new Error('Failed to fetch user stats');
      return await response.json();
    },
    enabled: !!walletAddress,
  });

  // Fetch recent attempts
  const { data: recentAttempts, isLoading: isLoadingAttempts } = useQuery({
    queryKey: ['/api/attempts', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return [];
      const response = await apiRequest('GET', `/api/attempts?walletAddress=${walletAddress}`);
      if (!response.ok) throw new Error('Failed to fetch attempts');
      return await response.json();
    },
    enabled: !!walletAddress,
  });

  // Fetch NFT collection
  const { data: nftCollection, isLoading: isLoadingNFTs } = useQuery({
    queryKey: ['/api/nfts', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return [];
      const response = await apiRequest('GET', `/api/nfts?walletAddress=${walletAddress}`);
      if (!response.ok) throw new Error('Failed to fetch NFTs');
      return await response.json();
    },
    enabled: !!walletAddress,
  });

  // Calculate performance by difficulty
  const performanceByDifficulty = React.useMemo(() => {
    if (!recentAttempts) return {
      easy: { total: 0, correct: 0, rate: 0 },
      medium: { total: 0, correct: 0, rate: 0 },
      hard: { total: 0, correct: 0, rate: 0 }
    };

    const difficultyStats = {
      easy: { total: 0, correct: 0, rate: 0 },
      medium: { total: 0, correct: 0, rate: 0 },
      hard: { total: 0, correct: 0, rate: 0 }
    };

    recentAttempts.forEach((attempt: Attempt) => {
      const difficulty = attempt.difficulty?.toLowerCase() as keyof typeof difficultyStats;
      if (difficulty && difficultyStats[difficulty]) {
        difficultyStats[difficulty].total++;
        if (attempt.isCorrect) {
          difficultyStats[difficulty].correct++;
        }
      }
    });

    // Calculate success rates
    Object.keys(difficultyStats).forEach((key) => {
      const k = key as keyof typeof difficultyStats;
      difficultyStats[k].rate = difficultyStats[k].total > 0 
        ? Math.round((difficultyStats[k].correct / difficultyStats[k].total) * 100) 
        : 0;
    });

    return difficultyStats;
  }, [recentAttempts]);

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-lg mx-auto">
          <div className="mb-8 text-7xl">♟️</div>
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-600 mb-8">
            Please connect your Solana wallet to view your personal dashboard, track your puzzle history, and manage your NFT collection.
          </p>
          <Button variant="outline" className="bg-primary text-white px-6">Connect Wallet</Button>
        </div>
      </div>
    );
  }

  if (isLoadingStats || isLoadingAttempts || isLoadingNFTs) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-lg mx-auto">
          <div className="mb-8 text-7xl">♟️</div>
          <h1 className="text-3xl font-bold mb-4">Loading Dashboard...</h1>
          <p className="text-gray-600">
            Please wait while we fetch your data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Player Dashboard</h1>
        <div className="flex items-center text-gray-500">
          <span className="font-mono">{truncateString(walletAddress || '', 12)}</span>
          <span className="mx-2">•</span>
          <span className="flex items-center text-green-500">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            Connected
          </span>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="outline" className="px-2 py-1">All Time</Badge>
            </div>
            <h3 className="text-lg font-medium text-gray-500">Success Rate</h3>
            <div className="text-3xl font-bold">{userStats?.successRate || 0}%</div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span>{userStats?.correctPuzzles || 0} correct out of {userStats?.totalPuzzles || 0}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="outline" className="px-2 py-1">Current</Badge>
            </div>
            <h3 className="text-lg font-medium text-gray-500">Puzzle Streak</h3>
            <div className="text-3xl font-bold">{userStats?.currentStreak || 0} days</div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span>Longest: {userStats?.longestStreak || 0} days</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="outline" className="px-2 py-1">Average</Badge>
            </div>
            <h3 className="text-lg font-medium text-gray-500">Solve Time</h3>
            <div className="text-3xl font-bold">{formatTime(userStats?.avgSolveTime || 0)}</div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span>Last solve: {recentAttempts?.[0] ? formatTime(recentAttempts[0].timeTaken) : 'N/A'}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="outline" className="px-2 py-1">Collection</Badge>
            </div>
            <h3 className="text-lg font-medium text-gray-500">NFTs Minted</h3>
            <div className="text-3xl font-bold">{nftCollection?.length || 0}</div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span>Latest: {nftCollection?.[0]?.date || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="history" className="mb-12">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="history">Puzzle History</TabsTrigger>
          <TabsTrigger value="collection">NFT Collection</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Puzzle Attempts</span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span>View Calendar</span>
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-7 bg-gray-50 p-4 text-sm font-medium text-gray-500 border-b">
                  <div>Date</div>
                  <div>Difficulty</div>
                  <div>Result</div>
                  <div>Move</div>
                  <div>Time</div>
                  <div>NFT Status</div>
                  <div className="text-right">Actions</div>
                </div>
                {recentAttempts?.map((attempt: Attempt, idx: number) => (
                  <div 
                    key={attempt.id} 
                    className={`grid grid-cols-7 p-4 text-sm ${
                      idx !== recentAttempts.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div className="font-medium">{new Date(attempt.timestamp).toLocaleDateString()}</div>
                    <div>
                      <Badge variant={
                        attempt.difficulty === "Easy" ? "default" : 
                        attempt.difficulty === "Medium" ? "secondary" : 
                        "destructive"
                      }>
                        {attempt.difficulty}
                      </Badge>
                    </div>
                    <div>
                      {attempt.isCorrect ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Correct
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <XCircle className="w-4 h-4 mr-1" />
                          Incorrect
                        </span>
                      )}
                    </div>
                    <div className="font-mono">{attempt.move}</div>
                    <div>{formatTime(attempt.timeTaken)}</div>
                    <div>
                      {attempt.nftAddress ? (
                        <span className="flex items-center text-blue-600">
                          <span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                          Minted
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </div>
                    <div className="text-right">
                      {attempt.nftAddress ? (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(`https://explorer.solana.com/address/${attempt.nftAddress}`, '_blank')}
                        >
                          View NFT
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      ) : attempt.isCorrect ? (
                        <Button variant="outline" size="sm">
                          Mint NFT
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" disabled>
                          N/A
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-6">
                <Button variant="outline">View All History</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Collection Tab */}
        <TabsContent value="collection">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your NFT Collection</span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'bg-transparent'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'bg-transparent'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nftCollection?.map((nft: NFT) => (
                    <Card key={nft.id} className="overflow-hidden h-full">
                      <div 
                        className="h-48 bg-gray-100 relative"
                        style={{
                          backgroundImage: `url(${nft.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Crown className="text-white w-12 h-12 opacity-70" />
                        </div>
                        <Badge 
                          className="absolute top-3 right-3"
                          variant={
                            nft.rarity === "Common" ? "default" : 
                            nft.rarity === "Uncommon" ? "secondary" : 
                            "destructive"
                          }
                        >
                          {nft.rarity}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold">Puzzle Solution</h3>
                          <span className="text-xs text-gray-500">{new Date(nft.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <span className="text-gray-500">Difficulty:</span>
                            <span className="ml-2 font-medium">{nft.difficulty}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Move:</span>
                            <span className="ml-2 font-mono">{nft.move}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Time:</span>
                            <span className="ml-2">{formatTime(nft.timeTaken)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Mint:</span>
                            <span className="ml-2 font-mono text-xs">{truncateString(nft.mint, 8)}</span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full"
                          onClick={() => window.open(`https://explorer.solana.com/address/${nft.mint}`, '_blank')}
                        >
                          View on Explorer
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 bg-gray-50 p-4 text-sm font-medium text-gray-500 border-b">
                    <div>Date</div>
                    <div>Difficulty</div>
                    <div>Move</div>
                    <div>Time</div>
                    <div>Rarity</div>
                    <div className="text-right">View</div>
                  </div>
                  {nftCollection?.map((nft: NFT, idx: number) => (
                    <div 
                      key={nft.id} 
                      className={`grid grid-cols-6 p-4 text-sm items-center ${
                        idx !== nftCollection.length - 1 ? 'border-b' : ''
                      }`}
                    >
                      <div className="font-medium">{new Date(nft.timestamp).toLocaleDateString()}</div>
                      <div>
                        <Badge variant={
                          nft.difficulty === "Easy" ? "default" : 
                          nft.difficulty === "Medium" ? "secondary" : 
                          "destructive"
                        }>
                          {nft.difficulty}
                        </Badge>
                      </div>
                      <div className="font-mono">{nft.move}</div>
                      <div>{formatTime(nft.timeTaken)}</div>
                      <div>
                        <Badge variant="outline" className={
                          nft.rarity === "Common" ? "text-green-600 bg-green-50" : 
                          nft.rarity === "Uncommon" ? "text-blue-600 bg-blue-50" : 
                          "text-purple-600 bg-purple-50"
                        }>
                          {nft.rarity}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(`https://explorer.solana.com/address/${nft.mint}`, '_blank')}
                        >
                          View
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Difficulty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <Badge className="mr-2">Easy</Badge>
                        <span className="text-sm text-gray-500">
                          {performanceByDifficulty.easy.correct} / {performanceByDifficulty.easy.total} puzzles
                        </span>
                      </div>
                      <span className="font-bold">{performanceByDifficulty.easy.rate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${performanceByDifficulty.easy.rate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <Badge variant="secondary" className="mr-2">Medium</Badge>
                        <span className="text-sm text-gray-500">
                          {performanceByDifficulty.medium.correct} / {performanceByDifficulty.medium.total} puzzles
                        </span>
                      </div>
                      <span className="font-bold">{performanceByDifficulty.medium.rate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${performanceByDifficulty.medium.rate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <Badge variant="destructive" className="mr-2">Hard</Badge>
                        <span className="text-sm text-gray-500">
                          {performanceByDifficulty.hard.correct} / {performanceByDifficulty.hard.total} puzzles
                        </span>
                      </div>
                      <span className="font-bold">{performanceByDifficulty.hard.rate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${performanceByDifficulty.hard.rate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Puzzle Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg mb-4">
                  <div className="text-6xl mb-2">📈</div>
                  <p className="text-gray-600">
                    Detailed activity charts will appear here as you solve more puzzles
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Most Active Day
                    </h3>
                    <div className="text-xl font-bold mb-1">
                      {userStats?.mostActiveDay || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {userStats?.mostActiveDayCount || 0} puzzles solved
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Fastest Solution
                    </h3>
                    <div className="text-xl font-bold mb-1">
                      {userStats?.fastestSolve ? formatTime(userStats.fastestSolve) : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {userStats?.fastestSolveDate || 'N/A'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <Calendar className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">Activity Calendar</h3>
                <p className="text-gray-600 mb-4 max-w-lg">
                  Track your daily puzzle activity with our interactive calendar. See your streak, success rate, and performance over time.
                </p>
                <Button>View Full Calendar</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Achievement Banner */}
      <div className="bg-gradient-to-r from-accent to-accent-dark text-white rounded-xl p-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Unlock Advanced Analytics</h2>
            <p className="text-white/90 mb-4">
              Get deeper insights into your chess puzzle performance with our premium analytics dashboard. Track your progress and identify areas for improvement.
            </p>
            <Button className="bg-white text-accent hover:bg-white/90">Upgrade Now</Button>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-white">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;