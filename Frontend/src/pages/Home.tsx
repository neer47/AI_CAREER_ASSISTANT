import TypingAnim from "../components/typer/TypingAnim";
import Footer from "../components/footer/Footer";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Home = () => {
  const navigate = useNavigate();

  const handleChatButtonClick = () => {
    const userSession = localStorage.getItem("userSession");
    console.log(userSession);
    if (userSession) {
      navigate("/chat"); // Redirect to chat page if session exists
    } else {
      toast.error("Please log in to continue to the chat page.");
      // alert("Please log in to continue to the chat page.");
      navigate("/login"); // Redirect to login page if no session
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white font-sans">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center w-full min-h-screen px-6 text-center">
        <div className="mb-12">
          <TypingAnim />
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 drop-shadow-lg">
          Ace Your Interviews & Chat Smart
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-3xl text-gray-300 leading-relaxed">
          Master your interview skills or enjoy seamless conversations with our AI-powered assistant tailored for preparation and productivity.
        </p>
        <div className="mt-12 flex gap-6">
          <button
            onClick={handleChatButtonClick}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 hover:shadow-xl transform hover:scale-105"
          >
            Start Chatting
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-4 bg-gray-800 text-indigo-300 text-lg font-semibold rounded-xl shadow-lg hover:bg-gray-700 transition-all duration-200 hover:shadow-xl transform hover:scale-105"
          >
            Sign Up Now
          </button>
        </div>
        <div className="absolute bottom-10 animate-pulse">
          <p className="text-sm text-gray-400">Scroll to discover more</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-8 bg-gray-900/90">
        <h2 className="text-4xl font-bold text-center mb-16 text-purple-300 tracking-tight">Why Choose Us?</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-6 bg-gray-800/70 rounded-xl shadow-lg text-center border border-indigo-500/30">
            <h3 className="text-2xl font-semibold text-indigo-200 mb-4">Interview Prep</h3>
            <p className="text-gray-300">
              Practice mock interviews, get feedback, and refine your skills with AI-driven insights tailored to your career goals.
            </p>
          </div>
          <div className="p-6 bg-gray-800/70 rounded-xl shadow-lg text-center border border-indigo-500/30">
            <h3 className="text-2xl font-semibold text-indigo-200 mb-4">Smart Conversations</h3>
            <p className="text-gray-300">
              Chat about anything—productivity tips, general knowledge, or casual fun—with instant, intelligent responses.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-8 bg-gray-900/90">
        <h2 className="text-4xl font-bold text-center mb-16 text-purple-300 tracking-tight">How It Works</h2>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h3 className="text-2xl font-semibold text-indigo-200 mb-4">Effortless & Powerful</h3>
            <p className="text-gray-300 leading-relaxed">
              Jump into interview practice or casual chats with ease. Our AI adapts to your needs, offering real-time guidance and answers.
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src="how-it-works.png"
              alt="How It Works"
              className="w-full rounded-xl shadow-2xl border border-indigo-500/30"
            />
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="py-16 px-8 bg-gradient-to-r from-purple-800 to-indigo-900 text-center">
        <h2 className="text-4xl font-bold mb-6 text-white tracking-tight">Ready to Excel?</h2>
        <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
          Elevate your interview game or enjoy smart conversations today. Join now and unlock your potential!
        </p>
        <button
          onClick={handleChatButtonClick}
          className="px-10 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 hover:shadow-xl transform hover:scale-105"
        >
          Get Started
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default Home;