import { Confighandler } from './config';
interface IWeatherGateway{
    
}
interface IForecastGateway{

}
interface IMQTTGateway{
    send(content:string, topic:string, qos:number):void

}