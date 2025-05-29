'use client';

import { useAction } from 'next-safe-action/hooks';

import { createEventSchema } from '@/schemas/db';
import FormBuilder, { Field } from '@/components/FormBuilder';
import FormLayout from '@/components/FormLayout';
import { useRouter } from 'next/navigation';
import { getErrorMessgaeSuccess } from '@/constants/errors';
import { useUser } from '@/providers/UserProvider';
import { createEvent } from '@/actions/db';

export default function CreateEventPage() {
  const router = useRouter();

  const { setEvents } = useUser();

  const { execute } = useAction(createEvent, {
    onSuccess: ({ data }) => {
      alert(JSON.stringify(data, null, 2));

      if (data?.event.id) {
        setEvents((oldEvents) => oldEvents.set(data.event.id, data.event));
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
      console.log('Event submitting...', input);
    },
  });

  const fields: Field[] = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'description', label: 'Description', type: 'text' },
  ];

  return (
    <FormLayout title='Create Event'>
      <FormBuilder
        schema={createEventSchema}
        execute={execute}
        fields={fields}
      />
    </FormLayout>
  );
}
