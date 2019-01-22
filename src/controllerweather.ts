import { Confighandler } from "./config/config"
import { Weather } from "./entities"
import { ForecastReceiver } from "./forecast/forecastreceiver"
import { MqttClient } from "./mqtt/mqttclient"
import { WeatherReceiver } from "./weather/weatherreceiver"

let mqttClient: MqttClient
let forecasttopicaggregated: string
let forecasttopicfull: string

export function setup() {

    const handler = Confighandler.Instance
    forecasttopicfull = handler.config.forecasttopicssend.full
    forecasttopicaggregated = handler.config.forecasttopicssend.aggregated

    const second = 1000
    const hour = 60 * 60 * 1000

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
    mqttClient.send(forecasttopicfull, JSON.stringify(forecast))
    return true
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
    mqttClient.send(topic, JSON.stringify({ timestamp: (timestamp - (timestamp % 1000)) / 1000, value }))
}
