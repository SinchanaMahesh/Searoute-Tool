// This file contains all the mock data that would be returned by our API

export type Destination = {
  id: string;
  name: string;
  description: string;
  image: string;
  cruiseCount: number;
  averagePrice: string;
  popularPorts: string[];
  bestTime: string;
  duration: string;
  type: 'vertical' | 'horizontal';
  coverImages?: string[];
}

export type CruiseLine = {
  id: string;
  name: string;
  logo: string;
  description: string;
  reviewRating: number;
  reviewCount: number;
  cruiseCount: number;
  popularDestinations: string[];
  cruises: Cruise[];
}

export type Cruise = {
  id: number;
  cruiseLineId: string;
  shipName: string;
  cruiseLine: string;
  title: string;
  description: string;
  images: string[];
  duration: number;
  departureDate: string;
  departurePort: string;
  destinationId: string;
  destination: string;
  route: string;
  ports: string[];
  priceFrom: number;
  savings?: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  isPopular: boolean;
  deals?: {
    type: 'last-minute' | 'price-drop';
    discount: string;
    departure?: string;
  };
}

// Mock destinations data
export const destinations: Destination[] = [
  {
    id: 'caribbean',
    name: "Caribbean",
    description: "Tropical paradise with pristine beaches",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
    cruiseCount: 147,
    averagePrice: "$899",
    popularPorts: ["Cozumel", "Nassau", "St. Thomas"],
    bestTime: "Year-round",
    duration: "7-14 days",
    type: "vertical",
    coverImages: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
      "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1200",
      "https://images.unsplash.com/photo-1580541631971-a0e1263b2b0f?w=1200",
    ],
  },
  {
    id: 'mediterranean',
    name: "Mediterranean",
    description: "Historic cities and stunning coastlines",
    image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400",
    cruiseCount: 89,
    averagePrice: "$1,299",
    popularPorts: ["Barcelona", "Rome", "Santorini"],
    bestTime: "Apr-Oct",
    duration: "7-12 days",
    type: "horizontal",
    coverImages: [
      "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=1200",
      "https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=1200",
      "https://images.unsplash.com/photo-1565112701024-7d739b422fbd?w=1200",
    ],
  },
  {
    id: 'alaska',
    name: "Alaska",
    description: "Glaciers, wildlife, and breathtaking scenery",
    image: "https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=400",
    cruiseCount: 34,
    averagePrice: "$1,599",
    popularPorts: ["Juneau", "Ketchikan", "Skagway"],
    bestTime: "May-Sep",
    duration: "7-14 days",
    type: "horizontal",
    coverImages: [
      "https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=1200",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
      "https://images.unsplash.com/photo-1507490934083-2d4d1233abbd?w=1200",
    ],
  },
  {
    id: 'northern-europe',
    name: "Northern Europe",
    description: "Fjords, capitals, and Viking heritage",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300",
    cruiseCount: 56,
    averagePrice: "$1,799",
    popularPorts: ["Copenhagen", "Stockholm", "Oslo"],
    bestTime: "May-Sep",
    duration: "7-14 days",
    type: "vertical",
    coverImages: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200",
      "https://images.unsplash.com/photo-1518790460052-8dcd245fed2d?w=1200",
    ],
  },
  {
    id: 'asia',
    name: "Asia",
    description: "Ancient cultures and modern marvels",
    image: "https://images.unsplash.com/photo-1549693578-d683be217e58?w=300",
    cruiseCount: 42,
    averagePrice: "$1,399",
    popularPorts: ["Singapore", "Hong Kong", "Tokyo"],
    bestTime: "Oct-Apr",
    duration: "10-16 days",
    type: "horizontal"
  },
  {
    id: 'transatlantic',
    name: "Transatlantic",
    description: "Classic ocean crossing experience",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400",
    cruiseCount: 18,
    averagePrice: "$999",
    popularPorts: ["Southampton", "New York", "Le Havre"],
    bestTime: "Apr-Nov",
    duration: "6-14 days",
    type: "horizontal"
  },
  {
    id: 'pacific-coast',
    name: "Pacific Coast",
    description: "Scenic coastlines and charming cities",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400",
    cruiseCount: 28,
    averagePrice: "$1,199",
    popularPorts: ["San Francisco", "Seattle", "Victoria"],
    bestTime: "Apr-Oct",
    duration: "7-10 days",
    type: "vertical"
  },
  {
    id: 'baltic-sea',
    name: "Baltic Sea",
    description: "Historic capitals and medieval charm",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400",
    cruiseCount: 39,
    averagePrice: "$1,699",
    popularPorts: ["Stockholm", "Helsinki", "St. Petersburg"],
    bestTime: "May-Sep",
    duration: "7-12 days",
    type: "horizontal"
  },
  {
    id: 'british-isles',
    name: "British Isles",
    description: "Castles, countryside, and culture",
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
    cruiseCount: 31,
    averagePrice: "$1,599",
    popularPorts: ["Edinburgh", "Dublin", "London"],
    bestTime: "May-Sep",
    duration: "7-14 days",
    type: "horizontal"
  }
];

