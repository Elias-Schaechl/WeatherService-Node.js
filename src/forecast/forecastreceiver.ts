import axios from "axios"
import { Confighandler } from "../config/config"
import { IForecastReceiver } from "../interfaces/boundaryinterfaces"

export class ForecastReceiver implements IForecastReceiver {

    private handler: Confighandler = Confighandler.Instance
    private baseUrl: string = this.handler.config.forecastreceiver.baseUrl
    private query: string = this.handler.config.forecastreceiver.query

    private cycleDuration: number
    private cycleActive: boolean = false

    private sendForecast: (forecast: ForecastJson, aggrforecast: AggrForecastJson) => boolean

    private cycle =  setInterval(() => { this.dummyFunc }, 0)

    constructor() {
        this.cycleDuration = -1
        this.sendForecast = this.dummyFunc
    }

    /**
     * Sets a new intervall for requests
     * @param intervall The time between requests in ms
     * @returns If the action was successful
     */
    public setCycleDuration(intervall: number): boolean {
        // console.info("setCycleDuration ran...")
        if (intervall == null) return false
        if (intervall <= 0) return false
        if (this.cycleActive)this.stopCycle()
        this.cycleDuration = intervall
        this.startCycle()
        return true
    }

    /**
     * Triggerst a request independent of the current cycle status
     * @returns If the action was successful
     */
    public triggerSending(): boolean {
        // console.info("triggerSending ran...")
        throw new Error("Method not implemented.")
    }

    /**
     * Sets the funtion which is to bee called when new weather arrives
     * @param target The function which is to be called
     */
    public setReceiveFunction(target: (forecast: ForecastJson, aggrforecast: AggrForecastJson) => boolean): boolean {
        // console.info("setRecieveFunction ran...")
        if (target == null) return false
        this.sendForecast = target
        return true
    }

    /**
     * Change status of cycle
     * @param status Which action is to bee performed
     */
    public setCycleActive(status: boolean): boolean {
        // console.info("setCycleActive ran...")
        if (this.cycleActive === status) return false
        if (status) {
            this.startCycle()
        } else {
            this.stopCycle()
        }
        this.cycleActive = status
        return true
    }

    /**
     * Start cycle
     */
    private startCycle(): boolean {
        if (this.cycleDuration <= 0) {
            console.info("startCycle ran... cycleDuration <= 0")
            return false
        }
        this.getForecast()
        this.cycle = setInterval(() => { this.getForecast() }, this.cycleDuration)

        this.cycleActive = true
        // console.info("startCycle ran...")
        return true
    }

    /**
     * Stop cycle
     */
    private stopCycle(): boolean {
        // console.info("stopCycle ran...")
        clearTimeout(this.cycle)
        return true
    }

    /**
     * Make the ready to use Url
     * @returns Url
     */
    private getUrl(): string {
        // console.info("getUrl ran...")
        const url =  this.baseUrl + this.query
        return url
    }

    private async getForecast() {
        // console.info("getWeather ran...")
        const responseData = await this.sendHTTPRequest()
        if (responseData === "") return false
        try {
            const forecastJson: ForecastJson = JSON.parse(JSON.stringify(responseData))
            this.onForecastReceived(forecastJson)
        } catch (error) {
            console.error("Error at forecast json parsing!")
            console.error(error)
            return false
        }
        return true
    }

    private onForecastReceived(forecastJson: ForecastJson) {
        // console.info("onWeatherRecieved ran...")
        // console.debug(weatherString)
        // console.debug(`Result weather: \n${JSON.stringify(weather)}`)
        const aggrForecastJson = this.aggregateForecast(forecastJson)
        this.sendForecast(forecastJson, aggrForecastJson)
    }

    private aggregateForecast(forecastJson: ForecastJson): any {
        const aggrForecastJson: AggrForecastJson = {
            cod: forecastJson.cod,
            message: forecastJson.message,
            cnt: 0,
            list: [],
        }
        const oldList = forecastJson.list
        const firstDate = new Date(oldList[0].dt_txt)
        let scipCnt: number = (24 - firstDate.getHours()) / 3 - 1
        if (scipCnt === 8) scipCnt = 0

        console.log(scipCnt)

        const newList: ForecastListElement[] = []

        for ( let i = scipCnt; i < oldList.length - 8; i += 8) {

            let temp: number = 0
            let temp_min: number = 100
            let temp_max: number = -100
            let pressure: number = 0
            let pressuregrnd: number = 0
            let pressuresea: number = 0
            let humidity: number = 0
            let clouds: number = 0
            let windspeed: number = 0
            let winddeg: number = 0
            let rain: number = 0
            let snow: number = 0

            for ( let j = i; j < i + 8; j++) {
                const weatherListElement = oldList[j]
                const weatherMain = weatherListElement.main
                temp += (weatherMain.temp / 8)
                pressure += (weatherMain.pressure / 8)
                pressuregrnd += (weatherMain.grnd_level / 8)
                pressuresea += (weatherMain.sea_level / 8)
                humidity += (weatherMain.humidity / 8)
                windspeed += (weatherListElement.wind.speed / 8)
                clouds += (weatherListElement.clouds.all / 8)
                if (temp_min > weatherMain.temp_min) {
                    temp_min = weatherMain.temp_min
                }
                if (temp_max < weatherMain.temp_max) {
                    temp_max = weatherMain.temp_max
                }
                //console.log("LoopLog: " + temp)
                //console.log(oldList[i].main.temp)

            }

            const listMain: MainData = {
                temp,
                temp_min,
                temp_max,
                pressure,
                sea_level: pressuresea,
                grnd_level: pressuregrnd,
                humidity,
            }

            const wind: Wind = {
                speed: windspeed,
                deg: oldList[i + 4].wind.deg,
            }

            const newElement: ForecastListElement = {
                dt: oldList[i + 4].dt,
                main: listMain,
                weather_id: oldList[i + 4].dt,
                werather_main: oldList[i + 4].weather[0].main,
                weather_description: oldList[i + 4].weather[0].description,
                weather_icon: oldList[i + 4].weather[0].icon,
                clouds,
                wind,
                dt_txt: oldList[i + 4].dt_txt,
                rain: 0,
                snow: 0,
            }
            newList.push(newElement)

        }
        aggrForecastJson.list = newList
        console.log(JSON.stringify(aggrForecastJson))
        return aggrForecastJson
    }

    /**
     * Sends a HTTP requesr to weather api
     * @returns returns the response as a string
     */
    private async sendHTTPRequest() {
        // console.info("sendHTTPRequest ran...")
        const res: string = ""
        const url: string = this.getUrl()
        try {
            const response = await axios.get(url)
            return response.data
        } catch (error) {
            console.error("Error at forecast http request!")
            return ""
        }
        // console.debug(url)

    }

    private dummyFunc(w: ForecastJson): boolean {
        // console.info("dummyFunc ran...")
        return false
    }
}
