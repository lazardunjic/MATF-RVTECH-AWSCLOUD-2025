import React, { useState } from 'react';
import { IoChevronBack, IoChevronForward, IoChevronDown, IoSearch, IoFilter } from 'react-icons/io5';
import { MdEvStation, MdLocationOn, MdPower, MdLogin } from 'react-icons/md';
import { FaInfoCircle } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ chargers, onChargerClick, selectedCharger }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  }

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  }

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-brand">
          <MdEvStation className="brand-icon" />
          <div className="brand-text">
            <h1>EV Chargers</h1>
            <p>Find charging stations across EX-YU countries</p>
          </div>
        </div>

        <button className="login-btn">
          <MdLogin className="login-icon" size={22}/>
          <strong>Login / Register</strong>
        </button>

        <div className="sidebar-search">
          <div className="search-box">
            <IoSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by location, town..."
            />
          </div>
        </div>

        <div className="filters-section">
          <div className="filter-header" onClick={toggleFilters}>
            <IoChevronDown 
              className={`filter-icon ${filtersOpen ? 'open' : ''}`} 
              size={16}
            />
            <IoFilter/>
            <></>
            <span className="filter-title">Filters</span>
          </div>

          {filtersOpen && (
            <>
              <div className="filter-group">
                <label className="filter-label">Country</label>
                <select className="filter-select">
                  <option>All Countries</option>
                  <option>Bosnia & Herzegovina</option>
                  <option>Croatia</option>
                  <option>North Macedonia</option>
                  <option>Montenegro</option>
                  <option>Serbia</option>
                  <option>Slovenia</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Minimum Power (kW)</label>
                <input 
                  type="text" 
                  className="filter-input" 
                  placeholder="e.g., 50"
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Status</label>
                <select className="filter-select">
                  <option>All Status</option>
                  <option>Operational</option>
                  <option>Non operational</option>
                  <option>Unknown</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div className="charger-list">
          {chargers.length === 0 ? (
            <div className="no-results">
              No charging stations found
            </div>
          ) : (
            chargers.map((charger) => (
              <div 
                key={charger.chargeId}
                className={`charger-card-new ${selectedCharger === charger.chargeId ? 'active' : ''}`}
                onClick={() => onChargerClick(charger)}
              >
                <div className="charger-card-header">
                  <MdEvStation className="charger-icon" />
                  <div className="charger-info">
                    <h3 className="charger-name">{charger.title}</h3>
                    <div className="charger-location-line">
                      <MdLocationOn size={14} />
                      <span>{charger.town}, {charger.country}</span>
                    </div>
                  </div>
                </div>

                <div className="charger-details-grid">
                  <div className="detail-badge">
                    <MdPower size={16} />
                    <span>{charger.powerKW} kW</span>
                  </div>
                  <div className="detail-badge">
                    <span>Type {charger.connectionType}</span>
                  </div>
                </div>

                <div className="charger-status-row">
                  <FaInfoCircle size={12} />
                  <span className={`status-text status-${getStatusClass(charger.status)}`}>
                    {charger.status || 'UNKNOWN'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <button 
        className={`toggle-btn ${isOpen ? 'open' : 'closed'}`}
        onClick={toggleSidebar}
      >
        {isOpen ? <IoChevronBack size={24} /> : <IoChevronForward size={24} />}
      </button>
    </>
  );
};

const getStatusClass = (status) => {
  if (!status) return 'unknown';
  const statusLower = status.toLowerCase();
  if (statusLower.includes('operational')) return 'operational';
  if (statusLower.includes('available')) return 'available';
  return 'unknown';
};

export default Sidebar;