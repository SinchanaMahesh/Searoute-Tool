
export interface Port {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export interface CruiseData {
  id: string;
  shipName: string;
  cruiseLine: string;
  duration: number;
  departureDate: string;
  departurePort: string;
  route: string;
  ports: Port[];
  priceFrom: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  savings?: number;
  isPopular?: boolean;
}

// Port coordinates database
const PORT_COORDINATES: { [key: string]: [number, number] } = {
  'Bergen': [5.3221, 60.3913],
  'Floro': [5.0333, 61.6000],
  'Maloy': [5.1167, 61.9333],
  'Turrvik': [5.5833, 62.0833],
  'Alesund': [6.1549, 62.4722],
  'Hjorundfjord': [6.3333, 62.1667],
  'Molde': [7.1597, 62.7378],
  'Kristiansund': [7.7278, 63.1097],
  'Trondheim': [10.3951, 63.4305],
  'Budapest': [19.0402, 47.4979],
  'Bratislava': [17.1077, 48.1486],
  'Vienna': [16.3738, 48.2082],
  'Durnstein': [15.5167, 48.3833],
  'Melk': [15.3333, 48.2333],
  'Linz': [14.2858, 48.3069],
  'Regensburg': [12.1016, 49.0134],
  'Nuremberg': [11.0767, 49.4521],
  'Amsterdam': [4.9041, 52.3676],
  'Port Canaveral': [-80.6077, 28.4072],
  'Lighthouse Point': [-80.0877, 26.2734],
  'Nassau': [-77.3554, 25.0343],
  'Castaway Cay': [-77.5389, 26.4619],
  'Tarragona': [1.2444, 41.1189],
  'Valencia': [-0.3763, 39.4699],
  'Livorno': [10.3167, 43.5500],
  'Rome/Civitavecchia': [11.7988, 42.0942],
  'Genoa': [8.9463, 44.4056],
  'Marseille': [5.3698, 43.2965],
  'Miami': [-80.1918, 25.7617],
  'Cozumel': [-86.9223, 20.5083],
  'Roatan': [-86.5392, 16.3021],
  'Costa Maya': [-87.7094, 18.7094],
  'Belize City': [-88.1975, 17.5045]
};

// Helper function to convert port names to Port objects
const createPorts = (portNames: string[]): Port[] => {
  return portNames.map(name => ({
    name,
    coordinates: PORT_COORDINATES[name] || [0, 0]
  }));
};

export const mockCruiseData: CruiseData[] = [
  {
    id: "495242c4-c3d5-f76e-176a-04437727942b",
    shipName: "MS Richard With",
    cruiseLine: "Hurtigruten",
    duration: 11,
    departureDate: "2025-05-28",
    departurePort: "Bergen",
    route: "Scandinavia & Fjords",
    ports: createPorts(["Bergen", "Floro", "Maloy", "Turrvik", "Alesund", "Hjorundfjord", "Molde", "Kristiansund", "Trondheim"]),
    priceFrom: 5345,
    rating: 4.2,
    reviewCount: 1250,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=800'
    ],
    amenities: ['Pool', 'Spa', 'Theater', 'Dining', 'Fitness Center'],
    isPopular: true
  },
  {
    id: "81518eb4-aebb-aed2-1189-276a4db9dca1",
    shipName: "AmaMora",
    cruiseLine: "AmaWaterways",
    duration: 16,
    departureDate: "2025-05-29",
    departurePort: "Budapest",
    route: "Europe-Tours & Cruises",
    ports: createPorts(["Budapest", "Bratislava", "Vienna", "Durnstein", "Melk", "Linz", "Regensburg", "Nuremberg", "Amsterdam"]),
    priceFrom: 8089,
    rating: 4.5,
    reviewCount: 890,
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
    ],
    amenities: ['Spa', 'Theater', 'Dining', 'Cultural Tours'],
    savings: 480
  },
  {
    id: "30146500-30d0-15f2-04de-97948467105b",
    shipName: "Disney Magic",
    cruiseLine: "Disney Cruise Line",
    duration: 5,
    departureDate: "2025-05-30",
    departurePort: "Port Canaveral",
    route: "Bahamas",
    ports: createPorts(["Port Canaveral", "Lighthouse Point", "Nassau", "Castaway Cay"]),
    priceFrom: 1911,
    rating: 4.7,
    reviewCount: 2150,
    images: [
      'https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
    ],
    amenities: ['Kids Club', 'Pool', 'Theater', 'Dining', 'Character Meet & Greet'],
    isPopular: true
  },
  {
    id: "a86a511f-4a64-7287-03d4-0b20b134254f",
    shipName: "MSC Splendida",
    cruiseLine: "MSC Cruises",
    duration: 7,
    departureDate: "2025-05-30",
    departurePort: "Tarragona",
    route: "Mediterranean-West",
    ports: createPorts(["Tarragona", "Valencia", "Livorno", "Rome/Civitavecchia", "Genoa", "Marseille"]),
    priceFrom: 609,
    rating: 4.1,
    reviewCount: 1680,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=800'
    ],
    amenities: ['Casino', 'Pool', 'Spa', 'Theater', 'Dining'],
    savings: 240
  },
  {
    id: "caribbean-wonder-2025",
    shipName: "Caribbean Wonder",
    cruiseLine: "Royal Caribbean",
    duration: 7,
    departureDate: "2025-06-15",
    departurePort: "Miami",
    route: "Caribbean",
    ports: createPorts(["Miami", "Cozumel", "Roatan", "Costa Maya", "Belize City"]),
    priceFrom: 899,
    rating: 4.3,
    reviewCount: 3200,
    images: [
      'https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
    ],
    amenities: ['Kids Club', 'Pool', 'Casino', 'Theater', 'Dining'],
    isPopular: true,
    savings: 200
  }
];
