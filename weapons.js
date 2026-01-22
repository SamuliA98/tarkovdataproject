import { promises as fs } from 'fs';
import path from 'path';

async function loadItemPresetData(){
    const filePath = path.resolve('./node_modules/tarkovdata/item_presets.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data); //parses the data so it can be utilized
}

async function loadItemData(){
    const filePath = path.resolve('./node_modules/tarkovdata/items.en.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}

export async function getAllDefaultWeapons(){
    const defaultWeaponData = await loadItemPresetData();
    const defaultWeapons = new Set();

    for (const key in defaultWeaponData){
        const weaponName = defaultWeaponData[key].name;
        const weaponDefault = defaultWeaponData[key].default;

        if (weaponDefault){
            defaultWeapons.add(weaponName);
        }
    }

    return Array.from(defaultWeapons);
}



//Finds a weapon preset by the name of the weapon and returns the weapon and its parts' information
export async function getWeaponPresetDetailsByName(presetName) {
  const presets = await loadItemPresetData();
  const items = await loadItemData();
  
  //Find the preset by looping through weapon presets and return the weapon with wanted preset name.
  let preset = null;
  for (const p of Object.values(presets)) {
    const presetNameFromFile = p.name.toLowerCase();
    const userInput = presetName.toLowerCase();

  if (presetNameFromFile === userInput) { //Comparing the found name for user input
    preset = p;
    break;
  }
}

  if (!preset) return null; //If no match was found between input and data return nothing

  
  const baseWeapon = items[preset.baseId]; //Resolve base weapon

  //Resolve parts
  const resolvedParts = [];
  
  //Loops through the found weapon's parts and adds them to the array
  for (const part of preset.parts) { 
    const item = items[part.id];

  resolvedParts.push({
    id: part.id,
    name: item && item.name ? item.name : "Unknown item",
    type: item && item.type ? item.type : "Unknown",
    quantity: part.quantity,
    properties: item && item.properties ? item.properties : {}
  });
}

  return {
    presetName: preset.name,
    baseWeapon: {
      id: preset.baseId,
      name: baseWeapon?.name,
      type: baseWeapon?.type,
      properties: baseWeapon?.properties
    },
    parts: resolvedParts
  };
}

