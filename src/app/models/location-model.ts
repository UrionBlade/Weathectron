import { Asn } from './asn-model'
import { Company } from './company-model'
import { Carrier } from './carrier-model'

export class LocationModel {
    constructor (
        public ip: string,
        public hostname: string,
        public city: string,
        public region: string,
        public country: string,
        public loc: string,
        public postal: string,
        public asn: Asn,
        public company: Company,
        public carrier: Carrier
    ) { }
}
