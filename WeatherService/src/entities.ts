export class Weather{

    Equals(other: Weather): boolean {
        this.changed.fill(false)
        let equal: boolean = false
        if(this.temp == other.temp){
            equal = true
            this.changed[0] = true
        } 
        if(this.pressure == other.pressure){
            equal = true
            this.changed[1] = true
        } 
        if(this.humidity == other.humidity){
            equal = true
            this.changed[2] = true
        } 
        if(this.windspeed == other.windspeed){
            equal = true
            this.changed[3] = true
        } 
        if(this.winddir == other.winddir){
            equal = true
            this.changed[4] = true
        } 
        if(!equal) return false
        return true
    }

    changed: boolean[] = Array(5).fill(true) 

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
