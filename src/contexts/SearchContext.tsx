"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  isMobileSearchOpen: boolean;
  setIsMobileSearchOpen: (isOpen: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <SearchContext.Provider value={{
      isMobileSearchOpen,
      setIsMobileSearchOpen
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
