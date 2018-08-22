import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { SearchService } from '../../services/search.service'
import { WeatherModel } from '../../models/weather-respose-model';
import { Coordinate } from '../../models/coordinate-model';
import { Temperature } from '../../models/temperature-model';
import { Wind } from '../../models/wind-model';
import { Cloud } from '../../models/cloud-model';
import { CountryInfo } from '../../models/country-model';
import { Weather } from '../../models/weather-model';
import * as moment from 'moment';
import { LocationModel } from '../../models/location-model';
import { ForecastResponse } from '../../models/forecast-response-model';

const TOKEN = '88e15095a3bbfb'
const KELVIN_GRADE = 273.15
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [SearchService]
})

export class HomeComponent implements OnInit {

  weather: WeatherModel = new WeatherModel(
    new Coordinate(0, 0),
    new Array(new Weather(0, '', '', '')),
    '',
    new Temperature(0, 0, 0, 0, 0),
    0,
    new Wind(0, 0),
    new Cloud(0),
    0,
    new CountryInfo(0, 0, 0, '', 0, 0),
    0,
    '',
    0
  )
  nextDays: ForecastResponse
  location: LocationModel
  date: string
  lat: number;
  lon: number;
  isDay: boolean
  weatherOnNextDays: Array<string> = new Array()

  constructor(private service: SearchService, private cd: ChangeDetectorRef) { }

  /**
   * @param that used to pass 'this' to my function passing from setInterval()
   */
  reloadWeather(that: this) {
    const self = that
    that.service.getLocation('http://ipinfo.io', '?token=' + TOKEN).subscribe(
      res => {
        console.log(res)
        self.location = res
        self.service.getWeather(self.location.postal, self.location.country).subscribe(
          result => {
            console.log('Result: ', JSON.stringify(result))
            self.weather = result
            const myDate = new Date(result.dt * 1000)
            self.date  = myDate.getHours() + ' : ' + myDate.getMinutes() + ' : ' + myDate.getSeconds()
            self.weather.main.temp = parseFloat((result.main.temp - KELVIN_GRADE).toPrecision(3))
            self.weather.main.temp_max = result.main.temp_max - KELVIN_GRADE
            self.weather.main.temp_min = result.main.temp_min - KELVIN_GRADE
            self.weather.weather[0].description = self.weather.weather[0].description.toUpperCase()
            console.log(self.date)
            console.log('Weather :', self.weather)
            const time = new Date()
            const currentHour = time.getHours().toString()
            const img = document.createElement('img')
            if ( parseFloat(currentHour) < 21 && parseFloat(currentHour) > 6 ) {
              img.src = '../../../assets/images/md-weather-iconset/weather-' + (self.weather.weather[0].main).toLowerCase() + '.png'
            } else {
              img.src = '../../../assets/images/md-weather-iconset/weather-' + (self.weather.weather[0].main).toLowerCase() + '-night.png'
            }
            if ( document.getElementById('actual-weather-icon') ) {
              document.getElementById('actual-weather-icon').remove()
            }

            img.id = 'actual-weather-icon'
            img.className = 'weather-icon'
            document.getElementById('weather-icon').appendChild(img)
            self.cd.detectChanges()
          }
        )
      })
  }

  getNextFiveDays(that: this) {
    const self = that
    that.service.getLocation('http://ipinfo.io', '?token=' + TOKEN).subscribe(
      res => {
        console.log(res)
        self.location = res
        self.service.getNext5DaysWeather(self.location.postal, self.location.country).subscribe(
          result => {
            self.nextDays = result
            console.log('Next five days ', self.nextDays)
            const date: Date = new Date(result.list[0].dt_txt.replace(/\ /gi, 'T'))
            date.setHours(date.getHours() + 24)
            for ( let i = 0; i < result.list.length; i ++ ) {
              const findDate = new Date(result.list[i].dt_txt.replace(/\ /gi, 'T'))
              if ( findDate.getHours() === date.getHours() ) {
                self.weatherOnNextDays = [...self.weatherOnNextDays, result.list[i].weather[0].main]
                date.setHours(date.getHours() + 24)
              }
            }

            if ( document.getElementById('day-1-icon') ) {
              for ( let i = 0; i < 4; i ++ ) {
                document.getElementById('day-' + (i + 1) + '-icon').remove()
              }
            }

            for ( let i = 0; i < 4; i ++ ) {
              const img = document.createElement('img')
              img.src = '../../../assets/images/md-weather-iconset/weather-' + (self.weatherOnNextDays[i+1]).toLowerCase() + '.png'
              img.id = 'day-' + ( i + 1 ) + '-icon'
              img.height = 50
              img.width = 50
              img.className = 'weather-week-icon'
              document.getElementById('day-0-icon').appendChild(img)
              console.log('created')
            }
            self.cd.detectChanges()
            console.log('Weather in next days: ', self.weatherOnNextDays)
          }
        )
      }
    )
  }

  ngOnInit() {
    const clock = new Clock(document.getElementById('clock'), document.getElementById('date'))
    this.reloadWeather(this)
    this.getNextFiveDays(this)
    const self = this
    setInterval(function() { self.getNextFiveDays(self) }, 3600000 )
    setInterval(function() { self.reloadWeather(self) } , 3600000)
    // Create a new instance of Clock, passing in your target DOM element.
  }

}

class Clock {
  // Declare a class variable of type "Element" called el
  el: Element
  dateElem: Element
  dayOfWeek = new Array<string>(
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  )

  months = new Array<string>(
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  )

  /**
   * Called when "new" is invoked, you'll pass your target element here.
   * @param element Target element to update
   */
  constructor(element, dateElement) {
      this.el = element
      this.dateElem = dateElement

      // Immediately kick off a setInterval to this objects "run" method,
      // every 1000ms like you had before.
      setInterval(() => this.run(), 1000)
  }

  /**
   * This *could* be in the constructor, but for seperation of duties we'll
   * make it a method.  This method is invoked every ~1000ms (JavaScript timers
   * aren't perfect).
   */
  run() {
      const time = new Date()
      // Don't need to call toString, but it's fine here. When you start
      // concatenating numbers onto strings they get converted anyway.
      let hours = time.getHours().toString()
      let minutes = time.getMinutes().toString()
      let seconds = time.getSeconds().toString()
      const today = time.getDay().toString()
      let day = time.getDate().toString()
      const month = time.getMonth().toString()
      const year = time.getFullYear().toString()

      // Your previous logic.
      if (hours.length < 2) {
      hours = '0' + hours
      }

      if (minutes.length < 2) {
      minutes = '0' + minutes
      }

      if (seconds.length < 2) {
      seconds = '0' + seconds
      }

      if (day.length < 2) {
        day = '0' + day
      }

      const clockStr = {
        clock: hours + ' : ' + minutes + ' : ' + seconds,
        date: this.dayOfWeek[ parseFloat(today) - 1 ] + ' ' + day + ' ' + this.months[month] + ' ' + year
      }

      // Update this class' "el" variable as before.
      this.el.textContent = clockStr.clock
      this.dateElem.textContent = clockStr.date
  }
}

