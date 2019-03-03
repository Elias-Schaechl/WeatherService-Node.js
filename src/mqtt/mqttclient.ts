import * as mqtt from "mqtt"
import { Confighandler } from "./../config/config"

interface Subscription{
    topic: string,
    onMessage(topic: string, message: string): void
}

export class MqttClient {

    public static get Instance() {
        return this.instance || (this.instance = new this())
    }

    private static instance: MqttClient

    public subscriptions: Subscription[] = []
    public connected: boolean = false
    private handler: Confighandler = Confighandler.Instance
    private readonly url: string = this.handler.config.mqttclient.url
    private readonly port: string = this.handler.config.mqttclient.port
    private readonly username: string = this.handler.config.mqttclient.username
    private readonly password: string = this.handler.config.mqttclient.password
    private readonly wtopic: string = this.handler.config.mqttclient.wtopic
    private readonly wpayload: string = this.handler.config.mqttclient.wpayload
    private readonly wqos: number = this.handler.config.mqttclient.wqos
    private readonly wretain: boolean = this.handler.config.mqttclient.wretain

    private readonly will = {topic: this.wtopic, payload: this.wpayload, qos: this.wqos, retain: this.wretain}
    private readonly connectionOptions = {username: this.username, password: this.password, lastwill: this.will}
    private client: mqtt.Client

    private constructor() {
        console.log("MqttClient constructor()...")
        console.log(`Connecting to ${this.url}:${this.port}`)
        this.client = mqtt.connect(`${this.url}:${this.port}`, this.connectionOptions)
        this.client.on("connect", this.onConnect)
        this.client.on("message", this.onMessage)
    }

    public subscribe(topic: string, target: (topic: string, message: string) => void) {
        if (this.connected) {
            this.client.subscribe(topic)
        }
        this.subscriptions.push({"topic": topic, "onMessage": target})
        // console.log (this.subscriptions)

    }

    public send(topic: string, message: string) {
        this.client.publish(topic, message, { retain: true, qos: 2})
    }

    private onConnect() {
        console.log(`MQTT connection established`)
        this.connected = true
        // console.log(this.subscriptions)
        // this.subscriptions.forEach((subscription) => {
        //     this.client.subscribe(subscription.topic)
        // })
    }

    private onMessage(topic: string, message: string): void {
        console.log (this.subscriptions)
        this.subscriptions.forEach((subscription) => {
            if (topic === subscription.topic) {
                subscription.onMessage(topic, message)
            }
        })
    }
}
