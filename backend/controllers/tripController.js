const axios = require('axios');

exports.planTrip = async (req, res) => {
  const { startDestination, endDestination, startDate, endDate } = req.body;
  console.log("Received data:", { startDestination, endDestination, startDate, endDate });

  try {
    const durationInDays = Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    );
    console.log("Duration:", durationInDays);

    // Step 1: Get city coordinates using GeoDB
    const geoResponse = await axios.get('https://wft-geo-db.p.rapidapi.com/v1/geo/cities', {
      params: {
        namePrefix: endDestination,
        limit: 5,
        sort: '-population'
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      }
    });

    const targetCity = geoResponse.data.data.find(city =>
        city.city.toLowerCase() === endDestination.toLowerCase()
      ) || geoResponse.data.data[0];
      

    if (!targetCity) {
      return res.status(404).json({ error: 'City not found' });
    }

    const [lat, lon] = [targetCity.latitude, targetCity.longitude];
    console.log("City found:", targetCity.city, targetCity.country, lat, lon);

    // Step 2: Fetch places via OpenTripMap (RapidAPI)
    const attractionsRes = await axios.get('https://opentripmap-places-v1.p.rapidapi.com/en/places/radius', {
      params: {
        radius: 10000,
        lon,
        lat,
        rate: 2,
        limit: durationInDays * 3,
        format: 'json'
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'opentripmap-places-v1.p.rapidapi.com'
      }
    });

    const attractions = attractionsRes.data.filter(place => place.rate >= 3);


    res.json({
      city: targetCity.city,
      country: targetCity.country,
      durationInDays,
      attractions
    });

  } catch (err) {
    console.error("Trip planning failed:", err.message);
    res.status(500).json({ error: 'Failed to plan trip' });
  }
};
