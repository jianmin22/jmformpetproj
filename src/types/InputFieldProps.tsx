export interface InputFieldProps {
    question: string;
    userQnsAnsID: string;
    questionID: string;
    answer: string | null;
    onChange: (answer: string) => void;
  }