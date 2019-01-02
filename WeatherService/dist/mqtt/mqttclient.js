"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./../config/config");
const mqtt = __importStar(require("mqtt"));
class MqttClient {
    constructor() {
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
        this.client = mqtt.connect(`${this.url}:${this.port}`, this.connectionOptions);
        this.client.on('connect', this.onConnect);
        this.client.on('message', this.onMessage);
    }
    onConnect() {
        console.log(`Now connected to Broker`);
    }
    onMessage(topic, message) {
        //console.log(`Topic: ${topic}, Message: ${message.toString().substring(0,60)}`)
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