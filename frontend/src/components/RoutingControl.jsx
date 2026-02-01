import { useEffect, useState } from 'react';
import { Polyline } from 'react-leaflet';

const RoutingControl = ({ start, end }) => {
  const [route, setRoute] = useState(null);

  useEffect(() => {
    if (!start || !end) return;

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          const coordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
          setRoute(coordinates);
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    fetchRoute();
  }, [start, end]);

  if (!route) return null;

  return (
    <Polyline 
      positions={route} 
      color="#ff3c00" 
      weight={6}
      opacity={0.7}
    />
  );
};

export default RoutingControl;