import { MqttClient } from './../mqtt/mqttclient';
import { IWeatherReceiver } from "../interfaces/boundaryinterfaces"
import { Weather } from "../entities"
import axios from 'axios'
import { Confighandler } from "../config/config";


export class WeatherReceiver implements IWeatherReceiver{
    //
    //Instance of Confighandler
    private handler: Confighandler = Confighandler.Instance

    //
    //Api connection fields
    private baseUrl: string = this.handler.config.weatherreceiver.baseUrl
    private query: string = this.handler.config.weatherreceiver.query

    //
    //Cycle fields
    private cycleDuration: number
    private cycleActive: boolean = false
    private cycle =  setInterval(() => { this.dummyFunc }, 0)

    private sendWeather: (weather: Weather) => boolean

    private lastWeather: Weather = new Weather(0,0,0,0,0,0)

    //
    //Mqtt client
    private mqttClient: MqttClient
    private temperatureTopic: string = this.handler.config.weathertopicsget.temperature
    private pressureTopic: string = this.handler.config.weathertopicsget.pressure
    private humidityTopic: string = this.handler.config.weathertopicsget.humidity
    private windSpeedTopic: string = this.handler.config.weathertopicsget.windspeed
    private windDegTopic: string = this.handler.config.weathertopicsget.winddeg

    /**
     * true/false : internal weather is/is not available
     */
    private sourceMode: boolean = false
    private lastMessagetime: number = 0



    constructor(mqttClient: MqttClient){
        this.mqttClient = mqttClient
        this.cycleDuration = -1
        this.sendWeather = this.dummyFunc
        //this.makeSubscriptions()
    }
    
    /**
     * Sets a new intervall for requests
     * @param intervall The time between requests in ms
     * @returns If the action was successful
     */
    setCycleDuration(intervall: number): boolean {
        //console.info("setCycleDuration ran...")
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
        //console.info("triggerSending ran...")
        throw new Error("Method not implemented.")
    }

    /**
     * Sets the funtion which is to bee called when new weather arrives
     * @param target The function which is to be called
     */
    setReceiveFunction(target: (weather: Weather) => boolean): boolean {
        //console.info("setRecieveFunction ran...")
        if(target == null) return false
        this.sendWeather = target
        return true
    }

    /**
     * Change status of cycle
     * @param status Which action is to bee performed
     */
    setCycleActive(status: boolean): boolean {
        //console.info("setCycleActive ran...")
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

    private makeSubscriptions(){
        this.mqttClient.subscribe(this.temperatureTopic,this.onNewTemperature)
        this.mqttClient.subscribe(this.pressureTopic,this.onNewPressure)
        this.mqttClient.subscribe(this.humidityTopic,this.onNewHumidity)
        this.mqttClient.subscribe(this.windSpeedTopic,this.onNewWindSpeed)
        this.mqttClient.subscribe(this.windDegTopic,this.onNewWindDeg)
    }

    private onNewTemperature(topic: string, message: string){
        if(this.lastWeather.temperature != +message){
            this.lastWeather.temperature = +message
            this.lastWeather.changed[0] = true
            this.sendWeather(this.lastWeather)
        }
    }
    private onNewPressure(topic: string, message: string){
        if(this.lastWeather.pressure != +message){
            this.lastWeather.pressure = +message
            this.lastWeather.changed[1] = true
            this.sendWeather(this.lastWeather)
        }
    }
    private onNewHumidity(topic: string, message: string){
        if(this.lastWeather.humidity != +message){
            this.lastWeather.humidity = +message
            this.lastWeather.changed[2] = true
            this.sendWeather(this.lastWeather)
        }
    }
    private onNewWindSpeed(topic: string, message: string){
        if(this.lastWeather.windspeed != +message){
            this.lastWeather.windspeed = +message
            this.lastWeather.changed[3] = true
            this.sendWeather(this.lastWeather)
        }
    }
    private onNewWindDeg(topic: string, message: string){
        if(this.lastWeather.winddir != +message){
            this.lastWeather.winddir = +message
            this.lastWeather.changed[4] = true
            this.sendWeather(this.lastWeather)
        }
    }



    /**
     * Start cycle
     */
    private startCycle(): boolean{
        if(this.cycleDuration <= 0){
            console.info("startCycle ran... cycleDuration <= 0")
            return false
        }
        this.getWeather()
        this.cycle = setInterval(() => { this.getWeather() }, this.cycleDuration)

        this.cycleActive = true
        //console.info("startCycle ran...")
        return true
    }

    /**
     * Stop cycle
     */
    private stopCycle():boolean{
        //console.info("stopCycle ran...")
        clearTimeout(this.cycle)
        return true
    }

    /**
     * Make the ready to use Url
     * @returns Url
     */
    private getUrl(): string{
        //console.info("getUrl ran...")
        const url =  this.baseUrl + this.query
        return url
    }

    private async getWeather(){
        //console.info("getWeather ran...")
        if(this.sourceMode){

        }
        else{
            let responseData = await this.sendHTTPRequest()
            if(responseData == "") return false
            try {
                let weatherJson : WeatherJson = JSON.parse(JSON.stringify(responseData))
                this.onWeatherReceived(weatherJson)
            } catch (error) {
                console.error("Error at weather json parsing!")
                console.error(error)
                return false
            }
            return true
        }
    }

    private onWeatherReceived(weatherJson: WeatherJson){
        //console.info("onWeatherRecieved ran...")
        //console.debug(weatherString)
        let weather = this.formatWeather(weatherJson)
        console.debug(`Result weather: \n${JSON.stringify(weather)}`)
        if(this.lastWeather.Equals(weather)){
            console.info(`No change in weather: ${weather.timestamp}`)
            return
        }
        else{
            this.lastWeather = weather
            this.sendWeather(weather)
        }
    }

    private formatWeather(weatherJson: WeatherJson):Weather{
        //console.info("formatWeather ran...")
        return new Weather(Date.now(),
                           Math.round(weatherJson.main.temp - 273.15), 
                           weatherJson.main.pressure, 
                           weatherJson.main.humidity, 
                           weatherJson.wind.speed, 
                           weatherJson.wind.deg)
    }

    private checkWeather(){
        //console.info("checkWeather ran...")
    }

    /**
     * Sends a HTTP requesr to weather api
     * @returns returns the response as a string
     */
    private async sendHTTPRequest():Promise<string>{
        //console.info("sendHTTPRequest ran...")
        let res: string = ""
        let url: string = this.getUrl()
        try {
            let response = await axios.get(url)
            return response.data
        } catch (error) {
            console.error("Error at weather http request!")
            return ""
        }
        //console.debug(url) 
    }

    private dummyFunc(w: Weather): boolean{
        //console.info("dummyFunc ran...")
        return false
    }
}
