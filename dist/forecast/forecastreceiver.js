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
        // console.info("setCycleDuration ran...")
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
        // console.info("triggerSending ran...")
        throw new Error("Method not implemented.");
    }
    /**
     * Sets the funtion which is to bee called when new weather arrives
     * @param target The function which is to be called
     */
    setReceiveFunction(target) {
        // console.info("setRecieveFunction ran...")
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
        // console.info("setCycleActive ran...")
        if (this.cycleActive === status)
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
        // console.info("startCycle ran...")
        return true;
    }
    /**
     * Stop cycle
     */
    stopCycle() {
        // console.info("stopCycle ran...")
        clearTimeout(this.cycle);
        return true;
    }
    /**
     * Make the ready to use Url
     * @returns Url
     */
    getUrl() {
        // console.info("getUrl ran...")
        const url = this.baseUrl + this.query;
        return url;
    }
    async getForecast() {
        // console.info("getWeather ran...")
        const responseData = await this.sendHTTPRequest();
        if (responseData === "")
            return false;
        try {
            const forecastJson = JSON.parse(JSON.stringify(responseData));
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
        // console.info("onWeatherRecieved ran...")
        // console.debug(weatherString)
        // console.debug(`Result weather: \n${JSON.stringify(weather)}`)
        const aggrForecastJson = this.aggregateForecast(forecastJson);
        this.sendForecast(forecastJson, aggrForecastJson);
    }
    aggregateForecast(forecastJson) {
        const aggrForecastJson = {
            cod: forecastJson.cod,
            message: forecastJson.message,
            cnt: 0,
            list: [],
        };
        const oldList = forecastJson.list;
        const firstDate = new Date(oldList[0].dt_txt);
        let scipCnt = (24 - firstDate.getHours()) / 3 - 1;
        if (scipCnt === 8)
            scipCnt = 0;
        console.log(scipCnt);
        const newList = [];
        for (let i = scipCnt; i < oldList.length - 8; i += 8) {
            let temp = 0;
            let temp_min = 100;
            let temp_max = -100;
            let pressure = 0;
            let pressuregrnd = 0;
            let pressuresea = 0;
            let humidity = 0;
            let clouds = 0;
            let windspeed = 0;
            let rain = 0;
            let snow = 0;
            for (let j = i; j < i + 8; j++) {
                const weatherListElement = oldList[j];
                const weatherMain = weatherListElement.main;
                temp += (weatherMain.temp / 8);
                pressure += (weatherMain.pressure / 8);
                pressuregrnd += (weatherMain.grnd_level / 8);
                pressuresea += (weatherMain.sea_level / 8);
                humidity += (weatherMain.humidity / 8);
                windspeed += (weatherListElement.wind.speed / 8);
                clouds += (weatherListElement.clouds.all / 8);
                if (temp_min > weatherMain.temp_min) {
                    temp_min = weatherMain.temp_min;
                }
                if (temp_max < weatherMain.temp_max) {
                    temp_max = weatherMain.temp_max;
                }
                //rain += weatherListElement.rain[""]
                //console.log("LoopLog: " + temp)
                //console.log(oldList[i].main.temp)
            }
            const listMain = {
                temp,
                temp_min,
                temp_max,
                pressure,
                sea_level: pressuresea,
                grnd_level: pressuregrnd,
                humidity,
            };
            const wind = {
                speed: windspeed,
                deg: oldList[i + 4].wind.deg,
            };
            const newElement = {
                dt: oldList[i + 4].dt,
                main: listMain,
                weather_id: oldList[i + 4].dt,
                werather_main: oldList[i + 4].weather[0].main,
                weather_description: oldList[i + 4].weather[0].description,
                weather_icon: oldList[i + 4].weather[0].icon,
                clouds,
                wind,
                dt_txt: oldList[i + 4].dt_txt,
                rain,
                snow,
            };
            newList.push(newElement);
        }
        aggrForecastJson.list = newList;
        // console.log(JSON.parse(JSON.stringify(oldList)))
        // console.log(JSON.parse(JSON.stringify(aggrForecastJson)))
        return aggrForecastJson;
    }
    /**
     * Sends a HTTP requesr to weather api
     * @returns returns the response as a string
     */
    async sendHTTPRequest() {
        // console.info("sendHTTPRequest ran...")
        const res = "";
        const url = this.getUrl();
        try {
            const response = await axios_1.default.get(url);
            return response.data;
        }
        catch (error) {
            console.error("Error at forecast http request!");
            return "";
        }
        // console.debug(url)
    }
    dummyFunc(w) {
        // console.info("dummyFunc ran...")
        return false;
    }
}
exports.ForecastReceiver = ForecastReceiver;
//# sourceMappingURL=forecastreceiver.js.map