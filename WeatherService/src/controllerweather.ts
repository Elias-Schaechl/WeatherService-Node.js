import { MqttClient } from './mqtt/mqttclient';
import { Confighandler } from './config/config'
import { WeatherReceiver } from './weather/weatherreceiver'
import { Weather } from './entities';
import { ForecastReceiver } from './forecast/forecastreceiver';

let mqttClient: MqttClient

export function setup(){
    
    let confighandler = Confighandler.Instance
    let second = 1000
    let hour = 60 * 60 * 1000

    mqttClient = MqttClient.Instance

    let weatherReceiver = new WeatherReceiver(mqttClient)
    let forecastReceiver = new ForecastReceiver()

    weatherReceiver.setReceiveFunction(getWeather)
    weatherReceiver.setCycleDuration(20 * second)
    weatherReceiver.setCycleActive


    forecastReceiver.setReceiveFunction(getForecast)
    forecastReceiver.setCycleDuration(1 * hour)
    forecastReceiver.setCycleActive

    mqttClient.subscribe("htlleonding/weather", onMessage)
    mqttClient.subscribe("htlleonding/weather/test", onMessage)
    mqttClient.send("htlleonding", "WeatherService up")

    console.log("Awaiting data:\n")
}

function onMessage(topic: string, message: string){
    console.log(`${topic}: ${message}`)
}

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
        weather.changed[0] = false
    }
    if (weather.changed[1]) {
        sendMessage("htlleonding/outdoor/weather/actual/pressure", weather.timestamp, weather.pressure)
        weather.changed[1] = false
    }
    if (weather.changed[2]) {
        sendMessage("htlleonding/outdoor/weather/actual/humidity", weather.timestamp, weather.humidity)
        weather.changed[2] = false
    }
    if (weather.changed[3]) {
        sendMessage("htlleonding/outdoor/weather/actual/wind_speed", weather.timestamp, weather.windspeed)
        weather.changed[3] = false
    }
    if (weather.changed[4]) {
        sendMessage("htlleonding/outdoor/weather/actual/wind_deg", weather.timestamp, weather.winddir)
        weather.changed[4] = false
    }
}

function sendMessage(topic: string, timestamp: number, value: number) {
    mqttClient.send(topic, JSON.stringify({ timestamp: (timestamp - (timestamp % 1000)) / 1000, value: value }))
}
