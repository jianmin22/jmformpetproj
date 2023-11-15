// SelectField.tsx
import React from 'react';

interface SelectFieldProps {
  label: string;
  id: string;
  options: string[]; // Add options prop to the interface
}

const SelectField: React.FC<SelectFieldProps> = ({ label, id, options }) => (
  <div>
    <label className="text-white dark:text-gray-200" htmlFor={id}>
      {label}
    </label>
    <select
      id={id}
      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  </div>
);

export default SelectField;
