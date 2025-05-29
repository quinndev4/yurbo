'use client';

import { useAction } from 'next-safe-action/hooks';

import { createYurboSchema, YurboFormData } from '@/schemas/db';
import FormBuilder, { Field } from '@/components/FormBuilder';
import FormLayout from '@/components/FormLayout';
import { useEffect, useState } from 'react';
import { getErrorMessgaeSuccess } from '@/constants/errors';
import { useUserData } from '@/providers/UserProvider';
import { createYurbo } from '@/actions/db';
import { useRouter } from 'next/navigation';

export default function CreateYurboPage() {
  const router = useRouter();

  const { events, locations } = useUserData();

  const { execute } = useAction(createYurbo, {
    onSuccess: ({ data }) => {
      alert(JSON.stringify(data, null, 2));

      if (data?.yurbo.id) {
        // const location =
        // if ('location_id' in data.yurbo) {
        //   const location = locations.get(data.yurbo.location_id)
        // } else {
        //   const a = data.yurbo;
        //   setYurbos((oldEvents) => oldEvents.set(data.yurbo.id, a));
        // }
        // const yurbo = data.yurbo;
        // if ('location_id' in yurbo) {
        //   const a = yurbo
        //   const location = locations.get(yurbo.location_id);
        //   yurbo.lat = location?.lat || 1;
        //   yurbo.long = location?.long || 1;
        // } else {
        //   const b = yurbo
        // }
        // setYurbos((oldEvents) => oldEvents.set(yurbo.id, yurbo));
        // const location =
        //   'location_id' in yurbo && locations.get(data.yurbo.location_id);
        // const yurbo =
        //   'location_id' in data.yurbo
        //     ? { ...data.yurbo, lat: location.lat, long: location.long }
        //     : data.yurbo;
      }

      router.push('/');
    },
    onError: (res) => {
      alert(
        JSON.stringify(
          { ...res.input, ...getErrorMessgaeSuccess(res.error) },
          null,
          2
        )
      );
    },
    onExecute: ({ input }) => {
      console.log('Location submitting...', input);
    },
  });

  const fields: Field[] = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'description', label: 'Description', type: 'text' },
    {
      name: 'event_id',
      label: 'Event',
      type: 'select',
      options: [...events].map(([, event]) => ({
        label: `${event.name} - ${event.description}`,
        value: event.id,
      })),
    },
    {
      name: 'location_id',
      label: 'Location',
      type: 'select',
      options: [...locations].map(([, loc]) => ({
        label: `${loc.name} - ${loc.description}`,
        value: loc.id,
      })),
    },
    { name: 'lat', label: 'Latitude', type: 'text' },
    { name: 'long', label: 'Longitude', type: 'text' },
  ];

  const [geoDefaults, setGeoDefaults] = useState<Partial<YurboFormData>>({});

  console.log(geoDefaults);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((position) => {
      setGeoDefaults({
        lat: position.coords.latitude,
        long: position.coords.longitude,
      });
    });
  }, []);

  return (
    <FormLayout title='Create Yurbo'>
      <FormBuilder
        schema={createYurboSchema}
        fields={fields}
        defaultValues={geoDefaults} // dynamic geo values
        execute={(a) => {
          console.log('a', a);
          execute(a);
        }}
      />
    </FormLayout>
  );
}
