"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

// Ask developer David Ham for api keys
// todo: search thru db for all posts by you,
// Have a list of null at start, then in useEffect add to list w db query

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
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

<<<<<<< HEAD
  return <div style={{ height: "700px" }} ref={mapRef}></div>;
=======
  return <div style={{ height: "600px" }} ref={mapRef}></div>;
>>>>>>> 51d87e00ffef75abc7540c28b5e80863da46a95b
}
