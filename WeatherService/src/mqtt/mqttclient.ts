import * as mqtt from "mqtt" ;


 

export class MqttClient{

    readonly url:string = "vm61.htl-leonding.ac.at"
    readonly port:string = "1883"

    private client:mqtt.Client 

    constructor(){

        this.client = mqtt.connect(`${this.url}:${this.port}`)

        const self = this
        this.client.on('connect', function () {
            self.client.subscribe('htlleonding/#', function (err) {
                if (!err) {
                    self.client.publish('presence', 'Hello mqtt')
                }
            })
        })
          
        this.client.on('message', function (topic, message) {
            // message is Buffer
            console.log(message.toString())
            self.client.end()
        })
    }

    send(topic: string, message: string) {
        this.client.publish(topic, message)
    }
}