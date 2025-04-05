import React from 'react';
import { useWallet } from '@/lib/useWallet';
import { Button } from '@/components/ui/button';

const WalletConnector: React.FC = () => {
  const { 
    connected, 
    walletAddress, 
    connectWallet, 
    disconnectWallet, 
    isConnecting 
  } = useWallet();

  // Truncate wallet address for display
  const truncatedAddress = walletAddress 
    ? `${walletAddress.slice(0, 3)}...${walletAddress.slice(-3)}` 
    : '';

  return (
    <div id="wallet-connector" className="flex items-center">
      {connected && (
        <div className="hidden sm:flex items-center mr-3 text-sm font-medium text-slate-600">
          <span className="w-2 h-2 rounded-full bg-status-success mr-2"></span>
          <span className="wallet-address font-mono">{truncatedAddress}</span>
        </div>
      )}
      
      {!connected ? (
        <Button 
          onClick={connectWallet} 
          className="px-4 py-2 bg-primary text-white rounded-lg flex items-center hover:bg-primary-light transition-colors"
          disabled={isConnecting}
        >
          {isConnecting ? (
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
      ) : (
        <Button 
          onClick={disconnectWallet} 
          className="px-4 py-2 bg-status-success text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <span>Connected</span>
        </Button>
      )}
    </div>
  );
};

export default WalletConnector;
