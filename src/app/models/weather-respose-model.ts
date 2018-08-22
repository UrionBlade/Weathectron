import { Coordinate } from './coordinate-model'
import { Weather } from './weather-model'
import { Temperature } from './temperature-model'
import { Wind } from './wind-model'
import { Cloud } from './cloud-model'
import { CountryInfo } from './country-model'

export class WeatherModel {
    constructor(
        public coord: Coordinate,
        public weather: Array<Weather>,
        public base: string,
        public main: Temperature,
        public visibility: number,
        public wind: Wind, 
        public clouds: Cloud,
        public dt: number,
        public sys: CountryInfo,
        public id: number,
        public name: string,
        public cod: number,
        public dt_txt?: string
    ) { }
}
