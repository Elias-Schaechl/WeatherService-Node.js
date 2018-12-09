import { Confighandler } from '../config/config';
import { Weather } from '../entities';

interface IReciever{
    setCycleDuration(interval: number): boolean
    setCycleActive(status: boolean):boolean
    triggerSending():boolean
}

export interface IWeatherReciever extends IReciever{   
    setRecieveFunction(target: (weather: Weather) => boolean):boolean 
}

export interface IForecastReciever extends IReciever{
    setRecieveFunction(target: (forecast: ForecastJson) => boolean):boolean
}

interface IMQTTGateway{
    setCycleDuration(interval: number): boolean
    send(content:string, topic:string, qos:number):void
    
}
