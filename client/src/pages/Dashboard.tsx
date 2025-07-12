import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Crown,
  LayoutGrid,
  List
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { fetchDigitalAsset, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { publicKey } from '@metaplex-foundation/umi';

// Types
interface Attempt {
  id: number;
  userId: string;
  puzzleId: number;
  move: string;
  timeTaken: number;
  isCorrect: boolean;
  nftAddress?: string;
  attemptDate: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  mintedNftAddress?: string;
}

interface FetchedNFT {
  id: string; // Mint address
  name: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

interface UserStats {
  totalPuzzles: number;
  correctPuzzles: number;
  successRate: number;
  currentStreak: number;
  longestStreak: number;
  avgSolveTime: number;
  mostActiveDay: string;
  mostActiveDayCount: number;
  fastestSolve: number;
  fastestSolveDate: string;
}

// A specific interface for the off-chain JSON metadata of our NFTs.
interface OffChainMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

const Dashboard: React.FC = () => {
  const { connected, walletAddress, mintedNfts } = useWallet();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('overview');
  const [recentAttempts, setRecentAttempts] = useState<Attempt[] | null>(null);
  const [nftCollection, setNftCollection] = useState<FetchedNFT[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate user stats directly from the fetched attempts, like on the Home page
  const userStats = useMemo(() => {
    if (!recentAttempts || recentAttempts.length === 0) {
      return {
        totalPuzzles: 0,
        correctPuzzles: 0,
        successRate: 0,
        avgSolveTime: 0,
        currentStreak: 0,
        longestStreak: 0,
        mostActiveDay: 'N/A',
        mostActiveDayCount: 0,
        fastestSolve: 0,
        fastestSolveDate: 'N/A',
      };
    }

    const totalPuzzles = recentAttempts.length;
    const correctPuzzles = recentAttempts.filter(a => a.isCorrect).length;
    const successRate = totalPuzzles > 0 ? Math.round((correctPuzzles / totalPuzzles) * 100) : 0;
    const avgSolveTime = totalPuzzles > 0 ? recentAttempts.reduce((acc, a) => acc + a.timeTaken, 0) / totalPuzzles : 0;

    // Fastest Solve
    const fastestSolveAttempt = recentAttempts.reduce((fastest, current) => {
      return current.timeTaken < fastest.timeTaken ? current : fastest;
    });
    const fastestSolve = fastestSolveAttempt.timeTaken;
    const fastestSolveDate = new Date(fastestSolveAttempt.attemptDate).toLocaleDateString();

    // Most Active Day
    const activityByDay: { [key: string]: number } = recentAttempts.reduce((acc, a) => {
      const date = new Date(a.attemptDate).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    let mostActiveDay = 'N/A';
    let mostActiveDayCount = 0;
    for (const date in activityByDay) {
      if (activityByDay[date] > mostActiveDayCount) {
        mostActiveDayCount = activityByDay[date];
        mostActiveDay = date;
      }
    }

    return {
      totalPuzzles,
      correctPuzzles,
      successRate,
      avgSolveTime,
      currentStreak: 0, // Placeholder
      longestStreak: 0, // Placeholder
      mostActiveDay,
      mostActiveDayCount,
      fastestSolve,
      fastestSolveDate,
    };
  }, [recentAttempts]);

  const fetchDashboardData = useCallback(async () => {
    if (!walletAddress) {
      setRecentAttempts([]);
      setNftCollection([]);
      return;
    }
    setIsLoading(true);
    try {
      // Fetch recent attempts
      const attemptsRes = await apiRequest('GET', `/api/attempts?walletAddress=${walletAddress}`);
      const attemptsData = await attemptsRes.json();
      // Sort attempts to ensure the most recent is first
      attemptsData.sort((a: Attempt, b: Attempt) => new Date(b.attemptDate).getTime() - new Date(a.attemptDate).getTime());
      setRecentAttempts(attemptsData);

      // Fetch the master list of NFTs from the server
      const nftsRes = await apiRequest('GET', `/api/nfts/${walletAddress}`);
      const { nfts: serverMintedAttempts } = await nftsRes.json();
      const serverMintAddresses = serverMintedAttempts
        .map((a: Attempt) => a.mintedNftAddress)
        .filter(Boolean) as string[];

      // Combine server list with newly minted NFTs from the context
      const allMintAddresses = Array.from(new Set([...serverMintAddresses, ...mintedNfts]));

      console.log("Combined mints for fetching:", allMintAddresses);

      if (allMintAddresses.length > 0) {
        const umi = createUmi(import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com').use(mplTokenMetadata());
        const nftPromises = allMintAddresses.map(async (mintAddress: string) => {
          try {
            const asset = await fetchDigitalAsset(umi, publicKey(mintAddress));
            const json = await umi.downloader.downloadJson<OffChainMetadata>(asset.metadata.uri);
            return { id: mintAddress, name: asset.metadata.name, image: json.image || '', attributes: json.attributes || [] };
          } catch (e) {
            console.error(`Failed to fetch metadata for mint ${mintAddress}`, e);
            return null;
          }
        });
        const fetchedNfts = (await Promise.all(nftPromises)).filter(nft => nft !== null) as FetchedNFT[];
        
        // Sort NFTs by the attempt ID in the name to find the latest one
        fetchedNfts.sort((a, b) => {
          const idA = parseInt(a.name.split('#')[1] || '0');
          const idB = parseInt(b.name.split('#')[1] || '0');
          return idB - idA; // Sort in descending order
        });

        setNftCollection(fetchedNfts);
      } else {
        setNftCollection([]);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setRecentAttempts([]);
      setNftCollection([]);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, mintedNfts]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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
          <h1 className="text-3xl font-bold mb-4 text-crisp-bold">Connect Your Wallet</h1>
          <p className="text-gray-600 mb-8 text-crisp">
            Please connect your Solana wallet to view your personal dashboard, track your puzzle history, and manage your NFT collection.
          </p>
          <Button variant="outline" className="bg-primary text-white px-6">Connect Wallet</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-lg mx-auto">
          <div className="mb-8 text-7xl">♟️</div>
          <h1 className="text-3xl font-bold mb-4 text-crisp-bold">Loading Dashboard...</h1>
          <p className="text-gray-600 text-crisp">
            Please wait while we fetch your data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2 text-crisp-bold">Player Dashboard</h1>
        <div className="flex items-center text-gray-500 text-crisp">
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
            <div className="text-3xl font-bold">{userStats.successRate}%</div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span>{userStats.correctPuzzles} correct out of {userStats.totalPuzzles}</span>
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
            <div className="text-3xl font-bold">{userStats.currentStreak} days</div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span>Longest: {userStats.longestStreak} days</span>
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
            <div className="text-3xl font-bold">{formatTime(userStats.avgSolveTime)}</div>
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
            <div className="text-3xl font-bold">
              {recentAttempts ? recentAttempts.filter(a => a.mintedNftAddress).length : 0}
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span>Latest: {nftCollection?.[0]?.name || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs 
        defaultValue="overview" 
        className="w-full mt-8"
        onValueChange={(tab) => {
          if (tab === 'collection' || tab === 'overview') {
            fetchDashboardData();
          }
        }}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Puzzle History</TabsTrigger>
          <TabsTrigger value="collection">NFT Collection</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        {/* History Tab */}
        <TabsContent value="overview">
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
              {isLoading ? (
                <div className="text-center p-8">Loading history...</div>
              ) : recentAttempts && recentAttempts.length > 0 ? (
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
                  {recentAttempts.map((attempt: Attempt, idx: number) => (
                    <div 
                      key={attempt.id} 
                      className={`grid grid-cols-7 p-4 text-sm ${
                        idx !== recentAttempts.length - 1 ? 'border-b' : ''
                      }`}
                    >
                      <div className="font-medium">{new Date(attempt.attemptDate).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}</div>
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
                        {attempt.mintedNftAddress ? (
                          <span className="flex items-center text-blue-600">
                            <span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                            Minted
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </div>
                      <div className="text-right">
                        {attempt.mintedNftAddress ? (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(`https://explorer.solana.com/address/${attempt.mintedNftAddress}`, '_blank')}
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
              ) : (
                <div className="text-center p-8 text-gray-500">
                  No puzzle attempts found. Go play today's puzzle!
                </div>
              )}
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
              <div className="flex justify-between items-center">
                <CardTitle>My NFT Collection</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center p-8">Loading your NFT collection...</div>
              ) : !nftCollection || nftCollection.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  You haven't minted any NFTs yet. Solve a puzzle and mint one!
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nftCollection.map((nft) => (
                    <Card key={nft.id}>
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        <img src={nft.image} alt={nft.name} className="object-cover w-full h-full"/>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold">{nft.name}</h3>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full mt-4"
                          onClick={() => window.open(`https://explorer.solana.com/address/${nft.id}?cluster=devnet`, '_blank')}
                        >
                          View on Explorer
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {nftCollection.map((nft) => (
                    <div key={nft.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                       <div className="flex items-center gap-4">
                        <img src={nft.image} alt={nft.name} className="w-12 h-12 rounded-md object-cover"/>
                        <div>
                          <h4 className="font-semibold">{nft.name}</h4>
                          <p className="text-sm text-gray-500">{truncateString(nft.id, 12)}</p>
                        </div>
                       </div>
                       <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(`https://explorer.solana.com/address/${nft.id}?cluster=devnet`, '_blank')}
                        >
                          View
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
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