// Mock cruise lines data
export const cruiseLines: CruiseLine[] = [
  {
    id: 'royal-caribbean',
    name: 'Royal Caribbean',
    logo: 'https://images.unsplash.com/photo-1580541631971-a0e1263b2b0f?w=100',
    description: 'Innovative ships with thrilling activities and entertainment',
    reviewRating: 4.7,
    reviewCount: 23458,
    cruiseCount: 156,
    popularDestinations: ['Caribbean', 'Mediterranean', 'Alaska'],
    cruises: []  // Will be populated dynamically
  },
  {
    id: 'carnival',
    name: 'Carnival Cruise Line',
    logo: 'https://images.unsplash.com/photo-1580541631971-a0e1263b2b0f?w=100',
    description: 'Fun-focused cruises for all ages with lively atmospheres',
    reviewRating: 4.5,
    reviewCount: 19732,
    cruiseCount: 142,
    popularDestinations: ['Caribbean', 'Mexico', 'Bahamas'],
    cruises: []
  },
  {
    id: 'norwegian',
    name: 'Norwegian Cruise Line',
    logo: 'https://images.unsplash.com/photo-1580541631971-a0e1263b2b0f?w=100',
    description: 'Freestyle cruising with diverse dining and entertainment options',
    reviewRating: 4.6,
    reviewCount: 18543,
    cruiseCount: 124,
    popularDestinations: ['Caribbean', 'Hawaii', 'Europe'],
    cruises: []
  },
  {
    id: 'celebrity',
    name: 'Celebrity Cruises',
    logo: 'https://images.unsplash.com/photo-1580541631971-a0e1263b2b0f?w=100',
    description: 'Modern luxury cruising with sophisticated amenities',
    reviewRating: 4.8,
    reviewCount: 15632,
    cruiseCount: 98,
    popularDestinations: ['Mediterranean', 'Alaska', 'Caribbean'],
    cruises: []
  },
  {
    id: 'princess',
    name: 'Princess Cruises',
    logo: 'https://images.unsplash.com/photo-1580541631971-a0e1263b2b0f?w=100',
    description: 'Destination-focused cruises with elegant ships',
    reviewRating: 4.6,
    reviewCount: 14521,
    cruiseCount: 112,
    popularDestinations: ['Alaska', 'Caribbean', 'Mediterranean'],
    cruises: []
  },
];

