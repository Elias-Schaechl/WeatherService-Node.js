interface ConfigJson {
  mqttclient: Mqttclient;
  forecastreceiver: Forecastreceiver;
  weatherreceiver: Forecastreceiver;
}

interface Forecastreceiver {
  baseUrl: string;
  query: string;
}

interface Mqttclient {
  url: string;
  port: string;
  username: string;
  password: string;
  wtopic: string;
  wpayload: string;
  wqos: number;
  wretain: boolean;
}