import { IWeatherReciever } from "../interfaces"

export class WeatherReciever implements IWeatherReciever{

    private intervall: number
    private cycleActive: boolean = false

    private sendWeather: (weather: Weather) => boolean

    private baseUrl: string = "https://api.openweathermap.org/data/"
    private query: string = "/2.5/weather?q=Leonding,at&appid=5cb2b2fa61fa541e7b13255fc29d5c61"
    private cycle: number = 0
    private lastWeather: Weather = new Weather(0,0,0)


    constructor(){
        this.intervall = -1
        this.sendWeather = this.dummyFunc

        
    }
    
    /**
     * Sets a new intervall for requests
     * @param intervall The time between requests in ms
     * @returns If the action was successful
     */
    setInterval(intervall: number): boolean {
        if(intervall == null) return false
        if(intervall <= 0) return false
        if(this.cycleActive)this.stopCycle()
        this.intervall = intervall
        this.startCycle()
        return true
    }

    /**
     * Triggerst a request independent of the current cycle status
     * @returns If the action was successful
     */
    triggerSending(): boolean {
        throw new Error("Method not implemented.")
    }

    /**
     * Sets the funtion which is to bee called when new weather arrives
     * @param target The function which is to be called
     */
    setRecieveFunction(target: (weather: Weather) => boolean): boolean {
        if(target == null) return false
        this.sendWeather = target
        return true
    }

    /**
     * Change status of cycle
     * @param status Which action is to bee performed
     */
    setCycleActive(status: boolean): boolean {
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
        this.cycle = setInterval(()=>{this.getWeather}, this.intervall)
        this.cycleActive = true
        return true
    }

    /**
     * Stop cycle
     */
    private stopCycle():boolean{
        clearTimeout(this.cycle)
        return true
    }

    /**
     * Make the ready to use Url
     * @returns Url
     */
    private getUrl(): string{
        const url =  this.baseUrl + this.query
        return url
    }

    private getWeather(): boolean{
        var weatherString = this.sendHTTPRequest()
        if(weatherString == ""){
            return false
        }
        var weather = this.formatWeather(weatherString)
        this.sendWeather(weather)
        throw new Error("Method not implemented.")
    }

    private formatWeather(weatherString: string):Weather{
        throw new Error("Method not implemented.")
    }

    private checkWeather(){

    }

    /**
     * Sends a HTTP requesr to weather api
     * @returns returns the response as a string
     */
    private sendHTTPRequest():string{
        var res: string = ""
        try{
            fetch(this.getUrl()).then( response =>{
                if(!response.ok){
                    throw Error(response.statusText)
                }
                response.text().then(r => {
                    res = r
                })
            })
        }
        catch(err){
            throw err
        }
        return res

    }

    private dummyFunc(w: Weather): boolean{
        return false
    }
}
