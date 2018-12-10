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
        this.url = "mqtt://vm61.htl-leonding.ac.at";
        this.port = "1883";
        this.username = "weather_client";
        this.password = "dhtnd54t";
        this.connectionOptions = { username: this.username, password: this.password };
        console.log("MqttClient constructor()...");
        this.client = mqtt.connect(`${this.url}:${this.port}`, this.connectionOptions);
        this.client.on('connect', this.onConnect);
        this.client.on('message', this.onMessage);
    }
    onConnect() {
        console.log(`Now connected to Broker`);
    }
    onMessage(topic, message) {
        console.log(`Topic: ${topic}, Message: ${message.toString().substring(0, 60)}`);
    }
    subscribe(topic) {
        this.client.subscribe(topic);
    }
    send(topic, message) {
        this.client.publish(topic, message);
    }
}
exports.MqttClient = MqttClient;
//# sourceMappingURL=mqttclient.js.map