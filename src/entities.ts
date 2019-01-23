export class Weather {

    public changed: boolean[] = Array(5).fill(true)

    constructor(
        public timestamp: number,
        public temperature: number,
        public pressure: number,
        public humidity: number,
        public windspeed: number,
        public winddir: number) {

        this.temperature = temperature
        this.pressure = pressure
        this.humidity = humidity
        this.windspeed = Math.round(windspeed * 3.6 * 10) / 10
        this.winddir = winddir
    }

    public Equals(other: Weather): boolean {
        this.changed.fill(false)
        let equal: boolean = true
        if (this.temperature !== other.temperature) {
            equal = false
            this.changed[0] = true
        }
        if (this.pressure !== other.pressure) {
            equal = false
            this.changed[1] = true
        }
        if (this.humidity !== other.humidity) {
            equal = false
            this.changed[2] = true
        }
        if (this.windspeed !== other.windspeed) {
            equal = false
            this.changed[3] = true
        }
        if (this.winddir !== other.winddir) {
            equal = false
            this.changed[4] = true
        }
        return equal
    }

}

// tslint:disable-next-line: max-classes-per-file
export class Unit {

    public readonly temperature: string = "°C"
    public readonly pressure: string = "%"
    public readonly humidity: string = "hPa"
    public readonly windspeed: string = "km/h"
    public readonly winddir: string = "°"
}
