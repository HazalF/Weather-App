// For openweathermap API call
const apiKey = "6f4c150feca86de42ef85c28995713db";
const weatherUnitCelsius = "metric";
const weatherUnitFahrenheit = "imperial";

let searchForm = document.querySelector("#city-search-form");
searchForm.addEventListener("submit", changeCity);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

let currentTemperature = null;
let activeUnitCelsius = true;
let currentCoordinates = null;
let favoriteCities = [];

function formatDay(date) {
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let currentDay = days[date.getDay()];
  let formatDay = `${currentDay}`;
  return formatDay;
}

function setDefaultCityAndTime() {
  setCurrentTime();
  updateCity("Zurich");
}

function setCurrentTime() {
  let now = new Date();
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let timeParagraph = document.querySelector("#time-paragraph");
  timeParagraph.innerHTML = `${formatDay(now)} ${hours}: ${minutes}`;
}

function changeCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-search-input");
  updateCity(cityInput.value);
}

function updateCity(cityName) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=`;
  apiUrl += getWeatherUnit();
  axios.get(apiUrl).then(displayTemperature);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  document.querySelector("#high").innerHTML = Math.round(response.data.main.temp_max);
  document.querySelector("#low").innerHTML = Math.round(response.data.main.temp_min);
  document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);
  document.querySelector("#description").innerHTML = response.data.weather[0].main;

  currentTemperature = response.data.main.temp;
  let cityElement = document.querySelector("#city-name");
  cityElement.innerHTML = response.data.name;

  let iconsElement = document.querySelector("#icons");

  iconsElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  currentCoordinates = response.data.coord;
  getForecast();
}

function displayFahrenheit() {
  if (activeUnitCelsius) {
    currentTemperature = currentTemperature * 1.8 + 32;
    document.querySelector("#temperature").innerHTML = Math.round(currentTemperature);
    activeUnitCelsius = false;
    changeActiveUnit();
    getForecast();
  }
}

function displayCelsius() {
  if (!activeUnitCelsius) {
    currentTemperature = (currentTemperature - 32) / 1.8;
    document.querySelector("#temperature").innerHTML = Math.round(currentTemperature);
    activeUnitCelsius = true;
    changeActiveUnit();
    getForecast();
  }
}

function searchLocation(position) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=`;
  apiUrl += getWeatherUnit();
  axios.get(apiUrl).then(displayTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function changeActiveUnit() {
  let celsiusLink = document.querySelector("#celsius-link");
  let fahrenheitLink = document.querySelector("#fahrenheit-link");
  if (activeUnitCelsius) {
    celsiusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");
  } else {
    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");
  }
}

function getWeatherUnit() {
  if (activeUnitCelsius) {
    return weatherUnitCelsius;
  } else {
    return weatherUnitFahrenheit;
  }
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="border p-2 mt-1 rounded shadow forecast-section">
        <div class="weather-forecast-date">${formatDay(new Date(forecastDay.dt * 1000))}</div>
        <img
          src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(forecastDay.temp.max)}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(forecastDay.temp.min)}° </span>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast() {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentCoordinates.lat}&lon=${currentCoordinates.lon}&appid=${apiKey}&units=`;
  apiUrl += getWeatherUnit();
  axios.get(apiUrl).then(displayForecast);
}

function toggleFavoriteCity() {
  let cityName = document.querySelector("#city-name").innerHTML;
  console.log("Toggle fav city: " + cityName);
  if (favoriteCities.includes(cityName)) {
    favoriteCities.pop(cityName);
  } else {
    if (favoriteCities.length >= 3) {
      alert("Sorry, you cannot add more than 3 cities to your favorites");
    } else {
      favoriteCities.push(cityName);
    }
  }
  updateFavoriteCitiesSection();
}

function updateFavoriteCitiesSection() {
  let favoriteCitiesHtml = "";
  favoriteCities.forEach(function (cityName) {
    favoriteCitiesHtml += `<a href="#"> ${cityName} </a> <br>`;
  });

  document.querySelector("#favorite-cities").innerHTML = favoriteCitiesHtml;
}
