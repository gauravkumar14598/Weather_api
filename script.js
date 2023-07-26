const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const cityInput = document.querySelector(".city-input");
const API_KEY = "a39c046f614be68ffaad9a76b83fbef3";
const weatherCardsDiv = document.querySelector(".weather-card");
const currentWeatherDiv = document.querySelector(".current-weather");


const createWeatherCard = (weatherItem, cityName, index) => {
    if (index == 0) { // HTML for main weather card
        const weatherCardHTML = `
        <div class="current-weather">
                <div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${weatherItem.main.temp} °C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <!-- Alternate is the text that is displayed if image is not loaded -->
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>
            </div>
    `;
        return weatherCardHTML;
    }
    else {
        // HTML for other five days forecast card
        const weatherCardHTML = `
        <li class="card">
            <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
            <h4>Temperature: ${weatherItem.main.temp} °C</h4>
            <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
            <h4>Humidity: ${weatherItem.main.humidity}%</h4>
        </li>
    `;
        return weatherCardHTML;
    }
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY + "&units=metric";

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {

        // Filter the forecasts to get only one forecast per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        // Clearing previous weather data
        cityName.value = "";
        weatherCardsDiv.innerHTML = "";
        currentWeatherDiv.innerHTML = "";

        // console.log(fiveDaysForecast);
        // Creating weather cards and adding to webpage
        fiveDaysForecast.forEach((weatherItem, index) => {
            if (index == 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem, cityName, index));
            }
            else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem, cityName, index));
            }
        });

    }).catch(
        () => alert('An error has occured while retreiving geo-cordinates')
    );
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;
    const GEOCODING_API_URL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + API_KEY;
    // console.log(cityName);

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        // if(!data.length) return alert('An error')
        // console.log(data);
        // console.log("Latitude:"+data.coord.lat);
        // console.log("Longitude:"+data.coord.lon);
        // console.log("Name:"+data.name);

        // const latitude=data.coord.lat;
        // const longitude=data.coord.lon;
        // const name=data.name;
        getWeatherDetails(data.name, data.coord.lat, data.coord.lon);


    }).catch(
        () => alert('An error has occured while retreiving geo-cordinates')
    );
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            console.log(position);
            const REVERSE_GEOCODING_URL = "http://api.openweathermap.org/geo/1.0/reverse?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&appid=" + API_KEY;
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                // console.log(data);
                const cityName = data[0].name.split(" ")[0];
                // console.log("City is"+cityName);
                getWeatherDetails(cityName, position.coords.latitude, position.coords.longitude);

            }).catch(
                () => alert('An error has occured while fetching the city!')
            );


        },
        error => {
            if (error.code == error.PERMISSION_DENIED) {
                alert('Geolocation request denied. Please reset location permission to grant access')
            }
        }
    );
}

searchButton.addEventListener("click", getCityCoordinates);
locationButton.addEventListener("click", getUserCoordinates);