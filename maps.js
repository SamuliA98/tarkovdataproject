import { promises as fs } from 'fs';
import path from 'path';

export async function loadMapData(){
    const filePath = path.resolve('./node_modules/tarkovdata/maps.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}

//This function rounds up all map names to an array.
export async function getAllMapLocaleNames() {
  const mapData = await loadMapData();
  const names = [];

  for (const key in mapData) {
    const locale = mapData[key].locale;
    if (locale?.en) {
      names.push(locale.en);
    }
  }

  return names;
}

//This function returns all information from the chosen map by name.
export async function getMapByLocaleName(localeName) {
  const mapData = await loadMapData();

  for (const key in mapData) {
    const map = mapData[key];
    const locale = map.locale;

    if (locale?.en?.toLowerCase() === localeName.toLowerCase() ||
        locale?.ru?.toLowerCase() === localeName.toLowerCase()) {
      return map;
    }
  }
  return null;
}