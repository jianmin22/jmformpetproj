import React, { useEffect, useState } from "react";

interface InputFieldProps {
  question: string;
  userQnsAnsID: string;
  questionID: string;
  answer: string | null;
  onChange: (answer: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  question,
  userQnsAnsID,
  questionID,
  answer,
  onChange,
}) => {
  if (!answer) {
    answer = "";
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value;
    onChange(newInputValue);
  };
  return (
    <div>
      <label className="text-black" htmlFor={questionID}>
        {question}
      </label>
      <input
        type="text"
        id={userQnsAnsID}
        value={answer}
        onChange={handleInputChange}
        className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring"
      />
    </div>
  );
};

export default InputField;
