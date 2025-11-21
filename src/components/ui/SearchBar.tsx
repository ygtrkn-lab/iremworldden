"use client";

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
  variant?: 'default' | 'hero';
}

export default function SearchBar({ 
  onSearch, 
  initialValue = '', 
  placeholder = "Emlak ara...",
  variant = 'default'
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Gerçek zamanlı arama için
    onSearch(value);
  };

  // Hero variant için özel stil
  if (variant === 'hero') {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative bg-white/10 backdrop-blur-md rounded-full border border-white/20 overflow-hidden shadow-2xl">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-4 pl-6">
                <svg 
                  className="w-6 h-6 text-white/80" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>
              
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="flex-1 py-5 px-4 text-lg bg-transparent border-none outline-none text-white placeholder-white/70 font-medium"
              />
              
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    onSearch('');
                  }}
                  className="flex-shrink-0 p-4 text-white/60 hover:text-white/90 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              
              <button
                type="submit"
                className="flex-shrink-0 bg-primary-500 hover:bg-primary-600 text-white px-8 py-5 font-semibold transition-all duration-300 rounded-full mr-1 shadow-lg hover:shadow-xl"
              >
                Ara
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // Default variant
  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-4">
              <svg 
                className="w-6 h-6 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="flex-1 py-4 px-2 text-lg bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  onSearch('');
                }}
                className="flex-shrink-0 p-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            <button
              type="submit"
              className="flex-shrink-0 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 font-medium transition-colors shadow-lg"
            >
              Ara
            </button>
          </div>
        </div>
        
        {/* Quick Search Suggestions */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {['Daire', 'Villa', 'Ofis', 'Arsa', 'Mağaza'].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setSearchQuery(suggestion);
                onSearch(suggestion);
              }}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
