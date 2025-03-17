import TypingAnim from "../components/typer/TypingAnim";
import Footer from "../components/footer/Footer";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleChatButtonClick = () => {
    const userSession = localStorage.getItem("userSession");
    if (userSession) {
      navigate("/chat"); // Redirect to chat page if session exists
    } else {
      alert("Please log in to continue to the chat page.");
      navigate("/login"); // Redirect to login page if no session
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br bg-[#0a1a2e] text-white">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center w-full h-screen px-6 text-center">
        <div className="mb-10">
          <TypingAnim />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Meet Your AI Chatbot
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-2xl">
          Seamlessly interact with an intelligent AI chatbot designed to simplify your tasks, answer your questions, and keep you productive.
        </p>
        <div className="mt-10">
          <button className="px-6 py-3 bg-purple-700 text-lg font-semibold rounded-lg hover:bg-purple-800 transition-all shadow-md"
          onClick={handleChatButtonClick}>
            Start Chatting
          </button>
        </div>
        <div className="absolute bottom-8 animate-bounce">
          <p className="text-sm">Scroll down to explore more</p>
        </div>
      </div>

      {/* Features Section */}
      {/* <div className="py-20 px-8 bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Chatbot?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center bg-gray-700 p-6 rounded-lg shadow-lg">
            <img
              src="chat-icon.png"
              alt="Real-Time Chat"
              className="w-16 h-16 mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Real-Time Chat</h3>
            <p className="text-gray-300 text-center">
              Engage in seamless, real-time conversations with lightning-fast responses.
            </p>
          </div>
          <div className="flex flex-col items-center bg-gray-700 p-6 rounded-lg shadow-lg">
            <img
              src="secure-icon.png"
              alt="Secure"
              className="w-16 h-16 mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Data Security</h3>
            <p className="text-gray-300 text-center">
              Your data is safe with end-to-end encryption and secure servers.
            </p>
          </div>
          <div className="flex flex-col items-center bg-gray-700 p-6 rounded-lg shadow-lg">
            <img
              src="multi-language.png"
              alt="Multi-Language"
              className="w-16 h-16 mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Multi-Language Support</h3>
            <p className="text-gray-300 text-center">
              Communicate in your preferred language with advanced language support.
            </p>
          </div>
        </div>
      </div> */}

      {/* How It Works Section */}
      <div className="py-20 px-8 bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 text-center md:text-left">
            <h3 className="text-2xl font-semibold mb-4">Simple and Efficient</h3>
            <p className="text-gray-400">
              Start chatting with ease. Just type your query, and the chatbot will provide instant responses tailored to your needs. Whether it’s about productivity, learning, or simple fun, we’ve got you covered.
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src="how-it-works.png"
              alt="How It Works"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      {/* <div className="py-16 px-8 bg-gradient-to-r from-purple-800 to-indigo-900 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-lg text-gray-200 mb-8">
          Unleash the potential of AI with our interactive chatbot. Sign up today and explore endless possibilities.
        </p>
        <button className="px-8 py-4 bg-indigo-700 text-lg font-semibold rounded-lg hover:bg-indigo-800 transition-all">
          Start Your Journey
        </button>
      </div> */}

      <Footer />
    </div>
  );
};

export default Home;
