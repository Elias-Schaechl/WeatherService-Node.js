# Weather Service

## Notes

### Planned Next

| Created at | Description        | Priority |
| ---------- | -----------------  | -------- |
| 13.11.2018 | send logs to mqtt  | 2        |
| 05.11.2018 | define interfaces  | 1        |
| 05.11.2018 | implement entities | 2        |
| 01.11.2018 | config handling    | 3        |


### Some tec:

- `nodemon` for typescript 
- `Axeos` Http client
- `Json to ts` json to interface converter

### Issues on the way

-  Error while implementing mqtt client
   Solved ([MQTT.js](https://www.npmjs.com/package/mqtt#usage-with-typescript)):
   -  Setting tsconfig.json:
      `"compilerOptions" : {"moduleResolution" : "node"}`
   -  Including TypeScript definitions for node
      `install --save-dev @types/node`

-  