import * as tarkovData from 'tarkovdata';

// Asking the name here
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const readline = require('readline');

// Create an interface for input and output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

// Importing the needed functions from other sources
import {getStationByLocaleName} from './hideout.js';
import { getAmmunitionDataByName, getAllCalibers } from './ammunition.js';
import {getMapByLocaleName, getAllMapLocaleNames} from './maps.js';


//loadAmmunitionData().then(data => console.log(data));
async function main() {
  try {
    console.log("Welcome to Tarkov database inspector!");
    const name = await askQuestion('What is your name? ');
    console.log(`Hello, ${name}!\n`);

    let exit = false;

    while (!exit) {
      const choice = await askQuestion(
        'Choose an option:\n' +
        'A) Look up ammunition calibers\n' +
        'B) Search hideout station by name\n' +
        'C) Load map data\n' +
        'E) Exit\n' +
        'Your choice: '
      );

      switch (choice.toUpperCase()) {
        case 'A':
          const caliberarray = await getAllCalibers();
          console.log('Available calibers:', caliberarray);

          const wantedAmmoName = await askQuestion('Which caliber do you want to search for? ');
          const allFoundAmmoByName = await getAmmunitionDataByName(wantedAmmoName);
          console.log(allFoundAmmoByName.length > 0 ? allFoundAmmoByName : 'No ammo found');
          break;

        case 'B':
          const stationName = await askQuestion('Enter the hideout station name: ');
          const stationInfo = await getStationByLocaleName(stationName);

          if (stationInfo){
            console.log('Station info:\n', stationInfo);
          } else{
            console.log('No station found!');
          }
          break;

        case 'C':
          const mapNames = await getAllMapLocaleNames();
          console.log('Available maps:', mapNames.join(', '));

          const localeInput = await askQuestion('Enter the map name: ');
          const mapInfo = await getMapByLocaleName(localeInput);

          if(mapInfo){
            console.log('Map info:\n', mapInfo);
          } else {
            console.log('No map found!');
          }
          break;

        case 'E':
          console.log('Exiting...');
          exit = true;
          break;

        default:
          console.log('Invalid choice.\n');
          break;
      }

      console.log(); // Add a blank line for spacing
    }

    // Close the readline interface when done
    rl.close();

  } catch (err) {
    console.error('An error occurred:', err);
    rl.close(); // Make sure to close on error too
  }
}

main ();