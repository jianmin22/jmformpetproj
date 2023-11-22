export interface DateFieldProps {
    question: string;
    userQnsAnsID: string;
    questionID: string;
    dateAns: Date | null;
    onChange: (dateAns: Date | null) => void;
  }
  