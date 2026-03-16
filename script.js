const apiKey = "YOUR_API_KEY"; // from OpenWeatherMap
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const resultDiv = document.getElementById("weatherResult");
const historyList = document.getElementById("historyList");

console.log("Script Loaded");

// Load history on page load
window.onload = function () {
    console.log("Page Loaded");
    loadHistory();
};

// Button click
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if(city === ""){
        alert("Please enter a city name");
        return;
    }

    getWeather(city);
});


// Async Weather Fetch
async function getWeather(city){

    console.log("Function Start");
    console.log("Fetching weather for:", city);

    try{

        const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );

        console.log("Fetch response received");

        if(!response.ok){
            throw new Error("City not found");
        }

        const data = await response.json();

        console.log("JSON parsed");

        displayWeather(data);
        saveCity(city);

    }

    catch(error){
        console.error("Error occurred:", error);
        resultDiv.innerHTML = "Error: " + error.message;
    }

    console.log("Function End");
}


// Display weather
function displayWeather(data){

    const city = data.name;
    const temp = data.main.temp;
    const condition = data.weather[0].main;

    resultDiv.innerHTML = `
        <h3>${city}</h3>
        <p>Temperature: ${temp} °C</p>
        <p>Condition: ${condition}</p>
    `;
}


// Save city to Local Storage
function saveCity(city){

    let cities = JSON.parse(localStorage.getItem("cities")) || [];

    if(!cities.includes(city)){
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
    }

    loadHistory();
}


// Load history
function loadHistory(){

    historyList.innerHTML = "";

    const cities = JSON.parse(localStorage.getItem("cities")) || [];

    cities.forEach(city => {

        const li = document.createElement("li");
        li.textContent = city;

        li.addEventListener("click", () => {
            getWeather(city);
        });

        historyList.appendChild(li);

    });

}