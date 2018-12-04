"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt = __importStar(require("mqtt"));
class MqttClient {
    constructor() {
        this.url = "vm61.htl-leonding.ac.at";
        this.port = "1883";
        this.client = mqtt.connect(`${this.url}:${this.port}`);
        const self = this;
        this.client.on('connect', function () {
            self.client.subscribe('htlleonding/#', function (err) {
                if (!err) {
                    self.client.publish('presence', 'Hello mqtt');
                }
            });
        });
        this.client.on('message', function (topic, message) {
            // message is Buffer
            console.log(message.toString());
            self.client.end();
        });
    }
    send(topic, message) {
        this.client.publish(topic, message);
    }
}
exports.MqttClient = MqttClient;
//# sourceMappingURL=mqttclient.js.map