import { Confighandler } from "../config/config"
import { Weather } from "../entities"

interface IReciever {
    setCycleDuration(interval: number): boolean
    setCycleActive(status: boolean): boolean
    triggerSending(): boolean
}

export interface IWeatherReceiver extends IReciever {
    setReceiveFunction(target: (weather: Weather) => boolean): boolean
}

export interface IForecastReceiver extends IReciever {
    setReceiveFunction(target: (forecast: ForecastJson, aggrforecast: AggrForecastJson) => boolean): boolean
}

interface IMQTTGateway {
    setCycleDuration(interval: number): boolean
    send(content: string, topic: string, qos: number): void

}
