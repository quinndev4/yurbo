import { Yurbo } from '@/types/types';
import MapboxMap from '../components/MapboxMap';
import { getYurbos } from '../actions/getYurbos';

export default async function Map() {
  let mapbox_token = process.env.MAPBOX_PUBLIC_TOKEN;

  const yurbos = await getYurbos();

  console.log('Yurboooos', yurbos);

  //   make sure types are correct
  if (mapbox_token === undefined) {
    console.log('Token is undefined ..');
    mapbox_token = '';
  }

  return (
    <div className='flex h-screen'>
      {/* Left Screen: List of Yurbos */}
      <div className='hidden sm:block md:w-1/2 md:h-screen md:pt-16 md:ml-5'>
        <div className='flex flex-row justify-between mr-5 border-b mb-2 pb-1'>
          <h2 className='font-bold text-lg'>Your Yurbos</h2>
          <h2 className='font-bold'>Coordinates</h2>
          <h2 className='font-bold'>Created on</h2>
        </div>

        <ul>
          {yurbos?.map((y: Yurbo) => (
            <div key={y.id} className='flex flex-row justify-between'>
              <li className=''>{y.location_id}</li>
              <li className='pr-2'>
                {y.lat} x {y.long}
              </li>
              {y.created_at && (
                <li className='pr-4'>
                  {new Date(y.created_at.seconds * 1000).toLocaleDateString()}
                </li>
              )}
            </div>
          ))}
        </ul>
      </div>

      {/* Right Screen: Map */}
      <div className='h-full w-full md:w-1/2'>
        <MapboxMap mapboxToken={mapbox_token} yurbos={yurbos} />
      </div>
    </div>
  );
}
