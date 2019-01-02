"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../entities");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config/config");
class WeatherReceiver {
    constructor() {
        this.handler = config_1.Confighandler.Instance;
        this.baseUrl = this.handler.config.weatherreceiver.baseUrl;
        this.query = this.handler.config.weatherreceiver.query;
        this.cycleActive = false;
        this.cycle = setInterval(() => { this.dummyFunc; }, 0);
        this.lastWeather = new entities_1.Weather(0, 0, 0, 0, 0, 0);
        this.cycleDuration = -1;
        this.sendWeather = this.dummyFunc;
    }
    /**
     * Sets a new intervall for requests
     * @param intervall The time between requests in ms
     * @returns If the action was successful
     */
    setCycleDuration(intervall) {
        //console.info("setCycleDuration ran...")
        if (intervall == null)
            return false;
        if (intervall <= 0)
            return false;
        if (this.cycleActive)
            this.stopCycle();
        this.cycleDuration = intervall;
        this.startCycle();
        return true;
    }
    /**
     * Triggerst a request independent of the current cycle status
     * @returns If the action was successful
     */
    triggerSending() {
        //console.info("triggerSending ran...")
        throw new Error("Method not implemented.");
    }
    /**
     * Sets the funtion which is to bee called when new weather arrives
     * @param target The function which is to be called
     */
    setReceiveFunction(target) {
        //console.info("setRecieveFunction ran...")
        if (target == null)
            return false;
        this.sendWeather = target;
        return true;
    }
    /**
     * Change status of cycle
     * @param status Which action is to bee performed
     */
    setCycleActive(status) {
        //console.info("setCycleActive ran...")
        if (this.cycleActive == status)
            return false;
        if (status) {
            this.startCycle();
        }
        else {
            this.stopCycle();
        }
        this.cycleActive = status;
        return true;
    }
    /**
     * Start cycle
     */
    startCycle() {
        if (this.cycleDuration <= 0) {
            console.info("startCycle ran... cycleDuration <= 0");
            return false;
        }
        this.getWeather();
        this.cycle = setInterval(() => { this.getWeather(); }, this.cycleDuration);
        this.cycleActive = true;
        //console.info("startCycle ran...")
        return true;
    }
    /**
     * Stop cycle
     */
    stopCycle() {
        //console.info("stopCycle ran...")
        clearTimeout(this.cycle);
        return true;
    }
    /**
     * Make the ready to use Url
     * @returns Url
     */
    getUrl() {
        //console.info("getUrl ran...")
        const url = this.baseUrl + this.query;
        return url;
    }
    getWeather() {
        //console.info("getWeather ran...")
        this.sendHTTPRequest();
        return true;
    }
    onWeatherReceived(weatherJson) {
        //console.info("onWeatherRecieved ran...")
        //console.debug(weatherString)
        let weather = this.formatWeather(weatherJson);
        //console.debug(`Result weather: \n${JSON.stringify(weather)}`)
        if (this.lastWeather.Equals(weather)) {
            console.info(`No change in weather: ${weather.timestamp}`);
            return;
        }
        else {
            this.lastWeather = weather;
            this.sendWeather(weather);
        }
    }
    formatWeather(weatherJson) {
        //console.info("formatWeather ran...")
        return new entities_1.Weather(Date.now(), Math.round(weatherJson.main.temp - 273.15), weatherJson.main.pressure, weatherJson.main.humidity, weatherJson.wind.speed, weatherJson.wind.deg);
    }
    checkWeather() {
        //console.info("checkWeather ran...")
    }
    /**
     * Sends a HTTP requesr to weather api
     * @returns returns the response as a string
     */
    sendHTTPRequest() {
        //console.info("sendHTTPRequest ran...")
        let res = "";
        let url = this.getUrl();
        const self = this;
        axios_1.default.get(url)
            .then(function (response) {
            //console.debug("cc")
            //console.debug(response.data)
            //let waetherString: string = JSON.stringify(response.data)
            self.onWeatherReceived(response.data);
        })
            .catch(function (error) {
            console.error(error);
        });
        //console.debug(url) 
        return "";
    }
    dummyFunc(w) {
        //console.info("dummyFunc ran...")
        return false;
    }
}
exports.WeatherReceiver = WeatherReceiver;
//# sourceMappingURL=weatherreceiver.js.map