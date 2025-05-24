const apikey = '1a18cdb7c9914db3838105530250803';

const search = document.querySelector("#search");
const searchIcon = document.querySelector("#search-icon");
const contents = document.querySelector(".contents");
const menuIcon = document.querySelector('#menu-icon');
const sidebarOverlay = document.querySelector('.sidebar-overlay');
const suggestions = document.querySelector("#suggestions");
const weatherInfo = document.querySelector("#weather-info");
const location = document.querySelector("#location");
const temperature = document.querySelector("#temp");
const aboutDayIcon = document.querySelector("#about-day-icon");
const aboutDayText = document.querySelector("#about-day-text");
const forecastCards = document.querySelector(".forecast-cards");
const sunriseTime = document.querySelector("#sunrise");
const sunsetTime = document.querySelector("#sunset");
const sungraph = document.querySelector("#sun-graph");
const windSpeed = document.querySelector("#wind-value");
const pressure = document.querySelector("#pressure-value");
const humidity = document.querySelector("#humidity-value");
const uv = document.querySelector("#uv-value");
const air = document.querySelector("#air-value");

 //Dynamic background color
let hue = 0;
setInterval(() => {
  hue = (hue + 1) % 360;
  const color = `hsl(${hue}, 50%, 25%)`;
  document.body.style.backgroundColor = color;
}, 500); 

search.addEventListener('input', async (e) => {
  const loc = search.value.trim();
  if (loc) {
    const suggestionsData = await fetchSuggestions(loc);
    displaySuggestions(suggestionsData);
  } else {
    suggestions.innerHTML = '';
  }
});

search.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const loc = search.value.trim();
    if (loc) {
      fetchWeatherData(loc);
    }
  }
});

searchIcon.addEventListener('click', (e) => {
  const loc = search.value.trim();
  if (loc) {
    fetchWeatherData(loc);
    if (loc == "") {
      alert("Please enter a location");
    }
  }
});

// Fetch suggestions from API
async function fetchSuggestions(loc) {
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${apikey}&q=${loc}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
}

function displaySuggestions(suggestionsData) {
  suggestions.innerHTML = '';
  suggestionsData.forEach(suggestion => {
    const suggestionItem = document.createElement('div');
    suggestionItem.classList.add('suggestion-item');
    suggestionItem.textContent = `${suggestion.name}, ${suggestion.region}, ${suggestion.country}`;
    suggestionItem.addEventListener('click', () => {
      search.value = suggestion.name;
      fetchWeatherData(suggestion.name);
      suggestions.innerHTML = '';
    });
    suggestions.appendChild(suggestionItem);
  });
}

// Fetch weather data for the initial location
async function fetchWeatherData(loc) {
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${loc}&days=5&aqi=yes`);
    const result = await response.json(); 

    console.log(result);

    if (result.error) {
      throw new Error(result.error.message);
    }
    displayWeatherData(result);

  } catch (error) {
    alert('Failed to fetch weather data. Please try again.');
    console.error('Error fetching weather data:', error);
  }
}

// Display weather data for the initial location
function displayWeatherData(data) {
  const todayForecast = data.forecast.forecastday[0];

  location.textContent = data.location.name;
  temperature.textContent = `${Math.round(data.current.temp_c)}°C`;
  aboutDayIcon.src = data.current.condition.icon;
  aboutDayIcon.alt = data.current.condition.text;
  aboutDayText.textContent = `${data.current.condition.text}`;

  if (data.current.is_day === 1) {
    sunriseTime.textContent = `Sunrise ${todayForecast.astro.sunrise}`;
    sunsetTime.textContent = `Sunset ${todayForecast.astro.sunset}`;
  } else {
    sunriseTime.textContent = `Moonrise ${todayForecast.astro.moonrise}`;
    sunsetTime.textContent = `Moonset ${todayForecast.astro.moonset}`;
  }

  humidity.textContent = `${data.current.humidity}%`;
  windSpeed.textContent = `${data.current.wind_mph}mPh`;
  pressure.innerHTML = `${data.current.pressure_mb}mbr`;
  uv.textContent = `${data.current.uv}`;
  air.textContent = data.current.air_quality ? `${Math.round(data.current.air_quality.pm2_5)}% ` : 'N/A';

  // Display 3-day forecast
  forecastCards.innerHTML = '';
  data.forecast.forecastday.forEach(day => {
    const forecastCard = document.createElement('div');
    forecastCard.classList.add('forecast-card');
    forecastCard.innerHTML = `
        <div>${day.date}</div>
        <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" style="width: 15vh; height: 15vh;">
        <div>${Math.round(day.day.maxtemp_c)}/${Math.round(day.day.mintemp_c)}°C</div>
        <div>${day.day.condition.text}</div>
      `;
    forecastCards.appendChild(forecastCard);
  });
}