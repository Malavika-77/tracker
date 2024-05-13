import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import Earth from './earth.gif';
import sate from './sate.jpg';
import './style.css';

function App() {
  const [satelliteData, setSatelliteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [satelliteId, setSatelliteId] = useState('');
  const [satelliteLatitude, setSatelliteLatitude] = useState(null);
  const [satelliteLongitude, setSatelliteLongitude] = useState(null);
  const [satelliteazimuth, setSatelliteazimuth] = useState(null);
  const [satelliteelevation, setSatelliteelevation] = useState(null);
  const [satellitera, setSatellitera] = useState(null);
  const [satellitedec, setSatellitedec] = useState(null);
  const [satellitetimestamp, setSatellitetimestamp] = useState(null);

  useEffect(() => {
    const map = L.map('map').setView([0, 0], 1);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{y}/{x}.png').addTo(map);

    const iconUrl = { sate };
    const customIcon = L.icon({
      iconUrl: iconUrl,
      iconSize: [38, 38],
      iconAnchor: [25, 50],
      popupAnchor: [0, -25]
    });

    const polyline = L.polyline([], { color: 'blue', weight: 5 }).addTo(map);
    const marker = L.marker([0, 0], { icon: customIcon }).addTo(map);

    const updateMarker = () => {
      if (satelliteLatitude !== null && satelliteLongitude !== null) {
        marker.setLatLng([satelliteLatitude, satelliteLongitude]);
        marker.bindPopup(`<b>${satelliteLatitude},${satelliteLongitude}</b>`).openPopup();
        polyline.addLatLng([satelliteLatitude, satelliteLongitude]);
      } else {
        console.warn('Latitude or longitude is null');
      }
    };

    updateMarker();

    const ws = new WebSocket('wss://tracker-1-y7fj.onrender.com:10000/ws'); // Replace with your WebSocket server URL

ws.onopen = () => {
  console.log('WebSocket connected');
};

ws.onmessage = (event) => {
  console.log('Received:', event.data);

  // Parse the JSON data received from the WebSocket message
  const data = JSON.parse(event.data);

  // Extract relevant information from the positions array
  const { satname, satlatitude, satlongitude, azimuth, elevation, ra, dec, timestamp } = data.positions[0];

  // Display the extracted information
  console.log('Satellite Name:', satname);
  console.log('Satellite Latitude:', satlatitude);
  console.log('Satellite Longitude:', satlongitude);
  console.log('Azimuth:', azimuth);
  console.log('Elevation:', elevation);
  console.log('RA:', ra);
  console.log('Dec:', dec);
  console.log('Timestamp:', timestamp);
};

ws.onclose = () => {
  console.log('WebSocket disconnected');
};

    return () => {
      map.remove();
      ws.close();
    };
  }, [satelliteLatitude, satelliteLongitude]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const observerLng = 76.55;
      const observerLat = 9.46667;

      const response = await axios.get(`/satellite?id=${satelliteId}&apiKey=PBDNMG-25GWYW-BAZRWH-58Z5&observer_lat=${observerLat}&observer_lng=${observerLng}`);

      if (!response.data.positions || response.data.positions.length === 0) {
        throw new Error('Satellite data not found');
      }

      setSatelliteData(response.data);
      const latestPosition = response.data.positions[0];
      setSatelliteLatitude(latestPosition.satlatitude);
      setSatelliteLongitude(latestPosition.satlongitude);
      setSatelliteazimuth(latestPosition.azimuth);
      setSatelliteelevation(latestPosition.elevation);
      setSatellitera(latestPosition.ra);
      setSatellitedec(latestPosition.dec);
      setSatellitetimestamp(latestPosition.timestamp);

      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching satellite data:', error);
      setError('Failed to fetch satellite data');
      setLoading(false);
      setSatelliteData(null);
    }
  };

  const handleInputChange = (event) => {
    setSatelliteId(event.target.value);
  };

  return (
    <div className="back">
      <h1 className='h1'>Tracker 2024</h1>
      <img src={Earth} alt="earth imag" className="spin" />
      <h3 className='h3'>
        Satellites are identified by their NORAD catalog number which is an integer ranging from 1 to 43235 and counting.
        The numbers are assigned by United States Space Command (USSPACECOM) to all Earth orbiting satellites in order of identification.
        If you are looking to find the id of your favorite satellite, browse categories or search the n2yo.com database until you arrive at the satellite details page,
        and extract the NORAD ID for your application. For instance, Space Station (ISS) is NORAD ID 25544.
      </h3>
      <div className="map-container">
        <div id="map"></div>
      </div>

      <form onSubmit={handleSubmit} className='map'>
        <label className='label'>Enter satelliteId</label>
        <input
          type="text"
          value={satelliteId}
          onChange={handleInputChange}
          placeholder="Enter satellite ID"
          className='text'
        /><br /><br />
        <button type="submit" className='btn1'>Track Satellite</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {satelliteData && satelliteData.info && (
        <div className='map1'>
          <h2>Tracking</h2>
          <p>Satellite Name: {satelliteData.info.satname}</p>
          <p>Satellite ID: {satelliteData.info.satid}</p>

          {satelliteazimuth !== null && satelliteelevation !== null && satellitera !== null && satellitedec !== null && satellitetimestamp !== null && (
            <div>
              <p>Satellite latitude: {satelliteLatitude}</p>
              <p>Satellite longitude: {satelliteLongitude}</p>
              <p>Satellite azimuth: {satelliteazimuth}</p>
              <p>Satellite elevation: {satelliteelevation}</p>
              <p>Satellite ra: {satellitera}</p>
              <p>Satellite dec: {satellitedec}</p>
              <p>Satellite timestamp: {satellitetimestamp}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
