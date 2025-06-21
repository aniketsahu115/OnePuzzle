import { Attempt } from '@shared/schema';
import { apiRequest } from './queryClient';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import type { SolanaWallet } from './useWallet.tsx';
import { Buffer } from 'buffer';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { generateSigner, percentAmount } from '@metaplex-foundation/umi';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';

// Function to mint an NFT from the best attempt using the connected wallet
export async function mintNFT(
  attempt: Attempt, 
  wallet: SolanaWallet,
  addMintedNft: (mint: string) => void
): Promise<string> {
  try {
    if (!wallet) throw new Error('Wallet not connected');

    console.log('Using client-side minting with Umi...');
    const endpoint = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
    
    // Create an Umi instance and register the Irys uploader
    const umi = createUmi(endpoint)
      .use(walletAdapterIdentity(wallet))
      .use(mplTokenMetadata())
      .use(irysUploader());

    const uri = await umi.uploader.uploadJson({
      name: `OnePuzzle #${attempt.id}`,
      description: `A record of a chess puzzle attempt on OnePuzzle solved on ${new Date(attempt.attemptDate).toLocaleDateString()}.`,
      image: 'https://i.ibb.co/F8D1xX3/generated-icon.png', // Using a placeholder image for now
      attributes: [
        { trait_type: 'Move', value: attempt.move },
        { trait_type: 'Time Taken', value: `${attempt.timeTaken}s` },
        { trait_type: 'Result', value: attempt.isCorrect ? 'Correct' : 'Incorrect' },
        { trait_type: 'Attempt Number', value: String(attempt.attemptNumber) },
      ],
    });

    console.log('Metadata uploaded. URI:', uri);

    const mint = generateSigner(umi);

    const builder = createNft(umi, {
      mint,
      name: `OnePuzzle #${attempt.id}`,
      uri: uri,
      sellerFeeBasisPoints: percentAmount(0), // 0%
      isCollection: false,
    });

    console.log('Sending transaction to wallet for signing...');
    const result = await builder.sendAndConfirm(umi, { confirm: { commitment: 'finalized' } });

    // The signature is directly available in the result object.
    const signature = result.signature;
    console.log('NFT minted successfully!', {
      signature,
      mintAddress: mint.publicKey,
    });
    
    // Associate the mint with the attempt in our database
    await apiRequest('POST', '/api/nft/associate', {
      attemptId: String(attempt.id),
      mintAddress: mint.publicKey,
    });

    const mintAddressString = mint.publicKey.toString();

    // Add the new mint to our global context state
    addMintedNft(mintAddressString);

    return mintAddressString;

  } catch (error) {
    console.error('Error in client-side minting:', error);
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
