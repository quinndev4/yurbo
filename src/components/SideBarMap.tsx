import React, { useEffect, useRef, useState } from 'react';
import {
  Map as MapComponent,
  MapRef,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  Popup,
  Layer,
  Source,
  LngLatBounds,
} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Yurbo } from '@/types/types';

import { CustomControl, CustomControlGroup } from './CustomControl';

import {
  ArrowUpCircleIcon,
  UserCircleIcon,
  UserPlusIcon,
  GlobeAltIcon,
  MapPinIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import { Map } from 'immutable';

const MAX_ZOOM_LEVEL = 9;
const NO_CLUSTER = 13;

const MapWithSidebar = ({ yurbos }: { yurbos: Map<string, Yurbo> }) => {
  const mapRef = useRef<MapRef>(null);

  const [mapType, setMapType] = useState<'heat' | 'cluster'>('heat');
  const [yurboSource, setYurboSource] = useState<'me' | 'following' | 'all'>(
    'me'
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedYurbo, setSelectedYurbo] = useState<Yurbo | null>(null);

  const [mapBounds, setMapBounds] = useState<LngLatBounds | undefined>();
  const [centerBounds, setCenterBounds] = useState<LngLatBounds | undefined>();

  const cardRefs = useRef<{ [id: string]: HTMLLIElement | null }>({});

  useEffect(() => {
    const src = mapRef.current?.getSource('yurbos-map-source');

    console.log('srccc', src);
  }, [mapType]);

  const scrollToYurbo = (yurbo: Yurbo) => {
    // Scroll to the corresponding card
    cardRefs.current[yurbo.id]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    mapRef.current?.flyTo({
      center: [yurbo.long, yurbo.lat],
      zoom: NO_CLUSTER, // Adjust zoom level as needed
      speed: 1.2, // Animation speed
      curve: 1.42, // Animation curve
      easing: (t) => t, // Easing function
      essential: true, // This animation is considered essential
    });

    setSelectedYurbo(yurbos.get(yurbo.id) ?? null);
  };

  const centerMap = () => {
    const lats = [...yurbos].map(([, y]) => y.lat);
    const lngs = [...yurbos].map(([, y]) => y.long);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    mapRef.current?.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      {
        padding: 100, // Adjust padding as needed
        duration: 1000, // Animation duration in milliseconds
      },
      { id: 'center-map' }
    );
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);

    mapRef.current?.easeTo(
      {
        padding: {
          left: isSidebarOpen ? 0 : 300, // Adjust based on sidebar width
          top: 0,
          right: 0,
          bottom: 0,
        },
        duration: 1000, // Duration in milliseconds
      },
      { id: 'sidebar-ease' }
    );
  };

  return (
    <div className='relative flex h-full w-full'>
      {/* Sidebar and Toggle Button Wrapper */}
      <div
        className={`absolute z-10 flex h-[100%] items-center justify-center p-2 transition-transform duration-1000 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-[320px]'
        }`}
      >
        {/* Sidebar */}
        <div className='h-full w-[300px] overflow-y-auto rounded-lg bg-white shadow-lg'>
          {/* Sidebar content */}
          <ul className='space-y-4 p-4'>
            {[...yurbos].map(([, yurbo]) => (
              <li
                key={`sidebar-li-${yurbo.id}`}
                ref={(el) => {
                  cardRefs.current[yurbo.id] = el;
                }}
                onClick={() => scrollToYurbo(yurbo)}
                className={`rounded-lg bg-gray-100 p-4 shadow transition hover:cursor-pointer hover:shadow-md ${selectedYurbo?.id === yurbo.id ? 'bg-gray-500' : ''}`}
              >
                <h3 className='font-semibold text-black'>{yurbo.name}</h3>
                <p className='text-sm text-gray-600'>{yurbo.description}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Toggle Button */}
        <button
          title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          onClick={toggleSidebar}
          className='mt-4 ml-6 h-10 w-10 rounded-lg bg-white text-black shadow-lg hover:cursor-pointer focus:outline-none'
        >
          {isSidebarOpen ? <span>&larr;</span> : <span>&rarr;</span>}
        </button>
      </div>

      {/* Map Container */}
      <MapComponent
        ref={mapRef}
        onLoad={(e) => {
          const map = e.target;

          map.on('mouseenter', 'unclustered-point', () => {
            map.getCanvas().style.cursor = 'pointer';
          });

          map.on('click', 'unclustered-point', (clickEvent) => {
            const clicked = yurbos.get(
              clickEvent.features?.[0]?.properties?.id
            );

            if (clicked) {
              scrollToYurbo(clicked);
            }
          });

          mapRef.current?.on('moveend', (e) => {
            if ('id' in e && e.id === 'center-map') {
              setCenterBounds(mapRef.current?.getBounds());
            }

            if (!('id' in e) || e.id !== 'sidebar-ease') {
              setMapBounds(mapRef.current?.getBounds());
            }
          });

          map.on('mouseleave', 'unclustered-point', () => {
            map.getCanvas().style.cursor = 'grab';
          });

          centerMap();
        }}
        mapStyle='https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
      >
        <GeolocateControl position='top-right' />
        <FullscreenControl position='top-right' />
        <NavigationControl position='top-right' />
        <ScaleControl />

        {/* Center map control */}
        <CustomControlGroup position='top-right'>
          <CustomControl
            title='Center map'
            onClick={centerMap}
            icon={ArrowUpCircleIcon}
            selected={
              JSON.stringify(mapBounds) === JSON.stringify(centerBounds)
            }
          />
        </CustomControlGroup>

        {/* Yurbo filtering controls */}
        <CustomControlGroup position='top-right'>
          <CustomControl
            title='My Yurbos'
            onClick={() => setYurboSource('me')}
            icon={UserCircleIcon}
            selected={yurboSource === 'me'}
          />
          <CustomControl
            title='Following Yurbos'
            onClick={() => setYurboSource('following')}
            icon={UserPlusIcon}
            selected={yurboSource === 'following'}
          />
          <CustomControl
            title='All Yurbos'
            onClick={() => setYurboSource('all')}
            icon={GlobeAltIcon}
            selected={yurboSource === 'all'}
          />
        </CustomControlGroup>

        {/* Map type controls */}
        <CustomControlGroup position='top-right'>
          <CustomControl
            title='Heat map'
            onClick={() => setMapType('heat')}
            icon={FireIcon}
            selected={mapType === 'heat'}
          />
          <CustomControl
            title='Clustered map'
            onClick={() => setMapType('cluster')}
            icon={MapPinIcon}
            selected={mapType === 'cluster'}
          />
        </CustomControlGroup>

        <Source
          id='yurbos-map-source'
          key={`yurbos-map-source-${mapType}`} // 👈 force remount on type change
          type='geojson'
          // data='https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson'
          data={{
            type: 'FeatureCollection',
            features: [...yurbos].map(([, yurbo]) => ({
              type: 'Feature',
              properties: { id: yurbo.id },
              geometry: { type: 'Point', coordinates: [yurbo.long, yurbo.lat] },
            })),
          }}
          {...(mapType === 'cluster' && {
            cluster: true,
            clusterMaxZoom: NO_CLUSTER,
            clusterRadius: 50,
          })}
        >
          {mapType === 'cluster' && (
            <Layer
              id='clusters'
              type='circle'
              source='yurbos-map-source'
              filter={['has', 'point_count']}
              maxzoom={NO_CLUSTER}
              paint={{
                'circle-color': [
                  'step',
                  ['get', 'point_count'],
                  '#d00',
                  3,
                  '#51bbd6',
                  6,
                  '#f28cb1',
                  111,
                  '#d00',
                  200,
                  '#f1f075',
                  750,
                  '#d00',
                  2000,
                  '#f28cb1',
                ],
                'circle-radius': [
                  'step',
                  ['get', 'point_count'],
                  20,
                  100,
                  30,
                  750,
                  40,
                ],
              }}
            />
          )}

          {mapType === 'cluster' && (
            <Layer
              id='cluster-count'
              type='symbol'
              source='yurbos-map-source'
              filter={['has', 'point_count']}
              layout={{
                'text-field': '{point_count_abbreviated}',
                'text-size': 12,
              }}
            />
          )}

          {mapType === 'heat' && (
            <Layer
              id='heatmap'
              maxzoom={NO_CLUSTER}
              type='heatmap'
              source='yurbos-map-source'
              paint={{
                // Increase the heatmap weight linearly with zoom
                'heatmap-weight': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  1,
                  1,
                  18,
                  0,
                ],

                // Increase the heatmap color weight weight by zoom level
                // heatmap-intensity is a multiplier on top of heatmap-weight
                'heatmap-intensity': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  0,
                  1,
                  MAX_ZOOM_LEVEL,
                  3,
                ],
                // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                // Begin color ramp at 0-stop with a 0-transparancy color
                // to create a blur-like effect.
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0,
                  'rgba(33,102,172,0)',
                  0.2,
                  'rgb(103,169,207)',
                  0.4,
                  'rgb(209,229,240)',
                  0.6,
                  'rgb(253,219,199)',
                  0.8,
                  'rgb(239,138,98)',
                  0.9,
                  'rgb(255,201,101)',
                ],
                // Adjust the heatmap radius by zoom level
                'heatmap-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  0,
                  2,
                  MAX_ZOOM_LEVEL,
                  20,
                ],
                // Transition from heatmap to circle layer by zoom level
                'heatmap-opacity': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  7,
                  1,
                  9,
                  1,
                ],
              }}
            />
          )}

          <Layer
            id='unclustered-point'
            type='circle'
            source='yurbos-map-source'
            paint={{
              'circle-color': '#11b4da',
              'circle-radius': 6,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#fff',
            }}
            {...(mapType === 'cluster'
              ? { filter: ['!', ['has', 'point_count']] }
              : { minzoom: NO_CLUSTER })}
          />
        </Source>

        {selectedYurbo && (
          <Popup
            anchor='top'
            style={{ fontWeight: 800, color: 'black' }}
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
};

export default MapWithSidebar;
