import React from "react";
import { api } from "~/utils/api";
import LoadingComponent from "./loadingComponent";
import { DropdownSelectFieldProps } from "~/types/DropdownSelectFieldProps";

const DropdownSelectField: React.FC<DropdownSelectFieldProps> = ({
  question,
  questionID,
  userQnsAnsID,
  ansOptionID,
  optionIDs,
  onChange,
}) => {
  if(!ansOptionID){
ansOptionID="";
  }

  const { data: optionDetails, isLoading: dataLoading } =
    api.form.getOptionDetails.useQuery({ optionIDs });
  const redirectTo = "/";
  if(dataLoading){
    return <LoadingComponent />
  }
  else if (!optionDetails) {
    window.location.href = redirectTo;
    return;
  }

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value;
    onChange(selectedOption);
  };
  

  return (
    <div>
      <label className="text-black" id={questionID}>
        {question}
      </label>
      <select
        id={userQnsAnsID}
        value={ansOptionID}
        onChange={handleOptionChange}
        className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-500"
        required
      >
        {optionDetails.map((option) => (
          <option key={option.qnsOptionID} value={option.qnsOptionID}>
            {option.option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownSelectField;
