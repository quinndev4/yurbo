"use client";

import { useEffect, useRef, useState } from "react";
// import mapboxgl, { Map } from "mapbox-gl";
import ReactMapGL, { Marker } from "react-map-gl";
import getCenter from "geolib/es/getCenter";

interface MapboxMapProps {
  mapboxToken: string;
}
export default function MapboxMap({ mapboxToken }: MapboxMapProps) {
  // const mapContainer = useRef<HTMLDivElement>(null);
  // let map: Map | null = null;

  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 9,
    width: "100%",
    height: "100%",
  });

  const markers = [
    { latitude: 37.7577, longitude: -122.4376, name: "Marker 1" },
    { latitude: 37.7749, longitude: -122.4194, name: "Marker 2" },
  ];

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(function (position) {
  //     console.log("Latitude is :", position.coords.latitude);
  //     console.log("Longitude is :", position.coords.longitude);
  //     setViewport({
  //       latitude: position.coords.latitude,
  //       longitude: position.coords.longitude,
  //       zoom: 9,
  //       width: "100%",
  //       height: "100%",
  //     });
  //   });
  // });

  return (
    <ReactMapGL
      mapStyle="mapbox://styles/david-ham/clr6mfjmg010z01qu02xbhf0w"
      mapboxAccessToken={mapboxToken}
      {...viewport}
      // onViewportChange={(newViewport) => setViewport(newViewport)}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.latitude + marker.longitude}
          latitude={marker.latitude}
          longitude={marker.longitude}
        >
          <div className="bg-red-600">{marker.name}</div>
        </Marker>
      ))}
    </ReactMapGL>
  );
}
