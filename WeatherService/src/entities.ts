export class Weather{

    Equals(other: Weather): boolean {
        if(this.temp != other.temp)return false
        if(this.pressure != other.pressure)return false
        if(this.humidity != other.humidity)return false
        if(this.windspeed != other.windspeed)return false
        if(this.winddir != other.winddir)return false
        return true
    }

    constructor(readonly timestamp:number,
                readonly temp: number, 
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
