
export interface Port {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  insights?: {
    weather: { temp: number; condition: string; };
    attractions: string[];
    facilities: string[];
    shoreExcursions: string[];
    trivia: string;
    photos: string[];
  };
}

export interface CruiseData {
  id: string;
  shipName: string;
  cruiseLine: string;
  duration: number;
  departureDate: string;
  sailingDates: string[]; // Multiple available dates
  departurePort: string;
  route: string;
  ports: Port[];
  polylineCoordinates: [number, number][]; // Complete route polyline
  priceFrom: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  savings?: number;
  isPopular?: boolean;
}

// Port coordinates database with enhanced location insights
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

// Enhanced location insights database
const LOCATION_INSIGHTS: { [key: string]: any } = {
  'Miami': {
    weather: { temp: 82, condition: 'Sunny' },
    attractions: ['South Beach', 'Art Deco District', 'Wynwood Walls', 'Vizcaya Museum', 'Everglades National Park'],
    facilities: ['Duty Free Shopping', 'Premium Lounges', 'Valet Parking', 'Fast Check-in'],
    shoreExcursions: ['City Tour', 'Everglades Adventure', 'Beach Day', 'Shopping Tour'],
    trivia: 'Miami is known as the "Magic City" due to its rapid growth in the early 20th century.',
    photos: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800']
  },
  'Nassau': {
    weather: { temp: 78, condition: 'Partly Cloudy' },
    attractions: ['Paradise Island', 'Atlantis Resort', 'Cable Beach', 'Fort Charlotte', 'Queen\'s Staircase'],
    facilities: ['Duty Free Shopping', 'Beach Access', 'Water Sports', 'Casinos'],
    shoreExcursions: ['Atlantis Day Pass', 'Swimming with Dolphins', 'Island Tour', 'Beach Break'],
    trivia: 'Nassau was once a haven for pirates in the 18th century and is named after William III of Orange-Nassau.',
    photos: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800']
  },
  'Cozumel': {
    weather: { temp: 84, condition: 'Tropical' },
    attractions: ['Chankanaab National Park', 'San Gervasio Ruins', 'Punta Sur Eco Park', 'El Cedral'],
    facilities: ['Diving Centers', 'Beach Clubs', 'Shopping Plaza', 'Restaurants'],
    shoreExcursions: ['Snorkeling Adventure', 'Mayan Ruins Tour', 'Beach Day', 'Tequila Tasting'],
    trivia: 'Cozumel is world-renowned for its spectacular coral reefs and is a top diving destination.',
    photos: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800']
  }
};

// Helper function to create ports with insights
const createPorts = (portNames: string[]): Port[] => {
  return portNames.map(name => ({
    name,
    coordinates: PORT_COORDINATES[name] || [0, 0],
    insights: LOCATION_INSIGHTS[name]
  }));
};

// Helper function to generate polyline coordinates
const generatePolyline = (ports: Port[]): [number, number][] => {
  const polyline: [number, number][] = [];
  
  for (let i = 0; i < ports.length - 1; i++) {
    const start = ports[i].coordinates;
    const end = ports[i + 1].coordinates;
    
    // Add start point
    polyline.push(start);
    
    // Add intermediate points for smooth curve
    const steps = 5;
    for (let j = 1; j < steps; j++) {
      const t = j / steps;
      const lat = start[1] + (end[1] - start[1]) * t;
      const lng = start[0] + (end[0] - start[0]) * t;
      
      // Add slight curve for sea routes
      const curveOffset = Math.sin(t * Math.PI) * 0.5;
      polyline.push([lng + curveOffset, lat + curveOffset * 0.2]);
    }
  }
  
  // Add final port
  if (ports.length > 0) {
    polyline.push(ports[ports.length - 1].coordinates);
  }
  
  return polyline;
};

export const mockCruiseData: CruiseData[] = [
  {
    id: "495242c4-c3d5-f76e-176a-04437727942b",
    shipName: "MS Richard With",
    cruiseLine: "Hurtigruten",
    duration: 11,
    departureDate: "2025-05-28",
    sailingDates: ["2025-05-28", "2025-06-15", "2025-07-02", "2025-07-20", "2025-08-05"],
    departurePort: "Bergen",
    route: "Scandinavia & Fjords",
    ports: createPorts(["Bergen", "Floro", "Maloy", "Turrvik", "Alesund", "Hjorundfjord", "Molde", "Kristiansund", "Trondheim"]),
    polylineCoordinates: generatePolyline(createPorts(["Bergen", "Floro", "Maloy", "Turrvik", "Alesund", "Hjorundfjord", "Molde", "Kristiansund", "Trondheim"])),
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
    sailingDates: ["2025-05-29", "2025-06-12", "2025-06-26", "2025-07-10"],
    departurePort: "Budapest",
    route: "Europe-Tours & Cruises",
    ports: createPorts(["Budapest", "Bratislava", "Vienna", "Durnstein", "Melk", "Linz", "Regensburg", "Nuremberg", "Amsterdam"]),
    polylineCoordinates: generatePolyline(createPorts(["Budapest", "Bratislava", "Vienna", "Durnstein", "Melk", "Linz", "Regensburg", "Nuremberg", "Amsterdam"])),
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
    sailingDates: ["2025-05-30", "2025-06-06", "2025-06-13", "2025-06-20", "2025-06-27", "2025-07-04"],
    departurePort: "Port Canaveral",
    route: "Bahamas",
    ports: createPorts(["Port Canaveral", "Lighthouse Point", "Nassau", "Castaway Cay"]),
    polylineCoordinates: generatePolyline(createPorts(["Port Canaveral", "Lighthouse Point", "Nassau", "Castaway Cay"])),
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
    sailingDates: ["2025-05-30", "2025-06-06", "2025-06-13", "2025-06-20"],
    departurePort: "Tarragona",
    route: "Mediterranean-West",
    ports: createPorts(["Tarragona", "Valencia", "Livorno", "Rome/Civitavecchia", "Genoa", "Marseille"]),
    polylineCoordinates: generatePolyline(createPorts(["Tarragona", "Valencia", "Livorno", "Rome/Civitavecchia", "Genoa", "Marseille"])),
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
    sailingDates: ["2025-06-15", "2025-06-22", "2025-06-29", "2025-07-06", "2025-07-13", "2025-07-20"],
    departurePort: "Miami",
    route: "Caribbean",
    ports: createPorts(["Miami", "Cozumel", "Roatan", "Costa Maya", "Belize City"]),
    polylineCoordinates: generatePolyline(createPorts(["Miami", "Cozumel", "Roatan", "Costa Maya", "Belize City"])),
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
