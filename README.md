# Sea Route Configuration Application

A Next.js 14 application for configuring and managing maritime sea routes between ports with dynamic route generation and segment saving.

## Features

- **Port Selection**: Searchable dropdowns with infinite scroll for 6000+ ports
- **Route Generation**: Auto-generate sea routes using searoute-js library
- **Route Editing**: Manual drawing and editing of routes with Leaflet
- **Route Smoothing**: Advanced curve smoothing with iterative refinement
- **Segment Saving**: Save route segments to ClickHouse database for reuse
- **Multi-Layer Caching**: localStorage, Redis, and database caching for optimal performance
- **Version Control**: Route segments support versioning for tracking changes

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: React, shadcn/ui, Tailwind CSS
- **Maps**: Leaflet.js with Leaflet.draw
- **Database**: ClickHouse
- **Caching**: Redis (optional, graceful fallback)
- **Route Generation**: searoute-js

## Project Structure

```
SearouteAPP/
├── app/                          # App Router - All application code
│   ├── api/                      # API Route Handlers
│   │   ├── ports/
│   │   │   ├── route.ts          # GET /api/ports (port listing)
│   │   │   └── route/
│   │   │       └── route.ts      # POST /api/ports/route (route generation)
│   │   └── segments/
│   │       ├── get/
│   │       │   └── route.ts      # GET /api/segments/get (fetch route)
│   │       └── save/
│   │           └── route.ts      # POST /api/segments/save (save route)
│   ├── components/               # React UI components
│   │   └── ui/                   # shadcn/ui components
│   ├── config/                   # Configuration files
│   │   ├── clickhouse.ts         # ClickHouse client
│   │   └── redis.ts              # Redis client
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utilities and services
│   │   ├── services/             # API service layer
│   │   │   ├── portService.ts
│   │   │   ├── routeService.ts
│   │   │   └── segmentService.ts
│   │   └── utils.ts              # Utility functions
│   ├── pages/                    # Page components (not routes)
│   │   └── SeaRouteConfiguration.tsx
│   ├── sea-route-configuration/  # Route: /sea-route-configuration
│   │   └── page.tsx
│   ├── types/                    # TypeScript types
│   │   ├── global.d.ts
│   │   └── route.ts
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (/)
│   └── globals.css               # Global styles
├── database/                     # Database schemas
│   └── searoute_segments.sql
├── public/                       # Static assets
├── .env                          # Environment variables (not in git)
├── .gitignore
├── next.config.mjs
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- ClickHouse database
- Redis (optional, for caching - app works without it)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# ClickHouse Configuration
CLICKHOUSE_HOST=your-clickhouse-host
CLICKHOUSE_PORT=8123
CLICKHOUSE_USERNAME=default
CLICKHOUSE_PASSWORD=your-password
CLICKHOUSE_DATABASE=cruise_master

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379

# Mapbox (if needed)
MAPBOX_ACCESS_TOKEN=your-mapbox-token
```

### Database Setup

Run the SQL script to create the required table:

```bash
# Execute the schema file in ClickHouse
cat database/searoute_segments.sql | clickhouse-client
```

### Redis Setup (Optional)

```bash
# Run Redis in Docker
docker run -d --name redis -p 6379:6379 redis
```

The application will work without Redis, but caching will be disabled.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## API Endpoints

### Ports
- `GET /api/ports?offset=0&limit=100&search=miami` - Get ports with pagination and search
- `POST /api/ports/route` - Generate sea route between two ports

### Segments
- `GET /api/segments/get?originPortId=...&destinationPortId=...` - Get saved route segment
- `POST /api/segments/save` - Save route segment to database

## Caching Strategy

The application uses a three-layer caching strategy:

1. **localStorage** (Client-side, instant): Routes cached in browser for instant access
2. **Redis** (Server-side, fast): Routes cached for 10 minutes to reduce database queries
3. **Database** (Source of truth): ClickHouse database with optimized indexes

## Key Components

- **SeaRouteConfiguration**: Main application component (`app/pages/SeaRouteConfiguration.tsx`)
- **Service Layer**: API abstraction in `app/lib/services/`
- **API Routes**: Next.js App Router route handlers in `app/api/`

## License

Private project
