import { Coordinate } from './coordinate-model'

export class City {
    constructor(
        public id: string,
        public name: string,
        public country: string,
        public coord: Coordinate
    ) { }
}
