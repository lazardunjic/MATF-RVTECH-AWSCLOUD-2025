import React from 'react';
import './Filters.css';

const Filters = ({ filters, onFilterChange, onClearFilters }) => {
  const countries = ['Serbia', 'Croatia', 'Bosnia', 'Montenegro', 'Macedonia', 
                     'Albania', 'Slovenia', 'Bulgaria', 'Romania', 'Greece', 'Kosovo'];
  
  const powerLevels = [
    { label: 'All', value: 0 },
    { label: '22+ kW', value: 22 },
    { label: '50+ kW', value: 50 },
    { label: '150+ kW', value: 150 }
  ];
  
  const statuses = ['Available', 'In Use', 'Unknown'];

  return (
    <div className="filters-container">
      <div className="filters-header">
        <span className="filters-title">Filters</span>
        <button className="clear-filters" onClick={onClearFilters}>
          Clear All
        </button>
      </div>

      <div className="filter-group">
        <label className="filter-label">Country</label>
        <select 
          className="filter-select"
          value={filters.country}
          onChange={(e) => onFilterChange('country', e.target.value)}
        >
          <option value="">All Countries</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Minimum Power</label>
        <div className="filter-chips">
          {powerLevels.map(level => (
            <div
              key={level.value}
              className={`filter-chip ${filters.minPower === level.value ? 'active' : ''}`}
              onClick={() => onFilterChange('minPower', level.value)}
            >
              {level.label}
            </div>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Status</label>
        <div className="filter-chips">
          <div
            className={`filter-chip ${filters.status === '' ? 'active' : ''}`}
            onClick={() => onFilterChange('status', '')}
          >
            All
          </div>
          {statuses.map(status => (
            <div
              key={status}
              className={`filter-chip ${filters.status === status ? 'active' : ''}`}
              onClick={() => onFilterChange('status', status)}
            >
              {status}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;