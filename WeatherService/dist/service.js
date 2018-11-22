"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config/config");
const weatherreciever_1 = require("./weather/weatherreciever");
const greeting = "Hello World!";
console.log(greeting);
let c1 = new config_1.Confighandler();
c1.loadConfig("hoho");
c1.loadConfig();
let wr = new weatherreciever_1.WeatherReciever();
wr.setRecieveFunction(GetWeather);
wr.setCycleDuration(5);
wr.setCycleActive;
function GetWeather(weather) {
    weather;
    console.log("Weather data arrived ${weather.toString()}");
    return true;
}
//# sourceMappingURL=service.js.map