import React, {useState, useEffect} from "react";
import { api } from "~/utils/api";

interface DropdownSelectFieldProps {
  question: string;
  userQnsAnsID: string;
  questionID: string;
  ansOptionID: string|null;
  optionIDs: string[];
  onChange: (selectedValue: string) => void;
}

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
  
  const [ansOptionIDValue, setAnsOptionIDValue] = useState(ansOptionID);
  const { data: optionDetails, isLoading: dataLoading } =
    api.form.getOptionDetails.useQuery({ optionIDs });
  const redirectTo = "/";
  if(dataLoading){
    return <div>Loading</div>
  }
  else if (!optionDetails) {
    window.location.href = redirectTo;
    return;
  }

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value;
    setAnsOptionIDValue(selectedOption);
    onChange(selectedOption);
  };
  

  return (
    <div>
      <label className="text-white dark:text-gray-200" id={questionID}>
        {question}
      </label>
      <select
        id={userQnsAnsID}
        value={ansOptionIDValue}
        onChange={handleOptionChange}
        className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-500"
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
