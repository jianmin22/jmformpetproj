import React, { useEffect, useState } from "react";
import { debounce } from "lodash";

interface DateFieldProps {
  question: string;
  userQnsAnsID: string;
  questionID: string;
  dateAns: Date | null;
  onChange: (dateAns: Date | null) => void;
}

const DateField: React.FC<DateFieldProps> = ({
  question,
  userQnsAnsID,
  questionID,
  dateAns,
  onChange,
}) => {
  const [dateValue, setDateValue] = useState(dateAns);

  useEffect(() => {
    setDateValue(dateAns);
  }, [dateAns]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.valueAsDate;
    setDateValue(selectedDate);
    onChange(selectedDate);
  };

  return (
    <div>
      <label className="text-white dark:text-gray-200" htmlFor={questionID}>
        {question}
      </label>
      <input
        type="date"
        id={userQnsAnsID}
        value={dateValue ? dateValue.toISOString().split("T")[0] : ""}
        onChange={handleDateChange}
        className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-500"
      />
    </div>
  );
};

export default DateField;