/**
 * Astronomy constants and planet physical catalog.
 */

export const ASTRONOMICAL_UNIT_KM = 149597870.7;
export const EARTH_RADIUS_KM = 6378.137;
export const J2000_EPOCH = 2451545.0; // 2000 January 1.5 TT

export interface PlanetCatalogEntry {
  name: string;
  color: string;
  image: string;
  size: number;
  orbitRadius: number; // visual orbital scale for solar system display
  realDiameterKm: number;
  orbitalPeriodDays: number;
  moonsCount: number;
  type: 'terrestrial' | 'gas-giant' | 'ice-giant';
  hasFeature?: 'rings' | 'great-red-spot';
  facts: string[];
  info: string;
  // Visual magnitude base constants (H / V(1,0))
  absoluteMagnitude: number;
}

export const PLANET_CATALOG: Record<string, PlanetCatalogEntry> = {
  Mercury: {
    name: 'Mercury',
    color: '#FFA500',
    image: 'https://images.unsplash.com/photo-1603977120304-ed25d9fc9149?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXJjdXJ5JTIwcGxhbmV0JTIwbmFzYSUyMHNwYWNlfGVufDF8fHx8MTc1ODgwMjcxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    size: 8,
    orbitRadius: 80,
    realDiameterKm: 4879,
    orbitalPeriodDays: 87.97,
    moonsCount: 0,
    type: 'terrestrial',
    absoluteMagnitude: -0.42,
    facts: [
      'Smallest planet in our solar system',
      'No atmosphere to speak of',
      'Temperature ranges from -170°C to 427°C'
    ],
    info: 'Closest planet to the Sun. Surface temperatures range from -173°C to 427°C.'
  },
  Venus: {
    name: 'Venus',
    color: '#FFC649',
    image: 'https://images.unsplash.com/photo-1639393455114-84df73f758cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZW51cyUyMHBsYW5ldCUyMHN1cmZhY2UlMjBuYXNhfGVufDF8fHx8MTc1ODgwMjcxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    size: 10,
    orbitRadius: 120,
    realDiameterKm: 12104,
    orbitalPeriodDays: 224.7,
    moonsCount: 0,
    type: 'terrestrial',
    absoluteMagnitude: -4.40,
    facts: [
      'Hottest planet in solar system',
      'Thick toxic atmosphere of carbon dioxide',
      'Rotates backwards (retrograde rotation)'
    ],
    info: 'Hottest planet at 462°C due to runaway greenhouse effect. Thick CO₂ atmosphere.'
  },
  Earth: {
    name: 'Earth',
    color: '#6B93D6',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlYXJ0aCUyMHBsYW5ldCUyMGZyb20lMjBzcGFjZXxlbnwxfHx8fDE3NTkxNDE0MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    size: 12,
    orbitRadius: 150,
    realDiameterKm: 12756,
    orbitalPeriodDays: 365.256,
    moonsCount: 1,
    type: 'terrestrial',
    absoluteMagnitude: -3.99,
    facts: [
      'Only known planet harboring life',
      '71% covered by liquid oceans',
      'One natural satellite: the Moon'
    ],
    info: 'Our blue marble. 71% water surface, protective magnetosphere, one natural satellite.'
  },
  Mars: {
    name: 'Mars',
    color: '#CD5C5C',
    image: 'https://images.unsplash.com/photo-1758269636418-9794f2f4f598?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJzJTIwcGxhbmV0JTIwcmVkJTIwc3VyZmFjZSUyMG5hc2F8ZW58MXx8fHwxNzU4ODAzNzAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    size: 10,
    orbitRadius: 190,
    realDiameterKm: 6792,
    orbitalPeriodDays: 686.98,
    moonsCount: 2,
    type: 'terrestrial',
    absoluteMagnitude: -1.52,
    facts: [
      'The Red Planet due to iron oxide soil',
      'Home to largest volcano in solar system (Olympus Mons)',
      'Two small moons: Phobos & Deimos'
    ],
    info: 'The Red Planet. Polar ice caps, largest volcano (Olympus Mons), canyon systems.'
  },
  Jupiter: {
    name: 'Jupiter',
    color: '#D8CA9D',
    image: 'https://images.unsplash.com/photo-1708257106484-1ae7f3c417c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqdXBpdGVyJTIwcGxhbmV0JTIwZ3JlYXQlMjByZWQlMjBzcG90fGVufDF8fHx8MTc1ODgwMjcxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    size: 20,
    orbitRadius: 280,
    realDiameterKm: 142984,
    orbitalPeriodDays: 4332.59,
    moonsCount: 95,
    type: 'gas-giant',
    hasFeature: 'great-red-spot',
    absoluteMagnitude: -9.40,
    facts: [
      'Largest planet in the solar system',
      'Great Red Spot storm bigger than Earth',
      'Has 95+ known moons including Ganymede'
    ],
    info: 'Gas giant with Great Red Spot storm. Protects inner planets from asteroids.'
  },
  Saturn: {
    name: 'Saturn',
    color: '#FAD5A5',
    image: 'https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXR1cm4lMjBwbGFuZXQlMjByaW5ncyUyMG5hc2F8ZW58MXx8fHwxNzU4ODAyNzEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    size: 18,
    orbitRadius: 340,
    realDiameterKm: 120536,
    orbitalPeriodDays: 10759.22,
    moonsCount: 146,
    type: 'gas-giant',
    hasFeature: 'rings',
    absoluteMagnitude: -8.88,
    facts: [
      'Spectacular planetary ring system',
      'Less dense than water (it would float!)',
      'Has 146+ known moons, led by Titan'
    ],
    info: 'Ring system made of ice and rock particles. Less dense than water.'
  },
  Uranus: {
    name: 'Uranus',
    color: '#4FD0E7',
    image: 'https://images.unsplash.com/photo-1639548206689-1a5238f8d5bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmFudXMlMjBwbGFuZXQlMjBibHVlJTIwbmFzYXxlbnwxfHx8fDE3NTg4MDI3MTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    size: 14,
    orbitRadius: 400,
    realDiameterKm: 51118,
    orbitalPeriodDays: 30685.4,
    moonsCount: 28,
    type: 'ice-giant',
    absoluteMagnitude: -7.19,
    facts: [
      'Ice giant tilted 98° on its side',
      'Rotates east to west with extreme seasons',
      'Faint ring system discovered in 1977'
    ],
    info: 'Ice giant tilted 98°. Methane atmosphere gives blue-green color. Faint rings.'
  },
  Neptune: {
    name: 'Neptune',
    color: '#4B70DD',
    image: 'https://images.unsplash.com/photo-1614314107768-6018061b5b72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhuZXB0dW5lJTIwcGxhbmV0JTIwYmx1ZSUyMGljZSUyMGdpYW50fGVufDF8fHx8MTc1OTE0MTQ0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    size: 14,
    orbitRadius: 460,
    realDiameterKm: 49528,
    orbitalPeriodDays: 60189.0,
    moonsCount: 16,
    type: 'ice-giant',
    absoluteMagnitude: -6.87,
    facts: [
      'Windiest planet with supersonic winds up to 2,100 km/h',
      'Furthest known major planet from the Sun',
      'Deep blue hue from methane in upper atmosphere'
    ],
    info: 'Windiest planet with speeds up to 2,100 km/h. Deep blue from methane.'
  }
};
