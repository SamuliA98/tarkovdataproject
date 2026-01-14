import { promises as fs } from 'fs';
import path from 'path';
    

// This loads the needed HIDEOUT data
export async function loadHideoutData() {
  const filePath = path.resolve('./node_modules/tarkovdata/hideout.json');
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data); // Parse the JSON content
}
 
// This function collects all hideout station names to an array and returns them
export async function getAllHideoutStations(){
  const hideoutData = await loadHideoutData();
  const stationData = hideoutData.stations;
  const stations = [];

  for (const key in stationData){
    const locale = stationData[key].locales;
    if (locale?.en){
      stations.push(locale.en);
    }
  }

  return stations;
}
    
// Function to get a station by its ID
export async function getHideoutStationById(id) {
  const hideoutData = await loadHideoutData();
  return hideoutData.stations.find(station => String(station.id) === String(id));
}

// This function returns the data of the wanted station
export async function getStationByLocaleName(localeName) {
  const hideoutData = await loadHideoutData();
  const station = hideoutData.stations.find(
    s =>
      s.locales.en.toLowerCase() === localeName.toLowerCase() ||
      s.locales.ru.toLowerCase() === localeName.toLowerCase()
  );
  return station || null;
}