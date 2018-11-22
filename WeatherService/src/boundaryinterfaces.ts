import { Confighandler } from './config/config';
import { Weather } from './entities';

export interface IWeatherReciever{
    setCycleDuration(interval: number): boolean
    setRecieveFunction(target: (weather: Weather) => boolean):boolean
    setCycleActive(status: boolean):boolean
    triggerSending():boolean
    
}

interface IForecastReciever{
    setCycleDuration(interval: number): boolean

}

interface IMQTTGateway{
    setCycleDuration(interval: number): boolean
    send(content:string, topic:string, qos:number):void
    
}
