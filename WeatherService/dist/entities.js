"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Weather {
    constructor(timestamp, temp, pressure, humidity, windspeed, winddir) {
        this.timestamp = timestamp;
        this.temp = temp;
        this.pressure = pressure;
        this.humidity = humidity;
        this.windspeed = windspeed;
        this.winddir = winddir;
        this.temp = temp;
        this.pressure = pressure;
        this.humidity = humidity;
        this.windspeed = windspeed;
        this.winddir = winddir;
    }
    Equals(other) {
        if (this.temp != other.temp)
            return false;
        if (this.pressure != other.pressure)
            return false;
        if (this.humidity != other.humidity)
            return false;
        if (this.windspeed != other.windspeed)
            return false;
        if (this.winddir != other.winddir)
            return false;
        return true;
    }
}
exports.Weather = Weather;
class Unit {
    constructor() {
        this.temp = "°C";
        this.pressure = "%";
        this.humidity = "hPa";
        this.windspeed = "m/s";
        this.winddir = "°";
    }
}
exports.Unit = Unit;
//# sourceMappingURL=entities.js.map