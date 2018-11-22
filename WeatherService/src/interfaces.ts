import { Confighandler } from './config/config';

export interface IWeatherReciever{
    setIntervall(intervall: number): boolean
    setRecieveFunction(target: (weather: Weather) => boolean):boolean
    setCycleActive(status: boolean):boolean
    triggerSending():boolean
    
}

interface IForecastReciever{
    setIntervall(intervall: number): boolean

}

interface IMQTTGateway{
    setIntervall(intervall: number): boolean
    send(content:string, topic:string, qos:number):void
    
}
