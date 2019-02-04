import { Confighandler } from "./config/config"
import { Weather } from "./entities"
import { ForecastReceiver } from "./forecast/forecastreceiver"
import { MqttClient } from "./mqtt/mqttclient"
import { WeatherReceiver } from "./weather/weatherreceiver"

let mqttClient: MqttClient

let forecasttopicaggregated: string
let forecasttopicfull: string
let temperaturetopicsend: string
let pressuretopicsend: string
let humiditytopicsend: string
let windspeedtopicsend: string
let winddegtopicsend: string

export function setup() {

    const handler = Confighandler.Instance
    forecasttopicfull = handler.config.forecasttopicssend.full
    forecasttopicaggregated = handler.config.forecasttopicssend.aggregated
    temperaturetopicsend = handler.config.weathertopicssend.temperature
    pressuretopicsend = handler.config.weathertopicssend.pressure
    humiditytopicsend = handler.config.weathertopicssend.humidity
    windspeedtopicsend = handler.config.weathertopicssend.windspeed
    winddegtopicsend = handler.config.weathertopicssend.winddeg 

    const second = 1000
    const hour = 60 * 60 * second

    mqttClient = MqttClient.Instance

    const weatherReceiver = new WeatherReceiver(mqttClient)
    const forecastReceiver = new ForecastReceiver()

    weatherReceiver.setReceiveFunction(getWeather)
    weatherReceiver.setCycleDuration(20 * second)
    weatherReceiver.setCycleActive(true)

    forecastReceiver.setReceiveFunction(getForecast)
    forecastReceiver.setCycleDuration(1 * hour)
    forecastReceiver.setCycleActive(true)

    mqttClient.subscribe("htlleonding/weather", onMessage)
    mqttClient.subscribe("htlleonding/weather/test", onMessage)
    mqttClient.send("htlleonding", "WeatherService up")

    console.log("Awaiting data:\n")
}

function onMessage(topic: string, message: string) {
    console.log(`${topic}: ${message}`)
}

function getWeather(weather: Weather): boolean {
    console.log("\x1b[32m", `New Weather Data arrived: \x1b[0m${JSON.stringify(weather)}`)
    updateWeather(weather)
    return true
}

function getForecast(forecast: ForecastJson, aggregatedforecast: AggrForecastJson): boolean {
    console.log(`Forecast arrived: ${JSON.stringify(forecast).substring(0, 40)}...`)
    //console.log(`Aggregated forecast arrived: ${JSON.stringify(aggregatedforecast)}...`)
    mqttClient.send(forecasttopicfull, JSON.stringify(forecast))
    mqttClient.send(forecasttopicaggregated, JSON.stringify(aggregatedforecast))
    return true
}

function updateWeather(weather: Weather) {
    if (weather.changed[0]) {
        sendMessage(temperaturetopicsend, weather.timestamp, weather.temperature)
        weather.changed[0] = false
    }
    if (weather.changed[1]) {
        sendMessage(pressuretopicsend, weather.timestamp, weather.pressure)
        weather.changed[1] = false
    }
    if (weather.changed[2]) {
        sendMessage(humiditytopicsend, weather.timestamp, weather.humidity)
        weather.changed[2] = false
    }
    if (weather.changed[3]) {
        sendMessage(windspeedtopicsend, weather.timestamp, weather.windspeed)
        weather.changed[3] = false
    }
    if (weather.changed[4]) {
        sendMessage(winddegtopicsend, weather.timestamp, weather.winddir)
        weather.changed[4] = false
    }
}

function sendMessage(topic: string, timestamp: number, value: number) {
    mqttClient.send(topic, JSON.stringify({ timestamp: (timestamp - (timestamp % 1000)) / 1000, value }))
}
