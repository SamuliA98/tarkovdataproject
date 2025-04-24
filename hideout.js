import { promises as fs } from 'fs';
import path from 'path';
    

// This loads the needed HIDEOUT data
export async function loadHideoutData() {
  const filePath = path.resolve('./node_modules/tarkovdata/hideout.json');
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data); // Parse the JSON content
}
    
// Function to get stations from the hideout data
export async function getHideoutStations() {
  const hideoutData = await loadHideoutData();
  return hideoutData.stations;
}
    
// Function to get a station by its ID
export async function getHideoutStationById(id) {
  const hideoutData = await loadHideoutData();
  return hideoutData.stations.find(station => String(station.id) === String(id));
}

export async function getStationByLocaleName(localeName) {
  const hideoutData = await loadHideoutData();
  const station = hideoutData.stations.find(
    s =>
      s.locales.en.toLowerCase() === localeName.toLowerCase() ||
      s.locales.ru.toLowerCase() === localeName.toLowerCase()
  );
  return station || null;
}