/**
 * Mock Wallet Implementation for Development
 * 
 * This module provides a mock implementation of a Solana wallet for development purposes.
 * It can be used to bypass actual wallet connections during testing or when wallet extensions
 * are not available.
 */

// Generate a mock Solana address that looks realistic but is tagged as a mock
export function generateMockAddress(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  // Start with "mock" to make it easy to identify in the UI
  let result = 'mock';
  
  // Fill the rest with random characters to make it look like a real address
  for (let i = 0; i < 28; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Create a mock public key object
export function createMockPublicKey(address: string = generateMockAddress()): { toString: () => string } {
  return {
    toString: () => address
  };
}

// Create a mock wallet provider that implements the SolanaWalletProvider interface
export function createMockWalletProvider(address?: string): any {
  const mockAddress = address || generateMockAddress();
  const mockPublicKey = createMockPublicKey(mockAddress);
  
  return {
    publicKey: mockPublicKey,
    isConnected: true,
    connect: async () => ({ 
      publicKey: mockPublicKey 
    }),
    disconnect: async () => {},
    signMessage: async (message: Uint8Array) => ({ 
      signature: new Uint8Array(64) // Mock signature
    }),
    signTransaction: async (transaction: any) => transaction, // Just return the transaction
  };
}

// A complete mock wallet implementation that can be used in place of actual wallet
export const MockWallet = {
  address: generateMockAddress(),
  
  get publicKey() {
    return createMockPublicKey(this.address);
  },
  
  isConnected: false,
  
  connect: async function() {
    this.isConnected = true;
    return {
      publicKey: this.publicKey
    };
  },
  
  disconnect: async function() {
    this.isConnected = false;
  },
  
  // Simulate realistic wallet behavior with occasional failures
  simulateRandomFailure: function() {
    // 10% chance of failure
    return Math.random() > 0.9;
  }
};