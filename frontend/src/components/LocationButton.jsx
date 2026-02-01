import React from 'react';
import './LocationButton.css';
import { MdMyLocation } from 'react-icons/md';

const LocationButton = ({onClick, loading, error}) => {
    return (
        <div className="location-button-container">
            <button 
                className={`location-button ${loading ? 'loading' : ''}`}
                onClick={onClick}
                disabled={loading}
            >
                <MdMyLocation size={20} />
            </button>
            {error && <div className="location-error">{error}</div>}
        </div>
    )
}

export default LocationButton;

