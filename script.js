const apiKey = "2165fddc6d625df04d323bf8065ed42c"; 
const searchButton = document.getElementById('search-button');
const cityInput = document.getElementById('city-input');

function getWeatherData(city) {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    fetch(weatherApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found. Please try again.');
            }
            return response.json();
        })
        .then(data => {
            updateWeatherCard(data);
            const { lat, lon } = data.coord;
            const aqiApiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            return fetch(aqiApiUrl); 
        })
        .then(response => response.json())
        .then(data => {
            updateAqiCard(data);
        })
        .catch(error => {
            console.error("Error:", error);
            alert(error.message); 
        });
}

function updateWeatherCard(data) {
    document.getElementById('city-name').textContent = `Weather in ${data.name}`;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

function updateAqiCard(data) {
    const aqiValue = data.list[0].main.aqi;
    const aqiValueEl = document.getElementById('aqi-value');
    const aqiStatusEl = document.getElementById('aqi-status');
    
    aqiValueEl.textContent = aqiValue;

    let status = '';
    let color = '';
    switch (aqiValue) {
        case 1: status = 'Good'; color = 'green'; break;
        case 2: status = 'Fair'; color = 'yellowgreen'; break;
        case 3: status = 'Moderate'; color = 'orange'; break;
        case 4: status = 'Poor'; color = 'red'; break;
        case 5: status = 'Very Poor'; color = 'darkred'; break;
        default: status = 'Unknown'; color = 'black'; break;
    }
    aqiStatusEl.textContent = status;
    aqiValueEl.style.color = color;
    aqiStatusEl.style.color = color;
}

searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

cityInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
        }
    }
});

window.addEventListener('load', () => {
    getWeatherData('Aurangabad');
});