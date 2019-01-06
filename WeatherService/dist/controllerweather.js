"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mqttclient_1 = require("./mqtt/mqttclient");
const config_1 = require("./config/config");
const weatherreceiver_1 = require("./weather/weatherreceiver");
const forecastreceiver_1 = require("./forecast/forecastreceiver");
let mqttClient;
function setup() {
    let confighandler = config_1.Confighandler.Instance;
    let second = 1000;
    let hour = 60 * 60 * 1000;
    let weatherReceiver = new weatherreceiver_1.WeatherReceiver();
    weatherReceiver.setReceiveFunction(getWeather);
    weatherReceiver.setCycleDuration(20 * second);
    weatherReceiver.setCycleActive;
    let forecastReceiver = new forecastreceiver_1.ForecastReceiver();
    forecastReceiver.setReceiveFunction(getForecast);
    forecastReceiver.setCycleDuration(1 * hour);
    forecastReceiver.setCycleActive;
    mqttClient = new mqttclient_1.MqttClient();
    mqttClient.subscribe("htlleonding/weather", onMessage);
    mqttClient.send("htlleonding", "WeatherService up");
    console.log("Awaiting data:\n");
}
exports.setup = setup;
function onMessage(topic, message) {
    console.log(`${topic}: ${message}`);
}
function getWeather(weather) {
    console.log('\x1b[32m', `New Weather Data arrived: \x1b[0m${JSON.stringify(weather)}`);
    updateWeather(weather);
    return true;
}
function getForecast(forecast) {
    console.log(`Forecast arrived: ${JSON.stringify(forecast).substring(0, 40)}...`);
    mqttClient.send("htlleonding/outdoor/weather/forecast", JSON.stringify(forecast));
    return true;
}
function updateWeather(weather) {
    if (weather.changed[0]) {
        sendMessage("htlleonding/outdoor/weather/actual/temperature", weather.timestamp, weather.temperature);
    }
    if (weather.changed[1]) {
        sendMessage("htlleonding/outdoor/weather/actual/pressure", weather.timestamp, weather.pressure);
    }
    if (weather.changed[2]) {
        sendMessage("htlleonding/outdoor/weather/actual/humidity", weather.timestamp, weather.humidity);
    }
    if (weather.changed[3]) {
        sendMessage("htlleonding/outdoor/weather/actual/wind_speed", weather.timestamp, weather.windspeed);
    }
    if (weather.changed[4]) {
        sendMessage("htlleonding/outdoor/weather/actual/wind_deg", weather.timestamp, weather.winddir);
    }
}
function sendMessage(topic, timestamp, value) {
    mqttClient.send(topic, JSON.stringify({ timestamp: (timestamp - (timestamp % 1000)) / 1000, value: value }));
}
//# sourceMappingURL=controllerweather.js.map