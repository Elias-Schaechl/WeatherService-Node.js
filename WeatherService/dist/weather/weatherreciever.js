"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("../entities");
class WeatherReciever {
    constructor() {
        this.cycleActive = false;
        this.baseUrl = "https://api.openweathermap.org/data/";
        this.query = "/2.5/weather?q=Leonding,at&appid=5cb2b2fa61fa541e7b13255fc29d5c61";
        this.cycle = 0;
        this.lastWeather = new entities_1.Weather(0, 0, 0);
        this.cycleDuration = -1;
        this.sendWeather = this.dummyFunc;
    }
    /**
     * Sets a new intervall for requests
     * @param intervall The time between requests in ms
     * @returns If the action was successful
     */
    setCycleDuration(intervall) {
        console.info("setCycleDuration ran...");
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
        console.info("triggerSending ran...");
        throw new Error("Method not implemented.");
    }
    /**
     * Sets the funtion which is to bee called when new weather arrives
     * @param target The function which is to be called
     */
    setRecieveFunction(target) {
        console.info("setRecieveFunction ran...");
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
        console.info("setCycleActive ran...");
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
        this.cycle = setInterval(() => { this.getWeather(); }, this.cycleDuration);
        this.cycleActive = true;
        console.info("startCycle ran...");
        return true;
    }
    /**
     * Stop cycle
     */
    stopCycle() {
        console.info("stopCycle ran...");
        clearTimeout(this.cycle);
        return true;
    }
    /**
     * Make the ready to use Url
     * @returns Url
     */
    getUrl() {
        console.info("getUrl ran...");
        const url = this.baseUrl + this.query;
        return url;
    }
    getWeather() {
        console.info("getWeather ran...");
        var weatherString = this.sendHTTPRequest();
        if (weatherString == "") {
            return false;
        }
        var weather = this.formatWeather(weatherString);
        this.sendWeather(weather);
        throw new Error("Method not implemented.");
    }
    formatWeather(weatherString) {
        console.info("formatWeather ran...");
        throw new Error("Method not implemented.");
    }
    checkWeather() {
        console.info("checkWeather ran...");
    }
    /**
     * Sends a HTTP requesr to weather api
     * @returns returns the response as a string
     */
    sendHTTPRequest() {
        console.info("sendHTTPRequest ran...");
        var res = "";
        try {
            fetch(this.getUrl()).then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                response.text().then(r => {
                    res = r;
                });
            });
        }
        catch (err) {
            throw err;
        }
        return res;
    }
    dummyFunc(w) {
        console.info("dummyFunc ran...");
        return false;
    }
}
exports.WeatherReciever = WeatherReciever;
//# sourceMappingURL=weatherreciever.js.map