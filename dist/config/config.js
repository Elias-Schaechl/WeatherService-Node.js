"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class Confighandler {
    constructor() {
        //private path: string = "config-vm61.json"
        this.path = "config-localtest.json";
        console.log("Confighandler constructor()...");
        const rawdata = fs_1.default.readFileSync(this.path);
        this.config = JSON.parse(rawdata.toString());
        // console.log(JSON.stringify(this.config))
    }
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
}
exports.Confighandler = Confighandler;
//# sourceMappingURL=config.js.map