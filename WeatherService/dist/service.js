"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mqttclient_1 = require("./mqtt/mqttclient");
const config_1 = require("./config/config");
const weatherreciever_1 = require("./weather/weatherreciever");
const forecastreciever_1 = require("./forecast/forecastreciever");
function GetWeather(weather) {
    console.log('\x1b[32m', `New Weather Data arrived: \x1b[0m${JSON.stringify(weather)}`);
    return true;
}
function GetForecast(forecast) {
    console.log(`New Forecast Data arrived: ${JSON.stringify(forecast).substring(0, 39)}...`);
    return true;
}
const greeting = "WeatherService is running\n-------------------------";
console.log(greeting);
let c1 = new config_1.Confighandler();
//c1.loadConfig("hoho")
c1.loadConfig();
let wr = new weatherreciever_1.WeatherReciever();
wr.setRecieveFunction(GetWeather);
wr.setCycleDuration(10000);
wr.setCycleActive;
let fr = new forecastreciever_1.ForecastReciever();
fr.setRecieveFunction(GetForecast);
fr.setCycleDuration(10000);
fr.setCycleActive;
let mqttClient = new mqttclient_1.MqttClient();
mqttClient.send("htlleonding", "test some ppps");
console.log("Awaiting data:\n");
//# sourceMappingURL=service.js.map