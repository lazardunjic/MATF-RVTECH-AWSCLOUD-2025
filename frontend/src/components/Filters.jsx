import React, { useState } from 'react';
import './Filters.css';
import { IoFilter, IoChevronDown } from 'react-icons/io5';

const Filters = ({ filters, onFilterChange, onClearFilters }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const countries = ['Serbia', 'Croatia', 'Bosnia And Herzegovina', 'Montenegro', 'Macedonia', 'Slovenia'];
  
  const powerLevels = [
    { label: 'All', value: 0 },
    { label: '22+ kW', value: 22 },
    { label: '50+ kW', value: 50 },
    { label: '150+ kW', value: 150 }
  ];
  
  const statuses = ['Operational', 'Unavailable', 'Unknown'];

  return (
    <div className="filters-container">
      <div className="filters-header" onClick={() => setIsOpen(!isOpen)}>
        <IoFilter className='filter-icon'/>
        <span className="filters-title">Filters</span>
        <IoChevronDown 
          className={`chevron-icon ${isOpen ? 'open' : ''}`}
          size={16}
        />
        <button 
          className="clear-filters" 
          onClick={(e) => {
            e.stopPropagation(); 
            onClearFilters();
          }}
        >
          Clear All
        </button>
      </div>

      {isOpen && (
        <>
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
        </>
      )}
    </div>
  );
};

export default Filters;