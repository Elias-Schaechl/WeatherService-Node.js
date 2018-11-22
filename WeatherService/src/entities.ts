export class Weather{
        
    readonly temp: number
    readonly pressure: number
    readonly humidity: number


    constructor(temp: number, pressure: number, humidity: number){
        this.temp = temp
        this.pressure = pressure
        this.humidity = humidity
    }

    /**
     * ToString
     * @returns A string representing the Object
     */
    public ToString(): string {
        return "Weather: " + this.humidity + ", " + this.pressure
    }
}
