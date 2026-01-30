import React, { useEffect, useState } from 'react';
import Map from './components/Map';
import './App.css';

function App() {
  const [chargers, setChargers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data za testiranje
    const mockChargers = [
      {
        chargeId: '1',
        title: 'Test Station Belgrade',
        latitude: 44.8176,
        longitude: 20.4569,
        town: 'Belgrade',
        country: 'Serbia',
        powerKW: 50,
        connectionType: 'Type 2',
        status: 'Available'
      },
      {
        chargeId: '2',
        title: 'Test Station Zagreb',
        latitude: 45.8150,
        longitude: 15.9819,
        town: 'Zagreb',
        country: 'Croatia',
        powerKW: 150,
        connectionType: 'CCS',
        status: 'Available'
      }
    ];
    
    setChargers(mockChargers);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <h2>Loading charging stations...</h2>
      </div>
    );
  }

  return (
    <div className="App">
      <Map chargers={chargers} />
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        <h3>⚡ EV Chargers - Balkan</h3>
        <p>Total stations: <strong>{chargers.length}</strong></p>
      </div>
    </div>
  );
}

export default App;