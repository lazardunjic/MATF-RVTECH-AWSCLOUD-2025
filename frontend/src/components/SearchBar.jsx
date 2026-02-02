import React from 'react';
import './SearchBar.css';
import { IoSearch } from 'react-icons/io5';

const SearchBar = ({ searchTerm, onSearch, onClear }) => {
  return (
    <div className="search-container">
      <div className="search-box">
         <IoSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, town, or country..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
        />
        {searchTerm && (
          <button className="clear-search" onClick={onClear}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;