/**
 * Representing forecast received by weather api
 */
interface ForecastJson {
  cod: string
  message: number
  cnt: number
  list: List[]
  city: City
}

interface City {
  id: number
  name: string
  coord: Coord
  country: string
}

interface Coord {
  lat: number
  lon: number
}

interface List {
  dt: number
  main: Main
  weather: Weather[]
  clouds: Clouds
  wind: Wind
  sys: Sys
  dt_txt: string
  rain?: Rain
  snow?: Snow
}

interface Rain {
  "3h"?: number
}

interface Snow {
  "3h"?: number
}

interface Sys {
  pod: string
}

interface Wind {
  speed: number
  deg: number
}

interface Clouds {
  all: number
}

interface Weather {
  id: number
  main: string
  description: string
  icon: string
}

interface Main {
  temp: number
  temp_min: number
  temp_max: number
  pressure: number
  sea_level: number
  grnd_level: number
  humidity: number
  temp_kf: number
}

/**
 * Aggregated forecast 1 set of data/day
 */
interface AggrForecastJson {
  cod: string
  message: number
  cnt: number
  list: ForecastListElement[]
}

interface ForecastListElement {
  dt: number
  main: MainData
  weather_id: number
  werather_main: string
  weather_description: string
  weather_icon: string
  clouds: number
  wind: Wind
  dt_txt: string
  rain?: number
  snow?: number
}

interface MainData {
  temp: number
  temp_min: number
  temp_max: number
  pressure: number
  sea_level: number
  grnd_level: number
  humidity: number
}
