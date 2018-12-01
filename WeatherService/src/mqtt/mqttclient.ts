import * as mqtt from "mqtt" ;

const url:string = ""
const port:string = ""
 

export class MqttClient{
    client:mqtt.Client = mqtt.connect(url)
    constructor(){
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

    
}
