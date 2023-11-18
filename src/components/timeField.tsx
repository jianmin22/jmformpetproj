import React , {useState} from 'react';
import TimePicker from 'react-time-picker';

interface TimeFieldProps {
  question: string;
  userQnsAnsID: string;
  questionID: string;
  timeAns: string | null; // Assuming timeAns is a string in the format 'HH:mm'
  onChange: (timeAns: string | null) => void;
}

const TimeField: React.FC<TimeFieldProps> = ({
  question,
  userQnsAnsID,
  questionID,
  timeAns,
  onChange,
}) => {
  const [time, setTime]=useState(timeAns);
  const handleTimeChange = (newTime: string | null) => {
    setTime(newTime);
    onChange(newTime);
  };

  return (
    <div>
      <label className="text-white dark:text-gray-200" htmlFor={questionID}>
        {question}
      </label>
      <TimePicker
        id={userQnsAnsID}
        value={time || ''}
        onChange={handleTimeChange}
      />
    </div>
  );
};

export default TimeField;
