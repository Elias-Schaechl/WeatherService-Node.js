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

    private client: mqtt.Client

    constructor() {
        console.log("MqttClient constructor()...")
        this.client = mqtt.connect(`${this.url}:${this.port}`, this.connectionOptions)

        this.client.on('connect', this.onConnect)
        this.client.on('message', this.onMessage)
    }

    onConnect() {
        console.log(`Now connected to Broker`)
    }

    onMessage(topic: string, message: String): void {
        //console.log(`Topic: ${topic}, Message: ${message.toString().substring(0,60)}`)
    }

    subscribe(topic: string) {
        this.client.subscribe(topic)
    }

    send(topic: string, message: string) {
        this.client.publish(topic, message)
    }
}