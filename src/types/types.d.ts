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

declare interface GenericFormField<T> {
  yup: Yup.Object;
  initialValue: T;
  Component: React.ComponentType<GenericFormFieldComponent<T>>;
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
  body: { location: string };
}

declare interface CreateYurboResponse extends GenericResponse {
  location: string;
}

declare interface CreateYurboError extends GenericError {
  location: string;
}

/*

declare interface GenericFormFieldComponent
  extends HTMLProps<HTMLInputElement> {
  id: string;
  label: string;
  error: string | undefined;
}

declare interface GenericFormField<T> {
  yup: Yup.Object;
  Component: React.ComponentType<GenericFormFieldComponent>;
}

declare interface GenericFormProps<> {
  fields: GenericFormField[];
  onSubmit: FormEventHandler<HTMLFormElement>;
}


*/
