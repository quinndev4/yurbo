'use client';

import { yurboFormSchema, YurboFormData } from '@/types/forms';
import FormBuilder, { Field } from '@/components/FormBuilder';
import FormLayout from '@/components/FormLayout';
import { useEffect, useState } from 'react';
import { CreateYurboResponse } from '@/types/types';
import { getErrorMessgaeSuccess } from '@/constants/errors';
import { useUserData } from '@/components/UserDataProvider';
import { useSession } from 'next-auth/react';
import { C } from '@/constants/constants';

export default function CreateYurboPage() {
  const { data: session } = useSession();

  const { events, locations, setYurbos } = useUserData();

  const fields: Field[] = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'description', label: 'Description', type: 'text' },
    {
      name: 'event_id',
      label: 'Event',
      type: 'select',
      options: events.map((event) => ({
        label: `${event.name} - ${event.description}`,
        value: event.id,
      })),
    },
    {
      name: 'location_id',
      label: 'Location',
      type: 'select',
      options: locations.map((loc) => ({
        label: `${loc.name} - ${loc.description}`,
        value: loc.id,
      })),
    },
    { name: 'lat', label: 'Latitude', type: 'text' },
    { name: 'long', label: 'Longitude', type: 'text' },
  ];

  const [geoDefaults, setGeoDefaults] = useState<Partial<YurboFormData>>({});
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

  const onSubmit = async (yurbo: YurboFormData) => {
    console.log('Yurbo submitting...', yurbo);

    setSubmitting(true);

    try {
      const res = await fetch(C.ROUTES.events(session?.user?.id), {
        method: 'POST',
        body: JSON.stringify(yurbo),
      });

      const data: CreateYurboResponse = await res.json();

      alert(JSON.stringify(data, null, 2));

      setYurbos((oldYurbos) => [data.yurbo, ...oldYurbos]);
    } catch (error) {
      alert(
        JSON.stringify({ ...yurbo, ...getErrorMessgaeSuccess(error) }, null, 2)
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormLayout title='Create Yurbo'>
      <FormBuilder
        schema={yurboFormSchema}
        fields={fields}
        onSubmit={onSubmit}
        defaultValues={geoDefaults} // dynamic geo values
        submitting={submitting}
      />
    </FormLayout>
  );
}
