import { promises as fs } from 'fs';
import path from 'path';

//This loads ALL ammunition data
async function loadAmmunitionData(){
    const filePath = path.resolve('./node_modules/tarkovdata/ammunition.json'); //including the directory route to filePath
    const data = await fs.readFile(filePath, 'utf-8'); //reads the ammunition.json file completely
    return JSON.parse(data); //parses the data so it can be utilized
}

export async function getAllCalibers(){
    const ammunitionData = await loadAmmunitionData();
    const calibers = new Set();  // Use a Set to store unique calibers

    for (const key in ammunitionData){
        const caliberName = ammunitionData[key].name;
        if (caliberName) {
            const caliberPrefix = extractCaliberPrefix(caliberName);
            if(caliberPrefix){
                calibers.add(caliberPrefix);
            }
        }
    }

    return Array.from(calibers);
}

function extractCaliberPrefix(name){
    const match = name.match(/^(\d+(\.\d+)?(?:x|\s?\/|\s?mm)\d+(\.\d+)?)/) || 
                name.match(/^(\d+(\.\d+)?mm)/) ||  // Match calibers like "40mm"
                name.match(/^(\.\d+)\s?\w+/); // Match calibers like ".45 acp"
    return match ? match[1] : null;  // Return the matched caliber or null

}
export async function getAmmunitionDataByName(name){

    if(!name) {
        throw new Error ("Provide query parameter");
    }

    const ammunitionData = await loadAmmunitionData();
    const filteredAmmunition = [];

    for (let key in ammunitionData){
        const ammo = ammunitionData[key];
        if (ammo.name && ammo.name.includes(name)){
            filteredAmmunition.push(ammo);
        }
    }

    return filteredAmmunition;
}

