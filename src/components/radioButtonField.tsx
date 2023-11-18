import React, {useEffect, useState} from "react";
import { api } from "~/utils/api";

interface RadioButtonFieldProps {
  question: string;
  userQnsAnsID: string;
  questionID: string;
  ansOptionID: string | null;
  optionIDs: string[];
  onChange: (selectedValue: string) => void;
}

const RadioButtonField: React.FC<RadioButtonFieldProps> = ({
  question,
  questionID,
  userQnsAnsID,
  ansOptionID,
  optionIDs,
  onChange,
}) => {
  if (!ansOptionID) {
    ansOptionID = "";
  }
  const [ansOptionIDValue, setAnsOptionIDValue] = useState(ansOptionID);
  const { data: optionDetails, isLoading: dataLoading } =
    api.form.getOptionDetails.useQuery({ optionIDs });
  const redirectTo = "/";
  if (dataLoading) {
    return <div>Loading</div>;
  } else if (!optionDetails) {
    window.location.href = redirectTo;
    return;
  }
  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOption = e.target.value;
    setAnsOptionIDValue(selectedOption);
    onChange(selectedOption);
  };

  return (
    <div>
      <label className="text-white dark:text-gray-200" id={questionID}>
        {question}
      </label>
      <div className="mt-2">
        {optionDetails.map((option) => (
          <div key={option.qnsOptionID} className="flex items-center">
            <input
              type="radio"
              id={`${userQnsAnsID}_${option.qnsOptionID}`}
              value={option.qnsOptionID}
              checked={ansOptionIDValue === option.qnsOptionID}
              onChange={handleOptionChange}
              className="mr-2"
            />
            <label
              htmlFor={`${userQnsAnsID}_${option.qnsOptionID}`}
              className="text-gray-700 dark:text-gray-300"
            >
              {option.option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioButtonField;