import { equatorialToHorizontal } from './coordinates';
import { ObserverLocation } from './types';

export interface ConstellationVisibility {
  name: string;
  representativeStar: string;
  altitude: number;
  azimuth: number;
  visible: boolean;
}

/**
 * Bright representative stars for the 88 IAU constellations.
 * RA is in hours, Dec in degrees.
 *
 * This is used as a practical sky-visibility indicator:
 * if the representative bright star is above the horizon,
 * the constellation is considered potentially visible.
 */
const REPRESENTATIVE_STARS: Array<{
  constellation: string;
  star: string;
  ra: number;
  dec: number;
}> = [
  { constellation: 'Andromeda', star: 'Alpheratz', ra: 0.14, dec: 29.09 },
  { constellation: 'Antlia', star: 'Alpha Antliae', ra: 10.45, dec: -31.07 },
  { constellation: 'Apus', star: 'Alpha Apodis', ra: 14.80, dec: -79.04 },
  { constellation: 'Aquarius', star: 'Sadalmelik', ra: 22.10, dec: -0.32 },
  { constellation: 'Aquila', star: 'Altair', ra: 19.85, dec: 8.87 },
  { constellation: 'Ara', star: 'Beta Arae', ra: 17.42, dec: -55.53 },
  { constellation: 'Aries', star: 'Hamal', ra: 2.12, dec: 23.46 },
  { constellation: 'Auriga', star: 'Capella', ra: 5.28, dec: 46.00 },
  { constellation: 'Bootes', star: 'Arcturus', ra: 14.26, dec: 19.18 },
  { constellation: 'Caelum', star: 'Alpha Caeli', ra: 4.70, dec: -41.86 },
  { constellation: 'Camelopardalis', star: 'Beta Camelopardalis', ra: 5.06, dec: 60.44 },
  { constellation: 'Cancer', star: 'Acubens', ra: 8.97, dec: 11.86 },
  { constellation: 'Canes Venatici', star: 'Cor Caroli', ra: 12.93, dec: 38.32 },
  { constellation: 'Canis Major', star: 'Sirius', ra: 6.75, dec: -16.72 },
  { constellation: 'Canis Minor', star: 'Procyon', ra: 7.66, dec: 5.22 },
  { constellation: 'Capricornus', star: 'Deneb Algedi', ra: 21.78, dec: -16.13 },
  { constellation: 'Carina', star: 'Canopus', ra: 6.40, dec: -52.70 },
  { constellation: 'Cassiopeia', star: 'Schedar', ra: 0.68, dec: 56.54 },
  { constellation: 'Centaurus', star: 'Alpha Centauri', ra: 14.66, dec: -60.84 },
  { constellation: 'Cepheus', star: 'Alderamin', ra: 21.31, dec: 62.59 },
  { constellation: 'Cetus', star: 'Diphda', ra: 0.73, dec: -17.99 },
  { constellation: 'Chamaeleon', star: 'Alpha Chamaeleontis', ra: 8.31, dec: -76.92 },
  { constellation: 'Circinus', star: 'Alpha Circini', ra: 14.71, dec: -65.09 },
  { constellation: 'Columba', star: 'Alpha Columbae', ra: 5.66, dec: -34.07 },
  { constellation: 'Coma Berenices', star: 'Beta Comae Berenices', ra: 13.20, dec: 27.88 },
  { constellation: 'Corona Australis', star: 'Alpha Coronae Australis', ra: 19.16, dec: -37.90 },
  { constellation: 'Corona Borealis', star: 'Alphecca', ra: 15.58, dec: 26.71 },
  { constellation: 'Corvus', star: 'Gienah', ra: 12.26, dec: -17.54 },
  { constellation: 'Crater', star: 'Delta Crateris', ra: 11.32, dec: -14.78 },
  { constellation: 'Crux', star: 'Acrux', ra: 12.44, dec: -63.10 },
  { constellation: 'Cygnus', star: 'Deneb', ra: 20.69, dec: 45.28 },
  { constellation: 'Delphinus', star: 'Rotanev', ra: 20.63, dec: 14.60 },
  { constellation: 'Dorado', star: 'Alpha Doradus', ra: 4.57, dec: -55.05 },
  { constellation: 'Draco', star: 'Eltanin', ra: 17.94, dec: 51.49 },
  { constellation: 'Equuleus', star: 'Kitalpha', ra: 21.26, dec: 5.25 },
  { constellation: 'Eridanus', star: 'Achernar', ra: 1.63, dec: -57.24 },
  { constellation: 'Fornax', star: 'Alpha Fornacis', ra: 3.20, dec: -28.99 },
  { constellation: 'Gemini', star: 'Pollux', ra: 7.76, dec: 28.03 },
  { constellation: 'Grus', star: 'Al Dhanab', ra: 22.71, dec: -37.02 },
  { constellation: 'Hercules', star: 'Kornephoros', ra: 16.50, dec: 21.49 },
  { constellation: 'Horologium', star: 'Alpha Horologii', ra: 4.23, dec: -42.29 },
  { constellation: 'Hydra', star: 'Alphard', ra: 9.46, dec: -8.66 },
  { constellation: 'Hydrus', star: 'Beta Hydri', ra: 0.43, dec: -77.25 },
  { constellation: 'Indus', star: 'Alpha Indi', ra: 20.63, dec: -47.29 },
  { constellation: 'Lacerta', star: 'Alpha Lacertae', ra: 22.52, dec: 50.28 },
  { constellation: 'Leo', star: 'Regulus', ra: 10.14, dec: 11.97 },
  { constellation: 'Leo Minor', star: '46 Leonis Minoris', ra: 10.89, dec: 34.21 },
  { constellation: 'Lepus', star: 'Arneb', ra: 5.55, dec: -17.82 },
  { constellation: 'Libra', star: 'Zubenelgenubi', ra: 14.85, dec: -16.04 },
  { constellation: 'Lupus', star: 'Alpha Lupi', ra: 14.70, dec: -47.39 },
  { constellation: 'Lynx', star: 'Alpha Lyncis', ra: 9.35, dec: 34.39 },
  { constellation: 'Lyra', star: 'Vega', ra: 18.62, dec: 38.78 },
  { constellation: 'Mensa', star: 'Alpha Mensae', ra: 5.66, dec: -74.75 },
  { constellation: 'Microscopium', star: 'Gamma Microscopii', ra: 21.02, dec: -32.53 },
  { constellation: 'Monoceros', star: 'Alpha Monocerotis', ra: 7.69, dec: -9.55 },
  { constellation: 'Musca', star: 'Alpha Muscae', ra: 12.62, dec: -69.14 },
  { constellation: 'Norma', star: 'Gamma Normae', ra: 16.33, dec: -50.15 },
  { constellation: 'Octans', star: 'Nu Octantis', ra: 21.95, dec: -77.02 },
  { constellation: 'Ophiuchus', star: 'Rasalhague', ra: 17.58, dec: 12.56 },
  { constellation: 'Orion', star: 'Betelgeuse', ra: 5.92, dec: 7.41 },
  { constellation: 'Pavo', star: 'Peacock', ra: 20.43, dec: -56.74 },
  { constellation: 'Pegasus', star: 'Markab', ra: 23.08, dec: 15.21 },
  { constellation: 'Perseus', star: 'Mirfak', ra: 3.41, dec: 49.86 },
  { constellation: 'Phoenix', star: 'Ankaa', ra: 0.44, dec: -42.31 },
  { constellation: 'Pictor', star: 'Alpha Pictoris', ra: 6.80, dec: -61.94 },
  { constellation: 'Pisces', star: 'Alpherg', ra: 1.52, dec: 2.76 },
  { constellation: 'Piscis Austrinus', star: 'Fomalhaut', ra: 22.96, dec: -29.62 },
  { constellation: 'Puppis', star: 'Zeta Puppis', ra: 8.06, dec: -40.00 },
  { constellation: 'Pyxis', star: 'Alpha Pyxidis', ra: 8.73, dec: -33.19 },
  { constellation: 'Reticulum', star: 'Alpha Reticuli', ra: 4.24, dec: -62.47 },
  { constellation: 'Sagitta', star: 'Gamma Sagittae', ra: 19.98, dec: 19.49 },
  { constellation: 'Sagittarius', star: 'Kaus Australis', ra: 18.40, dec: -34.38 },
  { constellation: 'Scorpius', star: 'Antares', ra: 16.49, dec: -26.43 },
  { constellation: 'Sculptor', star: 'Alpha Sculptoris', ra: 0.98, dec: -29.36 },
  { constellation: 'Scutum', star: 'Alpha Scuti', ra: 18.59, dec: -8.24 },
  { constellation: 'Serpens', star: 'Unukalhai', ra: 15.74, dec: 6.43 },
  { constellation: 'Sextans', star: 'Alpha Sextantis', ra: 10.13, dec: -0.37 },
  { constellation: 'Taurus', star: 'Aldebaran', ra: 4.60, dec: 16.51 },
  { constellation: 'Telescopium', star: 'Alpha Telescopii', ra: 18.45, dec: -45.97 },
  { constellation: 'Triangulum', star: 'Beta Trianguli', ra: 2.16, dec: 34.99 },
  { constellation: 'Triangulum Australe', star: 'Atria', ra: 16.81, dec: -69.03 },
  { constellation: 'Tucana', star: 'Alpha Tucanae', ra: 22.31, dec: -60.26 },
  { constellation: 'Ursa Major', star: 'Alioth', ra: 12.90, dec: 55.96 },
  { constellation: 'Ursa Minor', star: 'Polaris', ra: 2.53, dec: 89.26 },
  { constellation: 'Vela', star: 'Gamma Velorum', ra: 8.16, dec: -47.34 },
  { constellation: 'Virgo', star: 'Spica', ra: 13.42, dec: -11.16 },
  { constellation: 'Volans', star: 'Beta Volantis', ra: 8.43, dec: -66.14 },
  { constellation: 'Vulpecula', star: 'Alpha Vulpeculae', ra: 19.48, dec: 24.66 },
];

export function getVisibleConstellations(
  location: ObserverLocation,
  date: Date = new Date(),
  minAltitude = 5
): ConstellationVisibility[] {
  return REPRESENTATIVE_STARS
    .map((star) => {
      const horizontal = equatorialToHorizontal(
        star.ra * 15,
        star.dec,
        location,
        date
      );

      return {
        name: star.constellation,
        representativeStar: star.star,
        altitude: horizontal.altitude,
        azimuth: horizontal.azimuth,
        visible: horizontal.altitude >= minAltitude,
      };
    })
    .filter((item) => item.visible)
    .sort((a, b) => b.altitude - a.altitude);
}

export function getAllConstellationVisibility(
  location: ObserverLocation,
  date: Date = new Date(),
  minAltitude = 5
): ConstellationVisibility[] {
  return REPRESENTATIVE_STARS
    .map((star) => {
      const horizontal = equatorialToHorizontal(
        star.ra * 15,
        star.dec,
        location,
        date
      );

      return {
        name: star.constellation,
        representativeStar: star.star,
        altitude: horizontal.altitude,
        azimuth: horizontal.azimuth,
        visible: horizontal.altitude >= minAltitude,
      };
    })
    .sort((a, b) => b.altitude - a.altitude);
}
