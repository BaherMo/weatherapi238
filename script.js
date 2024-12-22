const apiKey = '2b62255c6a4ed6685d4cc98150248651'; 
const geoApiUrl = 'https://api.openweathermap.org/geo/1.0/direct';

const cityInput = document.getElementById('cityInput');
const suggestionsList = document.getElementById('suggestions');
const weatherResult = document.getElementById('weatherResult');
const searchBtn = document.getElementById('searchBtn');

let selectedCity = null; // Store selected city data

// Fetch city suggestions as the user types
cityInput.addEventListener('input', () => {
  const query = cityInput.value.trim();
  if (query.length > 2) {
    fetch(`${geoApiUrl}?q=${query}&limit=5&appid=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        // Clear previous suggestions
        suggestionsList.innerHTML = '';
        if (data.length === 0) {
          suggestionsList.innerHTML = '<li class="list-group-item">No results found</li>';
        } else {
          data.forEach(city => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'list-group-item-action');
            listItem.textContent = `${city.name}, ${city.country} (${city.state || 'N/A'})`;
            listItem.dataset.lat = city.lat;
            listItem.dataset.lon = city.lon;
            listItem.addEventListener('click', () => selectCity(city));
            suggestionsList.appendChild(listItem);
          });
        }
      })
      .catch(error => console.error('Error fetching suggestions:', error));
  } else {
    suggestionsList.innerHTML = '';
  }
});

// Handle city selection
function selectCity(city) {
  cityInput.value = `${city.name}, ${city.country}`;
  selectedCity = city; // Store selected city data
  suggestionsList.innerHTML = ''; // Hide suggestions
}

// Fetch weather when "Search" is clicked
searchBtn.addEventListener('click', () => {
  if (!selectedCity) {
    weatherResult.innerHTML = `<p class="text-danger">Please select a city from the suggestions.</p>`;
    return;
  }

  fetchWeather(selectedCity.lat, selectedCity.lon);
});

// Fetch weather by coordinates
function fetchWeather(lat, lon) {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
    fetch(weatherApiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Weather data not found');
        }
        return response.json();
      })
      .then(data => {
        weatherResult.innerHTML = `
          <div class="card mx-auto" style="max-width: 400px;">
            <div class="card-body">
              <h3 class="card-title">Weather in ${data.name}</h3>
              <p class="card-text"><strong>Temperature:</strong> ${data.main.temp} °C</p>
              <p class="card-text"><strong>Weather:</strong> ${data.weather[0].description}</p>
              <p class="card-text"><strong>Humidity:</strong> ${data.main.humidity}%</p>
            </div>
          </div>
        `;
      })
      .catch(error => {
        weatherResult.innerHTML = `<p class="text-danger">${error.message}</p>`;
      });
  }
