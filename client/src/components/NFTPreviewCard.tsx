import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Attempt } from '@shared/schema';
import { formatTime } from '@/lib/utils';
import { useWallet } from '@/lib/useWallet';
import { mintNFT } from '@/lib/solana';
import { toast } from '@/hooks/use-toast';

interface NFTPreviewCardProps {
  bestAttempt: Attempt | null;
  attempts: Attempt[];
}

const NFTPreviewCard: React.FC<NFTPreviewCardProps> = ({ bestAttempt, attempts }) => {
  const { connected } = useWallet();
  const [isMinting, setIsMinting] = React.useState(false);
  const [mintedNftAddress, setMintedNftAddress] = React.useState<string | null>(bestAttempt?.mintedNftAddress || null);
  
  // Update mintedNftAddress when bestAttempt changes
  React.useEffect(() => {
    if (bestAttempt?.mintedNftAddress) {
      setMintedNftAddress(bestAttempt.mintedNftAddress);
    }
  }, [bestAttempt]);
  
  const hasCorrectAttempt = attempts.some(attempt => attempt.isCorrect);
  const canMintNFT = connected && hasCorrectAttempt && !mintedNftAddress;
  
  const handleMintNFT = async () => {
    if (!bestAttempt) return;
    
    try {
      setIsMinting(true);
      
      console.log('Minting NFT with attempt:', bestAttempt);
      
      // Use the mintNFT function from solana.ts
      // This is now set up to simulate a successful mint in development
      const txSignature = await mintNFT(bestAttempt);
      
      toast({
        title: 'NFT Minted! (Simulation)',
        description: `Your puzzle attempt has been minted as an NFT. Transaction: ${txSignature.substring(0, 12)}...`,
      });
      
      // Manually update the component state to show the minted NFT
      if (bestAttempt) {
        bestAttempt.mintedNftAddress = txSignature;
      }
      
      // Update our local state to trigger re-render
      setMintedNftAddress(txSignature);
      
    } catch (error) {
      toast({
        title: 'Minting failed',
        description: error instanceof Error ? error.message : 'Failed to mint NFT',
        variant: 'destructive',
      });
    } finally {
      setIsMinting(false);
    }
  };
  
  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-primary p-4 text-white flex justify-between items-center">
        <h3 className="font-bold">Daily NFT Preview</h3>
        <span className="text-xs bg-white/20 rounded px-2 py-1">cNFT on Solana</span>
      </div>
      <CardContent className="p-4 text-center">
        {mintedNftAddress ? (
          <div className="p-4">
            <div className="mb-4 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mb-3 text-green-500">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <h4 className="font-bold mb-2">NFT Successfully Minted!</h4>
              <p className="text-sm text-slate-600 mb-2">Your daily puzzle attempt has been recorded on Solana</p>
              <div className="font-mono text-xs bg-slate-100 p-2 rounded break-all">
                {mintedNftAddress}
              </div>
            </div>
            <Button 
              className="w-full px-4 py-2 bg-primary text-white rounded-lg"
              onClick={() => window.open(`https://explorer.solana.com/address/${mintedNftAddress}`, '_blank')}
            >
              View on Explorer
            </Button>
          </div>
        ) : hasCorrectAttempt ? (
          <div className="p-4">
            <div className="border-2 border-accent rounded-lg p-6 mb-4 flex flex-col items-center">
              <div className="w-full max-w-[200px] aspect-square border border-slate-200 flex items-center justify-center mb-4 relative overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect width="100" height="100" fill="#1a365d" />
                  <text x="50" y="30" fontSize="10" textAnchor="middle" fill="white">OnePuzzle NFT</text>
                  <text x="50" y="45" fontSize="7" textAnchor="middle" fill="white">Move: {bestAttempt?.move || '—'}</text>
                  <text x="50" y="55" fontSize="7" textAnchor="middle" fill="white">Time: {bestAttempt ? formatTime(bestAttempt.timeTaken) : '—'}</text>
                  <text x="50" y="65" fontSize="7" textAnchor="middle" fill="white">Result: {bestAttempt?.isCorrect ? 'Correct' : 'Incorrect'}</text>
                  <text x="50" y="75" fontSize="7" textAnchor="middle" fill="white">Attempt: {bestAttempt?.attemptNumber || '—'}/3</text>
                  <text x="50" y="90" fontSize="5" textAnchor="middle" fill="#f59e0b">Solana cNFT</text>
                </svg>
              </div>
              <p className="text-slate-700 text-sm mb-1">Your best attempt is ready to mint!</p>
              <p className="text-xs text-slate-500">Record your achievement on-chain</p>
            </div>
            <Button 
              className="w-full px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
              onClick={handleMintNFT}
              disabled={isMinting || !canMintNFT}
            >
              {isMinting ? 'Minting...' : 'Mint as NFT'}
            </Button>
          </div>
        ) : (
          <div>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 mb-4 flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mb-3 text-slate-400">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <path d="M8.5 7h7"></path>
                <path d="M8.5 10.5h7"></path>
                <path d="M8.5 14h7"></path>
                <path d="M8.5 17.5h7"></path>
              </svg>
              <p className="text-slate-500 mb-2">Complete today's puzzle to mint your daily NFT</p>
              <p className="text-xs text-slate-400">Your NFT will include your move, time, and board position</p>
            </div>
            <Button 
              className="w-full px-4 py-2 bg-slate-200 text-slate-500 rounded-lg cursor-not-allowed" 
              disabled
            >
              Preview NFT
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NFTPreviewCard;
