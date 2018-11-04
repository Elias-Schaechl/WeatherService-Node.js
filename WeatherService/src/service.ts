import {Confighandler} from './config'

const greeting: string = "Hello World!"
console.log(greeting)
let c1 = new Confighandler()
c1.loadConfig("hoho")
c1.loadConfig()

