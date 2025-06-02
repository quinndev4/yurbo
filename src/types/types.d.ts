import { Timestamp } from 'firebase/firestore';
import { NextRequest } from 'next/server';
import { Map } from 'immutable';

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

// Create frien
declare interface CreateFriendRequest extends NextRequest {
  body: { friendName: string };
}

declare interface CreateFriendResponse extends GenericResponse {
  message: string;
  success: boolean;
  user_followed: User;
}

declare interface CreateFriendError extends GenericError {
  friend: Friend;
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
declare type Yurbo = DBObject & { event_id: string } & Coordinates & {
    location_id?: string;
  };

declare type Friend = DBObject & { userId: string } & { name: string } & {
  id: string;
  created_at: Timestamp;
};

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

/* Class for a User */
declare interface User {
  id: string;
  name: string;
  searchable_name: string;
  email: string;
  created_at: Timestamp;
}

interface UserDataContext {
  yurbos: Map<string, Yurbo>;
  setYurbos: React.Dispatch<React.SetStateAction<Map<string, Yurbo>>>;
  events: Map<string, Event>;
  setEvents: React.Dispatch<React.SetStateAction<Map<string, Event>>>;
  locations: Map<string, Location>;
  setLocations: React.Dispatch<React.SetStateAction<Map<string, Location>>>;
  following: Map<string, User>;
  setFollowing: React.Dispatch<React.SetStateAction<Map<string, User>>>;
  followers: Map<string, User>;
  setFollowers: React.Dispatch<React.SetStateAction<Map<string, User>>>;
}
