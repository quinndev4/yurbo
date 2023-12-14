declare type OkRes = {
  ok: string;
};

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
