declare global {
  interface Window {
    L: any;
  }
}

// Type declaration for searoute-js (no published types)
declare module "searoute-js" {
  import { Feature, Point, LineString } from 'geojson';

  type Units = 'degrees' | 'radians' | 'miles' | 'kilometers' | 'nautical miles';

  interface SearouteFunction {
    (
      origin: Feature<Point>,
      destination: Feature<Point>,
      units?: Units
    ): Feature<LineString>;
  }

  const searoute: SearouteFunction;
  export default searoute;
  export { searoute };
}

export {};
