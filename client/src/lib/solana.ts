import { Attempt } from '@shared/schema';
import { apiRequest } from './queryClient';
import { Connection, PublicKey } from '@solana/web3.js';
// import { SolanaWallet } from '@/lib/useWallet'; // SolanaWallet is no longer needed here
import { Buffer } from 'buffer';

// Function to mint an NFT from the best attempt
export async function mintNFT(attempt: Attempt, walletAddress: string): Promise<string> {
  try {
    if (!attempt.id) throw new Error('Attempt is missing a valid id');
    if (!walletAddress) throw new Error('Wallet address is required');
    
    // Removed wallet parameter as server handles signing
    // if (!wallet) throw new Error('Wallet not connected');
    
    // Call the server endpoint that directly mints the NFT
    const response = await apiRequest('POST', '/api/nft/mint', {
      attemptId: String(attempt.id),
      puzzleId: String(attempt.puzzleId),
      userWalletAddress: walletAddress
    });
    
    const data = await response.json();
    
    // Handle already minted case
    if (response.status === 409 && data.nftAddress) {
      return data.nftAddress;
    }
    
    if (!data.success || !data.nftAddress) { // Expecting nftAddress directly now
      throw new Error(data.message || 'Failed to mint NFT');
    }

    // Server now returns the minted NFT address directly
    return data.nftAddress;
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
}

// Function to verify a wallet with seed vault
export async function verifySeedVault(walletAddress: string): Promise<boolean> {
  try {
    // In a real implementation, this would interact with Seed Vault
    // For now, we'll simulate success
    return true;
  } catch (error) {
    console.error('Error verifying with Seed Vault:', error);
    return false;
  }
}

// Function to setup a Gum session key
export async function setupSessionKey(walletAddress: string): Promise<string> {
  try {
    // In a real implementation, this would create a session key using Gum SDK
    // For now, we'll simulate a session key
    return 'simulated-session-key';
  } catch (error) {
    console.error('Error setting up session key:', error);
    throw error;
  }
}
