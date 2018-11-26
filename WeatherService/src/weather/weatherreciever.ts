import { IWeatherReciever } from "../interfaces/boundaryinterfaces"
import { Weather } from "../entities"

import axios from 'axios';


export class WeatherReciever implements IWeatherReciever{

    private cycleDuration: number
    private cycleActive: boolean = false

    private sendWeather: (weather: Weather) => boolean

    private baseUrl: string = "https://api.openweathermap.org/data/"
    private query: string = "/2.5/weather?q=Leonding,at&appid=5cb2b2fa61fa541e7b13255fc29d5c61"
    private cycle: number = 0
    private lastWeather: Weather = new Weather(0,0,0,0,0)


    constructor(){
        this.cycleDuration = -1
        this.sendWeather = this.dummyFunc
    }
    
    /**
     * Sets a new intervall for requests
     * @param intervall The time between requests in ms
     * @returns If the action was successful
     */
    setCycleDuration(intervall: number): boolean {
        console.info("setCycleDuration ran...")
        if(intervall == null) return false
        if(intervall <= 0) return false
        if(this.cycleActive)this.stopCycle()
        this.cycleDuration = intervall
        this.startCycle()
        return true
    }

    /**
     * Triggerst a request independent of the current cycle status
     * @returns If the action was successful
     */
    triggerSending(): boolean {
        console.info("triggerSending ran...")
        throw new Error("Method not implemented.")
    }

    /**
     * Sets the funtion which is to bee called when new weather arrives
     * @param target The function which is to be called
     */
    setRecieveFunction(target: (weather: Weather) => boolean): boolean {
        console.info("setRecieveFunction ran...")
        if(target == null) return false
        this.sendWeather = target
        return true
    }

    /**
     * Change status of cycle
     * @param status Which action is to bee performed
     */
    setCycleActive(status: boolean): boolean {
        console.info("setCycleActive ran...")
        if(this.cycleActive == status) return false
        if(status){
            this.startCycle()
        }
        else{
            this.stopCycle()
        }
        this.cycleActive = status
        return true
    }

    /**
     * Start cycle
     */
    private startCycle(): boolean{
        if(this.cycleDuration <= 0){
            console.info("startCycle ran... cycleDuration <= 0")
            return false
        }
        this.cycle = setInterval(() => { this.getWeather() }, this.cycleDuration)

        this.cycleActive = true
        console.info("startCycle ran...")
        return true
    }

    /**
     * Stop cycle
     */
    private stopCycle():boolean{
        console.info("stopCycle ran...")
        clearTimeout(this.cycle)
        return true
    }

    /**
     * Make the ready to use Url
     * @returns Url
     */
    private getUrl(): string{
        console.info("getUrl ran...")
        const url =  this.baseUrl + this.query
        return url
    }

    private getWeather(): boolean{
        console.info("getWeather ran...")
        var weatherString = this.sendHTTPRequest()
        if(weatherString == ""){
            return false
        }
        var weather = this.formatWeather(weatherString)
        this.sendWeather(weather)
        return true
    }

    private formatWeather(weatherString: string):Weather{
        console.info("formatWeather ran...")
        let weatherjson: WeatherJson = JSON.parse(weatherString)
        return new Weather(weatherjson.main.temp, 
                           weatherjson.main.pressure, 
                           weatherjson.main.humidity, 
                           weatherjson.wind.speed, 
                           weatherjson.wind.deg)
    }

    private checkWeather(){
        console.info("checkWeather ran...")

    }

    /**
     * Sends a HTTP requesr to weather api
     * @returns returns the response as a string
     */
    private sendHTTPRequest():any{
        console.info("sendHTTPRequest ran...")
        var res: string = ""
        axios.get(this.getUrl())
          .then(function (response) {
            console.debug("cc")
            console.debug(response.data)
            return response.data
          })
          .catch(function (error) {
            console.error(error);
          });
        console.debug(this.getUrl())    
    }

    private dummyFunc(w: Weather): boolean{
        console.info("dummyFunc ran...")
        return false
    }
}
