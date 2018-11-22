import {Confighandler} from './config/config'
import {WeatherReciever} from './weather/weatherreciever'
const greeting: string = "Hello World!"
console.log(greeting)
let c1 = new Confighandler()
c1.loadConfig("hoho")
c1.loadConfig()


function newWeather(weather: Weather):boolean{
    return true;
}

let wr = new WeatherReciever()
wr.setRecieveFunction(GetWeather)

function GetWeather(weather: Weather):boolean{
    weather
    return true;
}
