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
const url = "";
const port = "";
class MqttClient {
    constructor() {
        this.client = mqtt.connect(url);
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
}
exports.MqttClient = MqttClient;
//# sourceMappingURL=mqttclient.js.map