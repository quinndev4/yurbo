import { Timestamp } from 'firebase/firestore';
import { NextRequest } from 'next/server';

type Never<T> = {
  [K in keyof T]?: never;
};

interface GenericResponse {
  success: boolean;
  message: string;
}

declare interface GenericError extends Error, GenericResponse {}

declare interface GenericFormFieldComponent<T> extends T {
  id: string;
  label: string;
  error: string | undefined;
}

declare interface GenericFormProps<> {
  fields: GenericFormField[];
  onSubmit: FormEventHandler<HTMLFormElement>;
}

/* Create Event Types  */
declare interface CreateEventRequest extends NextRequest {
  body: { eventName: string };
}

declare interface CreateEventResponse extends GenericResponse {
  event: Event;
}

declare interface CreateEventError extends GenericError {
  event: Event;
}

/* Create Yurbo Types  */
declare interface CreateYurboRequest extends NextRequest {
  body: {
    location_id?: string;
    lat: number;
    long: number;
    description?: string;
  };
}

declare interface CreateYurboResponse extends GenericResponse {
  yurbo: Yurbo;
}

declare interface CreateYurboError extends GenericError {
  location: string;
}

/* Get Yurbo Types */
declare interface GetYurbosResponse extends GenericResponse {
  yurbos: Yurbo[];
}

declare interface GetYurbosError extends GenericError {
  yurbos: Yurbo[];
}

declare interface DBObject {
  id: string;
  name: string;
  description?: string;
  created_at: Timestamp;
}

interface Coordinates {
  lat: number;
  long: number;
}

/* Class for a Yurbo */
type Yurbo = DBObject & { event_id: string } & (
    | ({ location_id: string } & Never<Coordinates>)
    | (Coordinates & { location_id?: never })
  );

/* Class for Event/Activity */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
declare interface Event extends DBObject {}

declare interface Location extends DBObject, Coordinates {}

/* Create Location Types  */
declare interface CreateLocationRequest extends NextRequest {
  body: { name: string; lat: number; long: number };
}

declare interface CreateLocationResponse extends GenericResponse {
  location: Location;
}

declare interface CreateLocationError extends GenericError {
  name: string;
}
