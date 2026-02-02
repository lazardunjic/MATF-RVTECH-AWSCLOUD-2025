import React, { useState } from 'react';
import { IoChevronBack, IoChevronForward} from 'react-icons/io5';
import { MdEvStation, MdLocationOn, MdPower, MdLogin } from 'react-icons/md';
import { FaInfoCircle } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ chargers, onChargerClick, selectedCharger, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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

        {children}
        
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