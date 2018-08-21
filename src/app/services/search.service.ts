import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { WeatherModel } from '../models/weather-respose-model';
import { LocationModel } from '../models/location-model';

@Injectable()
export class SearchService {

  apiRoot = 'http://api.openweathermap.org/data/2.5'
  apiWeather = '/weather'
  apiForecast = '/forecast'
  appId = 'f6cc689c667a6e181d7728d61ceb49f7'

  constructor (private http: HttpClient) {
  }

  getLocation(url: string, token: string) {
    return this.http.get<LocationModel>(url + token)
  }

  getWeather(zip: string, country: string) {
    const apiUrl = this.apiRoot + this.apiWeather + '?zip=' + zip + ',' + country + '&APPID=' + this.appId;
      return this.http.get<WeatherModel>(apiUrl);
  }

  getNext5DaysWeather(zip: string, country: string) {
    const apiUrl = this.apiRoot + this.apiForecast + '?zip=' + zip + ',' + country + '&APPID=' + this.appId;
      return this.http.get(apiUrl);
  }

  doPost(object: Object, url: String) {
    const apiUrl = this.apiRoot + url;
    const _headers = new HttpHeaders();
    const headers = _headers.append('Content-Type', 'application/json');
    const options =  {
      headers: headers
    };
    console.log('Post: ', apiUrl)
    return this.http.post(apiUrl, object, options);
  }

}
