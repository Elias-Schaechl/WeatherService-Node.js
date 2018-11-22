"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Weather {
    constructor(temp, pressure, humidity) {
        this.temp = temp;
        this.pressure = pressure;
        this.humidity = humidity;
    }
    /**
     * ToString
     * @returns A string representing the Object
     */
    ToString() {
        return "Weather: " + this.humidity + ", " + this.pressure;
    }
}
exports.Weather = Weather;
//# sourceMappingURL=entities.js.map