import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button } from "@mui/material";
import { Box, Grid, Typography, Paper } from "@mui/material";

function WeatherComponent() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = import.meta.env.VITE_APP_OPENAI_API_K; // Replace with your actual key
  const [city, setCity] = useState("London"); // Default city
  const [inputCity, setInputCity] = useState(""); // State for TextField input
  const [kolkataTime, setKolkataTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const utcTime = new Date();
      // Kolkata is UTC+5:30 (5 hours and 30 minutes ahead, or 19800 seconds)
      const kolkataLocalTime = new Date(utcTime.getTime() + 19800 * 1000);
      setKolkataTime(kolkataLocalTime);
    }, 1000);
    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  const handleInputChange = (event) => {
    console.log("testing", event.target.value); // Log the input value
    setInputCity(event.target.value); // Update inputCity as the user types
  };

  const handleSearch = () => {
    setCity(inputCity); // Update the city state to trigger the API call
  };

  const temp = weatherData?.main?.temp; // Optional chaining to avoid errors if data is not available
  const celcius = temp - 273.15; // Convert Kelvin to Celsius

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

  const formatDateTime = (date) => {
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (weatherData) {
    return (
      <>
        <div>
          <Box
            sx={{
              padding: 4,
              backgroundColor: "#0f1c2e",
              color: "white",
              minHeight: "100vh",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              The Weather Forecasting
            </Typography>

            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Kolkata Date and Time: {formatDateTime(kolkataTime)}
            </Typography>

            <TextField
              id="outlined-basic"
              // label="Enter City"
              variant="outlined"
              value={inputCity}
              onChange={handleInputChange} // Update inputCity on change
              sx={{
                width: 1100,
                marginTop: 2,
                marginLeft: 2,
                borderRadius: 1,
                backgroundColor: "white",
              }}
            />
            <Button
              onClick={handleSearch}
              variant="contained"
              sx={{
                marginLeft: 2,
                marginTop: 3,
                backgroundColor: "#1976d2",
                color: "white",
              }}
            >
              Submit
            </Button>

            <Grid container spacing={2} marginTop={4}>
              {/* Left Side - Current Weather */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={3}
                  sx={{ padding: 3, backgroundColor: "#1e2a3a" }}
                >
                  <Typography variant="h5">
                    Current Weather - {weatherData.name}(
                    {weatherData.sys.country})
                  </Typography>
                  <Typography variant="h2">{celcius.toFixed(1)}°C</Typography>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {weatherData.weather[0].description}
                  </Typography>
                  <Typography>
                    Real Feel: {weatherData.main.feels_like - 273.15}°C
                  </Typography>
                  <Typography>
                    Humidity: {weatherData.main.humidity}%
                  </Typography>
                  <Typography>
                    Wind Speed: {weatherData.wind.speed} m/s
                  </Typography>
                  <Typography>Clouds: {weatherData.clouds.all}%</Typography>
                </Paper>
              </Grid>

              {/* Right Side - Weekly Forecast Placeholder */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={3}
                  sx={{ padding: 3, backgroundColor: "#1e2a3a" }}
                >
                  <Typography variant="h5">Weekly Forecast</Typography>
                  {/* You'll loop through weekly data here */}
                  <Typography sx={{ mt: 2 }}>Coming soon...</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </div>
      </>
    );
  }

  return null;
}

export default WeatherComponent;
