import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiRequest } from './queryClient';
import { useToast } from '@/hooks/use-toast';
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';

// This is the interface that wallet adapter libraries like Umi expect.
// It's more generic to handle different transaction types.
export interface CompatibleWalletAdapter {
  publicKey: PublicKey | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: <T extends Transaction | VersionedTransaction>(transaction: T) => Promise<T>;
  signAllTransactions: <T extends Transaction | VersionedTransaction>(transactions: T[]) => Promise<T[]>;
  // We'll keep the `on` and `removeListener` from the original adapter for event handling
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
}


// This will be our app's internal wallet interface.
// It's slightly simplified for our use case.
export interface SolanaWallet {
  publicKey: PublicKey;
  isConnected: boolean;
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signTransaction: <T extends Transaction | VersionedTransaction>(transaction: T) => Promise<T>;
  signAllTransactions: <T extends Transaction | VersionedTransaction>(transactions: T[]) => Promise<T[]>;
}

interface WalletContextType {
  connected: boolean;
  walletAddress: string | null;
  connectWallet: (walletProvider?: SolanaWallet) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  isConnecting: boolean;
  wallet: SolanaWallet | null;
  mintedNfts: string[];
  addMintedNft: (mint: string) => void;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  walletAddress: null,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
  isConnecting: false,
  wallet: null,
  mintedNfts: [],
  addMintedNft: () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}

const fallbackMockWallet: SolanaWallet = {
  publicKey: new PublicKey('11111111111111111111111111111111'),
  isConnected: false,
  connect: async () => ({ publicKey: new PublicKey('11111111111111111111111111111111') }),
  disconnect: async () => {},
  signTransaction: async (tx) => tx,
  signAllTransactions: async (txs) => txs
};

const errorMockWallet: SolanaWallet = {
  publicKey: new PublicKey('11111111111111111111111111111111'),
  isConnected: false,
  connect: async () => ({ publicKey: new PublicKey('11111111111111111111111111111111') }),
  disconnect: async () => {},
  signTransaction: async (tx) => tx,
  signAllTransactions: async (txs) => txs
};

const createWalletAdapter = (wallet: CompatibleWalletAdapter): SolanaWallet => {
  return {
    // We know the public key will be available after connection.
    publicKey: wallet.publicKey!,
    isConnected: !!wallet.publicKey,
    connect: async () => {
      if (!wallet.publicKey) await wallet.connect();
      return { publicKey: wallet.publicKey! };
    },
    disconnect: wallet.disconnect,
    signTransaction: wallet.signTransaction,
    signAllTransactions: wallet.signAllTransactions,
  };
};

declare global {
  interface Window {
    // The global solana object can be any wallet that conforms to this compatible adapter.
    solana?: CompatibleWalletAdapter;
  }
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [currentWallet, setCurrentWallet] = useState<SolanaWallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [mintedNfts, setMintedNfts] = useState<string[]>([]);
  const { toast } = useToast();

  const addMintedNft = useCallback((mint: string) => {
    setMintedNfts(prev => Array.from(new Set([...prev, mint])));
  }, []);

  const connectWallet = useCallback(async (walletProvider?: SolanaWallet) => {
    try {
      setIsConnecting(true);

      let connectedWallet: SolanaWallet;
      
      if (walletProvider) {
        // Scenario 1: A wallet provider is passed in from our WalletConnector component.
        // We must call its connect method to get the real public key.
        const { publicKey: connectedPublicKey } = await walletProvider.connect();
        
        if (!connectedPublicKey) {
          throw new Error('Wallet connection failed: Public key not returned.');
        }

        // The provided wallet object is now fully ready.
        connectedWallet = {
          ...walletProvider,
          publicKey: connectedPublicKey,
          isConnected: true,
        };

      } else {
        // Scenario 2: Default connection logic (e.g., for auto-reconnection)
        const solana = window.solana;
        if (!solana) {
          throw new Error('Wallet not found. Please install a Solana wallet.');
        }

        if (!solana.publicKey) {
          await solana.connect();
        }
        connectedWallet = createWalletAdapter(solana);
      }
      
      const publicKeyStr = connectedWallet.publicKey.toString();
      setCurrentWallet(connectedWallet);
      setWalletAddress(publicKeyStr);
      setConnected(true);

      toast({
        title: "Wallet connected",
        description: `Successfully connected to wallet: ${publicKeyStr.slice(0, 4)}...${publicKeyStr.slice(-4)}`,
      });

      // Verify with server
      try {
        await apiRequest('POST', '/api/auth/wallet', {
          walletAddress: publicKeyStr
        });
      } catch (error) {
        console.warn('Server verification failed:', error);
      }

    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to connect to wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  const disconnectWallet = useCallback(async () => {
    try {
      if (currentWallet) {
        await currentWallet.disconnect();
        setCurrentWallet(null);
        setWalletAddress(null);
        setConnected(false);
        
        toast({
          title: "Wallet disconnected",
          description: "Successfully disconnected from wallet",
        });
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast({
        title: "Disconnect failed",
        description: error instanceof Error ? error.message : "Failed to disconnect wallet. Please try again.",
        variant: "destructive",
      });
    }
  }, [currentWallet, toast]);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const solana = window.solana;
    if (solana?.publicKey) {
      const publicKey = solana.publicKey.toString();
      const walletAdapter = createWalletAdapter(solana);
      setCurrentWallet(walletAdapter);
      setWalletAddress(publicKey);
      setConnected(true);
    }
  }, []);

  // Listen for wallet connection changes
  useEffect(() => {
    const solana = window.solana;
    if (!solana) return;

    const handleConnect = () => {
      if (solana.publicKey) {
        const publicKey = solana.publicKey.toString();
        const walletAdapter = createWalletAdapter(solana);
        setCurrentWallet(walletAdapter);
        setWalletAddress(publicKey);
        setConnected(true);
      }
    };

    const handleDisconnect = () => {
      setCurrentWallet(null);
      setWalletAddress(null);
      setConnected(false);
    };

    solana.on('connect', handleConnect);
    solana.on('disconnect', handleDisconnect);

    return () => {
      solana.removeListener('connect', handleConnect);
      solana.removeListener('disconnect', handleDisconnect);
    };
  }, []);

  return (
    <WalletContext.Provider value={{
      connected,
      walletAddress,
      connectWallet,
      disconnectWallet,
      isConnecting,
      wallet: currentWallet,
      mintedNfts,
      addMintedNft,
    }}>
      {children}
    </WalletContext.Provider>
  );
};
