import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

class Weather {
  city: string;
  date: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  description: string;

  constructor(city: string, date: string, tempF: number, windSpeed: number, humidity: number, icon: string, description: string) {
    this.city = city;
    this.date = date;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
    this.description = description;
  }
}
class WeatherService {
  private baseURL?: string;
  private apiKey?: string;
  private cityName = '';
  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  private async fetchLocationData(query: string) {
    try {
      if (!this.baseURL || !this.apiKey) {
        throw new Error('API base URL or API key not found. Check .env file');
      }

      const response: Coordinates[] = await fetch(query).then((res) =>
        res.json()
      );

      return response[0];
    }
    catch (error) {
      throw error;
    }
  }

  private destructureLocationData(locationData: Coordinates): Coordinates {
    if (!locationData) {
      throw new Error('City not found, please enter another.');
    }

    const { name, lat, lon, country, state } =   locationData;

    return {name, lat, lon, country, state,};
  }

  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }

  private async fetchAndDestructureLocationData() {
    return await this.fetchLocationData(this.buildGeocodeQuery()).then((data) => this.destructureLocationData(data));
  }

  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates)).then((res) => res.json());

      if (!response) throw new Error('Weather data not found');
      
      const currentWeather: Weather = this.parseCurrentWeather(response.list[0]);

      const forecastInfo: Weather[] = this.buildForecastArray(currentWeather, response.list);
      return forecastInfo;
    }

    catch (error: any) {
      return error;
    }
  }
  
  private parseCurrentWeather(response: any) {

    const weatherCurrent = new Weather(
      this.cityName,
      new Date().toDateString(),
      response.main.temp,
      response.wind.speed,
      response.main.humidity,
      response.weather[0].icon,
      response.weather[0].description ||  response.weather[0].main
    );

    return weatherCurrent;
  }

  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const weatherForecast: Weather[] = [currentWeather];

    const filterWeatherData = weatherData.filter((data: any) => {
      return data.dt_txt.includes('12:00:00');
    });

    for (const day of filterWeatherData) {
      let date = new Date(day.dt * 1000).toDateString();

      weatherForecast.push(
        new Weather(
          this.cityName,
          date,
          day.main.temp,
          day.wind.speed,
          day.main.humidity,
          day.weather[0].icon,
          day.weather[0].description ||  day.weather[0].main
        )
      );
    }
    return weatherForecast;
  }


  async getWeatherForCity(cityName: string) {
    try {
      this.cityName = cityName;
      const coordinates = await this.fetchAndDestructureLocationData();
      if (coordinates) {
        const weather = await this.fetchWeatherData(coordinates);

        return weather;
      }
      throw new Error('Weather data not found. Try again.');
    } catch (error) {
      return error;
    }

  }
}

export default new WeatherService();