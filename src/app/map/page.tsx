"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

// Ask developer David Ham for api keys

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      //   console.log("map init");
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");

      //   Marker
      const { Marker } = (await loader.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      const position = {
        lat: 40.35312205762731,
        lng: -74.0648122261862,
      };

      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 17,
        mapId: "YURBO_MAP_ID",
      };

      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

      const marker = new Marker({
        map: map,
        position: position,
      });
    };

    initMap();
  }, []);

  return <div style={{ height: "600px" }} ref={mapRef}></div>;
}
