import { create } from 'zustand'

interface MemeState {
    searchText: string;
    currentPage: number;
    setSearchText: (text: string) => void;
    setPage: (page: number) =>  void;
  }

export const useMemeStore = create<MemeState>((set) => ({
  searchText: "",
  currentPage: 1,
  setSearchText: (text: string) => set((state: MemeState) => ({
    searchText: text, page: state.currentPage
  })),
  setPage: (page: number) => set((state: MemeState) => ({
    searchText: state.searchText, currentPage: page
  })),
}))