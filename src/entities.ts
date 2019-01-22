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

    constructor(public timestamp:number,
        public temperature: number, 
        public pressure: number, 
        public humidity: number, 
        public windspeed: number, 
        public winddir:number,){

        this.temperature = temperature
        this.pressure = pressure
        this.humidity = humidity
        this.windspeed = windspeed * 3.6
        this.winddir = winddir        
    }
    
}

export class Unit{

    readonly temperature: string = "°C"
    readonly pressure: string = "%"
    readonly humidity: string = "hPa"
    readonly windspeed: string = "km/h"
    readonly winddir: string = "°"
}
