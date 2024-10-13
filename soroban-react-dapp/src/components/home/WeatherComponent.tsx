// WeatherComponent.tsx
import React, { useEffect, useState } from 'react';
import { fetchWeatherData } from './mockApi'; // Adjust the import path as necessary

const WeatherComponent: React.FC = () => {
  const [data, setData] = useState<{ areas: { name: string; imageUrl: string }[] } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const getWeatherData = async () => {
      setLoading(true);
      const response = await fetchWeatherData();
      setData(response);
      setLoading(false);
    };

    getWeatherData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Areas Under Natural Disaster Right Now:</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {data?.areas.map((area, index) => (
          <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', width: '200px' }}>
            <img src={area.imageUrl} alt={area.name} style={{ width: '100%', height: 'auto' }} />
            <h3 style={{ textAlign: 'center', margin: '10px 0' }}>{area.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherComponent;
