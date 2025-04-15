import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button } from '@mui/material';

function WeatherComponent() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = import.meta.env.VITE_APP_OPENAI_API_K; // Replace with your actual key
  const [city, setCity] = useState('London'); // Default city
  const [inputCity, setInputCity] = useState(''); // State for TextField input

  const handleInputChange = (event) => {
    console.log("testing",event.target.value); // Log the input value
    setInputCity(event.target.value); // Update inputCity as the user types
  };

  const handleSearch = () => {
    setCity(inputCity); // Update the city state to trigger the API call
  };
  
  const temp = weatherData?.main?.temp; // Optional chaining to avoid errors if data is not available
  const celcius =  temp - 273.15; // Convert Kelvin to Celsius

  useEffect(() => {
    if (!city) return;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
        );
        setWeatherData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [city]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (weatherData) {
    return (
      <div>
        <TextField
          id="outlined-basic"
          label="Enter City"
          variant="outlined"
          value={inputCity}
          onChange={handleInputChange} // Update inputCity on change
        />
        <Button onClick={handleSearch} variant="contained">
          Submit
        </Button>
        <h2>Weather in {weatherData.name}</h2>
        <p>Temperature: {celcius}°C</p>
        <p>Description: {weatherData.weather[0].description}</p>
      </div>
    );
  }

  return null;
}

export default WeatherComponent;