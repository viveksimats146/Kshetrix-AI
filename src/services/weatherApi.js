export const fetchWeatherForDistrict = async (district, targetDateStr) => {
  try {
    // 1. Geocode district name to coordinates using Open-Meteo free geocoding API
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(district)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) throw new Error("Geocoding failed");
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("District coordinates not found");
    }
    
    const { latitude, longitude, name } = geoData.results[0];
    
    // 2. Fetch daily weather forecast using Open-Meteo free forecast API
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,precipitation_probability_max,weathercode&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) throw new Error("Weather forecast fetch failed");
    const weatherData = await weatherRes.json();
    
    const daily = weatherData.daily;
    if (!daily || !daily.time || daily.time.length === 0) {
      throw new Error("No daily forecast data available");
    }

    // 3. Find target date index in the forecast
    let targetIdx = 0; // Default to today
    if (targetDateStr) {
      const idx = daily.time.indexOf(targetDateStr);
      if (idx !== -1) {
        targetIdx = idx;
      } else {
        // If date is outside forecast, find the closest date in the array
        const targetTime = new Date(targetDateStr).getTime();
        let minDiff = Infinity;
        daily.time.forEach((t, i) => {
          const diff = Math.abs(new Date(t).getTime() - targetTime);
          if (diff < minDiff) {
            minDiff = diff;
            targetIdx = i;
          }
        });
      }
    }

    // 4. Map WMO Weather Code to readable condition
    const wmoCode = daily.weathercode[targetIdx];
    let condition = "Sunny";
    
    if (wmoCode === 0) {
      condition = "Sunny";
    } else if ([1, 2, 3].includes(wmoCode)) {
      condition = "Partly Cloudy";
    } else if ([45, 48].includes(wmoCode)) {
      condition = "Cloudy";
    } else if ([51, 53, 55].includes(wmoCode)) {
      condition = "Rainy";
    } else if ([61, 63, 65, 80, 81, 82].includes(wmoCode)) {
      condition = "Heavy Rain";
    } else if ([95, 96, 99].includes(wmoCode)) {
      condition = "Thunderstorm";
    } else {
      condition = "Sunny";
    }

    const tempMax = Math.round(daily.temperature_2m_max[targetIdx]);
    const tempMin = Math.round(daily.temperature_2m_min[targetIdx]);
    const avgTemp = Math.round((tempMax + tempMin) / 2);
    const humidity = Math.round(daily.relative_humidity_2m_max[targetIdx] || 55);
    const rainProb = Math.round(daily.precipitation_probability_max[targetIdx] || 10);
    
    return {
      temp: avgTemp,
      tempMax,
      tempMin,
      humidity,
      wind: 12, // Default fallback
      rainProb,
      condition,
      date: daily.time[targetIdx],
      resolvedName: name
    };
  } catch (err) {
    console.error("Failed fetching live weather, falling back to mock:", err.message);
    return null;
  }
};
