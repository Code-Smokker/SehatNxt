const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
    try {
        const { lat, lng } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and Longitude required' });
        }

        // Use the API key from environment variables
        // Note: In backend .env, it should be GOOGLE_MAPS_API_KEY. 
        // If frontend calls existing NEXT_PUBLIC_..., we need to ensure the backend also has access or we pass it (bad practice).
        // I will assume GOOGLE_MAPS_API_KEY is available or I will try to use the one from process.env if available, 
        // else fallback to a hardcoded one if user provided (User didn't provide in chat, but context implies use "REAL API").
        // I will attempt to read from process.env.GOOGLE_MAPS_API_KEY 

        const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            console.error("AQI API Key Missing");
            return res.status(500).json({ error: 'Server Configuration Error: API Key Missing' });
        }

        const url = `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${apiKey}`;

        const response = await axios.post(url, {
            location: {
                latitude: parseFloat(lat),
                longitude: parseFloat(lng)
            },
            universalAqi: true, // Request generic AQI if available
            extraComputations: ["HEALTH_RECOMMENDATIONS", "DOMINANT_POLLUTANT_CONCENTRATION", "POLLUTANT_CONCENTRATION", "LOCAL_AQI", "POLLUTANT_ADDITIONAL_INFO"]
        });

        res.json(response.data);

    } catch (error) {
        console.error("Google AQI API Error:", error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch AQI data' });
    }
});

module.exports = router;
