import { create } from 'zustand'

interface MemeState {
    searchText: string;
    setSearchText: (text: string) => void;
  }

export const useMemeStore = create<MemeState>((set) => ({
  searchText: "",
  setSearchText: (text: string) => set((state: MemeState) => ({
    searchText: text
   })),
}))