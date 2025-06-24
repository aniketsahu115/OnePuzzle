import { useState, useEffect } from 'react';
import { PuzzleWithoutSolution } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useWallet } from '@/lib/useWallet';

interface RecommendedPuzzleCardProps {
  getRecommendedPuzzle: () => Promise<PuzzleWithoutSolution | null>;
  onSelect: (puzzle: PuzzleWithoutSolution) => void;
}

export function RecommendedPuzzleCard({ getRecommendedPuzzle, onSelect }: RecommendedPuzzleCardProps) {
  const { connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedPuzzle, setRecommendedPuzzle] = useState<PuzzleWithoutSolution | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (connected) {
      loadRecommendation();
    }
  }, [connected]);

  const loadRecommendation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const puzzle = await getRecommendedPuzzle();
      setRecommendedPuzzle(puzzle);
    } catch (err) {
      console.error('Failed to load recommended puzzle', err);
      setError('Could not load your personalized recommendation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = () => {
    if (recommendedPuzzle) {
      onSelect(recommendedPuzzle);
    }
  };

  if (!connected) {
    return (
      <Card className="bg-gray-50 border-indigo-100 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-indigo-900">Daily Recommendations</CardTitle>
          <CardDescription>Connect your wallet to get personalized puzzle recommendations</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-indigo-900 dark:text-white">Your Recommended Puzzle</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="text-indigo-700 border-indigo-300 hover:bg-indigo-100"
            onClick={loadRecommendation}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'New Recommendation'}
          </Button>
        </div>
        <CardDescription>
          Personalized for your skill level and playing style
        </CardDescription>
      </CardHeader>

      <Separator className="bg-indigo-200/50" />

      <CardContent className="pt-4">
        {isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center p-6 text-red-500">
            <p>{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={loadRecommendation}
            >
              Try Again
            </Button>
          </div>
        ) : recommendedPuzzle ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <h3 className="font-medium text-indigo-900 dark:text-white">Difficulty Level</h3>
                <Badge
                  variant={
                    recommendedPuzzle.difficulty === 'easy' ? 'default' :
                    recommendedPuzzle.difficulty === 'medium' ? 'secondary' :
                    'destructive'
                  }
                  className="capitalize"
                >
                  {recommendedPuzzle.difficulty}
                </Badge>
              </div>

              {recommendedPuzzle.themes && recommendedPuzzle.themes.length > 0 && (
                <div className="space-y-1 sm:text-right">
                  <h3 className="font-medium text-indigo-900 dark:text-white">Puzzle Theme</h3>
                  <div className="flex gap-1 sm:justify-end flex-wrap">
                    {recommendedPuzzle.themes.slice(0, 2).map((theme, i) => (
                      <Badge key={i} variant="outline" className="capitalize bg-white truncate max-w-[100px]">
                        {theme}
                      </Badge>
                    ))}
                    {recommendedPuzzle.themes.length > 2 && (
                      <Badge variant="outline" className="bg-white">
                        +{recommendedPuzzle.themes.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {recommendedPuzzle.recommendationReason && (
              <div className="p-3 bg-indigo-100/50 rounded-lg text-sm text-indigo-700 italic max-h-20 overflow-y-auto">
                {recommendedPuzzle.recommendationReason}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-6 text-gray-500">
            <p>No recommendation available yet</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={loadRecommendation}
            >
              Get Recommendation
            </Button>
          </div>
        )}
      </CardContent>

      {recommendedPuzzle && (
        <CardFooter className="pt-0">
          <Button
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            onClick={handleSelect}
          >
            Try This Puzzle
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}