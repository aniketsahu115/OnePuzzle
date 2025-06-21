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
  const { connected, walletAddress, wallet } = useWallet();
  const [isMinting, setIsMinting] = React.useState(false);
  const [mintedNftAddress, setMintedNftAddress] = React.useState<string | null>(bestAttempt?.mintedNftAddress || null);
  
  // Update mintedNftAddress when bestAttempt changes
  React.useEffect(() => {
    if (bestAttempt?.mintedNftAddress) {
      setMintedNftAddress(bestAttempt.mintedNftAddress);
    }
  }, [bestAttempt]);
  
  // Allow minting for any attempt (for testing)
  const canMintNFT = connected && attempts.length > 0 && !mintedNftAddress;
  const bestOrFirstAttempt = bestAttempt || (attempts.length > 0 ? attempts[0] : null);

  const handleMintNFT = async () => {
    if (!bestOrFirstAttempt || !walletAddress) return;
    try {
      setIsMinting(true);
      // Pass the wallet object to mintNFT for client-side signing
      const txSignature = await mintNFT(bestOrFirstAttempt, walletAddress, wallet || undefined);
      toast({
        title: 'NFT Minted! (Simulation)',
        description: `Your puzzle attempt has been minted as an NFT. Transaction: ${txSignature.substring(0, 12)}...`,
      });
      bestOrFirstAttempt.mintedNftAddress = txSignature;
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
        ) : canMintNFT ? (
          <div className="p-4">
            <div className="border-2 border-accent rounded-lg p-6 mb-4 flex flex-col items-center">
              <div className="w-full max-w-[200px] aspect-square border border-slate-200 flex items-center justify-center mb-4 relative overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Dynamic background gradient based on attempt difficulty */}
                  <defs>
                    <linearGradient id="nftBackground" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1a365d" />
                      <stop offset="100%" stopColor={bestOrFirstAttempt?.isCorrect ? "#4c1d95" : "#1e3a8a"} />
                    </linearGradient>
                  </defs>
                  <rect width="100" height="100" fill="url(#nftBackground)" />
                  <rect x="5" y="5" width="90" height="90" fill="none" stroke="#f8fafc" strokeWidth="0.5" rx="2" />
                  <text x="50" y="18" fontSize="8" fontWeight="bold" textAnchor="middle" fill="white">CHESS PUZZLE NFT</text>
                  <text x="50" y="26" fontSize="4" textAnchor="middle" fill="#94a3b8">DATE: {new Date().toLocaleDateString()}</text>
                  <rect x="30" y="30" width="40" height="8" rx="4" fill={
                    bestOrFirstAttempt?.isCorrect ? 
                      (bestOrFirstAttempt.timeTaken < 30 ? "#22c55e" : 
                       bestOrFirstAttempt.timeTaken < 60 ? "#eab308" : 
                       "#f97316") : "#64748b"
                  } />
                  <text x="50" y="36" fontSize="5" fontWeight="bold" textAnchor="middle" fill="white">
                    {bestOrFirstAttempt?.isCorrect ? 
                      (bestOrFirstAttempt.timeTaken < 30 ? "EXCELLENT" : 
                       bestOrFirstAttempt.timeTaken < 60 ? "GREAT" : 
                       "GOOD") : "ATTEMPT"}
                  </text>
                  <text x="50" y="50" fontSize="7" textAnchor="middle" fill="white">Move: {bestOrFirstAttempt?.move || '—'}</text>
                  <text x="50" y="60" fontSize="7" textAnchor="middle" fill="white">Time: {bestOrFirstAttempt ? formatTime(bestOrFirstAttempt.timeTaken) : '—'}</text>
                  <text x="50" y="70" fontSize="7" textAnchor="middle" fill="white">Result: {bestOrFirstAttempt?.isCorrect ? 'Correct' : 'Incorrect'}</text>
                  <text x="50" y="80" fontSize="7" textAnchor="middle" fill="white">Attempt: {bestOrFirstAttempt?.attemptNumber || '—'}/3</text>
                  <circle cx="50" cy="90" r="5" fill="#14f195" opacity="0.3" />
                  <text x="50" y="92" fontSize="4" textAnchor="middle" fill="#ffffff">Solana cNFT</text>
                </svg>
              </div>
              <p className="text-slate-700 text-sm mb-1">Your best attempt is ready to mint!</p>
              <p className="text-xs text-slate-500">Record your achievement on-chain</p>
            </div>
            <Button 
              className="w-full px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
              onClick={handleMintNFT}
              disabled={isMinting}
            >
              {isMinting ? 'Minting...' : 'Mint as NFT'}
            </Button>
          </div>
        ) : (
          <div className="p-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 mb-4 flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mb-3 text-slate-400">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <path d="M8.5 7h7"></path>
                <path d="M8.5 10.5h7"></path>
                <path d="M8.5 14h7"></path>
                <path d="M8.5 17.5h7"></path>
              </svg>
              <h4 className="font-bold mb-2">No NFT Available</h4>
              <p className="text-slate-500 mb-2">You must solve the puzzle correctly to mint your daily NFT.</p>
              <p className="text-xs text-slate-400">Try again tomorrow for another chance!</p>
            </div>
            <Button className="w-full px-4 py-2 bg-slate-200 text-slate-500 rounded-lg cursor-not-allowed" disabled>
              Preview NFT
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NFTPreviewCard;

