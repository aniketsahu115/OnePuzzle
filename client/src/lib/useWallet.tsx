import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiRequest } from './queryClient';
import { useToast } from '@/hooks/use-toast';
import { PublicKey, Transaction } from '@solana/web3.js';

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

export const useWallet = () => useContext(WalletContext);

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

interface WalletAdapter {
  publicKey: { toString: () => string };
  isConnected: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  on: (event: string, callback: () => void) => void;
  removeListener: (event: string, callback: () => void) => void;
}

const createWalletAdapter = (wallet: WalletAdapter): SolanaWallet => {
  return {
    publicKey: new PublicKey(wallet.publicKey.toString()),
    isConnected: true,
    connect: async () => ({ publicKey: new PublicKey(wallet.publicKey.toString()) }),
    disconnect: async () => {},
    signTransaction: async (tx: Transaction) => {
      const signedTx = await wallet.signTransaction(tx);
      return Transaction.from(signedTx.serialize());
    },
    signAllTransactions: async (txs: Transaction[]) => {
      const signedTxs = await wallet.signAllTransactions(txs);
      return signedTxs.map(tx => Transaction.from(tx.serialize()));
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

  const connectWallet = useCallback(async () => {
    try {
      setIsConnecting(true);

      if (!window.solana) {
        toast({
          title: "Wallet not found",
          description: "Please install Phantom wallet to continue",
          variant: "destructive",
        });
        return;
      }

      // Check if already connected
      if (window.solana.isConnected) {
        const publicKey = window.solana.publicKey.toString();
        const wallet = createWalletAdapter(window.solana);
        setCurrentWallet(wallet);
        setWalletAddress(publicKey);
        setConnected(true);
        return;
      }

      // Connect to wallet
      await window.solana.connect();
      const publicKey = window.solana.publicKey.toString();
      const wallet = createWalletAdapter(window.solana);
      
      setCurrentWallet(wallet);
      setWalletAddress(publicKey);
      setConnected(true);

      toast({
        title: "Wallet connected",
        description: "Successfully connected to Phantom wallet",
      });

      // Verify with server
      try {
        await apiRequest('POST', '/api/auth/wallet', {
          walletAddress: publicKey
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
      const wallet = createWalletAdapter(solana);
      setCurrentWallet(wallet);
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
      const wallet = createWalletAdapter(solana);
      setCurrentWallet(wallet);
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
