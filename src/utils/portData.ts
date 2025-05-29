
import { Port } from './maritimeRouteCalculator';

export const portDatabase: Port[] = [
  {
    id: "port_miami",
    name: "Miami",
    coordinates: [-80.1918, 25.7617],
    country: "United States",
    region: "Caribbean",
    type: "major_terminal",
    cruiseLines: ["Royal Caribbean", "Norwegian", "MSC"],
    facilities: ["duty_free", "parking", "wifi", "restaurants"],
    capacity: 5000,
    description: "Major cruise port serving Caribbean routes",
    attractions: ["South Beach", "Art Deco District", "Everglades National Park", "Wynwood Walls"],
    photos: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    weather: { temp: 82, condition: "sunny" },
    rating: 4.5,
    reviews: 1250
  },
  {
    id: "port_nassau",
    name: "Nassau",
    coordinates: [-77.3554, 25.0343],
    country: "Bahamas",
    region: "Caribbean",
    type: "major_terminal",
    cruiseLines: ["Royal Caribbean", "Norwegian", "Celebrity"],
    facilities: ["duty_free", "shopping", "beaches", "casinos"],
    capacity: 3000,
    description: "Paradise island destination with pristine beaches",
    attractions: ["Paradise Island", "Atlantis Resort", "Cable Beach", "Fort Charlotte"],
    photos: ["/placeholder.svg", "/placeholder.svg"],
    weather: { temp: 78, condition: "partly_cloudy" },
    rating: 4.2,
    reviews: 890
  },
  {
    id: "port_st_thomas",
    name: "St. Thomas",
    coordinates: [-64.9306, 18.3381],
    country: "US Virgin Islands",
    region: "Caribbean",
    type: "major_terminal",
    cruiseLines: ["Royal Caribbean", "Celebrity", "Princess"],
    facilities: ["duty_free", "shopping", "beaches", "snorkeling"],
    capacity: 2500,
    description: "Tropical paradise with world-class beaches",
    attractions: ["Magens Bay", "Coral World", "Paradise Point", "Blackbeard's Castle"],
    photos: ["/placeholder.svg", "/placeholder.svg"],
    weather: { temp: 85, condition: "tropical" },
    rating: 4.7,
    reviews: 1100
  },
  {
    id: "port_barbados",
    name: "Barbados",
    coordinates: [-59.5432, 13.1939],
    country: "Barbados",
    region: "Caribbean",
    type: "secondary",
    cruiseLines: ["MSC", "Celebrity", "Princess"],
    facilities: ["shopping", "beaches", "cultural_sites", "rum_tours"],
    capacity: 1500,
    description: "Rich cultural heritage and beautiful coastlines",
    attractions: ["Harrison's Cave", "Animal Flower Cave", "Rum Distilleries", "Crane Beach"],
    photos: ["/placeholder.svg", "/placeholder.svg"],
    weather: { temp: 83, condition: "sunny" },
    rating: 4.4,
    reviews: 650
  }
];

export const getPortById = (id: string): Port | undefined => {
  return portDatabase.find(port => port.id === id);
};

export const getPortByName = (name: string): Port | undefined => {
  return portDatabase.find(port => port.name.toLowerCase() === name.toLowerCase());
};

export const searchPorts = (query: string): Port[] => {
  const lowerQuery = query.toLowerCase();
  return portDatabase.filter(port => 
    port.name.toLowerCase().includes(lowerQuery) ||
    port.country.toLowerCase().includes(lowerQuery) ||
    port.region.toLowerCase().includes(lowerQuery)
  );
};
