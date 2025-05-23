'use client';

import { useState } from 'react';

import {
  Map as MapComponent,
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import Pin from './Pin';
import { Yurbo } from '@/types/types';
import { Map } from 'immutable';

export default function TestMapBasic({
  yurbos,
}: {
  yurbos: Map<string, Yurbo>;
}) {
  const [selectedYurbo, setSelectedYurbo] = useState<Yurbo | null>(null);

  console.log('jheyo', [...yurbos]);

  return (
    <div className='h-full w-full'>
      <MapComponent
        attributionControl={false}
        initialViewState={{
          latitude: 40,
          longitude: -100,
          zoom: 3.5,
          bearing: 0,
          pitch: 0,
        }}
        mapStyle='https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
      >
        <GeolocateControl position='top-left' />
        <FullscreenControl position='top-left' />
        <NavigationControl position='top-left' />
        <ScaleControl />

        {[...yurbos].map(([, yurbo]) => (
          <Marker
            key={`marker-${yurbo.id}`}
            longitude={yurbo.long}
            latitude={yurbo.lat}
            anchor='bottom'
            onClick={(e) => {
              // If we let the click event propagates to the map, it will immediately close the popup
              // with `closeOnClick: true`
              e.originalEvent.stopPropagation();
              setSelectedYurbo(yurbo);
            }}
          >
            <Pin />
          </Marker>
        ))}

        {selectedYurbo && (
          <Popup
            anchor='top'
            longitude={selectedYurbo.long}
            latitude={selectedYurbo.lat}
            onClose={() => setSelectedYurbo(null)}
          >
            {selectedYurbo.name}
          </Popup>
        )}
      </MapComponent>
    </div>
  );
}
