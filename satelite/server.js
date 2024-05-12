const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'src')));

app.use(express.static(path.join(__dirname, 'build')));

const PORT = process.env.PORT || 5000;

app.use(express.json());

// Serve the React frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Route for proxying requests to N2YO API
app.get('/satellite', async (req, res) => {
    const { apiKey, id } = req.query;
    const{observer_lat,observer_lng}=req.query;
    const observer_alt=0;
    const seconds=1;


    const apiUrl = `https://api.n2yo.com/rest/v1/satellite/positions/${id}/${observer_lat}/${observer_lng}/${observer_alt}/${seconds}?apiKey=${apiKey}`;
    


    try {
        const response = await axios.get(apiUrl);
        res.json(response.data);
        console.log(response.data);
        const latestposition=response.data.positions[0];
        const{satlatitude,satlongitude,azimuth,elevation,ra,dec,timestamp}=latestposition;
        console.log(`${satlatitude}, ${satlongitude},${azimuth},${elevation},${ra},${dec},${timestamp}`);

    } catch (error) {
        console.error('Error fetching data from N2YO API:', error);
        res.status(500).json({ error: 'Failed to fetch data from N2YO API' });
    }});
    
    

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
