import React, {useEffect, useState} from "react";
import { api } from "~/utils/api";
import LoadingComponent from "./loadingComponent";
import { RadioButtonFieldProps } from "~/types/RadioButtonFieldProps";

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
  const { data: optionDetails, isLoading: dataLoading } =
    api.form.getOptionDetails.useQuery({ optionIDs });
  const redirectTo = "/";
  if (dataLoading) {
    return <LoadingComponent />;
  } else if (!optionDetails) {
    window.location.href = redirectTo;
    return;
  }
  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOption = e.target.value;
    onChange(selectedOption);
  };

  return (
    <div>
      <label className="text-black" id={questionID}>
        {question}
      </label>
      <div className="mt-2">
        {optionDetails.map((option) => (
          <div key={option.qnsOptionID} className="flex items-center">
            <input
              type="radio"
              id={`${userQnsAnsID}_${option.qnsOptionID}`}
              value={option.qnsOptionID}
              checked={ansOptionID === option.qnsOptionID}
              onChange={handleOptionChange}
              className="mr-2"
              required
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
