import { zodResolver } from '@hookform/resolvers/zod';
import {
  useForm,
  SubmitHandler,
  FieldValues,
  DefaultValues,
} from 'react-hook-form';
import { ZodType } from 'zod';
import Button from './Button';
import { useEffect } from 'react';

export type Field = {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number';
  options?: { label: string; value: string }[]; // for dropdowns
};

interface FormBuilderProps<T extends FieldValues> {
  schema: ZodType<T>;
  fields: Field[];
  onSubmit: SubmitHandler<T>;
  defaultValues?: DefaultValues<T>;
  submitting: boolean;
}

export default function FormBuilder<T extends FieldValues>({
  schema,
  fields,
  onSubmit,
  defaultValues,
  submitting,
}: FormBuilderProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<T>({ resolver: zodResolver(schema) });

  // reset form if defaultValues change
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      {fields.map(({ name, label, type, options }) => (
        <div key={name}>
          <label className='mb-1'>{label}</label>

          {type === 'textarea' ? (
            <textarea
              {...register(name as any)}
              className='w-full rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:text-white'
            />
          ) : type === 'select' && options ? (
            <select
              {...register(name as any)}
              className='w-full rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:text-white'
            >
              <option value=''>Select an option</option>
              {options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              {...register(name as any)}
              className='w-full rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:text-white'
            />
          )}

          {errors[name as keyof T] && (
            <p className='mt-1 text-sm text-red-600'>
              {(errors[name as keyof T] as any)?.message}
            </p>
          )}
        </div>
      ))}

      <div className='mt-8 flex justify-end'>
        <Button type='submit' disabled={submitting}>
          Submit
        </Button>
      </div>
    </form>
  );
}
