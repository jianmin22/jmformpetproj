import React, {useState, useEffect} from 'react';
import { api } from "~/utils/api";

interface MultiSelectCheckboxesProps {
  question: string;
  userQnsAnsID: string;
  questionID: string;
  ansOptionIDs: string[];
  optionIDs: string[]; 
  onChange: (selectedValues: string[]) => void;
}

const MultiSelectCheckboxes: React.FC<MultiSelectCheckboxesProps> = ({ question, questionID, userQnsAnsID, optionIDs, ansOptionIDs, onChange }) => {
    const { data: optionDetails, isLoading: dataLoading } =api.form.getOptionDetails.useQuery({ optionIDs });
    const [ansOptionIDsLocal, setAnsOptionIDsLocal]=useState(ansOptionIDs);
    const redirectTo = "/";
    if(dataLoading){
      return <div>Loading</div>
    }
    else if (!optionDetails) {
      window.location.href = redirectTo;
      return;
    }

    const handleCheckboxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedValue = e.target.value;
      const updatedValues = e.target.checked
        ? [...ansOptionIDsLocal, selectedValue]
        : ansOptionIDsLocal.filter((value) => value !== selectedValue);
        setAnsOptionIDsLocal(updatedValues)
      onChange(updatedValues);
    }

    return(
  <div>
    <label className="text-white dark:text-gray-200" id={questionID}>
      {question}
    </label>
    {optionDetails.map((option) => (
      <div key={option.qnsOptionID} className="flex items-center">
        <input
            type="checkbox"
            id={`${userQnsAnsID}_${option.qnsOptionID}`}
            value={option.qnsOptionID}
            checked={ansOptionIDsLocal.includes(option.qnsOptionID)}
            onChange={handleCheckboxChange}
          />
          <label htmlFor={`${userQnsAnsID}_${option.qnsOptionID}`} className="ml-2 text-gray-700 dark:text-gray-300">
            {option.option}
          </label>
      </div>
    ))}
  </div>
  )
};

export default MultiSelectCheckboxes;
