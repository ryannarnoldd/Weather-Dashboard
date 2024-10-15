import fs from 'node:fs/promises';

class City {
  name: string;
  id: string;

  constructor ( name: string, id: string)
  {
    this.name = name;
    this.id = id;
  }
}

class HistoryService {
  
  private async read() {
    return await fs.readFile('db/db.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  }

  private async write(cities: City[]) { 
    return await fs.writeFile('db/db.json', JSON.stringify(cities, null, '\t'));
  }

  async getCities() {
      return await this.read().then((cities) => {
      let parsedCities: City[];
      
      try { parsedCities = [].concat(JSON.parse(cities)); } 
      catch (err) { parsedCities = []; }
      
      return parsedCities;
    });
  }
  
  async addCity(city: string) {
    if (!city) {
      throw new Error('Please enter a city name');
    }


    const randomID = Math.random().toString().slice(2,11);
    const newCity: City = { name: city, id: randomID };

    return await this.getCities()
      .then((cities: any) => {
        if (cities.find((index: any) => index.name == city)) return cities;
        return [...cities, newCity];
      })
      .then((updatedCities : any) => (
        this.write(updatedCities)
      ))
      .then(() => (
        newCity
      ));
  }
}

export default new HistoryService();