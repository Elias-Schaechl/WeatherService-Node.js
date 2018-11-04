"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const greeting = "Hello World!";
console.log(greeting);
let c1 = new config_1.Confighandler();
c1.loadConfig("hoho");
c1.loadConfig();
//# sourceMappingURL=service.js.map