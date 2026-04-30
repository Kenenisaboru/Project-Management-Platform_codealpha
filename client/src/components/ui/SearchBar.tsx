'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search projects, tasks, team...', className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <motion.div
        animate={{ 
          borderColor: isFocused ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.1)',
          boxShadow: isFocused ? '0 0 0 3px rgba(99, 102, 241, 0.1)' : 'none'
        }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-2 rounded-xl border bg-white/5 px-4 py-2.5 transition-all"
      >
        <Search className="h-5 w-5 text-white/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clearSearch}
              className="shrink-0 rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-white transition-all"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Keyboard shortcut hint */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 text-[10px] font-medium text-white/40">
          <span>⌘</span>K
        </kbd>
      </div>
    </div>
  );
}
