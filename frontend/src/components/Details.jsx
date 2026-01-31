import React from 'react';
import './Details.css';

const Details = ({ charger, onClose }) => {
  if (!charger) return null;

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <button className="detail-close" onClick={onClose}>✕</button>
        <div className="detail-title">{charger.title}</div>
        <div className="detail-subtitle">
           {charger.address || charger.town}, {charger.country}
        </div>
      </div>
      
      <div className="detail-body">
        <div className="detail-section">
          <div className="detail-section-title">Technical Specifications</div>
          <div className="info-grid">
            <div className="info-box">
              <div className="info-box-label">Power</div>
              <div className="info-box-value">{charger.powerKW} kW</div>
            </div>
            <div className="info-box">
              <div className="info-box-label">Connector</div>
              <div className="info-box-value">{charger.connectionType}</div>
            </div>
            <div className="info-box">
              <div className="info-box-label">Voltage</div>
              <div className="info-box-value">{charger.voltage || 'N/A'} V</div>
            </div>
            <div className="info-box">
              <div className="info-box-label">Current</div>
              <div className="info-box-value">{charger.currentType || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section-title">Status & Availability</div>
          <div className="detail-info-item">
            <div className="detail-info-label">Status</div>
            <div className="detail-info-value">{charger.status || 'Unknown'}</div>
          </div>
          <div className="detail-info-item">
            <div className="detail-info-label">Number of Points</div>
            <div className="detail-info-value">{charger.numberOfPoints || 1}</div>
          </div>
          <div className="detail-info-item">
            <div className="detail-info-label">Usage Type</div>
            <div className="detail-info-value">{charger.usageType || 'Unknown'}</div>
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section-title">Operator</div>
          <div className="detail-info-item">
            <div className="detail-info-label">Operator Name</div>
            <div className="detail-info-value">{charger.operatorName || 'Unknown'}</div>
          </div>
          {charger.phone && (
            <div className="detail-info-item">
              <div className="detail-info-label">Phone</div>
              <div className="detail-info-value">{charger.phone}</div>
            </div>
          )}
          {charger.website && (
            <div className="detail-info-item">
              <div className="detail-info-label">Website</div>
              <div className="detail-info-value">
                <a href={charger.website} target="_blank" rel="noopener noreferrer">
                  Visit Website
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => {
              const url = `https://www.google.com/maps/dir/?api=1&destination=${charger.latitude},${charger.longitude}`;
              window.open(url, '_blank');
            }}
          >
            Get Directions
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;