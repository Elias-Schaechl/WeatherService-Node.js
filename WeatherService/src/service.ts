import {Confighandler} from './config/config'
import {WeatherReciever} from './weather/weatherreciever'
import { Weather } from './entities';
const greeting: string = "Hello World!"
console.log(greeting)
let c1 = new Confighandler()
c1.loadConfig("hoho")
c1.loadConfig()


let wr = new WeatherReciever()
wr.setRecieveFunction(GetWeather)
wr.setCycleDuration(5)
wr.setCycleActive

function GetWeather(weather: Weather):boolean{
    weather
    console.log("Weather data arrived ${weather.toString()}")
    return true;
}
