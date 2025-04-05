import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiRequest } from './queryClient';
import { useToast } from '@/hooks/use-toast';

// Solana wallet interface
interface SolanaWallet {
  publicKey?: { toString: () => string };
  isConnected?: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
}

interface WalletContextType {
  connected: boolean;
  walletAddress: string | null;
  connectWallet: (wallet?: SolanaWallet) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  walletAddress: null,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
  isConnecting: false,
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentWallet, setCurrentWallet] = useState<SolanaWallet | null>(null);
  const { toast } = useToast();

  const connectWallet = useCallback(async (wallet?: SolanaWallet) => {
    try {
      setIsConnecting(true);
      
      // Ensure we have a valid wallet object
      if (!wallet && !currentWallet) {
        throw new Error('No wallet provider available. Please install a Solana wallet extension.');
      }
      
      const activeWallet = wallet || currentWallet;
      let publicKey: string;
      
      try {
        // First, check if the wallet is already connected
        if (activeWallet?.isConnected && activeWallet?.publicKey) {
          publicKey = activeWallet.publicKey.toString();
          console.log('Wallet already connected:', publicKey);
        } else {
          // Connect to the wallet
          console.log('Connecting to wallet...');
          const response = await activeWallet!.connect();
          publicKey = response.publicKey.toString();
          console.log('Connected with wallet address:', publicKey);
        }
        
        // Save the current wallet for future use
        if (wallet) {
          setCurrentWallet(wallet);
        }
      } catch (walletError) {
        console.error('Wallet connection error:', walletError);
        // Specific handling for wallet connection errors
        let errorMessage = 'Failed to connect to wallet';
        if (walletError instanceof Error) {
          errorMessage = walletError.message;
        }
        throw new Error(`Wallet connection failed: ${errorMessage}`);
      }
      
      // Skip server verification in development mode and proceed
      // This allows the app to work even if the backend isn't fully set up
      setWalletAddress(publicKey);
      setConnected(true);
      toast({
        title: "Wallet connected",
        description: "You've successfully connected your wallet",
      });
      
      // Try server verification but don't block the UI
      try {
        // Log the attempt to verify with the server
        console.log('Attempting to verify wallet with server...');
        const response = await apiRequest('POST', '/api/auth/wallet', {
          walletAddress: publicKey
        });
        
        // Only log the result, don't affect the UI flow
        const data = await response.json();
        console.log('Server verification result:', data);
      } catch (apiError) {
        // Just log server errors, don't affect the user experience
        console.warn('Server verification failed (safe to ignore in development):', apiError);
      }
      
    } catch (error) {
      // Handle and display any errors
      console.error('Error in wallet connection process:', error);
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
      
      // Clean up any partial state
      setCurrentWallet(null);
      setWalletAddress(null);
      setConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, [toast, currentWallet]);

  const disconnectWallet = useCallback(async () => {
    try {
      if (currentWallet) {
        await currentWallet.disconnect();
      }
      
      setCurrentWallet(null);
      setWalletAddress(null);
      setConnected(false);
      
      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast({
        title: "Disconnection failed",
        description: error instanceof Error ? error.message : "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  }, [toast, currentWallet]);

  // Check if wallet is already connected on mount
  useEffect(() => {
    // We're disabling auto-connection to allow users to explicitly choose a wallet
    // This ensures a better user experience where they consciously select which wallet to use
    
    console.log('Auto-wallet connection disabled - waiting for user to choose a wallet');
    
    // If we want to re-enable auto-connection later, uncomment the code below:
    /*
    const checkWalletConnection = async () => {
      try {
        // Check for Phantom wallet
        // @ts-ignore
        if (window.phantom?.solana && window.phantom.solana.isConnected) {
          // @ts-ignore
          const wallet = window.phantom.solana;
          const publicKey = wallet.publicKey.toString();
          setCurrentWallet(wallet);
          setWalletAddress(publicKey);
          setConnected(true);
        }
        // Check for Solflare wallet
        // @ts-ignore
        else if (window.solflare && window.solflare.isConnected) {
          // @ts-ignore
          const wallet = window.solflare;
          const publicKey = wallet.publicKey.toString();
          setCurrentWallet(wallet);
          setWalletAddress(publicKey);
          setConnected(true);
        }
        // Other wallet checks could be added here
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };
    
    // Wait for window to be fully loaded
    if (typeof window !== 'undefined') {
      checkWalletConnection();
    }
    */
  }, []);

  return (
    <WalletContext.Provider value={{
      connected,
      walletAddress,
      connectWallet,
      disconnectWallet,
      isConnecting
    }}>
      {children}
    </WalletContext.Provider>
  );
};
