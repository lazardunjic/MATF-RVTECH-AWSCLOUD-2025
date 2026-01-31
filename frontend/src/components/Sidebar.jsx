import React from 'react';
import './Sidebar.css';

const Sidebar = ({ chargers, onChargerClick, selectedCharger }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>⚡ Charging Stations</h2>
        <p className="count">{chargers.length} stations</p>
      </div>
      
      <div className="charger-list">
        {chargers.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
            No charging stations found
          </div>
        ) : (
          chargers.map((charger) => (
            <div 
              key={charger.chargeId}
              className={`charger-card ${selectedCharger === charger.chargeId ? 'active' : ''}`}
              onClick={() => onChargerClick(charger)}
            >
              <div className="charger-title">
                <span>{charger.title}</span>
                <span className={`status-badge status-${getStatusClass(charger.status)}`}>
                  {charger.status || 'Unknown'}
                </span>
              </div>
              
              <div className="charger-location">
                {charger.town}, {charger.country}
              </div>
              
              <div className="charger-details">
                <div className="detail-item">
                  <span className="detail-value">{charger.powerKW} kW</span>
                </div>
                <div className="detail-item">
                  <span className="detail-value">{charger.connectionType}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-value">{charger.numberOfPoints || 1} points</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const getStatusClass = (status) => {
  if (!status) return 'unknown';
  const statusLower = status.toLowerCase();
  if (statusLower.includes('available') || statusLower.includes('operational')) return 'available';
  if (statusLower.includes('use') || statusLower.includes('busy')) return 'busy';
  return 'unknown';
};

export default Sidebar;