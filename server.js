import fs from "fs";
import assert from "assert";
import { parse } from "csv-parse";

const keplerData = [];
const habitablePlanets = [];

// read data from internal source and save it into keplerData
fs.createReadStream("./kepler_data.csv")
  // pipe data and parse it into array of javascript object
  .pipe(
    parse({
      comment: "#",
      columns: true,
    })
  )
  // save data into avaiable variable
  .on("data", (data) => {
    if (isHabitablePlanet(data)) {
      habitablePlanets.push(data);
    }
    keplerData.push(data);
  })
  .on("error", (error) => console.log(error))
  // display data needed
  .on("end", () => {
    console.log(
      `There are ${habitablePlanets.length} habitable planets of ${keplerData.length} planets avaiable based on Kepler's data.`
    );
    habitablePlanets.map((planet, index) =>
      console.log(`${index + 1}. ${planet["kepler_name"]}`)
    );
  });

// filter data
const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};
