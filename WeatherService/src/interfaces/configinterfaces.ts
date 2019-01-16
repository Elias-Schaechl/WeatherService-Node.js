interface ConfigJson {
  mqttclient: Mqttclient;
  forecastreceiver: Forecastreceiver;
  weatherreceiver: Forecastreceiver;
  weathertopicsget: WeatherTopicsGet;
  weathertopicssend: WeatherTopicsSend;
  forecasttopicssend: ForecastTopicsSend;
}

interface WeatherTopicsGet {
  temperature: string;
  pressure: string;
  humidity: string;
  windspeed: string;
  winddeg: string;
}

interface WeatherTopicsSend {
  temperature: string;
  pressure: string;
  humidity: string;
  windspeed: string;
  winddeg: string;
}

interface ForecastTopicsSend {
  full: string;
  aggregated: string;
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
