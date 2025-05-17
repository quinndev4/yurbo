import { z } from 'zod';

export const baseFormSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  description: z.string().optional(),
});

const coordinatesFormSchema = z.object({
  lat: z.coerce
    .number()
    .max(90, 'Over max latitude')
    .min(-90, 'Under min latitude'),
  long: z.coerce
    .number()
    .max(180, 'Over max longitude')
    .min(-180, 'Under min longitude'),
});

export const eventFormSchema = z.object({
  ...baseFormSchema.shape,
});

export const yurboFormSchema = z.object({
  ...baseFormSchema.shape,
  ...coordinatesFormSchema.shape,
  location_id: z.string().optional(),
  event_id: z.string().min(1, 'Event is rquired'),
});

export const locationFormSchema = z.object({
  ...baseFormSchema.shape,
  ...coordinatesFormSchema.shape,
});

export type EventFormData = z.infer<typeof eventFormSchema>;
export type YurboFormData = z.infer<typeof yurboFormSchema>;
export type LocationFormData = z.infer<typeof locationFormSchema>;
