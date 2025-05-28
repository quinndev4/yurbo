'use client';

import { useRef, useState } from 'react';

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
import { Timestamp } from 'firebase/firestore';

export default function TestMapBasic() {
  const [menuOpen, setIsSidebarOpen] = useState(true);
  const [selectedYurbo, setSelectedYurbo] = useState<Yurbo | null>(null);

  const cardRefs = useRef<{ [id: string]: HTMLLIElement | null }>({});

  const yurbos = Map([
    [
      '1',
      {
        id: '1',
        event_id: 'evt-1',
        name: 'Yurbo Alpha',
        description: 'Exciting place in Seattle.',
        lat: 47.6062,
        long: -122.3321,
        created_at: Timestamp.now(),
      },
    ],
    [
      '2',
      {
        id: '2',
        event_id: 'evt-2',
        name: 'Yurbo Bravo',
        description: 'Vibrant scene in San Francisco.',
        lat: 37.7749,
        long: -122.4194,
        created_at: Timestamp.now(),
      },
    ],
    [
      '3',
      {
        id: '3',
        event_id: 'evt-3',
        name: 'Yurbo Charlie',
        description: 'Cultural hub in Austin.',
        lat: 30.2672,
        long: -97.7431,
        created_at: Timestamp.now(),
      },
    ],
    [
      '4',
      {
        id: '4',
        event_id: 'evt-4',
        name: 'Yurbo Delta',
        description: 'Sunny vibes in Miami.',
        lat: 25.7617,
        long: -80.1918,
        created_at: Timestamp.now(),
      },
    ],
    [
      '5',
      {
        id: '5',
        event_id: 'evt-5',
        name: 'Yurbo Echo',
        description: 'Historic charm in Boston.',
        lat: 42.3601,
        long: -71.0589,
        created_at: Timestamp.now(),
      },
    ],
    [
      '6',
      {
        id: '6',
        event_id: 'evt-6',
        name: 'Yurbo Foxtrot',
        description: 'Lively music in Nashville.',
        lat: 36.1627,
        long: -86.7816,
        created_at: Timestamp.now(),
      },
    ],
    [
      '7',
      {
        id: '7',
        event_id: 'evt-7',
        name: 'Yurbo Golf',
        description: 'Tech core of Silicon Valley.',
        lat: 37.3875,
        long: -122.0575,
        created_at: Timestamp.now(),
      },
    ],
    [
      '8',
      {
        id: '8',
        event_id: 'evt-8',
        name: 'Yurbo Hotel',
        description: 'Jazz roots in New Orleans.',
        lat: 29.9511,
        long: -90.0715,
        created_at: Timestamp.now(),
      },
    ],
    [
      '9',
      {
        id: '9',
        event_id: 'evt-9',
        name: 'Yurbo India',
        description: 'Desert art in Santa Fe.',
        lat: 35.687,
        long: -105.9378,
        created_at: Timestamp.now(),
      },
    ],
    [
      '10',
      {
        id: '10',
        event_id: 'evt-10',
        name: 'Yurbo Juliet',
        description: 'Space vibes in Houston.',
        lat: 29.7604,
        long: -95.3698,
        created_at: Timestamp.now(),
      },
    ],
    [
      '11',
      {
        id: '11',
        event_id: 'evt-11',
        name: 'Yurbo Kilo',
        description: 'Urban pulse in Chicago.',
        lat: 41.8781,
        long: -87.6298,
        created_at: Timestamp.now(),
      },
    ],
    [
      '12',
      {
        id: '12',
        event_id: 'evt-12',
        name: 'Yurbo Lima',
        description: 'Nature meets city in Denver.',
        lat: 39.7392,
        long: -104.9903,
        created_at: Timestamp.now(),
      },
    ],
    [
      '13',
      {
        id: '13',
        event_id: 'evt-13',
        name: 'Yurbo Mike',
        description: 'Capitol action in D.C.',
        lat: 38.9072,
        long: -77.0369,
        created_at: Timestamp.now(),
      },
    ],
    [
      '14',
      {
        id: '14',
        event_id: 'evt-14',
        name: 'Yurbo November',
        description: 'Old west in Phoenix.',
        lat: 33.4484,
        long: -112.074,
        created_at: Timestamp.now(),
      },
    ],
    [
      '15',
      {
        id: '15',
        event_id: 'evt-15',
        name: 'Yurbo Oscar',
        description: 'Beaches and nightlife in LA.',
        lat: 34.0522,
        long: -118.2437,
        created_at: Timestamp.now(),
      },
    ],
    [
      '16',
      {
        id: '16',
        event_id: 'evt-16',
        name: 'Yurbo Papa',
        description: 'Live energy in Atlanta.',
        lat: 33.749,
        long: -84.388,
        created_at: Timestamp.now(),
      },
    ],
    [
      '17',
      {
        id: '17',
        event_id: 'evt-17',
        name: 'Yurbo Quebec',
        description: 'Mountain air in Salt Lake City.',
        lat: 40.7608,
        long: -111.891,
        created_at: Timestamp.now(),
      },
    ],
    [
      '18',
      {
        id: '18',
        event_id: 'evt-18',
        name: 'Yurbo Romeo',
        description: 'History meets tech in Philadelphia.',
        lat: 39.9526,
        long: -75.1652,
        created_at: Timestamp.now(),
      },
    ],
    [
      '19',
      {
        id: '19',
        event_id: 'evt-19',
        name: 'Yurbo Sierra',
        description: 'Chill lifestyle in Portland.',
        lat: 45.5051,
        long: -122.675,
        created_at: Timestamp.now(),
      },
    ],
    [
      '20',
      {
        id: '20',
        event_id: 'evt-20',
        name: 'Yurbo Tango',
        description: 'Bright lights of Las Vegas.',
        lat: 36.1699,
        long: -115.1398,
        created_at: Timestamp.now(),
      },
    ],
    [
      '21',
      {
        id: '21',
        event_id: 'evt-21',
        name: 'Yurbo Uniform',
        description: 'Capital cool in Sacramento.',
        lat: 38.5816,
        long: -121.4944,
        created_at: Timestamp.now(),
      },
    ],
    [
      '22',
      {
        id: '22',
        event_id: 'evt-22',
        name: 'Yurbo Victor',
        description: 'Old town vibes in Charleston.',
        lat: 32.7765,
        long: -79.9311,
        created_at: Timestamp.now(),
      },
    ],
    [
      '23',
      {
        id: '23',
        event_id: 'evt-23',
        name: 'Yurbo Whiskey',
        description: 'Arts in Minneapolis.',
        lat: 44.9778,
        long: -93.265,
        created_at: Timestamp.now(),
      },
    ],
    [
      '24',
      {
        id: '24',
        event_id: 'evt-24',
        name: 'Yurbo X-ray',
        description: 'Downtown energy in Detroit.',
        lat: 42.3314,
        long: -83.0458,
        created_at: Timestamp.now(),
      },
    ],
    [
      '25',
      {
        id: '25',
        event_id: 'evt-25',
        name: 'Yurbo Yankee',
        description: 'Rust belt resurgence in Cleveland.',
        lat: 41.4993,
        long: -81.6944,
        created_at: Timestamp.now(),
      },
    ],
    [
      '26',
      {
        id: '26',
        event_id: 'evt-26',
        name: 'Yurbo Zulu',
        description: 'Southern charm in Savannah.',
        lat: 32.0809,
        long: -81.0912,
        created_at: Timestamp.now(),
      },
    ],
    [
      '27',
      {
        id: '27',
        event_id: 'evt-27',
        name: 'Yurbo Ace',
        description: 'Hill country in San Antonio.',
        lat: 29.4241,
        long: -98.4936,
        created_at: Timestamp.now(),
      },
    ],
    [
      '28',
      {
        id: '28',
        event_id: 'evt-28',
        name: 'Yurbo Blaze',
        description: 'Great lakes city in Milwaukee.',
        lat: 43.0389,
        long: -87.9065,
        created_at: Timestamp.now(),
      },
    ],
    [
      '29',
      {
        id: '29',
        event_id: 'evt-29',
        name: 'Yurbo Crest',
        description: 'Rocky Mountain views in Boulder.',
        lat: 40.01499,
        long: -105.27055,
        created_at: Timestamp.now(),
      },
    ],
    [
      '30',
      {
        id: '30',
        event_id: 'evt-30',
        name: 'Yurbo Drift',
        description: 'Bayou life in Baton Rouge.',
        lat: 30.4515,
        long: -91.1871,
        created_at: Timestamp.now(),
      },
    ],
  ]);

  const handleMarkerClick = (id: string) => {
    const card = cardRefs.current[id];
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (!menuOpen) setIsSidebarOpen(true);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);

    if (mapRef.current) {
      mapRef.current.easeTo({
        padding: {
          left: isSidebarOpen ? 0 : 300, // Adjust this value based on your sidebar width
          top: 0,
          right: 0,
          bottom: 0,
        },
        duration: 1000, // Duration in milliseconds
      });
    }
  };

  console.log('jheyo', [...yurbos]);

  return (
    <div className='flex h-full w-full'>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        style={{
          position: 'absolute',
          top: 20,
          left: isSidebarOpen ? 320 : 20,
          zIndex: 2,
        }}
      >
        {isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
      </button>

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
            <Pin size={selectedYurbo?.id === yurbo.id ? 50 : 20} />
          </Marker>
        ))}

        {selectedYurbo && (
          <Popup
            anchor='top'
            longitude={selectedYurbo.long}
            latitude={selectedYurbo.lat}
            onClose={() => setSelectedYurbo(null)}
          >
            <span className='font-extrabold text-black'>
              {selectedYurbo.name}
            </span>
          </Popup>
        )}
      </MapComponent>

      {/* Yurbo list */}

      <div
        className={`fixed top-0 right-0 z-30 h-full w-72 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
      >
        <h2 className='border-b p-4 text-xl font-bold'>Yurbos</h2>
        <ul className='space-y-4 p-4'>
          {[...yurbos].map(([, yurbo]) => (
            <li
              key={yurbo.id}
              ref={(el) => {
                cardRefs.current[yurbo.id] = el;
              }}
              className='rounded-lg bg-gray-100 p-4 shadow transition hover:shadow-md'
              onClick={() => {
                handleMarkerClick(yurbo.id);
                setSelectedYurbo(yurbo);
              }}
            >
              <h3 className='font-semibold'>{yurbo.name}</h3>
              <p className='text-sm text-gray-600'>{yurbo.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
