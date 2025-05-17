import { Timestamp } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

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
  eventName: string;
}

declare interface CreateEventError extends GenericError {
  eventName: string;
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
  location: string;
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

/* Class for a Yurbo */
declare interface Yurbo {
  act_id?: Act;
  created_at: Timestamp;
  location_id: string;
  name: string;
  lat: number;
  long: number;
}

/* Class for Event/Activity */
declare interface Act {
  name: string;
  created_at: Timestamp;
}

declare interface Location {
  name: string;
  lat: number;
  long: number;
}

/* Create Location Types  */
declare interface CreateLocationRequest extends NextRequest {
  body: { name: string; lat: number; long: number };
}

declare interface CreateLocationResponse extends GenericResponse {
  name: string;
}

declare interface CreateLocationError extends GenericError {
  name: string;
}
