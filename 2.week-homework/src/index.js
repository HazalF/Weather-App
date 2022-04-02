let searchForm = document.querySelector("#city-search-form");
searchForm.addEventListener("submit", changeCity);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

let celsiusTemperature = null;

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
  let apiKey = "6f4c150feca86de42ef85c28995713db";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function displayTemperature(response) {
  console.log(response);
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  document.querySelector("#high").innerHTML = Math.round(response.data.main.temp_max);
  document.querySelector("#low").innerHTML = Math.round(response.data.main.temp_min);
  document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);
  document.querySelector("#description").innerHTML = response.data.weather[0].main;

  celsiusTemperature = response.data.main.temp;
  let cityElement = document.querySelector("#city-name");
  cityElement.innerHTML = response.data.name;

  let iconsElement = document.querySelector("#icons");

  iconsElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
}

function displayFahrenheit() {
  let fahrenheitTemperature = celsiusTemperature * 1.8 + 32;
  document.querySelector("#temperature").innerHTML = Math.round(fahrenheitTemperature);
  changeActiveUnit(false);
}

function displayCelsius() {
  document.querySelector("#temperature").innerHTML = Math.round(celsiusTemperature);
  changeActiveUnit(true);
}

function searchLocation(position) {
  let apiKey = "6f4c150feca86de42ef85c28995713db";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function changeActiveUnit(isCelsiusActive) {
  let celsiusLink = document.querySelector("#celsius-link");
  let fahrenheitLink = document.querySelector("#fahrenheit-link");
  if (isCelsiusActive) {
    celsiusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");
  } else {
    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");
  }
}
