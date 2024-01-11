"use client";

import { useEffect, useRef, useState } from "react";
import ReactMapGl, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getErrorMessage } from "../constants/errors";
import { Yurbo } from "@/types/types";

interface MapboxMapProps {
  mapboxToken: string;
}

export default function MapboxMap({ mapboxToken }: MapboxMapProps) {
  const [initialViewport, setInitialViewport] = useState({
    // dummy lat and long info before finding location
    latitude: -999,
    longitude: -999,
    zoom: 11,
    width: "100%",
    height: "100%",
  });

  const markers = [
    { latitude: 37.7577, longitude: -122.4376, name: "Marker 1" },
    { latitude: 37.7749, longitude: -122.4194, name: "Marker 2" },
  ];

  // const [yurbos, setYurbos] = useState<Yurbo[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setInitialViewport({
        ...initialViewport,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        zoom: 11,
        width: "100%",
        height: "100%",
      });
    });

    // // get yurbos
    // const getYurbos = async () => {
    //   console.log("getting yurbos");
    //   try {
    //     const res = await fetch("/api/yurbo/get");
    //     if (!res.ok) {
    //       throw new Error("Failed to fetch data");
    //     }
    //     const result = await res.json();

    //     setYurbos(result.yurbos);
    //   } catch (e) {
    //     const errorMessage = getErrorMessage(e);
    //     console.log(errorMessage);
    //   }
    // };
    // getYurbos();
  }, []);

  return (
    <>
      {initialViewport.latitude != -999 &&
        initialViewport.longitude != -999 && (
          <ReactMapGl
            mapStyle="mapbox://styles/david-ham/clr6mfjmg010z01qu02xbhf0w"
            mapboxAccessToken={mapboxToken}
            initialViewState={initialViewport}
          >
            <Marker
              longitude={initialViewport.longitude}
              latitude={initialViewport.latitude}
            />
          </ReactMapGl>
        )}
    </>
  );
}
