'use client';

import { useEffect, useState } from 'react';
import ReactMapGl, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Yurbo } from '@/types/types';

interface MapboxMapProps {
  mapboxToken: string;
  yurbos: Yurbo[];
}

export default function MapboxMap({ mapboxToken, yurbos }: MapboxMapProps) {
  const [initialViewport, setInitialViewport] = useState({
    // dummy lat and long info before finding location
    latitude: -999,
    longitude: -999,
    zoom: 11,
    width: '100%',
    height: '100%',
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setInitialViewport({
        ...initialViewport,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        zoom: 11,
        width: '100%',
        height: '100%',
      });
    });
  }, []);

  return (
    <>
      {initialViewport.latitude != -999 &&
        initialViewport.longitude != -999 && (
          <ReactMapGl
            mapStyle='mapbox://styles/david-ham/clr6mfjmg010z01qu02xbhf0w'
            mapboxAccessToken={mapboxToken}
            initialViewState={initialViewport}
          >
            {yurbos.map((y) => (
              <Marker key={y.id} longitude={y.long} latitude={y.lat}></Marker>
            ))}
          </ReactMapGl>
        )}
    </>
  );
}
