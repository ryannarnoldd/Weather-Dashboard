import fs from 'node:fs/promises';

class City {
  name: string;
  id: string;

  // For each city.
  constructor ( name: string, id: string)
  {
    this.name = name;
    this.id = id;
  }
}

// Create HistoryService class
// This keeps track of histroy.
class HistoryService {
  
  private async read() {
    return await fs.readFile('db/db.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  }

  // Writes to file
  private async write(cities: City[]) { 
    return await fs.writeFile('db/db.json', JSON.stringify(cities, null, '\t'));
  }

  // Retrieves cities.
  async getCities() {
      return await this.read().then((cities) => {
      let parsedCities: City[];
      
      // Parse cities
      try { parsedCities = [].concat(JSON.parse(cities)); } 
      catch (err) { parsedCities = []; }
      
      return parsedCities;
    });
  }
  
  // Adds a city
  async addCity(city: string) {
    if (!city) {
      throw new Error('Please enter a city name');
    }

    // Uses randomID to generate a random ID. It is a 10 digit number.
    const randomID = Math.random().toString().slice(2,11);
    const newCity: City = { name: city, id: randomID };

    return await this.getCities()
    // If the city is found, return the cities.
      .then((cities: any) => {
        if (cities.find((index: any) => index.name == city)) return cities;
        return [...cities, newCity];
      })
      .then((updatedCities : any) => (
        this.write(updatedCities)
      ))
      // Return the new city.
      .then(() => (
        newCity
      ));
  }
}

// Exports.
export default new HistoryService();