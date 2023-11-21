import React from 'react';

interface TimeFieldProps {
  question: string;
  userQnsAnsID: string;
  questionID: string;
  timeAns: Date | null; // Assuming timeAns is a string in the format 'HH:mm'
  onChange: (timeAns: Date | null) => void;
}

const TimeField: React.FC<TimeFieldProps> = ({
  question,
  userQnsAnsID,
  questionID,
  timeAns,
  onChange,
}) => {
  const formatTime = (date: Date | null) => {
    return date ? `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}` : '';
  };

  const handleTimeChange = (newTime: string) => {
    if (newTime) {
      const [hours, minutes] = newTime.split(':').map(Number);
      const currentTime = new Date(0, 0, 0, hours, minutes);
      onChange(currentTime);
    } else {
      onChange(null);
    }
  };

  return (
    <div>
      <label className="text-black" htmlFor={userQnsAnsID}>
        {question}
      </label>
      <input
        type="time"
        id={userQnsAnsID}
        value={formatTime(timeAns)}
        onChange={(e) => handleTimeChange(e.target.value)}
        className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring"
     required
     />
    </div>
  );
};

export default TimeField;
