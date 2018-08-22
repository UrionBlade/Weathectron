import { City } from './city-model'
import { WeatherModel } from './weather-respose-model';

export class ForecastResponse {
    constructor (
        public city: City,
        public cod: string,
        public message: number,
        public cnt: string,
        public list: Array<WeatherModel>
    ) { }
}
