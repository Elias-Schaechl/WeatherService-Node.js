import fs from "fs"

export class Confighandler {

    public static get Instance() {
        return this._instance || (this._instance = new this())
    }

    private static _instance: Confighandler
    public readonly config: ConfigJson
    private path: string = "config-vm61.json"
    // private path: string = "config-localtest.json"

    private constructor() {
        console.log("Confighandler constructor()...")
        const rawdata = fs.readFileSync(this.path)
        this.config = JSON.parse(rawdata.toString())
        // console.log(JSON.stringify(this.config))
    }
}
