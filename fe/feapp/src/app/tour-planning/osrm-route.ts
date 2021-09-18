export interface OsrmRoute {
  code: string;
  routes: Route[];
}

class Route {
  geometry: Geometry;
}

class Geometry {
  coordinates: number[]; // lon, lat
}
