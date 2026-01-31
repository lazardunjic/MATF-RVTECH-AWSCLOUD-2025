import { API_ENDPOINTS } from './config';
import React, { useEffect, useState } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import Details from './components/Details';
import './App.css';

function App() {
  const [chargers, setChargers] = useState([]);
  const [filteredChargers, setFilteredChargers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCharger, setSelectedCharger] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    country: '',
    minPower: 0,
    status: ''
  });

 useEffect(() => {
  const fetchChargers = async () => {
    try {
      console.log('Fetching chargers...');
      const response = await fetch(API_ENDPOINTS.GET_CHARGERS);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Received ${data.chargers?.length || 0} chargers`);
      
      setChargers(data.chargers || []);
      setFilteredChargers(data.chargers || []);
      setLoading(false);
    } catch (err) {
      console.error('Error while fetching chargers:', err);
      
      console.log('Using mock data');
      const mockData = generateMockData();
      setChargers(mockData);
      setFilteredChargers(mockData);
      setLoading(false);
    }
  };

  fetchChargers();
}, []);

useEffect(() => {
  let result = [...chargers];

  if (searchTerm) {
    result = result.filter(charger =>
      charger.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charger.town.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charger.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filters.country) {
    result = result.filter(charger => charger.country === filters.country);
  }

  if (filters.minPower > 0) {
    result = result.filter(charger => charger.powerKW >= filters.minPower);
  }

  if (filters.status) {
    result = result.filter(charger => 
      charger.status && charger.status.toLowerCase().includes(filters.status.toLowerCase())
    );
  }

  setFilteredChargers(result); 
}, [searchTerm, filters, chargers]);

  const handleChargerClick = (charger) => {
    setSelectedCharger(charger);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ country: '', minPower: 0, status: '' });
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h2>Loading charging stations...</h2>
      </div>
    );
  }

  return (
    <div className="App">
      <Sidebar 
        chargers={filteredChargers}
        onChargerClick={handleChargerClick}
        selectedCharger={selectedCharger?.chargeId}
      >
        <SearchBar 
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          onClear={() => setSearchTerm('')}
        />
        <Filters 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </Sidebar>

      <div className="map-with-sidebar">
        <Map 
          chargers={filteredChargers}
          selectedCharger={selectedCharger}
          onMarkerClick={handleChargerClick}
        />
      </div>

      {selectedCharger && (
        <Details
          charger={selectedCharger}
          onClose={() => setSelectedCharger(null)}
        />
      )}

      <div className="info-box">
        <h3>⚡ EV Chargers - Balkan</h3>
        <p>
          Showing <strong>{filteredChargers.length}</strong> of <strong>{chargers.length}</strong> stations
        </p>
      </div>
    </div>
  );
}

function generateMockData() {
  return [
    {
      chargeId: '1',
      title: 'Delta City Parking',
      latitude: 44.8176,
      longitude: 20.4569,
      town: 'Belgrade',
      country: 'Serbia',
      address: 'Jurija Gagarina 16',
      powerKW: 50,
      voltage: 400,
      connectionType: 'Type 2',
      currentType: 'AC',
      status: 'Available',
      usageType: 'Public',
      operatorName: 'EPS',
      numberOfPoints: 2,
      phone: '+381 11 123 4567',
      website: 'https://example.com'
    },
    {
      chargeId: '2',
      title: 'Zagreb Main Station',
      latitude: 45.8150,
      longitude: 15.9819,
      town: 'Zagreb',
      country: 'Croatia',
      address: 'Trg kralja Tomislava 12',
      powerKW: 150,
      voltage: 400,
      connectionType: 'CCS',
      currentType: 'DC',
      status: 'Available',
      usageType: 'Public',
      operatorName: 'HEP',
      numberOfPoints: 4
    }
  ];
}

export default App;