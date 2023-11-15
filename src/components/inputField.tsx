// InputField.tsx
import React from 'react';

interface InputFieldProps {
  label: string;
  id: string;
  type: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, type }) => (
  <div>
    <label className="text-white dark:text-gray-200" htmlFor={id}>
      {label}
    </label>
    <input
      id={id}
      type={type}
      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
    />
  </div>
);

export default InputField;
