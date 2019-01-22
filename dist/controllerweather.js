"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config/config");
const forecastreceiver_1 = require("./forecast/forecastreceiver");
const mqttclient_1 = require("./mqtt/mqttclient");
const weatherreceiver_1 = require("./weather/weatherreceiver");
let mqttClient;
var forecasttopicaggregated;
var forecasttopicfull;
var temperaturetopicsend;
var pressuretopicsend;
var humiditytopicsend;
var windspeedtopicsend;
var winddegtopicsend;
function setup() {
    const handler = config_1.Confighandler.Instance;
    forecasttopicfull = handler.config.forecasttopicssend.full;
    forecasttopicaggregated = handler.config.forecasttopicssend.aggregated;
    temperaturetopicsend = handler.config.weathertopicssend.temperature;
    pressuretopicsend = handler.config.weathertopicssend.pressure;
    humiditytopicsend = handler.config.weathertopicssend.humidity;
    windspeedtopicsend = handler.config.weathertopicssend.windspeed;
    winddegtopicsend = handler.config.weathertopicssend.winddeg;
    console.log(temperaturetopicsend);
    console.log(pressuretopicsend);
    const second = 1000;
    const hour = 60 * 60 * 1000;
    mqttClient = mqttclient_1.MqttClient.Instance;
    const weatherReceiver = new weatherreceiver_1.WeatherReceiver(mqttClient);
    const forecastReceiver = new forecastreceiver_1.ForecastReceiver();
    weatherReceiver.setReceiveFunction(getWeather);
    weatherReceiver.setCycleDuration(20 * second);
    weatherReceiver.setCycleActive(true);
    forecastReceiver.setReceiveFunction(getForecast);
    forecastReceiver.setCycleDuration(1 * hour);
    forecastReceiver.setCycleActive(true);
    mqttClient.subscribe("htlleonding/weather", onMessage);
    mqttClient.subscribe("htlleonding/weather/test", onMessage);
    mqttClient.send("htlleonding", "WeatherService up");
    console.log("Awaiting data:\n");
}
exports.setup = setup;
function onMessage(topic, message) {
    console.log(`${topic}: ${message}`);
}
function getWeather(weather) {
    console.log("\x1b[32m", `New Weather Data arrived: \x1b[0m${JSON.stringify(weather)}`);
    updateWeather(weather);
    return true;
}
function getForecast(forecast, aggregatedforecast) {
    console.log(`Forecast arrived: ${JSON.stringify(forecast).substring(0, 40)}...`);
    mqttClient.send(forecasttopicfull, JSON.stringify(forecast));
    return true;
}
function updateWeather(weather) {
    if (weather.changed[0]) {
        sendMessage(temperaturetopicsend, weather.timestamp, weather.temperature);
        weather.changed[0] = false;
    }
    if (weather.changed[1]) {
        sendMessage(pressuretopicsend, weather.timestamp, weather.pressure);
        weather.changed[1] = false;
    }
    if (weather.changed[2]) {
        sendMessage(humiditytopicsend, weather.timestamp, weather.humidity);
        weather.changed[2] = false;
    }
    if (weather.changed[3]) {
        sendMessage(windspeedtopicsend, weather.timestamp, weather.windspeed);
        weather.changed[3] = false;
    }
    if (weather.changed[4]) {
        sendMessage(winddegtopicsend, weather.timestamp, weather.winddir);
        weather.changed[4] = false;
    }
}
function sendMessage(topic, timestamp, value) {
    mqttClient.send(topic, JSON.stringify({ timestamp: (timestamp - (timestamp % 1000)) / 1000, value }));
}
//# sourceMappingURL=controllerweather.js.map