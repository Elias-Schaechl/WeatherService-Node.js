"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Weather {
    constructor(timestamp, temperature, pressure, humidity, windspeed, winddir) {
        this.timestamp = timestamp;
        this.temperature = temperature;
        this.pressure = pressure;
        this.humidity = humidity;
        this.windspeed = windspeed;
        this.winddir = winddir;
        this.changed = Array(5).fill(true);
        this.temperature = temperature;
        this.pressure = pressure;
        this.humidity = humidity;
        this.windspeed = Math.round(windspeed * 3.6 * 10) / 10;
        this.winddir = winddir;
    }
    Equals(other) {
        this.changed.fill(false);
        let equal = true;
        if (this.temperature !== other.temperature) {
            equal = false;
            this.changed[0] = true;
        }
        if (this.pressure !== other.pressure) {
            equal = false;
            this.changed[1] = true;
        }
        if (this.humidity !== other.humidity) {
            equal = false;
            this.changed[2] = true;
        }
        if (this.windspeed !== other.windspeed) {
            equal = false;
            this.changed[3] = true;
        }
        if (this.winddir !== other.winddir) {
            equal = false;
            this.changed[4] = true;
        }
        return equal;
    }
}
exports.Weather = Weather;
// tslint:disable-next-line: max-classes-per-file
class Unit {
    constructor() {
        this.temperature = "°C";
        this.pressure = "%";
        this.humidity = "hPa";
        this.windspeed = "km/h";
        this.winddir = "°";
    }
}
exports.Unit = Unit;
//# sourceMappingURL=entities.js.map