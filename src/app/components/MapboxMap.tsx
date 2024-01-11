"use client";

import { useEffect, useRef, useState } from "react";
import ReactMapGl, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapboxMapProps {
  mapboxToken: string;
}

// async function getYurbos() {
//   // Authenticate
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.email) {
//     return Response.json(
//       { success: false, mesage: ERRORS.UNATHORIZED },
//       { status: 401 }
//     );
//   }

//   // get yurbos for this user
//   const [yurbos, loading, error] = useCollection(
//     query(
//       collection(db, "users", session.user.email, "yurbos"),
//       orderBy("timestamp", "desc")
//     )
//   );
// }

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

  useEffect(() => {
    // works!
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
