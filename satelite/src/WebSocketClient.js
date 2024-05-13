const connectWebSocket = () => {
    const ws = new WebSocket('wss://tracker-ay6d.onrender.com/ws');

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

    return ws;
};

export default connectWebSocket;
