import { FC } from "react";

interface Interview {
  id: string;
  date: string;
  preview: string;
}

interface InterviewListProps {
  interviews: Interview[];
  onSelectInterview: (id: string) => void;
  onDeleteInterview: (id: string) => void;
}

const InterviewList: FC<InterviewListProps> = ({ interviews = [], onSelectInterview, onDeleteInterview }) => {
  return (
    <div className="space-y-2">
      {Array.isArray(interviews) && interviews.map((interview) => (
        <div
          key={interview.id}
          className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-all duration-200"
        >
          <button onClick={() => onSelectInterview(interview.id)} className="flex-1 text-left">
            <p className="text-purple-300 font-semibold">{interview.preview}</p>
            <p className="text-sm text-gray-400">{interview.date}</p>
          </button>
          <button
            onClick={() => onDeleteInterview(interview.id)}
            className="p-1 text-red-400 hover:text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default InterviewList;