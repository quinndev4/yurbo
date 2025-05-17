'use client';

import { yurboFormSchema, YurboFormData } from '@/types/forms';
import FormBuilder, { Field } from '@/components/FormBuilder';
import FormLayout from '@/components/FormLayout';
import { useEffect, useState } from 'react';
import { CreateYurboResponse } from '@/types/types';
import { useRouter } from 'next/navigation';
import { getErrorMessgaeSuccess } from '@/app/constants/errors';

export default function CreateYurboPage() {
  const router = useRouter();
  const [locationOptions, setLocationOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [eventOptions, setEventOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const fields: Field[] = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'description', label: 'Description', type: 'text' },
    {
      name: 'event_id',
      label: 'Event',
      type: 'select',
      options: eventOptions,
    },
    {
      name: 'location_id',
      label: 'Location',
      type: 'select',
      options: locationOptions,
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

    fetch('/api/location')
      .then((res) => res.json())
      .then((data) => {
        setLocationOptions(
          data.locations.map((loc: any) => ({
            label: loc.name,
            value: loc.id,
          }))
        );
      });

    fetch('/api/event')
      .then((res) => res.json())
      .then((data) => {
        setEventOptions(
          data.events.map((event: any) => ({
            label: event.name,
            value: event.id,
          }))
        );
      });
  }, []);

  const onSubmit = async (yurbo: YurboFormData) => {
    console.log('Yurbo submitting...', yurbo);

    setSubmitting(true);

    try {
      const res = await fetch('/api/yurbo', {
        method: 'POST',
        body: JSON.stringify(yurbo),
      });

      const data: CreateYurboResponse = await res.json();

      alert(JSON.stringify(data, null, 2));

      router.push('/');
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
