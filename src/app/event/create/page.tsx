'use client';

import { eventFormSchema, EventFormData } from '@/types/forms';
import FormBuilder, { Field } from '@/components/FormBuilder';
import FormLayout from '@/components/FormLayout';
import { useState } from 'react';
import { CreateEventResponse } from '@/types/types';
import { useRouter } from 'next/navigation';
import { getErrorMessgaeSuccess } from '@/constants/errors';
import { C } from '@/constants/constants';
import { useSession } from 'next-auth/react';
import { useUserData } from '@/components/UserDataProvider';

export default function CreateEventPage() {
  const { data: session } = useSession();

  const router = useRouter();

  const { setEvents } = useUserData();

  const fields: Field[] = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'description', label: 'Description', type: 'text' },
  ];

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (location: EventFormData) => {
    console.log('Location submitting...', location);

    setSubmitting(true);

    try {
      const res = await fetch(C.ROUTES.events(session?.user?.id), {
        method: 'POST',
        body: JSON.stringify(location),
      });

      const data: CreateEventResponse = await res.json();

      alert(JSON.stringify(data, null, 2));

      setEvents((oldEvents) => [data.event, ...oldEvents]);

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
    <FormLayout title='Create Event'>
      <FormBuilder
        schema={eventFormSchema}
        fields={fields}
        onSubmit={onSubmit}
        submitting={submitting}
      />
    </FormLayout>
  );
}
