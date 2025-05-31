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

export const createEventSchema = baseFormSchema;

export const createYurboSchema = baseFormSchema
  .merge(coordinatesFormSchema)
  .extend({
    location_id: z.string().optional(),
    event_id: z.string().min(1, 'Event is rquired'),
  });

export const createFriendSchema = z.object({
  email: z.string().email().min(3, 'Email is required'),
});
//   .refine(
//     (data) =>
//       data.location_id ||
//       (typeof data.lat === 'number' && typeof data.long === 'number'),
//     {
//       message: 'location_id is required if lat and long are not provided',
//       path: ['location_id'],
//     }
//   );

// TODO: fix create yurbo type when submitting

// export const createYurboSchema = z.union([
//   baseFormSchema
//     .merge(coordinatesFormSchema)
//     .extend({ event_id: z.string().min(1, 'Event is rquired') }),
//   baseFormSchema.merge(coordinatesFormSchema.partial()).extend({
//     event_id: z.string().min(1, 'Event is rquired'),
//     location_id: z.string().min(1, 'Location or lat/long required'),
//   }),
// ]);

export const createLocationSchema = baseFormSchema.merge(coordinatesFormSchema);

export type YurboFormData = z.infer<typeof createYurboSchema>;
export type FriendFormData = z.infer<typeof createFriendSchema>;
