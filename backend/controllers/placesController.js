// controllers/placesController.js

// Define a helper function to use dynamic import for node-fetch
const fetchWrapper = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const YOUR_GOOGLE_API_KEY = 'AIzaSyBhwcZV06UIeDf7qcyhkshqQRDcx3X-vrM'; // Replace with your actual key

exports.getNearbyPlaces = async (req, res) => {
  try {
    const { lat, lng, radius = 1500 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng query parameters are required' });
    }
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=tourist_attraction&key=${YOUR_GOOGLE_API_KEY}`;
    const response = await fetchWrapper(url);
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.statusText}`);
    }
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    console.error('Error in getNearbyPlaces:', error);
    res.status(500).json({ error: error.message });
  }
};
