import fs from "fs";

export class Confighandler{

    private static _instance: Confighandler;
    private path: string = "config.json"
    readonly config: ConfigJson

    private constructor(){
        console.log("Confighandler constructor()...")
        let rawdata = fs.readFileSync(this.path)
        this.config = JSON.parse(rawdata.toString())
        //console.log(JSON.stringify(this.config))
    }

    public static get Instance()
    {
        return this._instance || (this._instance = new this());
    }
    



}
