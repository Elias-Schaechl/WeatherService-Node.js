export class Weather{

    constructor(readonly temp: number, 
                readonly pressure: number, 
                readonly humidity: number, 
                readonly windspeed: number, 
                readonly winddir:number,){

        this.temp = temp
        this.pressure = pressure
        this.humidity = humidity
        this.windspeed = windspeed
        this.winddir = winddir
        
    }
}

export class Unit{

    readonly temp: string = "°C"
    readonly pressure: string = "%"
    readonly humidity: string = "hPa"
    readonly windspeed: string = "m/s"
    readonly winddir: string = "°"
}