// Mock cruises data
export const cruises: Cruise[] = [
  {
    id: 1,
    cruiseLineId: 'royal-caribbean',
    shipName: 'Symphony of the Seas',
    cruiseLine: 'Royal Caribbean',
    title: '7-Night Eastern Caribbean & Perfect Day',
    description: 'Experience the ultimate family vacation on the world\'s largest cruise ship',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800',
      'https://images.unsplash.com/photo-1635105783165-3916c3f33486?w=800',
    ],
    duration: 7,
    departureDate: '2025-07-15',
    departurePort: 'Miami, FL',
    destinationId: 'caribbean',
    destination: 'Caribbean',
    route: 'Eastern Caribbean',
    ports: ['Miami', 'Perfect Day at CocoCay', 'Charlotte Amalie', 'Philipsburg'],
    priceFrom: 899,
    savings: 400,
    rating: 4.8,
    reviewCount: 3245,
    amenities: ['Water Slides', 'Casino', 'Broadway Shows', 'Specialty Dining', 'Mini Golf'],
    isPopular: true,
    deals: {
      type: 'price-drop',
      discount: '31% OFF',
    }
  },
  {
    id: 2,
    cruiseLineId: 'norwegian',
    shipName: 'Norwegian Bliss',
    cruiseLine: 'Norwegian Cruise Line',
    title: '10-Night Alaska with Glacier Bay',
    description: 'Witness breathtaking glaciers and wildlife on this Alaska adventure',
    images: [
      'https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=800',
      'https://images.unsplash.com/photo-1548019840-17bd45d9d0be?w=800',
      'https://images.unsplash.com/photo-1533985902446-f046683916b7?w=800',
    ],
    duration: 10,
    departureDate: '2025-06-02',
    departurePort: 'Seattle, WA',
    destinationId: 'alaska',
    destination: 'Alaska',
    route: 'Inside Passage',
    ports: ['Seattle', 'Juneau', 'Skagway', 'Glacier Bay', 'Ketchikan', 'Victoria'],
    priceFrom: 1199,
    savings: 500,
    rating: 4.6,
    reviewCount: 2187,
    amenities: ['Observation Lounge', 'Race Track', 'Laser Tag', 'Waterslides', 'Thermal Spa'],
    isPopular: true,
    deals: {
      type: 'last-minute',
      discount: '29% OFF',
      departure: 'Next Month'
    }
  },
  {
    id: 3,
    cruiseLineId: 'celebrity',
    shipName: 'Celebrity Edge',
    cruiseLine: 'Celebrity Cruises',
    title: '12-Night Mediterranean & Adriatic',
    description: 'Luxury cruising through the cultural capitals of the Mediterranean',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800',
      'https://images.unsplash.com/photo-1468413253725-0d5181091126?w=800',
    ],
    duration: 12,
    departureDate: '2025-08-17',
    departurePort: 'Barcelona, Spain',
    destinationId: 'mediterranean',
    destination: 'Mediterranean',
    route: 'Western Mediterranean',
    ports: ['Barcelona', 'Valencia', 'Rome', 'Naples', 'Santorini', 'Athens', 'Dubrovnik'],
    priceFrom: 1599,
    savings: 600,
    rating: 4.9,
    reviewCount: 1876,
    amenities: ['Infinite Veranda', 'Magic Carpet', 'Rooftop Garden', 'Fine Dining', 'Thermal Spa'],
    isPopular: true
  },
  {
    id: 4,
    cruiseLineId: 'carnival',
    shipName: 'Carnival Vista',
    cruiseLine: 'Carnival Cruise Line',
    title: '7-Night Western Caribbean from Galveston',
    description: 'Family-friendly fun with stops at tropical destinations',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800',
    ],
    duration: 7,
    departureDate: '2025-06-27',
    departurePort: 'Galveston, TX',
    destinationId: 'caribbean',
    destination: 'Caribbean',
    route: 'Western Caribbean',
    ports: ['Galveston', 'Cozumel', 'Belize', 'Mahogany Bay'],
    priceFrom: 599,
    savings: 400,
    rating: 4.4,
    reviewCount: 2432,
    amenities: ['SkyRide', 'WaterWorks', 'IMAX Theater', 'Havana Pool', 'Alchemy Bar'],
    isPopular: true,
    deals: {
      type: 'last-minute',
      discount: '40% OFF',
      departure: 'Next Week'
    }
  },
  {
    id: 5,
    cruiseLineId: 'royal-caribbean',
    shipName: 'Allure of the Seas',
    cruiseLine: 'Royal Caribbean',
    title: '9-Night Mediterranean from Barcelona',
    description: 'Explore the Mediterranean on one of the world\'s largest ships',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      'https://images.unsplash.com/photo-1533077162801-86490c593afb?w=800',
      'https://images.unsplash.com/photo-1568849676085-51415703900f?w=800',
    ],
    duration: 9,
    departureDate: '2025-07-22',
    departurePort: 'Barcelona, Spain',
    destinationId: 'mediterranean',
    destination: 'Mediterranean',
    route: 'Western Mediterranean',
    ports: ['Barcelona', 'Palma de Mallorca', 'Marseille', 'La Spezia', 'Rome', 'Naples'],
    priceFrom: 1099,
    savings: 400,
    rating: 4.7,
    reviewCount: 2876,
    amenities: ['Central Park', 'Aqua Theater', 'Zip Line', 'Carousel', 'Rock Climbing Wall'],
    isPopular: true,
    deals: {
      type: 'price-drop',
      discount: '27% DROP',
    }
  }
];

