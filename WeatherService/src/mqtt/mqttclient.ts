import * as mqtt from "mqtt";




export class MqttClient {

    readonly url: string = "mqtt://vm61.htl-leonding.ac.at"
    readonly port: string = "1883"
    readonly username: string = "weather_client"
    readonly password: string = "dhtnd54t"
    readonly wtopic: string = ""
    readonly wpayload: string = ""
    readonly wqos: number = 0
    readonly wretain: boolean = false 
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
        console.log(`Topic: ${topic}, Message: ${message.toString().substring(0,60)}`)
    }

    subscribe(topic: string) {
        this.client.subscribe(topic)
    }

    send(topic: string, message: string) {
        this.client.publish(topic, message)
    }
}