/**
 * Segment Service
 * Handles route segment saving and fetching
 */

export interface SegmentSaveRequest {
  originPortId: string;
  destinationPortId: string;
  originPort: {
    id: string;
    name: string;
    code?: string;
    lat: number;
    lng: number;
  };
  destinationPort: {
    id: string;
    name: string;
    code?: string;
    lat: number;
    lng: number;
  };
  routeCoordinates: [number, number][];
  routeType: 'generated' | 'manual' | 'edited';
  createdBy?: string;
  metadata?: Record<string, any>;
}

export interface SegmentSaveResponse {
  success: boolean;
  segmentId: string;
  version: number;
  message: string;
}

export interface SegmentGetResponse {
  found: boolean;
  segment?: {
    segmentId: string;
    originPortId: string;
    destinationPortId: string;
    originPort: {
      code: string;
      name: string;
      lat: number;
      lng: number;
    };
    destinationPort: {
      code: string;
      name: string;
      lat: number;
      lng: number;
    };
    routeCoordinates: [number, number][];
    routeCoordinatesCount: number;
    routeType: string;
    distanceNauticalMiles: number;
    distanceKilometers: number;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    version: number;
    metadata: Record<string, any>;
  };
}

export const saveSegment = async (
  data: SegmentSaveRequest
): Promise<SegmentSaveResponse> => {
  const response = await fetch('/api/segments/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to save segment');
  }

  return await response.json();
};

export const getSegment = async (
  originPortId: string,
  destinationPortId: string
): Promise<SegmentGetResponse> => {
  const response = await fetch(
    `/api/segments/get?originPortId=${encodeURIComponent(originPortId)}&destinationPortId=${encodeURIComponent(destinationPortId)}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch segment');
  }

  return await response.json();
};
