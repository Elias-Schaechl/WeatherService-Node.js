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
const config_1 = require("./../config/config");
class MqttClient {
    constructor() {
        this.subscriptions = new Set();
        this.handler = config_1.Confighandler.Instance;
        this.url = this.handler.config.mqttclient.url;
        this.port = this.handler.config.mqttclient.port;
        this.username = this.handler.config.mqttclient.username;
        this.password = this.handler.config.mqttclient.password;
        this.wtopic = this.handler.config.mqttclient.wtopic;
        this.wpayload = this.handler.config.mqttclient.wpayload;
        this.wqos = this.handler.config.mqttclient.wqos;
        this.wretain = this.handler.config.mqttclient.wretain;
        this.will = { topic: this.wtopic, payload: this.wpayload, qos: this.wqos, retain: this.wretain };
        this.connectionOptions = { username: this.username, password: this.password, lastwill: this.will };
        console.log("MqttClient constructor()...");
        console.log(`Connecting to ${this.url}:${this.port}`);
        this.client = mqtt.connect(`${this.url}:${this.port}`, this.connectionOptions);
        this.client.on("connect", this.onConnect);
        this.client.on("message", this.onMessage);
    }
    static get Instance() {
        return this.instance || (this.instance = new this());
    }
    subscribe(topic, target) {
        this.client.subscribe(topic);
        this.subscriptions.add({ "topic": topic, "onMessage": target });
        // console.log (this.subscriptions)
    }
    send(topic, message) {
        this.client.publish(topic, message, { retain: true, qos: 2 });
    }
    onConnect() {
        console.log(`MQTT connection established`);
    }
    onMessage(topic, message) {
        console.log(this.subscriptions);
        this.subscriptions.forEach((subscription) => {
            if (topic === subscription.topic) {
                subscription.onMessage(topic, message);
            }
        });
    }
}
exports.MqttClient = MqttClient;
//# sourceMappingURL=mqttclient.js.map