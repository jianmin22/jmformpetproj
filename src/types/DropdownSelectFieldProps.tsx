export interface DropdownSelectFieldProps {
  question: string;
  userQnsAnsID: string;
  questionID: string;
  ansOptionID: string|null;
  optionIDs: string[];
  onChange: (selectedValue: string) => void;
}