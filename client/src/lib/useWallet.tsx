import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiRequest } from './queryClient';
import { useToast } from '@/hooks/use-toast';
import { PublicKey, Transaction } from '@solana/web3.js';

// Wallet adapter interface for external wallet providers
export interface WalletAdapter {
  publicKey: { toString: () => string };
  isConnected: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  on: (event: string, callback: () => void) => void;
  removeListener: (event: string, callback: () => void) => void;
}

// Solana wallet interface
export interface SolanaWallet {
  publicKey: PublicKey;
  isConnected: boolean;
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
}

interface WalletContextType {
  connected: boolean;
  walletAddress: string | null;
  connectWallet: (wallet?: SolanaWallet) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  isConnecting: boolean;
  wallet: SolanaWallet | null;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  walletAddress: null,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
  isConnecting: false,
  wallet: null,
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

const createWalletAdapter = (wallet: WalletAdapter): SolanaWallet => {
  return {
    publicKey: new PublicKey(wallet.publicKey.toString()),
    isConnected: true,
    connect: async () => ({ publicKey: new PublicKey(wallet.publicKey.toString()) }),
    disconnect: async () => {},
    signTransaction: async (tx: Transaction) => {
      return await wallet.signTransaction(tx);
    },
    signAllTransactions: async (txs: Transaction[]) => {
      return await wallet.signAllTransactions(txs);
    }
  };
};

declare global {
  interface Window {
    solana?: WalletAdapter;
  }
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [currentWallet, setCurrentWallet] = useState<SolanaWallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

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

        if (!solana.isConnected) {
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
    if (solana?.isConnected) {
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
      const publicKey = solana.publicKey.toString();
      const walletAdapter = createWalletAdapter(solana);
      setCurrentWallet(walletAdapter);
      setWalletAddress(publicKey);
      setConnected(true);
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
    }}>
      {children}
    </WalletContext.Provider>
  );
};
