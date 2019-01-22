import { setup as setupWeatherController } from "./controllerweather"

const greeting: string = "WeatherService is running\n-------------------------"
console.log(greeting)

setupWeatherController()
