export interface TimeFieldProps {
    question: string;
    userQnsAnsID: string;
    questionID: string;
    timeAns: Date | null; // Assuming timeAns is a string in the format 'HH:mm'
    onChange: (timeAns: Date | null) => void;
  }