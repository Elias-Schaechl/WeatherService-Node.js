import { MqttClient } from './mqtt/mqttclient';
import { Confighandler } from './config/config'
import { WeatherReciever } from './weather/weatherreciever'
import { Weather } from './entities';
import { ForecastReciever } from './forecast/forecastreciever';


function GetWeather(weather: Weather): boolean {
    console.log('\x1b[32m',`New Weather Data arrived: \x1b[0m${JSON.stringify(weather)}`)
    return true;
}

function GetForecast(forecast: ForecastJson): boolean {
    console.log(`New Forecast arrived: ${JSON.stringify(forecast).substring(0,39)}...`)
    return true;
}


const greeting: string = "WeatherService is running\n-------------------------"
console.log(greeting)
let c1 = new Confighandler()
//c1.loadConfig("hoho")
c1.loadConfig()


let wr = new WeatherReciever()
wr.setRecieveFunction(GetWeather)
wr.setCycleDuration(10000)
wr.setCycleActive

let fr = new ForecastReciever()
fr.setRecieveFunction(GetForecast)
fr.setCycleDuration(10000)
fr.setCycleActive


let mqttClient = new MqttClient();
mqttClient.send("htlleonding", "test some ppps")


console.log("Awaiting data:\n")
