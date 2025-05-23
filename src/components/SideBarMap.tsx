import React, { useEffect, useRef, useState } from 'react';
import {
  Map as MapComponent,
  Marker,
  MapRef,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  Popup,
} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Map } from 'immutable';
import { Timestamp } from 'firebase/firestore';
import Pin from './Pin';
import { Yurbo } from '@/types/types';

const MapWithSidebar = () => {
  const mapRef = useRef<MapRef>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedYurbo, setSelectedYurbo] = useState<Yurbo | null>(null);

  const cardRefs = useRef<{ [id: string]: HTMLLIElement | null }>({});

  const scrollToYurbo = (yurbo: Yurbo) => {
    // Scroll to the corresponding card
    cardRefs.current[yurbo.id]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    const map = mapRef.current?.getMap();

    console.log('hey', map);

    map?.flyTo({
      center: [yurbo.long, yurbo.lat],
      zoom: 12, // Adjust zoom level as needed
      speed: 1.2, // Animation speed
      curve: 1.42, // Animation curve
      easing: (t) => t, // Easing function
      essential: true, // This animation is considered essential
    });

    setSelectedYurbo(yurbos.get(yurbo.id) ?? null);
  };

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

  //   useEffect(() => {
  //     if (mapRef.current && yurbos.size) {
  //       const map = mapRef.current.getMap();

  //       const lats = [...yurbos].map(([, y]) => y.lat);
  //       const lngs = [...yurbos].map(([, y]) => y.long);

  //       const minLat = Math.min(...lats);
  //       const maxLat = Math.max(...lats);
  //       const minLng = Math.min(...lngs);
  //       const maxLng = Math.max(...lngs);

  //       map.fitBounds(
  //         [
  //           [minLng, minLat],
  //           [maxLng, maxLat],
  //         ],
  //         {
  //           padding: {
  //             left: isSidebarOpen ? 300 : 50, // Adjust based on sidebar width
  //             right: 50,
  //             top: 50,
  //             bottom: 50,
  //           },
  //           duration: 1000,
  //         }
  //       );
  //     }
  //   }, [yurbos, isSidebarOpen]);

  // useEffect(() => {
  //   if (mapRef.current && yurbos.size) {
  //     const map = mapRef.current.getMap();

  //     const lats = [...yurbos].map(([, y]) => y.lat);
  //     const lngs = [...yurbos].map(([, y]) => y.long);

  //     const minLat = Math.min(...lats);
  //     const maxLat = Math.max(...lats);
  //     const minLng = Math.min(...lngs);
  //     const maxLng = Math.max(...lngs);

  //     map.fitBounds(
  //       [
  //         [minLng, minLat],
  //         [maxLng, maxLat],
  //       ],
  //       {
  //         padding: 100, // Adjust padding as needed
  //         duration: 1000, // Animation duration in milliseconds
  //       }
  //     );
  //   }
  // }, [yurbos]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);

    mapRef.current?.getMap()?.easeTo({
      padding: {
        left: isSidebarOpen ? 0 : 300, // Adjust based on sidebar width
        top: 0,
        right: 0,
        bottom: 0,
      },
      duration: 1000, // Duration in milliseconds
    });
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
          onClick={toggleSidebar}
          className='mt-4 ml-6 h-10 w-10 rounded-lg bg-white text-black shadow-lg hover:cursor-pointer focus:outline-none'
        >
          {isSidebarOpen ? <span>&larr;</span> : <span>&rarr;</span>}
        </button>
      </div>

      {/* Map Container */}
      <MapComponent
        ref={mapRef}
        initialViewState={{
          latitude: 40,
          longitude: -100,
          zoom: 3.5,
          bearing: 0,
          pitch: 0,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle='https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
      >
        <GeolocateControl position='top-right' />
        <FullscreenControl position='top-right' />
        <NavigationControl position='top-right' />
        <ScaleControl />

        {[...yurbos].map(([, yurbo]) => (
          <Marker
            key={`marker-${yurbo.id}`}
            longitude={yurbo.long}
            latitude={yurbo.lat}
            anchor='bottom'
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              scrollToYurbo(yurbo);
            }}
          >
            <Pin selected={selectedYurbo?.id === yurbo.id} />
          </Marker>
        ))}

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
