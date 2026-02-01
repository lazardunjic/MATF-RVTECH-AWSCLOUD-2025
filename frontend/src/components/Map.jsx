import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapController({ selectedCharger, userLocation, onMapReady }) {
  const map = useMap();
  
  useEffect(() => {
    if (onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);
  
  useEffect(() => {
    if (selectedCharger) {
      map.flyTo([selectedCharger.latitude, selectedCharger.longitude], 13, {
        duration: 1
      });
    } else if (userLocation) {
      map.flyTo([userLocation.latitude, userLocation.longitude], 12, {
        duration: 1.5
      });
    }
  }, [selectedCharger, userLocation, map]);
  
  return null;
}

const Map = ({ chargers, selectedCharger, onMarkerClick, userLocation, onMapReady }) => {
  return (
    <MapContainer 
      center={[44.0, 21.0]} 
      zoom={6} 
      style={{ height: '100vh', width: '100%' }}
      zoomControl={false} 
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <ZoomControl position="topright" />
      
      <MapController 
        selectedCharger={selectedCharger} 
        userLocation={userLocation}
        onMapReady={onMapReady}
      />
      
      {userLocation && (
        <Marker 
          position={[userLocation.latitude, userLocation.longitude]}
          icon={userLocationIcon}
        >
          <Popup>
            <strong>Your location</strong>
          </Popup>
        </Marker>
      )}
      
      {chargers && chargers.map((charger) => (
        <Marker 
          key={charger.chargeId} 
          position={[charger.latitude, charger.longitude]}
          icon={selectedCharger?.chargeId === charger.chargeId ? selectedIcon : L.Icon.Default.prototype}
          eventHandlers={{
            click: () => onMarkerClick(charger)
          }}
        >
          <Popup>
            <div style={{ minWidth: '200px' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>{charger.title}</h3>
              <p style={{ margin: '4px 0' }}><strong>Town:</strong> {charger.town}</p>
              <p style={{ margin: '4px 0' }}><strong>Country:</strong> {charger.country}</p>
              <p style={{ margin: '4px 0' }}><strong>Power:</strong> {charger.powerKW} kW</p>
              <p style={{ margin: '4px 0' }}><strong>Type:</strong> {charger.connectionType}</p>
              <p style={{ margin: '4px 0' }}><strong>Status:</strong> {charger.status}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;