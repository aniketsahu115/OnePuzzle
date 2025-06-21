// This file re-exports from useWallet.tsx for consistency
// This avoids having to change import statements throughout the app
export { useWallet, WalletProvider } from './useWallet.tsx';
export type { SolanaWallet, CompatibleWalletAdapter as WalletAdapter } from './useWallet.tsx';
