import { MqttClient } from './mqtt/mqttclient';
import { Confighandler } from './config/config'
import { WeatherReceiver } from './weather/weatherreceiver'
import { Weather } from './entities';
import { ForecastReceiver } from './forecast/forecastreceiver';


function getWeather(weather: Weather): boolean {
    console.log('\x1b[32m', `New Weather Data arrived: \x1b[0m${JSON.stringify(weather)}`)
    updateWeather(weather)
    return true;
}

function getForecast(forecast: ForecastJson): boolean {
    console.log(`Forecast arrived: ${JSON.stringify(forecast).substring(0, 40)}...`)
    mqttClient.send("htlleonding/outdoor/weather/forecast", JSON.stringify(forecast))
    return true;
}

function updateWeather(weather: Weather) {
    if (weather.changed[0]) {
        sendMessage("htlleonding/outdoor/weather/actual/temperature", weather.timestamp, weather.temperature)
    }
    if (weather.changed[1]) {
        sendMessage("htlleonding/outdoor/weather/actual/pressure", weather.timestamp, weather.pressure)
    }
    if (weather.changed[2]) {
        sendMessage("htlleonding/outdoor/weather/actual/humidity", weather.timestamp, weather.humidity)
    }
    if (weather.changed[3]) {
        sendMessage("htlleonding/outdoor/weather/actual/wind_speed", weather.timestamp, weather.windspeed)
    }
    if (weather.changed[4]) {
        sendMessage("htlleonding/outdoor/weather/actual/wind_deg", weather.timestamp, weather.winddir)
    }
}

function sendMessage(topic: string, timestamp: number, value: number) {
    mqttClient.send(topic, JSON.stringify({ timestamp: (timestamp - (timestamp % 1000)) / 1000, value: value }))
}


const greeting: string = "WeatherService is running\n-------------------------"
console.log(greeting)

let confighandler = Confighandler.Instance




let weatherReceiver = new WeatherReceiver()
weatherReceiver.setReceiveFunction(getWeather)
weatherReceiver.setCycleDuration(20 * 1000)
weatherReceiver.setCycleActive

let forecastReceiver = new ForecastReceiver()
forecastReceiver.setReceiveFunction(getForecast)
forecastReceiver.setCycleDuration(60 * 60 * 1000)
forecastReceiver.setCycleActive


let mqttClient = new MqttClient();
mqttClient.subscribe("htlleonding/#")
mqttClient.send("htlleonding", "WeatherService up")


console.log("Awaiting data:\n")
