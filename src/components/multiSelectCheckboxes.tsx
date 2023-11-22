import React, { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import LoadingComponent from './loadingComponent';
import { MultiSelectCheckboxesProps } from '~/types/MultiSelectCheckboxesProps';

const MultiSelectCheckboxes: React.FC<MultiSelectCheckboxesProps> = ({
  question,
  questionID,
  userQnsAnsID,
  optionIDs,
  ansOptionIDs,
  onChange,
}) => {
  const { data: optionDetails, isLoading: dataLoading } = api.form.getOptionDetails.useQuery({ optionIDs });
  const redirectTo = '/';
  const [isRequired, setIsRequired] = useState<boolean>(true);

  useEffect(() => {
    if (!dataLoading && !optionDetails) {
      window.location.href = redirectTo;
    }
  }, [dataLoading, optionDetails]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = e.target.value;
    const updatedValues = e.target.checked
      ? [...ansOptionIDs, selectedValue]
      : ansOptionIDs.filter((value) => value !== selectedValue);

    onChange(updatedValues);
    const atLeastOneChecked = updatedValues.length > 0;
    setIsRequired(!atLeastOneChecked);
  };

  if (dataLoading) {
    return <LoadingComponent />;
  }

  return (
    <div>
      <label className="text-black" id={questionID}>
        {question}
      </label>
      {optionDetails?.map((option) => (
        <div key={option.qnsOptionID} className="flex items-center">
          <input
            type="checkbox"
            id={`${userQnsAnsID}_${option.qnsOptionID}`}
            value={option.qnsOptionID}
            checked={ansOptionIDs.includes(option.qnsOptionID)}
            onChange={handleCheckboxChange}
            name={questionID}
            required={isRequired}
          />
          <label htmlFor={`${userQnsAnsID}_${option.qnsOptionID}`} className="ml-2 text-gray-700 dark:text-gray-300">
            {option.option}
          </label>
        </div>
      ))}
    </div>
  );
};

export default MultiSelectCheckboxes;
