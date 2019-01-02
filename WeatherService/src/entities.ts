export class Weather{

    Equals(other: Weather): boolean {
        this.changed.fill(false)
        let equal: boolean = true
        if(this.temperature != other.temperature){
            equal = false
            this.changed[0] = true
        } 
        if(this.pressure != other.pressure){
            equal = false
            this.changed[1] = true
        } 
        if(this.humidity != other.humidity){
            equal = false
            this.changed[2] = true
        } 
        if(this.windspeed != other.windspeed){
            equal = false
            this.changed[3] = true
        } 
        if(this.winddir != other.winddir){
            equal = false
            this.changed[4] = true
        } 
        return equal
    }

    changed: boolean[] = Array(5).fill(true) 

    constructor(readonly timestamp:number,
                readonly temperature: number, 
                readonly pressure: number, 
                readonly humidity: number, 
                readonly windspeed: number, 
                readonly winddir:number,){

        this.temperature = temperature
        this.pressure = pressure
        this.humidity = humidity
        this.windspeed = windspeed
        this.winddir = winddir        
    }
}

export class Unit{

    readonly temperature: string = "°C"
    readonly pressure: string = "%"
    readonly humidity: string = "hPa"
    readonly windspeed: string = "m/s"
    readonly winddir: string = "°"
}
