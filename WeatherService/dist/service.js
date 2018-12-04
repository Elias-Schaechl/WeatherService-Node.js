"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mqttclient_1 = require("./mqtt/mqttclient");
const config_1 = require("./config/config");
const weatherreciever_1 = require("./weather/weatherreciever");
const greeting = "Hello World!";
console.log(greeting);
let c1 = new config_1.Confighandler();
//c1.loadConfig("hoho")
c1.loadConfig();
let wr = new weatherreciever_1.WeatherReciever();
wr.setRecieveFunction(GetWeather);
wr.setCycleDuration(10000);
wr.setCycleActive;
function GetWeather(weather) {
    console.log(`New Weather Data arrived ${JSON.stringify(weather)}`);
    return true;
}
let mqttClient = new mqttclient_1.MqttClient();
mqttClient.send("htlleonding", "test some ppps");
console.log("Hey I'm working!");
//# sourceMappingURL=service.js.map