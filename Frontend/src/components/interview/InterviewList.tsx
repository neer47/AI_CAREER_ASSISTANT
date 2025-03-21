// InterviewList.tsx
import React from "react";

interface Interview {
  id: string;
  date: string;
  preview: string;
}

interface InterviewListProps {
  interviews: Interview[];
  onSelectInterview: (id: string) => void;
}

const InterviewList: React.FC<InterviewListProps> = ({ interviews, onSelectInterview }) => {
  return (
    <div className="space-y-2">
      {interviews.map((interview) => (
        <div
          key={interview.id}
          onClick={() => onSelectInterview(interview.id)}
          className="p-2 hover:bg-gray-700 rounded cursor-pointer"
        >
          <div className="text-sm font-medium">{new Date(interview.date).toLocaleDateString()}</div>
          <div className="text-xs text-gray-400 truncate">{interview.preview}</div>
        </div>
      ))}
    </div>
  );
};

export default InterviewList;