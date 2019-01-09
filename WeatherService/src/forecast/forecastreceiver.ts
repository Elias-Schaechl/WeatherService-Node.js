import { IForecastReceiver } from "../interfaces/boundaryinterfaces"
import axios from 'axios'
import { Confighandler } from "../config/config";


export class ForecastReceiver implements IForecastReceiver{

    private handler: Confighandler = Confighandler.Instance
    private baseUrl: string = this.handler.config.forecastreceiver.baseUrl
    private query: string = this.handler.config.forecastreceiver.query

    private cycleDuration: number
    private cycleActive: boolean = false

    private sendForecast: (forecast: ForecastJson, aggrforecast: AggrForecastJson) => boolean
    
    private cycle =  setInterval(() => { this.dummyFunc }, 0)


    constructor(){
        this.cycleDuration = -1
        this.sendForecast = this.dummyFunc
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
    setReceiveFunction(target: (forecast: ForecastJson, aggrforecast: AggrForecastJson) => boolean): boolean {
        //console.info("setRecieveFunction ran...")
        if(target == null) return false
        this.sendForecast = target
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

    /**
     * Start cycle
     */
    private startCycle(): boolean{
        if(this.cycleDuration <= 0){
            console.info("startCycle ran... cycleDuration <= 0")
            return false
        }
        this.getForecast()
        this.cycle = setInterval(() => { this.getForecast() }, this.cycleDuration)

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

    private async getForecast(){
        //console.info("getWeather ran...")
        let responseData = await this.sendHTTPRequest()
        if(responseData == "") return false
        try {
            let forecastJson : ForecastJson = JSON.parse(JSON.stringify(responseData))
            this.onForecastReceived(forecastJson)
        } catch (error) {
            console.error("Error at forecast json parsing!")
            console.error(error)
            return false
        }
        return true
    }

    private onForecastReceived(forecastJson: ForecastJson){
        //console.info("onWeatherRecieved ran...")
        //console.debug(weatherString)
        //console.debug(`Result weather: \n${JSON.stringify(weather)}`)
        let aggrForecastJson = this.aggregateForecast(forecastJson)
        this.sendForecast(forecastJson,aggrForecastJson)
    }

    private aggregateForecast(forecastJson: ForecastJson): any {
        let aggrForecastJson: AggrForecastJson = forecastJson
        let oldList = aggrForecastJson.list
        let firstDate = new Date(oldList[0].dt_txt)
        let scipCnt: number = (24 - firstDate.getHours())/3 -1
        if(scipCnt == 8) scipCnt = 0

        console.log(scipCnt)

        let newList: List[] = []

        for( var i = scipCnt; i < oldList.length - 8; i += 8){
            
            let temp: number = 0
            let mintemp: number
            let maxtemp: number
            let pressure: number = 0
            let pressuregrnd: number = 0
            let pressuresea: number = 0
            let humidity: number = 0
            let clouds: number = 0
            let windspeed: number = 0
            let winddeg: number = 0
            let rain: number = 0
            let snow: number = 0

            
            
            for( var j = i; j < i + 8; j++){
                temp += oldList[i].main.temp/8


            }

            var listMain: Main = {

            }

            var newElement: List = {
                dt: 0,
                main: listMain,
                weather: [
                    id: 0,
                    main: "",
                    description: "",
                    icon: ""
                ],
                clouds: Clouds;
                wind: Wind;
                dt_txt: "string",
                rain?: Rain;
                snow?: Rain;
            }
            newList.push(newElement)

        }
        aggrForecastJson.list = newList
        return aggrForecastJson
    }


    /**
     * Sends a HTTP requesr to weather api
     * @returns returns the response as a string
     */
    private async sendHTTPRequest(){
        //console.info("sendHTTPRequest ran...")
        let res: string = ""
        let url: string = this.getUrl()
        try {
            let response = await axios.get(url)
            return response.data
        } catch (error) {
            console.error("Error at forecast http request!")
            return ""
        }
        //console.debug(url) 

    }

    private dummyFunc(w: ForecastJson): boolean{
        //console.info("dummyFunc ran...")
        return false
    }
}
