import { Attempt, Puzzle } from "@shared/schema";
import { Connection, Keypair, PublicKey, clusterApiUrl, Transaction, SystemProgram } from '@solana/web3.js';
import { Metaplex, keypairIdentity, toMetaplexFile } from '@metaplex-foundation/js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';
dotenv.config();

// Configuration for Solana connection
const SOLANA_RPC_URL = 'https://api.devnet.solana.com';
const SOLANA_NETWORK = 'devnet';

// Mock connection for development
export let connection: Connection | null = null;
let metaplex: Metaplex | null = null;
let keypair: Keypair | null = null;

// Initialize Solana connection
export async function setupSolanaConnection() {
  try {
    // Load keypair from environment variable or file for persistence
    let secret;
    if (process.env.SOLANA_PRIVATE_KEY) {
      secret = JSON.parse(process.env.SOLANA_PRIVATE_KEY);
      keypair = Keypair.fromSecretKey(Uint8Array.from(secret));
      console.log('Loaded Solana keypair from SOLANA_PRIVATE_KEY env variable.');
    } else if (process.env.SOLANA_KEYPAIR_PATH) {
      const keypairPath = process.env.SOLANA_KEYPAIR_PATH;
      secret = JSON.parse(readFileSync(keypairPath, 'utf8'));
      keypair = Keypair.fromSecretKey(Uint8Array.from(secret));
      console.log('Loaded Solana keypair from file:', keypairPath);
    } else {
      // Default to Solana CLI wallet path
      const keypairPath = '/Users/harshsharma/.config/solana/id.json';
      try {
        secret = JSON.parse(readFileSync(keypairPath, 'utf8'));
        keypair = Keypair.fromSecretKey(Uint8Array.from(secret));
        console.log('Loaded Solana keypair from default CLI path:', keypairPath);
      } catch (error) {
        console.error('Failed to load keypair from default path:', error);
        throw new Error('No valid Solana keypair found. Please set SOLANA_PRIVATE_KEY or SOLANA_KEYPAIR_PATH environment variable.');
      }
    }

    if (!keypair) {
      throw new Error('Failed to initialize Solana keypair');
    }

    // Initialize connection
    connection = new Connection(SOLANA_RPC_URL, { commitment: 'processed' });
    if (!connection) {
      throw new Error('Failed to initialize Solana connection');
    }

    // Initialize Metaplex
    metaplex = Metaplex.make(connection).use(keypairIdentity(keypair));
    if (!metaplex) {
      throw new Error('Failed to initialize Metaplex client');
    }

    // Verify connection by getting version
    const version = await connection.getVersion();
    console.log(`Connected to Solana ${SOLANA_NETWORK} (version: ${version['solana-core']}) with wallet:`, keypair.publicKey.toBase58());

    // Request airdrop for testing
    if (SOLANA_NETWORK === 'devnet') {
      await requestAirdrop();
    }

    return true;
  } catch (error) {
    console.error('Failed to setup Solana connection:', error);
    // Reset all connections on failure
    connection = null;
    metaplex = null;
    keypair = null;
    throw error;
  }
}

// Helper function to create a timeout promise
function timeoutPromise(ms: number, errorMessage: string): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), ms);
  });
}

// Get SOL balance for an account
async function getSolBalance(publicKey: PublicKey): Promise<number> {
  if (!connection) throw new Error('Connection not initialized');
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / 1e9; // Convert lamports to SOL
  } catch (error) {
    console.error('[getSolBalance] Error getting balance:', error);
    throw error;
  }
}

// Request devnet SOL for the wallet with retry logic
async function requestAirdrop() {
  if (!connection || !keypair) throw new Error('Connection not initialized');
  
  // Check current balance first
  const currentBalance = await getSolBalance(keypair.publicKey);
  if (currentBalance >= 1) {
    console.log(`[requestAirdrop] Wallet already has ${currentBalance} SOL, skipping airdrop`);
    return true;
  }

  const maxRetries = 5;
  const baseDelay = 1000; // Start with 1 second delay
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`[requestAirdrop] Requesting airdrop for ${keypair.publicKey.toBase58()} (attempt ${attempt + 1}/${maxRetries})`);
      const signature = await connection.requestAirdrop(keypair.publicKey, 2 * 1e9); // Request 2 SOL
      
      // Wait for confirmation with timeout
      const confirmation = await Promise.race([
        connection.confirmTransaction(signature),
        timeoutPromise(30000, 'Transaction confirmation timeout')
      ]);
      
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`);
      }
      
      console.log(`[requestAirdrop] Airdrop successful! Signature: ${signature}`);
      return true;
    } catch (err) {
      console.error(`[requestAirdrop] Error requesting airdrop (attempt ${attempt + 1}/${maxRetries}):`, err);
      
      if (attempt === maxRetries - 1) {
        console.error('[requestAirdrop] Max retries reached, giving up');
        return false;
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`[requestAirdrop] Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return false;
}

// Mint a compressed NFT for an attempt
export async function mintCNFT(attempt: Attempt, puzzle: Puzzle): Promise<string> {
  if (!metaplex || !keypair) throw new Error('Metaplex not initialized');
  console.log(`[mintCNFT] Start minting for attemptId=${attempt.id}, puzzleId=${puzzle.id}`);
  try {
    // Use a simple placeholder image to reduce transaction size
    const imageUri = 'https://placehold.co/100x100?text=1PZL';
    // Create NFT with minimal metadata
    console.log(`[mintCNFT] Minting NFT on Solana...`);
    const { nft } = await metaplex.nfts().create({
      uri: imageUri,
      name: `OnePuzzle #${attempt.id}`,
      sellerFeeBasisPoints: 0,
      symbol: '1PZL',
      maxSupply: 1,
      isMutable: false,
      updateAuthority: keypair,
    });
    console.log(`[mintCNFT] NFT minted! Address: ${nft.address.toString()}`);
    return nft.address.toString();
  } catch (err) {
    console.error(`[mintCNFT] Error during minting for attemptId=${attempt.id}:`, err);
    throw err;
  }
}

// Format a date for display
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Debug function to test Solana connection
export async function testConnection() {
  if (!connection) throw new Error('Connection not initialized');
  const version = await connection.getVersion();
  console.log('Solana version:', version);
  return version;
}

// Debug function to test metadata upload
export async function testMetadataUpload() {
  if (!metaplex) throw new Error('Metaplex not initialized');
  const metadata = { name: 'Test', description: 'Test metadata', image: 'https://placehold.co/500x500' };
  const start = Date.now();
  const { uri } = await metaplex.nfts().uploadMetadata(metadata);
  console.log(`Metadata upload took ${Date.now() - start}ms`);
  return uri;
}