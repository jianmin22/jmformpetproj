export interface MultiSelectCheckboxesProps {
    question: string;
    userQnsAnsID: string;
    questionID: string;
    ansOptionIDs: string[];
    optionIDs: string[];
    onChange: (selectedValues: string[]) => void;
  }