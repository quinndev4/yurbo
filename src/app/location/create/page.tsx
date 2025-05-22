'use client';

import { locationFormSchema, LocationFormData } from '@/types/forms';
import FormBuilder, { Field } from '@/components/FormBuilder';
import FormLayout from '@/components/FormLayout';
import { useEffect, useState } from 'react';
import { CreateLocationResponse } from '@/types/types';
import { getErrorMessgaeSuccess } from '@/constants/errors';
import { useRouter } from 'next/navigation';
import { C } from '@/constants/constants';
import { useSession } from 'next-auth/react';

export default function CreateLocationPage() {
  const { data: session } = useSession();

  const router = useRouter();

  const fields: Field[] = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'description', label: 'Description', type: 'text' },
    { name: 'lat', label: 'Latitude', type: 'text' },
    { name: 'long', label: 'Longitude', type: 'text' },
  ];

  const [geoDefaults, setGeoDefaults] = useState<Partial<LocationFormData>>({});
  const [submitting, setSubmitting] = useState(false);

  console.log(geoDefaults);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((position) => {
      setGeoDefaults({
        lat: position.coords.latitude,
        long: position.coords.longitude,
      });
    });
  }, []);

  const onSubmit = async (location: LocationFormData) => {
    console.log('Location submitting...', location);

    setSubmitting(true);

    try {
      const res = await fetch(C.ROUTES.locations(session?.user?.id), {
        method: 'POST',
        body: JSON.stringify(location),
      });

      const data: CreateLocationResponse = await res.json();

      alert(JSON.stringify(data, null, 2));

      router.push('/');
    } catch (error) {
      alert(
        JSON.stringify(
          { ...location, ...getErrorMessgaeSuccess(error) },
          null,
          2
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormLayout title='Create Location'>
      <FormBuilder
        schema={locationFormSchema}
        fields={fields}
        onSubmit={onSubmit}
        defaultValues={geoDefaults} // dynamic geo values
        submitting={submitting}
      />
    </FormLayout>
  );
}
