'use client';

import { useAction } from 'next-safe-action/hooks';

import { createLocationSchema, LocationFormData } from '@/schemas/db';
import FormBuilder, { Field } from '@/components/FormBuilder';
import FormLayout from '@/components/FormLayout';
import { useEffect, useState } from 'react';
import { getErrorMessgaeSuccess } from '@/constants/errors';
import { useRouter } from 'next/navigation';
import { useUserData } from '@/providers/UserProvider';
import { createLocation } from '@/actions/db';

export default function CreateLocationPage() {
  const router = useRouter();

  const { setLocations } = useUserData();

  const { execute } = useAction(createLocation, {
    onSuccess: ({ data }) => {
      alert(JSON.stringify(data, null, 2));

      if (data?.location.id) {
        setLocations((oldEvents) =>
          oldEvents.set(data.location.id, data.location)
        );
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
    { name: 'lat', label: 'Latitude', type: 'text' },
    { name: 'long', label: 'Longitude', type: 'text' },
  ];

  const [geoDefaults, setGeoDefaults] = useState<Partial<LocationFormData>>({});

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((position) => {
      setGeoDefaults({
        lat: position.coords.latitude,
        long: position.coords.longitude,
      });
    });
  }, []);

  return (
    <FormLayout title='Create Location'>
      <FormBuilder
        schema={createLocationSchema}
        fields={fields}
        defaultValues={geoDefaults} // dynamic geo values
        execute={execute}
      />
    </FormLayout>
  );
}
