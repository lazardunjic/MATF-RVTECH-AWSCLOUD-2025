import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Map = ({ chargers, center, zoom }) => {
  return (
    <MapContainer 
      center={center || [44.0, 21.0]} 
      zoom={zoom || 6} 
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {chargers && chargers.map((charger) => (
        <Marker 
          key={charger.chargeId} 
          position={[charger.latitude, charger.longitude]}
        >
          <Popup>
            <div>
              <h3>{charger.title}</h3>
              <p><strong>Town:</strong> {charger.town}</p>
              <p><strong>Country:</strong> {charger.country}</p>
              <p><strong>Power:</strong> {charger.powerKW} kW</p>
              <p><strong>Type:</strong> {charger.connectionType}</p>
              <p><strong>Status:</strong> {charger.status}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;