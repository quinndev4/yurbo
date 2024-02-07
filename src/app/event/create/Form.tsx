'use client';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { YUP } from '../../constants/constants';
import { CreateEventResponse } from '@/types/types';
import { getErrorMessgaeSuccess } from '@/app/constants/errors';

const name = 'eventName';
const label = 'Event Name';

interface Values {
  [name]: string;
}

export default function Form() {
  const onSubmit = async (formikValues: Values) => {
    try {
      const res = await fetch('/api/event', {
        method: 'POST',
        body: JSON.stringify(formikValues),
      });
      const data: CreateEventResponse = await res.json();

      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      alert(
        JSON.stringify(
          { ...formikValues, ...getErrorMessgaeSuccess(error) },
          null,
          2
        )
      );
    }
  };

  const formik = useFormik<Values>({
    initialValues: { [name]: '' },
    validationSchema: Yup.object().shape({
      [name]: Yup.string()
        .min(1, 'Must be at least 1 character')
        .required(YUP.REQUIRED),
    }),
    onSubmit,
  });

  return (
    <div className='2xs:w-4/5 xl:w-1/2 bg-blue-600'>
      <form className='flex flex-col m-5' onSubmit={formik.handleSubmit}>
        <div className='flex flex-col w-full items-start my-5'>
          <label htmlFor={name}>{label} *</label>
          <input
            className='text-black text-left w-1/4 rounded-lg'
            id={name}
            type='text'
            placeholder={` Enter ${label}`}
            {...formik.getFieldProps(name)}
          />
          <p
            className={`text-red-600 h-5 ${
              !formik.errors[name] && 'invisible'
            }`}
          >
            {formik.errors[name]}
          </p>
        </div>

        <button className='btn-primary m-auto' type='submit'>
          Submit
        </button>
      </form>
    </div>
  );
}
