const API_KEY = '526f85084d508409e3c8fd6d19180390'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const currentLocationBtn = document.getElementById('current-location-btn');
const weatherDisplay = document.querySelector('.weather-display');
const locationName = document.getElementById('location-name');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');

// Event Listeners
searchBtn.addEventListener('click', searchWeather);
currentLocationBtn.addEventListener('click', getWeatherByCurrentLocation);
locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchWeather();
});

async function searchWeather() {
    const location = locationInput.value.trim();
    if (!location) {
        alert('Please enter a location');
        return;
    }
    
    try {
        showLoader(true);
        const data = await fetchWeatherData(`q=${location}`);
        displayWeather(data);
    } catch (error) {
        showError(error);
    } finally {
        showLoader(false);
    }
}

async function getWeatherByCurrentLocation() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }

    try {
        showLoader(true);
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const data = await fetchWeatherData(
            `lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        );
        displayWeather(data);
    } catch (error) {
        showError(error);
    } finally {
        showLoader(false);
    }
}

async function fetchWeatherData(query) {
    const response = await fetch(`${BASE_URL}?${query}&units=metric&appid=${API_KEY}`);
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch weather data');
    }
    
    return await response.json();
}

function displayWeather(data) {
    weatherDisplay.style.display = 'block';
    locationName.textContent = `${data.name}, ${data.sys?.country || ''}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;
    
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
}

function showError(error) {
    console.error('Error:', error);
    alert(`Error: ${error.message || 'Failed to get weather data'}`);
}

function showLoader(show) {
    // Implement a loading spinner here if needed
    if (show) {
        console.log('Loading...');
    } else {
        console.log('Done loading');
    }
}