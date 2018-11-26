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
wr.setCycleDuration(5000)
wr.setCycleActive

function GetWeather(weather: Weather):boolean{
    console.log(`New Weather Data arrived ${JSON.stringify(weather)}`)

    return true;
}

console.log("Hey I'm working!")
