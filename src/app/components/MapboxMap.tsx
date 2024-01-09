"use client";

import { useEffect, useRef, useState } from "react";
// import mapboxgl, { Map } from "mapbox-gl";
import ReactMapGL from "react-map-gl";

interface MapboxMapProps {
  mapboxToken: string;
}
export default function MapboxMap({ mapboxToken }: MapboxMapProps) {
  // const mapContainer = useRef<HTMLDivElement>(null);
  // let map: Map | null = null;

  const [viewport, setViewport] = useState({
    latitude: 40,
    longitude: -74.5,
    zoom: 9,
    width: "100%",
    height: "100%",
  });

  return (
    <ReactMapGL
      mapStyle="mapbox://styles/david-ham/clr6mfjmg010z01qu02xbhf0w"
      mapboxAccessToken={mapboxToken}
      {...viewport}
    ></ReactMapGL>
  );
}
