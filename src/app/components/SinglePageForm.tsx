'use client';

import * as Yup from 'yup';
import { FormikConfig, FormikValues, useFormik } from 'formik';
import { YUP } from '../constants/constants';

interface Values {
  location: string;
}

interface GenericValues<T> {
  formikConfig: FormikConfig<T>;
}
export default SinglePageForm = ({ formikConfig }) => {
  const formik = useFormik<FormikValues>(formikConfig);

  return (
    <div className='2xs:w-4/5 xl:w-1/2 bg-blue-600'>
      <form className='flex flex-col m-5' onSubmit={formik.handleSubmit}>
        <div className='flex flex-col w-full items-start my-5'>
          <label htmlFor='location'>Location *</label>
          <input
            className='text-black text-left w-1/4'
            id='location'
            type='text'
            placeholder='Enter Location'
            {...formik.getFieldProps('location')}
          />
          <p
            className={`text-red-600 h-5 ${
              !formik.errors.location && 'invisible'
            }`}
          >
            {formik.errors.location}
          </p>
        </div>

        <button className='btn-primary m-auto' type='submit'>
          Submit
        </button>
      </form>
    </div>
  );
};
