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
        this.windspeed = windspeed;
        this.winddir = winddir;
    }
    Equals(other) {
        this.changed.fill(false);
        let equal = false;
        if (this.temperature == other.temperature) {
            equal = true;
            this.changed[0] = true;
        }
        if (this.pressure == other.pressure) {
            equal = true;
            this.changed[1] = true;
        }
        if (this.humidity == other.humidity) {
            equal = true;
            this.changed[2] = true;
        }
        if (this.windspeed == other.windspeed) {
            equal = true;
            this.changed[3] = true;
        }
        if (this.winddir == other.winddir) {
            equal = true;
            this.changed[4] = true;
        }
        if (!equal)
            return false;
        return true;
    }
}
exports.Weather = Weather;
class Unit {
    constructor() {
        this.temperature = "°C";
        this.pressure = "%";
        this.humidity = "hPa";
        this.windspeed = "m/s";
        this.winddir = "°";
    }
}
exports.Unit = Unit;
//# sourceMappingURL=entities.js.map