// Type definitions for browser-based Solana wallets
interface SolanaPublicKey {
  toString: () => string;
}

interface SolanaWalletProvider {
  publicKey: SolanaPublicKey;
  isConnected: boolean;
  connect: () => Promise<{ publicKey: SolanaPublicKey }>;
  disconnect: () => Promise<void>;
  signMessage?: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  signTransaction?: (transaction: any) => Promise<any>;
}

interface PhantomWallet {
  solana?: SolanaWalletProvider;
}

interface Window {
  // Phantom wallet
  phantom?: PhantomWallet;
  
  // Solflare wallet
  solflare?: SolanaWalletProvider;
  
  // Backpack wallet
  backpack?: SolanaWalletProvider;
}