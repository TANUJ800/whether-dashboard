document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "2813429a34914bb57a5976abdce9370f"; // Replace with your OpenWeather API key

  const form = document.getElementById("weather-form");
  const cityInput = document.getElementById("city-input");
  const suggestionsBox = document.getElementById("suggestions");
  const weatherCard = document.getElementById("weather-card");
  const background = document.getElementById("background");

  const tempElem = document.getElementById("temperature");
  const descElem = document.getElementById("weather-description");
  const cityElem = document.getElementById("city-name");
  const timeElem = document.getElementById("local-time");
  const humidityElem = document.getElementById("humidity");
  const windElem = document.getElementById("wind-speed");
  const pressureElem = document.getElementById("pressure");
  const visibilityElem = document.getElementById("visibility");
  const sunriseElem = document.getElementById("sunrise");
  const sunsetElem = document.getElementById("sunset");
  const iconElem = document.getElementById("weather-icon");
  const errorElem = document.getElementById("error-message");

  const popularCities = [
    "Ahmedabad", "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata",
    "London", "New York", "Paris", "Tokyo", "Sydney", "Dubai",
    "Singapore", "Toronto", "Los Angeles", "Berlin", "Moscow", "Cape Town"
  ];

  // Autocomplete
  cityInput.addEventListener("input", () => {
    const value = cityInput.value.toLowerCase();
    suggestionsBox.innerHTML = "";
    if (value) {
      const filtered = popularCities.filter(c => c.toLowerCase().startsWith(value));
      filtered.forEach(city => {
        const div = document.createElement("div");
        div.classList.add("suggestion");
        div.textContent = city;
        div.onclick = () => {
          cityInput.value = city;
          suggestionsBox.innerHTML = "";
        };
        suggestionsBox.appendChild(div);
      });
    }
  });

  document.addEventListener("click", e => {
    if (e.target !== cityInput) suggestionsBox.innerHTML = "";
  });

  // Fetch weather
  form.addEventListener("submit", e => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;
    fetchWeather(city);
  });

  async function fetchWeather(city) {
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`);
      if (!res.ok) throw new Error("Check you spelling or ,City not found");
      const data = await res.json();
      displayWeather(data);
    } catch (err) {
      errorElem.textContent = "Sorry , We are currentl not available";
      weatherCard.classList.add("hidden");
    }
  }

  function displayWeather(data) {
    errorElem.textContent = "";

    tempElem.textContent = `${Math.round(data.main.temp)}°C`;
    descElem.textContent = data.weather[0].description;
    cityElem.textContent = data.name;
    timeElem.textContent = `Local Time: ${new Date((data.dt + data.timezone) * 1000).toUTCString().slice(17, 25)}`;
    humidityElem.textContent = `${data.main.humidity}%`;
    windElem.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    pressureElem.textContent = `${data.main.pressure} hPa`;
    visibilityElem.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    sunriseElem.textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    sunsetElem.textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    iconElem.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    updateBackground(data.weather[0].main);
    weatherCard.classList.remove("hidden");
  }

 function updateBackground(condition) {
  switch (condition.toLowerCase()) {
    case "clear":
      background.style.backgroundImage = "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')";
      break;
    case "clouds":
      background.style.backgroundImage = "url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80')";
      break;
    case "rain":
    case "drizzle":
      background.style.backgroundImage = "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80')";
      break;
    case "snow":
      background.style.backgroundImage = "url('https://images.unsplash.com/photo-1608889179800-8d1b4e54a5b8?auto=format&fit=crop&w=1600&q=80')";
      break;
    default:
      background.style.backgroundImage = "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')";
  }
}

});
