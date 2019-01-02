import fs from "fs";

export class Confighandler{

    private static _instance: Confighandler;
    private path: string = "./config.json"
    readonly json: ConfigJson

    private constructor(){
        console.log("Confighandler constructor()...")
        let rawdata = fs.readFileSync(this.path)
        this.json = JSON.parse(rawdata.toString())
        console.log(JSON.stringify(this.json))
    }

    public static get Instance()
    {
        return this._instance || (this._instance = new this());
    }
    



}
