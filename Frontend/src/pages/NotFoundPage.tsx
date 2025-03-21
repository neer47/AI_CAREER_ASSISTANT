import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/chat"); // Redirects to the chat page
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 flex flex-col items-center justify-center text-white px-6">
      {/* 404 Illustration/Message */}
      <div className="text-center">
        <h1 className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 animate-pulse">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-purple-300 mt-4">
          Oops! Page Not Found
        </h2>
        <p className="text-lg text-gray-300 mt-4 max-w-md">
          It seems you’ve wandered off the path. Don’t worry—let’s get you back to preparing for interviews or chatting with AI!
        </p>
      </div>

      {/* Back Button */}
      <div className="mt-10">
        <button
          onClick={handleBackClick}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
        >
          <FaHome size={20} />
          Back to Chat
        </button>
      </div>

      {/* Optional Fun Element */}
      <div className="mt-12 text-gray-400 text-sm">
        <p>Hint: Try asking the AI for directions next time!</p>
      </div>
    </div>
  );
};

export default NotFoundPage;