// AccountSettingsPage.js
import React from 'react';
import InputField from '~/components/inputField';
import SelectField from '~/components/selectField';

const FormPage = () => (
  <section className="max-w-4xl p-6 mx-auto bg-indigo-600 rounded-md shadow-md dark:bg-gray-800 mt-20">
    <h1 className="text-xl font-bold text-white capitalize dark:text-white">Account settings</h1>
    <form>
      <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
        <InputField label="Username" id="username" type="text" />
        <InputField label="Email Address" id="emailAddress" type="email" />
        <InputField label="Password" id="password" type="password" />
        <InputField
          label="Password Confirmation"
          id="passwordConfirmation"
          type="password"
        />
        <InputField label="Color" id="color" type="color" />
        <SelectField
          label="Select"
          id="select"
          options={['Surabaya', 'Jakarta', 'Tangerang', 'Bandung']}
        />
        {/* Include other fields as needed */}
      </div>
      <div className="flex justify-end mt-6">
        <button className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-pink-500 rounded-md hover:bg-pink-700 focus:outline-none focus:bg-gray-600">
          Save
        </button>
      </div>
    </form>
  </section>
);

export default FormPage;
