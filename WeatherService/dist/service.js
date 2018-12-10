"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mqttclient_1 = require("./mqtt/mqttclient");
const config_1 = require("./config/config");
const weatherreciever_1 = require("./weather/weatherreciever");
const forecastreciever_1 = require("./forecast/forecastreciever");
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
        sendMessage("htlleonding/outdoor/weather/actual/temp", weather.timestamp, weather.temp);
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
const greeting = "WeatherService is running\n-------------------------";
console.log(greeting);
let c1 = new config_1.Confighandler();
//c1.loadConfig("hoho")
c1.loadConfig();
let wr = new weatherreciever_1.WeatherReciever();
wr.setRecieveFunction(getWeather);
wr.setCycleDuration(20 * 1000);
wr.setCycleActive;
let fr = new forecastreciever_1.ForecastReciever();
fr.setRecieveFunction(getForecast);
fr.setCycleDuration(60 * 60 * 1000);
fr.setCycleActive;
let mqttClient = new mqttclient_1.MqttClient();
mqttClient.subscribe("htlleonding/#");
mqttClient.send("htlleonding", "WeatherService up");
console.log("Awaiting data:\n");
//# sourceMappingURL=service.js.map