import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '@/lib/useWallet';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { truncateString } from '@/lib/utils';
import { MockWallet, createMockWalletProvider } from '@/lib/mockWallet';

// Icons for different wallets
const PhantomIcon = () => (
  <svg width="24" height="24" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="128" height="128" rx="64" fill="#AB9FF2"/>
    <path d="M110.584 64.9142H99.142C99.142 41.7651 80.173 23 56.7724 23C33.6612 23 15 41.7651 15 64.9142C15 88.0632 33.6612 107 56.7724 107H64.8187C86.6014 107 104.249 89.4274 104.249 67.7138C104.249 67.1658 104.106 66.6143 103.757 66.2306C103.409 65.8468 102.903 65.6284 102.369 65.6284H91.0988C90.2513 65.6284 89.5461 66.3391 89.5461 67.2356V68.4999C89.5461 76.1323 83.3498 82.2428 75.6994 82.2428H46.532C38.8816 82.2428 32.6959 76.1323 32.6959 68.4999V60.9427C32.6959 53.3103 38.8816 47.1998 46.532 47.1998H75.6994C83.3498 47.1998 89.5461 53.3103 89.5461 60.9427V62.0223C89.5461 62.9187 90.2513 63.6294 91.0988 63.6294H102.582C103.116 63.6294 103.621 63.4111 103.97 63.0273C104.318 62.6436 104.462 62.0921 104.462 61.5441C104.462 40.1234 86.814 22.7928 65.0313 22.7928H56.9851C33.8739 22.7928 15 41.7365 15 64.9142C15 88.0918 33.8739 107 56.9851 107C80.173 107 99.142 88.0632 99.142 64.9142V64.9142Z" fill="white"/>
  </svg>
);

const SolflareIcon = () => (
  <svg width="24" height="24" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24.8 15L17.6 26.5H12.3L19.5 15H24.8Z" fill="#FFC077"/>
    <path d="M24.8 15L17.6 3.5H12.3L19.5 15H24.8Z" fill="#FFA055"/>
    <path d="M12.3 3.5L5.2 15L12.3 26.5L19.5 15L12.3 3.5Z" fill="#FF802C"/>
    <path d="M5.2 15L12.3 3.5H7L2 12.3C1.4 13.3 1.4 14.6 2 15.6L7 24.5H12.3L5.2 15Z" fill="#FFDB43"/>
  </svg>
);

const BackpackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#2a2a2a"/>
    <path d="M15.0602 5H8.93976C8.06976 5 7.35978 5.71 7.35978 6.58V7.88C7.35978 8.1 7.53978 8.28 7.75978 8.28C7.97978 8.28 8.15976 8.1 8.15976 7.88V6.58C8.15976 6.15 8.50976 5.8 8.93976 5.8H15.0602C15.4902 5.8 15.8398 6.15 15.8398 6.58V7.88C15.8398 8.1 16.0202 8.28 16.2402 8.28C16.4602 8.28 16.6398 8.1 16.6398 7.88V6.58C16.6398 5.71 15.9302 5 15.0602 5Z" fill="white"/>
    <path d="M18.8 9.41998C18.68 9.21998 18.47 9.09998 18.22 9.09998H5.77002C5.53002 9.09998 5.31002 9.21998 5.19002 9.41998C5.07002 9.61998 5.05002 9.85999 5.14002 10.08L7.11002 15.44V17.81C7.11002 18.64 7.71002 19.34 8.51002 19.47L11.95 20C12.01 20.01 12.08 20.01 12.14 20.01C12.48 20.01 12.8 19.85 13.03 19.57C13.22 19.34 13.32 19.04 13.32 18.74V15.44L15.29 10.08C15.36 9.85999 15.35 9.61998 15.23 9.41998C15.22 9.41998 15.22 9.41998 15.22 9.41998C15.22 9.41998 15.22 9.41998 15.23 9.41998L15.22 9.41998V9.41998H18.8ZM11.75 15.57C11.67 15.8 11.63 16.04 11.63 16.29V18.74C11.63 18.78 11.61 18.82 11.58 18.85C11.55 18.88 11.51 18.9 11.47 18.9C11.46 18.9 11.46 18.9 11.45 18.9L8.01001 18.36C7.82001 18.33 7.68001 18.15 7.68001 17.95V16.29C7.68001 16.04 7.64001 15.8 7.56001 15.57L5.77002 10.8H18.24L16.44 15.57C16.36 15.8 16.32 16.04 16.32 16.29V17.4C16.32 17.62 16.14 17.8 15.93 17.8C15.71 17.8 15.53 17.62 15.53 17.4V16.29C15.53 15.97 15.58 15.64 15.68 15.34L12 14.1L12.32 13.29L15.65 14.41L16.86 10.8H7.14001L8.35001 14.41L11.68 13.29L12 14.1L8.32001 15.34C8.42001 15.65 8.47001 15.97 8.47001 16.29V17.7L11.44 18.18C11.4 18.18 11.37 18.17 11.34 18.16C11.18 18.09 11.05 17.95 11.01 17.78C10.96 17.58 10.98 17.39 11.07 17.21C11.16 17.03 11.32 16.9 11.51 16.84C11.91 16.75 12.32 16.99 12.4 17.39C12.49 17.8 12.2 18.2 11.8 18.25L11.75 15.57V15.57Z" fill="white"/>
  </svg>
);

