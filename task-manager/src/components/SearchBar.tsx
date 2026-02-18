import React from 'react';
import { FiSearch } from 'react-icons/fi';
import '../styles/SearchBar.css';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
  const SearchIcon = FiSearch as React.ElementType;
  
  return (
    <div className="search-bar">
      <SearchIcon className="search-icon"/>
      <input
        type="text"
        placeholder="Search To-Do"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
    </div>
  );
};