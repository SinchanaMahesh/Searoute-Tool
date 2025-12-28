/**
 * Port Service
 * Handles all port-related API calls
 */

export interface Port {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface PortsResponse {
  ports: Port[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
  search?: string;
}

export const fetchPorts = async (
  offset: number = 0,
  limit: number = 100,
  search: string = ''
): Promise<PortsResponse> => {
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
  const response = await fetch(`/api/ports?offset=${offset}&limit=${limit}${searchParam}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ports: ${response.status}`);
  }

  const data = await response.json();

  return {
    ports: data.ports.map((row: any) => ({
      id: String(row.port_id),
      name: row.port_name,
      lat: Number(row.port_latitude),
      lng: Number(row.port_longitude),
    })),
    total: data.total || 0,
    offset: data.offset || 0,
    limit: data.limit || 100,
    hasMore: data.hasMore || false,
    search: data.search || '',
  };
};