const WalletConnector: React.FC = () => {
  const { 
    connected, 
    walletAddress, 
    connectWallet, 
    disconnectWallet, 
    isConnecting
  } = useWallet();
  // For the simulation we'll create a local state
  const [isLocalConnecting, setIsLocalConnecting] = useState(false);
  const { toast } = useToast();
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Truncate wallet address for display
  const truncatedAddress = walletAddress 
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` 
    : '';

  // Handle outside clicks to close the wallet menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsWalletMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // For development purposes, use a simulation mode to bypass wallet connectivity issues
  const simulationMode = false; // Set to false to use actual wallet connections, true for simulation
  
  // Handle demo wallet connection
  const handleDemoWallet = async () => {
    try {
      // Close the menu immediately to avoid multiple clicks
      setIsWalletMenuOpen(false);
      
      console.log('Using demo wallet mode');
      setIsLocalConnecting(true);
      
      // Simulate loading with local state
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Use the mockWallet implementation
      const mockWalletProvider = createMockWalletProvider();
      
      // Connect to the mock wallet
      await connectWallet(mockWalletProvider);
      
      toast({
        title: "Demo Mode Active",
        description: "You're connected with a demo wallet. Features have the same behavior but no real transactions occur.",
      });
      
    } catch (error) {
      console.error('Error connecting to demo wallet:', error);
      toast({
        title: "Demo Connection Error",
        description: error instanceof Error ? error.message : "Failed to connect demo wallet",
        variant: "destructive"
      });
    } finally {
      setIsLocalConnecting(false);
    }
  };
  
  // Generate a random Solana-like address for simulation (remains the same during the session)
  const getSimulatedAddress = (walletName: string) => {
    // Create 32 random bytes (like a Solana address) 
    let addr = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      addr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return addr;
  };
  
  // Function to handle wallet selection
  const handleWalletSelect = async (walletName: string) => {
    try {
      // Close the menu immediately to avoid multiple clicks
      setIsWalletMenuOpen(false);
      
      console.log(`Selected wallet: ${walletName}`);
      setIsLocalConnecting(true);
      
      if (simulationMode) {
        console.log('Using simulation mode for development');
        
        // Simulate loading with local state
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update the UI state directly
        // This bypasses actual wallet connection for development purposes
        toast({
          title: "Wallet connected (Simulation)",
          description: `${walletName} wallet connected successfully in simulation mode`,
        });
        
        // Set connected state for the UI
        // The context will be updated directly here instead of through the provider
        // In a real application, this should be properly handled through the wallet context
        
        // Generate a proper Solana-like address for the simulation
        const simulatedAddress = getSimulatedAddress(walletName);
        
        // Now call the real connectWallet function but with a mock wallet
        const mockWallet = {
          publicKey: { toString: () => simulatedAddress },
          isConnected: true,
          connect: async () => ({ publicKey: { toString: () => simulatedAddress } }),
          disconnect: async () => {}
        };
        
        await connectWallet(mockWallet);
        setIsLocalConnecting(false);
        return;
      }
      
      // Real wallet implementation for production
      // Check if wallet exists in window
      const hasPhantom = window?.phantom?.solana;
      const hasSolflare = window?.solflare;
      const hasBackpack = window?.backpack;
      
      console.log(`Wallet detection: Phantom (${hasPhantom ? 'available' : 'not available'}), ` +
                  `Solflare (${hasSolflare ? 'available' : 'not available'}), ` +
                  `Backpack (${hasBackpack ? 'available' : 'not available'})`);
      
      let walletProvider: SolanaWalletProvider | undefined = undefined;
      
      try {
        let selectedWalletProvider: SolanaWalletProvider | undefined = undefined;
        
        if (walletName === 'Phantom' && hasPhantom) {
          selectedWalletProvider = window.phantom?.solana as SolanaWalletProvider;
          console.log('Using Phantom wallet provider:', selectedWalletProvider);
        } else if (walletName === 'Solflare' && hasSolflare) {
          selectedWalletProvider = window.solflare as SolanaWalletProvider;
          console.log('Using Solflare wallet provider:', selectedWalletProvider);
        } else if (walletName === 'Backpack' && hasBackpack) {
          selectedWalletProvider = window.backpack as SolanaWalletProvider;
          console.log('Using Backpack wallet provider:', selectedWalletProvider);
        }
        
        // Ensure we have a valid wallet provider
        if (!selectedWalletProvider) {
          console.log(`${walletName} wallet provider not found, redirecting to download page`);
          // If wallet doesn't exist, open the wallet website
          const walletUrls: Record<string, string> = {
            'Phantom': 'https://phantom.app/',
            'Solflare': 'https://solflare.com/',
            'Backpack': 'https://www.backpack.app/'
          };
          
          window.open(walletUrls[walletName], '_blank');
          
          toast({
            title: "Wallet Not Detected",
            description: `${walletName} wallet is not installed. Please install it and try again.`,
            variant: "destructive"
          });
          
          setIsLocalConnecting(false);
          return;
        }
        
        // Assign to the outer variable after validation
        walletProvider = selectedWalletProvider;
        
        // Create a properly formatted wallet object with extra safety checks
        const walletWrapper = {
          // Safely handle publicKey property which might be undefined
          publicKey: walletProvider.publicKey,
          
          // Make sure isConnected is a boolean
          isConnected: !!walletProvider.isConnected,
          
          // Enhanced connect method with additional error handling
          connect: async () => {
            try {
              console.log('Calling connect on wallet provider');
              
              // Check if wallet provider exists
              if (!walletProvider || typeof walletProvider.connect !== 'function') {
                throw new Error('Wallet provider not available or missing connect method');
              }
              
              // Call the wallet's connect method
              const result = await walletProvider.connect();
              console.log('Connect result:', result);
              
              // Validate the result
              if (!result || !result.publicKey) {
                throw new Error('Wallet connection failed: Invalid response from wallet');
              }
              
              // Make sure result.publicKey has toString method
              if (typeof result.publicKey.toString !== 'function') {
                console.warn('Wallet returned publicKey without toString method, creating a wrapper');
                // Create a wrapper with toString
                return {
                  publicKey: {
                    toString: () => {
                      // If we can access it as a string property, use that
                      if (typeof result.publicKey === 'string') {
                        return result.publicKey;
                      }
                      // Otherwise use object notation and convert to string
                      return String(result.publicKey);
                    }
                  }
                };
              }
              
              return result;
            } catch (err) {
              console.error('Error in wallet connect wrapper:', err);
              throw err;
            }
          },
          
          // Enhanced disconnect method
          disconnect: async () => {
            try {
              // Use a local reference to eliminate the TypeScript error
              const provider = walletProvider;
              
              // Check if wallet provider exists
              if (!provider || typeof provider.disconnect !== 'function') {
                console.warn('Wallet provider not available or missing disconnect method');
                return;
              }
              return await provider.disconnect();
            } catch (err) {
              console.error('Error in wallet disconnect wrapper:', err);
              throw err;
            }
          }
        };
        
        // Connect to the wallet
        console.log('Connecting to wallet with wrapper:', walletWrapper);
        await connectWallet(walletWrapper);
      } catch (err) {
        console.error('Error setting up wallet provider:', err);
        toast({
          title: `${walletName} Connection Error`,
          description: `Error setting up wallet provider: ${err instanceof Error ? err.message : String(err)}`,
          variant: "destructive"
        });
      } finally {
        setIsLocalConnecting(false);
      }
      
    } catch (error) {
      console.error(`Error connecting to ${walletName}:`, error);
      toast({
        title: `${walletName} Connection Error`,
        description: error instanceof Error ? error.message : `Failed to connect to ${walletName}`,
        variant: "destructive"
      });
    }
  };

  return (
    <div id="wallet-connector" className="flex items-center relative" ref={menuRef}>
      {connected && (
        <div className="hidden sm:flex items-center mr-3 text-sm font-medium text-slate-600 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          <span className="wallet-address font-mono">{truncatedAddress}</span>
        </div>
      )}
      
      {!connected ? (
        <div>
          <Button 
            onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)} 
            className="btn-solana-gradient rounded-lg flex items-center animate-fade-in"
            disabled={isConnecting || isLocalConnecting}
          >
            {(isConnecting || isLocalConnecting) ? (
              <span className="animate-pulse">Connecting...</span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 mr-2">
                  <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"></path>
                  <path d="M22 10H4"></path>
                  <path d="M20 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                </svg>
                <span>Connect Wallet</span>
              </>
            )}
          </Button>
          
          {/* Wallet Selection Menu */}
          {isWalletMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10 animate-slide-up">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <h3 className="text-sm font-medium dark:text-gray-200">Select a wallet</h3>
              </div>
              <div className="p-2">
                <button
                  onClick={() => handleWalletSelect('Phantom')}
                  className="w-full flex items-center p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <PhantomIcon />
                  <span className="ml-3 text-sm font-medium dark:text-gray-200">Phantom</span>
                </button>
                <button
                  onClick={() => handleWalletSelect('Solflare')}
                  className="w-full flex items-center p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <SolflareIcon />
                  <span className="ml-3 text-sm font-medium dark:text-gray-200">Solflare</span>
                </button>
                <button
                  onClick={() => handleWalletSelect('Backpack')}
                  className="w-full flex items-center p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <BackpackIcon />
                  <span className="ml-3 text-sm font-medium dark:text-gray-200">Backpack</span>
                </button>
                
                {/* Demo Mode Option */}
                <button
                  onClick={() => handleDemoWallet()}
                  className="w-full flex items-center p-3 mt-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M6 8h.01" />
                    <path d="M12 8h.01" />
                    <path d="M18 8h.01" />
                    <path d="M12 12h.01" />
                    <path d="M12 16h.01" />
                    <path d="M6 12h.01" />
                    <path d="M6 16h.01" />
                    <path d="M18 12h.01" />
                    <path d="M18 16h.01" />
                  </svg>
                  <span className="ml-3 text-sm font-medium dark:text-gray-200">Demo Mode</span>
                </button>
                
                <div className="p-2 text-xs text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                  Demo mode lets you try the app without a real wallet
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              className="btn-solana-gradient rounded-lg flex items-center space-x-2 animate-fade-in"
            >
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span>Connected</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 animate-slide-up">
            <DropdownMenuItem className="font-mono text-xs text-gray-500 cursor-default">
              {truncatedAddress}
            </DropdownMenuItem>
            
            {/* Show a demo indicator if using a mock wallet */}
            {walletAddress && walletAddress.length > 10 && !walletAddress.startsWith('demo') && (
              <DropdownMenuItem onClick={() => window.open(`https://explorer.solana.com/address/${walletAddress}`, '_blank')}>
                View on Explorer
              </DropdownMenuItem>
            )}
            
            {/* Show a demo indicator if using a demo wallet */}
            {walletAddress && walletAddress.includes('mock') && (
              <DropdownMenuItem className="bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 cursor-default">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                Demo Mode Active
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem onClick={disconnectWallet} className="text-red-500">
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default WalletConnector;
