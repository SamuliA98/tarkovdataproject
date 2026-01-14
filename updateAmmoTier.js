//This will add a new stat into ammunition called "tier", which tells us how good the ammo is against armor in Escape From Tarkov.

import { promises as fs } from 'fs'; //For reading/writing the file
import path from 'path'; //Ensuring the path is correct

const filePath = path.resolve('./node_modules/tarkovdata/ammunition.json'); //including the directory route to filePath

//This loads ALL ammunition data
async function loadAmmunitionData(){
    const data = await fs.readFile(filePath, 'utf-8'); //reads the ammunition.json file completely
    return JSON.parse(data); //parses the data so it can be utilized
}

const ammunitionData = await loadAmmunitionData(); //Load all ammunition to a variable

//Gives ammo a tier based on armor damage
function getAmmunitionTier(){
    if (ammunitionData.armorDamage >= 37) return "high";
    if (ammunitionData.armorDamage >= 28) return "mid";
    return "low";
}

//Adding ammo tiers to ammunition data
async function addAmmunitionTier(){

    //Looping through all ammo and adding the tier stat
    for (const ammo of Object.values(ammunitionData)) {
        ammo.ballistics.tier = getAmmunitionTier(ammo.ballistics);
    }

    await fs.writeFile(filePath, JSON.stringify(ammunitionData, null, 2), "utf-8"); //Using the fs to write updates into the file, stringify converts ammunitionData to JSON string data

    console.log("Ammo tiers added");
}

addAmmunitionTier().catch(console.error);