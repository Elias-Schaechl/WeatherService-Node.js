import { MqttClient } from './mqtt/mqttclient';
import { Confighandler } from './config/config'
import { WeatherReceiver } from './weather/weatherreceiver'
import { Weather } from './entities';
import { ForecastReceiver } from './forecast/forecastreceiver';

class WeatherController{

    private mqttClient: MqttClient

    constructor(){
        const greeting: string = "WeatherService is running\n-------------------------"
        console.log(greeting)

        let confighandler = Confighandler.Instance


        let second = 1000
        let hour = 60 * 60 * 1000

        let weatherReceiver = new WeatherReceiver()
        weatherReceiver.setReceiveFunction(this.getWeather)
        weatherReceiver.setCycleDuration(20 * second)
        weatherReceiver.setCycleActive

        let forecastReceiver = new ForecastReceiver()
        forecastReceiver.setReceiveFunction(this.getForecast)
        forecastReceiver.setCycleDuration(1 * hour)
        forecastReceiver.setCycleActive


        this.mqttClient = new MqttClient();
        this.mqttClient.subscribe("htlleonding/#")
        this.mqttClient.send("htlleonding", "WeatherService up")


        console.log("Awaiting data:\n")

    }

    getWeather(weather: Weather): boolean {
        console.log('\x1b[32m', `New Weather Data arrived: \x1b[0m${JSON.stringify(weather)}`)
        this.updateWeather(weather)
        return true;
    }
    
    getForecast(forecast: ForecastJson): boolean {
        console.log(`Forecast arrived: ${JSON.stringify(forecast).substring(0, 40)}...`)
        this.mqttClient.send("htlleonding/outdoor/weather/forecast", JSON.stringify(forecast))
        return true;
    }
    
    updateWeather(weather: Weather) {
        if (weather.changed[0]) {
            this.sendMessage("htlleonding/outdoor/weather/actual/temperature", weather.timestamp, weather.temperature)
        }
        if (weather.changed[1]) {
            this.sendMessage("htlleonding/outdoor/weather/actual/pressure", weather.timestamp, weather.pressure)
        }
        if (weather.changed[2]) {
            this.sendMessage("htlleonding/outdoor/weather/actual/humidity", weather.timestamp, weather.humidity)
        }
        if (weather.changed[3]) {
            this.sendMessage("htlleonding/outdoor/weather/actual/wind_speed", weather.timestamp, weather.windspeed)
        }
        if (weather.changed[4]) {
            this.sendMessage("htlleonding/outdoor/weather/actual/wind_deg", weather.timestamp, weather.winddir)
        }
    }
    
    sendMessage(topic: string, timestamp: number, value: number) {
        this.mqttClient.send(topic, JSON.stringify({ timestamp: (timestamp - (timestamp % 1000)) / 1000, value: value }))
    }
}