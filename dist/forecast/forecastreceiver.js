"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config/config");
class ForecastReceiver {
    constructor() {
        this.handler = config_1.Confighandler.Instance;
        this.baseUrl = this.handler.config.forecastreceiver.baseUrl;
        this.query = this.handler.config.forecastreceiver.query;
        this.cycleActive = false;
        this.cycle = setInterval(() => { this.dummyFunc; }, 0);
        this.cycleDuration = -1;
        this.sendForecast = this.dummyFunc;
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
        this.sendForecast = target;
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
        this.getForecast();
        this.cycle = setInterval(() => { this.getForecast(); }, this.cycleDuration);
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
    async getForecast() {
        //console.info("getWeather ran...")
        let responseData = await this.sendHTTPRequest();
        if (responseData == "")
            return false;
        try {
            let forecastJson = JSON.parse(JSON.stringify(responseData));
            this.onForecastReceived(forecastJson);
        }
        catch (error) {
            console.error("Error at forecast json parsing!");
            console.error(error);
            return false;
        }
        return true;
    }
    onForecastReceived(forecastJson) {
        //console.info("onWeatherRecieved ran...")
        //console.debug(weatherString)
        //console.debug(`Result weather: \n${JSON.stringify(weather)}`)
        let aggrForecastJson = this.aggregateForecast(forecastJson);
        this.sendForecast(forecastJson, aggrForecastJson);
    }
    aggregateForecast(forecastJson) {
        let aggrForecastJson = {
            cod: forecastJson.cod,
            message: forecastJson.message,
            cnt: 0,
            list: []
        };
        let oldList = forecastJson.list;
        let firstDate = new Date(oldList[0].dt_txt);
        let scipCnt = (24 - firstDate.getHours()) / 3 - 1;
        if (scipCnt == 8)
            scipCnt = 0;
        console.log(scipCnt);
        let newList = [];
        for (var i = scipCnt; i < oldList.length - 8; i += 8) {
            let temp = 0;
            let mintemp;
            let maxtemp;
            let pressure = 0;
            let pressuregrnd = 0;
            let pressuresea = 0;
            let humidity = 0;
            let clouds = 0;
            let windspeed = 0;
            let winddeg = 0;
            let rain = 0;
            let snow = 0;
            for (var j = i; j < i + 8; j++) {
                temp += oldList[i].main.temp / 8;
            }
            var listMain = {
                temp: temp,
                temp_min: 0,
                temp_max: 0,
                pressure: 0,
                sea_level: 0,
                grnd_level: 0,
                humidity: 0
            };
            var wind = {
                speed: 0,
                deg: 0
            };
            var newElement = {
                dt: 0,
                main: listMain,
                weather_id: 0,
                werather_main: "",
                weather_description: "",
                weather_icon: "",
                clouds: 0,
                wind: wind,
                dt_txt: "string",
                rain: 0,
                snow: 0
            };
            newList.push(newElement);
        }
        aggrForecastJson.list = newList;
        return aggrForecastJson;
    }
    /**
     * Sends a HTTP requesr to weather api
     * @returns returns the response as a string
     */
    async sendHTTPRequest() {
        //console.info("sendHTTPRequest ran...")
        let res = "";
        let url = this.getUrl();
        try {
            let response = await axios_1.default.get(url);
            return response.data;
        }
        catch (error) {
            console.error("Error at forecast http request!");
            return "";
        }
        //console.debug(url) 
    }
    dummyFunc(w) {
        //console.info("dummyFunc ran...")
        return false;
    }
}
exports.ForecastReceiver = ForecastReceiver;
//# sourceMappingURL=forecastreceiver.js.map