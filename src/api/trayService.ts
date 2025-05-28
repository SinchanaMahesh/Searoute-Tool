
// Unified API service for tray content (except destinations which have different structure)

export interface TrayItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  rating: number;
  duration?: string;
  type?: string;
  departure?: string;
  shipName?: string;
  route?: string;
}

export interface TrayData {
  trayId: string;
  title: string;
  items: TrayItem[];
}

// Mock API function that simulates fetching tray data
export const fetchTrayData = async (trayId: string): Promise<TrayData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  switch (trayId) {
    case 'recently-viewed':
      return {
        trayId: 'recently-viewed',
        title: 'Recently Viewed',
        items: [
          {
            id: 1,
            title: "Symphony of the Seas",
            subtitle: "Royal Caribbean",
            image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
            price: "$899",
            originalPrice: "$1,299",
            discount: "31% OFF",
            rating: 4.8,
            duration: "7 nights"
          },
          {
            id: 2,
            title: "Norwegian Bliss",
            subtitle: "Norwegian Cruise Line",
            image: "https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=400",
            price: "$1,199",
            originalPrice: "$1,699",
            discount: "29% OFF",
            rating: 4.6,
            duration: "10 nights"
          },
          {
            id: 3,
            title: "Celebrity Edge",
            subtitle: "Celebrity Cruises",
            image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
            price: "$1,599",
            originalPrice: "$2,199",
            discount: "27% OFF",
            rating: 4.9,
            duration: "12 nights"
          }
        ]
      };

    case 'deals-steals':
      return {
        trayId: 'deals-steals',
        title: 'Deals & Steals',
        items: [
          {
            id: 4,
            title: "Carnival Vista",
            subtitle: "Carnival Cruise Line",
            image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
            price: "$599",
            originalPrice: "$999",
            discount: "40% OFF",
            rating: 4.4,
            duration: "7 nights",
            type: "last-minute",
            departure: "Next Week"
          },
          {
            id: 5,
            title: "MSC Seaside",
            subtitle: "MSC Cruises",
            image: "https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=400",
            price: "$799",
            originalPrice: "$1,199",
            discount: "33% OFF",
            rating: 4.5,
            duration: "8 nights",
            type: "last-minute",
            departure: "This Month"
          },
          {
            id: 6,
            title: "Allure of the Seas",
            subtitle: "Royal Caribbean",
            image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
            price: "$1,099",
            originalPrice: "$1,499",
            discount: "27% DROP",
            rating: 4.7,
            duration: "9 nights",
            type: "price-drop"
          }
        ]
      };

    case 'royal-caribbean':
      return {
        trayId: 'royal-caribbean',
        title: 'Royal Caribbean',
        items: [
          {
            id: 1,
            shipName: "Symphony of the Seas",
            title: "Symphony of the Seas",
            subtitle: "Caribbean",
            route: "Caribbean",
            duration: "7",
            price: "$899",
            image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300",
            rating: 4.8
          },
          {
            id: 2,
            shipName: "Oasis of the Seas",
            title: "Oasis of the Seas",
            subtitle: "Mediterranean",
            route: "Mediterranean",
            duration: "10",
            price: "$1,299",
            image: "https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=300",
            rating: 4.7
          },
          {
            id: 3,
            shipName: "Allure of the Seas",
            title: "Allure of the Seas",
            subtitle: "Alaska",
            route: "Alaska",
            duration: "14",
            price: "$1,599",
            image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300",
            rating: 4.9
          }
        ]
      };

    case 'norwegian-cruise-line':
      return {
        trayId: 'norwegian-cruise-line',
        title: 'Norwegian Cruise Line',
        items: [
          {
            id: 9,
            shipName: "Norwegian Bliss",
            title: "Norwegian Bliss",
            subtitle: "Alaska",
            route: "Alaska",
            duration: "7",
            price: "$1,199",
            image: "https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=300",
            rating: 4.6
          },
          {
            id: 10,
            shipName: "Norwegian Epic",
            title: "Norwegian Epic",
            subtitle: "Mediterranean",
            route: "Mediterranean",
            duration: "10",
            price: "$1,099",
            image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300",
            rating: 4.5
          }
        ]
      };

    case 'celebrity-cruises':
      return {
        trayId: 'celebrity-cruises',
        title: 'Celebrity Cruises',
        items: [
          {
            id: 17,
            shipName: "Celebrity Edge",
            title: "Celebrity Edge",
            subtitle: "Mediterranean",
            route: "Mediterranean",
            duration: "12",
            price: "$1,599",
            image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300",
            rating: 4.9
          },
          {
            id: 18,
            shipName: "Celebrity Apex",
            title: "Celebrity Apex",
            subtitle: "Northern Europe",
            route: "Northern Europe",
            duration: "10",
            price: "$1,799",
            image: "https://images.unsplash.com/photo-1564437657622-73a8e53c0ca7?w=300",
            rating: 4.8
          }
        ]
      };

    default:
      throw new Error(`Tray with ID "${trayId}" not found`);
  }
};

// Separate API for destinations (has different structure)
export interface DestinationItem {
  id: string;
  name: string;
  description: string;
  image: string;
  cruiseCount: number;
  averagePrice: string;
  popularPorts: string[];
  bestTime: string;
  duration: string;
  type: "vertical" | "horizontal";
}

export const fetchDestinationData = async (): Promise<DestinationItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  return [
    {
      id: "caribbean",
      name: "Caribbean",
      description: "Tropical paradise with pristine beaches",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
      cruiseCount: 147,
      averagePrice: "$899",
      popularPorts: ["Cozumel", "Nassau", "St. Thomas"],
      bestTime: "Year-round",
      duration: "7-14 days",
      type: "vertical"
    },
    {
      id: "mediterranean",
      name: "Mediterranean",
      description: "Historic cities and stunning coastlines",
      image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400",
      cruiseCount: 89,
      averagePrice: "$1,299",
      popularPorts: ["Barcelona", "Rome", "Santorini"],
      bestTime: "Apr-Oct",
      duration: "7-12 days",
      type: "horizontal"
    },
    {
      id: "alaska",
      name: "Alaska",
      description: "Glaciers, wildlife, and breathtaking scenery",
      image: "https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=400",
      cruiseCount: 34,
      averagePrice: "$1,599",
      popularPorts: ["Juneau", "Ketchikan", "Skagway"],
      bestTime: "May-Sep",
      duration: "7-14 days",
      type: "horizontal"
    }
  ];
};
