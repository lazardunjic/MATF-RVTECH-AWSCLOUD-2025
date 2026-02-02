import { API_ENDPOINTS } from './config';
import React, { useEffect, useState } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import Details from './components/Details';
import LocationButton from './components/LocationButton';
import Auth from './components/Auth';
import './App.css';

function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [chargers, setChargers] = useState([]);
  const [filteredChargers, setFilteredChargers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCharger, setSelectedCharger] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRoute, setShowRoute] = useState(false); 
  const [filters, setFilters] = useState({
    country: '',
    minPower: 0,
    status: ''
  });
  const [showAuthModal, setShowAuthModal] = useState(false);

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
        setChargers([]);
        setFilteredChargers([]);
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
        (charger.town && charger.town.toLowerCase().includes(searchTerm.toLowerCase())) ||
        charger.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.country) {
      if (filters.country === 'Serbia') {
        result = result.filter(charger => charger.country === 'Serbia');
      } else {
        result = result.filter(charger => charger.country === filters.country);
      }
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
    setShowRoute(false); 
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ country: '', minPower: 0, status: '' });
    setSearchTerm('');
  };

  const getUserLocation = () => {
    setLoadingLocation(true);
    setLocationError(null);

    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const {latitude, longitude} = position.coords;
          setUserLocation({latitude, longitude});
          setLoadingLocation(false);
        },
        (error) => {
          let errorMessage = '';
          switch(error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'User denied access!';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location unavailable!';
                break;
              case error.TIMEOUT:
                errorMessage = 'Request expired...';
                break;
              default:
                errorMessage = 'LOCATION ERROR: ' + error.message;
          }

          setLocationError(errorMessage);
          setLoadingLocation(false);
          console.error(errorMessage);
        }
      )
    }else{
      console.log('Geolocation API is not supported by this browser.')
    }
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
      <LocationButton 
        onClick={getUserLocation}
        loading={loadingLocation}
        error={locationError}
      />

      <Sidebar 
        chargers={filteredChargers}
        onChargerClick={handleChargerClick}
        selectedCharger={selectedCharger?.chargeId}
        onAuthClick={() => setShowAuthModal(true)}
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

      <Map 
        chargers={filteredChargers}
        selectedCharger={selectedCharger}
        onMarkerClick={handleChargerClick}
        userLocation={userLocation}
        showRoute={showRoute}
      />

      {selectedCharger && (
        <Details
          charger={selectedCharger}
          onClose={() => {
            setSelectedCharger(null);
            setShowRoute(false); 
          }}
          onShowRoute={() => setShowRoute(true)} 
          userLocation={userLocation}
        />
      )}

      <Auth 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

export default App;