import { Attempt } from '@shared/schema';
import { apiRequest } from './queryClient';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import type { SolanaWallet } from './useWallet.tsx';
import { Buffer } from 'buffer';

// Function to mint an NFT from the best attempt using the connected wallet
export async function mintNFT(attempt: Attempt, walletAddress: string, wallet?: SolanaWallet): Promise<string> {
  try {
    if (!attempt.id) throw new Error('Attempt is missing a valid id');
    if (!walletAddress) throw new Error('Wallet address is required');
    
    // If we have a wallet object, use client-side minting with wallet signing
    if (wallet) {
      return await mintNFTWithWallet(attempt, walletAddress, wallet);
    }
    
    // Fallback to server-side minting if no wallet object provided
    return await mintNFTWithServer(attempt, walletAddress);
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
}

// Client-side minting using the connected wallet for signing
async function mintNFTWithWallet(attempt: Attempt, walletAddress: string, wallet: SolanaWallet): Promise<string> {
  try {
    console.log('Using client-side minting with wallet signing');
    
    const transaction = new Transaction();
    
    // A standard practice for placeholder transactions is a small transfer to a known address
    // instead of a self-transfer, which some wallets may flag as suspicious.
    const recipient = new PublicKey('1nc1nerator11111111111111111111111111111111');
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: recipient,
      lamports: 1000, // A nominal amount of lamports (1 SOL = 1,000,000,000 lamports)
    });
    
    transaction.add(transferInstruction);
    
    // Set the fee payer
    transaction.feePayer = wallet.publicKey;
    
    // Get recent blockhash
    const connection = new Connection(import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com');
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    
    // Sign the transaction with the wallet
    const signedTransaction = await wallet.signTransaction(transaction);
    
    // Send the signed transaction to the server for confirmation
    const response = await apiRequest('POST', '/api/nft/confirm', {
      attemptId: String(attempt.id),
      signedTransaction: signedTransaction.serialize().toString('base64')
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to confirm NFT mint');
    }
    
    return data.txSignature;
  } catch (error) {
    console.error('Error in client-side minting:', error);
    throw error;
  }
}

// Server-side minting (existing implementation)
async function mintNFTWithServer(attempt: Attempt, walletAddress: string): Promise<string> {
  try {
    console.log('Using server-side minting');
    
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
    
    if (!data.success || !data.nftAddress) {
      throw new Error(data.message || 'Failed to mint NFT');
    }

    return data.nftAddress;
  } catch (error) {
    console.error('Error in server-side minting:', error);
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