// Add more cruises for each cruise line
cruiseLines.forEach(line => {
  line.cruises = cruises.filter(cruise => cruise.cruiseLineId === line.id);
});

// API functions
export const fetchDestinations = () => {
  return new Promise<Destination[]>((resolve) => {
    setTimeout(() => resolve(destinations), 300);
  });
};

export const fetchDestination = (id: string) => {
  return new Promise<Destination | undefined>((resolve) => {
    setTimeout(() => resolve(destinations.find(d => d.id === id)), 300);
  });
};

export const fetchCruiseLines = () => {
  return new Promise<CruiseLine[]>((resolve) => {
    setTimeout(() => resolve(cruiseLines), 300);
  });
};

export const fetchCruiseLine = (id: string) => {
  return new Promise<CruiseLine | undefined>((resolve) => {
    setTimeout(() => resolve(cruiseLines.find(cl => cl.id === id)), 300);
  });
};

export const fetchCruises = (filters?: {
  destinationId?: string;
  cruiseLineId?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: number[];
}) => {
  return new Promise<Cruise[]>((resolve) => {
    let filteredCruises = [...cruises];
    
    if (filters) {
      if (filters.destinationId) {
        filteredCruises = filteredCruises.filter(c => c.destinationId === filters.destinationId);
      }
      
      if (filters.cruiseLineId) {
        filteredCruises = filteredCruises.filter(c => c.cruiseLineId === filters.cruiseLineId);
      }
      
      if (filters.minPrice !== undefined) {
        filteredCruises = filteredCruises.filter(c => c.priceFrom >= filters.minPrice!);
      }
      
      if (filters.maxPrice !== undefined) {
        filteredCruises = filteredCruises.filter(c => c.priceFrom <= filters.maxPrice!);
      }
      
      if (filters.duration && filters.duration.length > 0) {
        filteredCruises = filteredCruises.filter(c => filters.duration!.includes(c.duration));
      }
    }
    
    setTimeout(() => resolve(filteredCruises), 300);
  });
};

export const fetchCruise = (id: number) => {
  return new Promise<Cruise | undefined>((resolve) => {
    setTimeout(() => resolve(cruises.find(c => c.id === id)), 300);
  });
};

export const fetchCruisesByDestination = (destinationId: string) => {
  return new Promise<Cruise[]>((resolve) => {
    const filteredCruises = cruises.filter(c => c.destinationId === destinationId);
    setTimeout(() => resolve(filteredCruises), 300);
  });
};

export const fetchCruiseLinesByDestination = (destinationId: string) => {
  return new Promise<CruiseLine[]>((resolve) => {
    // Get all unique cruise line IDs that have cruises to this destination
    const cruiseLineIds = [...new Set(
      cruises
        .filter(c => c.destinationId === destinationId)
        .map(c => c.cruiseLineId)
    )];
    
    // Filter cruise lines by these IDs
    const filteredLines = cruiseLines.filter(cl => cruiseLineIds.includes(cl.id));
    
    setTimeout(() => resolve(filteredLines), 300);
  });
};
