import { Confighandler } from './../config/config';
import * as mqtt from "mqtt";





export class MqttClient {

    private handler: Confighandler = Confighandler.Instance
    readonly url: string = this.handler.config.mqttclient.url
    readonly port: string = this.handler.config.mqttclient.port
    readonly username: string = this.handler.config.mqttclient.username
    readonly password: string = this.handler.config.mqttclient.password
    readonly wtopic: string = this.handler.config.mqttclient.wtopic
    readonly wpayload: string = this.handler.config.mqttclient.wpayload
    readonly wqos: number = this.handler.config.mqttclient.wqos
    readonly wretain: boolean = this.handler.config.mqttclient.wretain 

    readonly will = {topic: this.wtopic, payload: this.wpayload, qos: this.wqos, retain: this.wretain}
    readonly connectionOptions = {username: this.username, password: this.password, lastwill: this.will}

    private subscriptions = new Set()
    private client: mqtt.Client

    private static _instance: MqttClient;

    private constructor(){
        console.log("MqttClient constructor()...")
        this.client = mqtt.connect(`${this.url}:${this.port}`, this.connectionOptions)

        this.client.on('connect', this.onConnect)
        this.client.on('message', this.onMessage)
    }

    public static get Instance()
    {
        return this._instance || (this._instance = new this());
    }


    onConnect() {
        console.log(`Now connected to Broker`)
    }

    onMessage(topic: string, message: string): void {
        console.log (this.subscriptions)
        this.subscriptions.forEach(function(subscription){
            if(topic == subscription.topic){
                subscription.onMessage(topic, message)
            }
        })
    }

    public subscribe(topic: string, target: (topic: string, message: string) => void) {
        this.client.subscribe(topic)
        this.subscriptions.add({"topic": topic, "onMessage": target})
        console.log (this.subscriptions)

    }

    send(topic: string, message: string) {
        this.client.publish(topic, message,{ retain:true, qos:2})
    }

    sampleTopic(topic: string, message: string){
    }
}