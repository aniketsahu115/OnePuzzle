import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Attempt } from '@shared/schema';
import { formatTime } from '@/lib/utils';
import { useWallet } from '@/lib/useWallet';
import { mintNFT } from '@/lib/solana';
import { toast } from '@/hooks/use-toast';
import GradientCard from './GradientCard';

interface NFTPreviewCardProps {
  bestAttempt: Attempt | null;
  attempts: Attempt[];
}

const NFTPreviewCard: React.FC<NFTPreviewCardProps> = ({ bestAttempt, attempts }) => {
  const { connected, walletAddress, wallet, addMintedNft } = useWallet();
  const [isMinting, setIsMinting] = useState(false);
  const [mintedNftAddress, setMintedNftAddress] = useState<string | null>(bestAttempt?.mintedNftAddress || null);
  
  // This would be your actual NFT data, fetched from an API using the mintedNftAddress
  const [nftData, setNftData] = useState<any | null>(null);

  useEffect(() => {
    if (bestAttempt?.mintedNftAddress) {
      setMintedNftAddress(bestAttempt.mintedNftAddress);
    }
  }, [bestAttempt]);
  
  useEffect(() => {
    if (mintedNftAddress) {
      // In a real app, you would fetch the NFT metadata here
      // For now, we'll simulate it with a timeout
      setTimeout(() => {
        setNftData({
          name: 'Daily Chess Puzzle',
          image: '/nft-placeholder.png', // Placeholder image
          date: new Date().toLocaleDateString(),
          move: bestAttempt?.move,
          timeTaken: bestAttempt?.timeTaken,
          isCorrect: bestAttempt?.isCorrect,
        });
      }, 1000);
    }
  }, [mintedNftAddress, bestAttempt]);
  
  // Allow minting for any attempt (for testing)
  const canMintNFT = connected && attempts.length > 0 && !mintedNftAddress;
  const bestOrFirstAttempt = bestAttempt || (attempts.length > 0 ? attempts[0] : null);

  const handleMintNFT = async () => {
    if (!bestOrFirstAttempt || !wallet) return;
    try {
      setIsMinting(true);
      const txSignature = await mintNFT(bestOrFirstAttempt, wallet, addMintedNft);
      toast({
        title: 'NFT Minted!',
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

  const renderMintedNFT = () => (
    <GradientCard variant="primary" className="p-4">
      <div className="flex flex-col items-center text-white">
        <h4 className="text-2xl font-bold mb-4 neon-glow-purple">NFT Minted!</h4>
        <div className="w-full max-w-[200px] aspect-square rounded-lg bg-indigo-900/50 mb-4 flex items-center justify-center">
          {/* Placeholder for NFT image */}
          <img src={nftData?.image || '/placeholder.png'} alt="NFT Preview" className="w-full h-full object-cover rounded-lg" />
        </div>
        <p className="text-sm text-indigo-200 mb-2">Your achievement is now on-chain.</p>
        <Button 
          className="w-full btn-solana-gradient-alt mt-4"
          onClick={() => window.open(`https://explorer.solana.com/address/${mintedNftAddress}`, '_blank')}
        >
          View on Explorer
        </Button>
      </div>
    </GradientCard>
  );

  return (
    <GradientCard variant="primary" className="overflow-hidden">
      <div className="p-4 text-white flex justify-between items-center bg-purple-900/30">
        <h3 className="font-bold">Daily NFT Preview</h3>
        <span className="text-xs bg-white/20 rounded px-2 py-1">cNFT on Solana</span>
      </div>
      <CardContent className="p-4 text-center">
        {mintedNftAddress && nftData ? renderMintedNFT() : canMintNFT ? (
          <div className="p-4">
            <div className="border-2 border-purple-500/30 rounded-lg p-6 mb-4 flex flex-col items-center">
              <div className="w-full max-w-[200px] aspect-square border border-purple-500/30 flex items-center justify-center mb-4 relative overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full">
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
              <p className="text-indigo-200 text-sm mb-1">Your best attempt is ready to mint!</p>
              <p className="text-xs text-purple-300">Record your achievement on-chain</p>
            </div>
            <Button 
              className="w-full btn-solana-gradient"
              onClick={handleMintNFT}
              disabled={isMinting}
            >
              {isMinting ? 'Minting...' : 'Mint as NFT'}
            </Button>
          </div>
        ) : (
          <div className="p-4">
            <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 mb-4 flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mb-3 text-purple-400">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <path d="M8.5 7h7"></path>
                <path d="M8.5 10.5h7"></path>
                <path d="M8.5 14h7"></path>
                <path d="M8.5 17.5h7"></path>
              </svg>
              <h4 className="font-bold mb-2 text-white">No NFT Available</h4>
              <p className="text-indigo-200 mb-2">You must solve the puzzle correctly to mint your daily NFT.</p>
              <p className="text-xs text-purple-300">Try again tomorrow for another chance!</p>
            </div>
            <Button className="w-full btn-solana-gradient o-50 c-not-allowed" disabled>
              Preview NFT
            </Button>
          </div>
        )}
      </CardContent>
    </GradientCard>
  );
};

export default NFTPreviewCard;

