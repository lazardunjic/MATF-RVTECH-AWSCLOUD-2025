import React from 'react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, onSearch, onClear }) => {
  return (
    <div className="search-container">
      <div className="search-box">
        <span className="search-icon">🔍</span>
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