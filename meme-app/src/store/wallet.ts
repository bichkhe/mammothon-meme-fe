import { create } from 'zustand'

interface WalletState {
    walletAddress: string;
    setWalletAddress: (addr: string) =>  void;
  }

export const useWalletStore = create<WalletState>((set) => ({
  walletAddress: "",
  setWalletAddress: (addr: string) =>  {
    set({ walletAddress: addr });
  }
}))