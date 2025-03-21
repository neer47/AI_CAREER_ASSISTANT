import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { IoMdSend } from "react-icons/io";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import ChatItem from "../components/chat/ChatItem";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
  getInterviews,
  deleteInterviews,
  getInterviewMessages,
} from "../helpers/api-communicator";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import InterviewList from "../components/interview/InterviewList";
import FileUpload from "../components/interview/FileUpload";

type Message = { role: "user" | "assistant"; content: string };
type Interview = { id: string; date: string; preview: string };

const Chat = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [chatMode, setChatMode] = useState<"normal" | "interview">("normal");
  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;

      recognition.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        if (inputRef.current) inputRef.current.value = transcript;
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
        toast.error("Speech recognition error", {
          style: { background: "#2D3748", color: "#E2E8F0" },
        });
      };
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (auth?.isLoggedIn && auth.user) {
        try {
          toast.loading("Loading...", {
            id: "loadchats",
            style: { background: "#2D3748", color: "#E2E8F0" },
          });
          if (chatMode === "normal") {
            const data = await getUserChats();
            setChatMessages([...data.chats]);
          } else {
            const interviewData = await getInterviews();
            setInterviews(interviewData.interviews);
          }
          toast.success("Loaded successfully", {
            id: "loadchats",
            style: { background: "#2D3748", color: "#E2E8F0" },
          });
        } catch (error) {
          toast.error("Load failed", {
            id: "loadchats",
            style: { background: "#2D3748", color: "#E2E8F0" },
          });
        }
      }
    };
    fetchData();
  }, [chatMode, auth]);

  useEffect(
    () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
    [chatMessages]
  );
  useEffect(() => {
    if (!auth?.user) navigate("/login");
  }, [auth, navigate]);

  const handleUploadComplete = (response: string) => {
    setChatMessages((prev) => [
      ...prev,
      { role: "assistant", content: response },
    ]);
  };

  const loadInterview = async (interviewId: string) => {
    try {
      const data = await getInterviewMessages(interviewId);
      setChatMessages(data.messages);
    } catch (error) {
      toast.error("Failed to load interview", {
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
    }
  };

  const toggleChatMode = () => {
    setChatMode((prev) => (prev === "normal" ? "interview" : "normal"));
    setChatMessages([]);
  };

  const handleSubmit = async () => {
    const content = inputRef.current?.value.trim();
    if (!content) {
      toast.error("Message cannot be empty!", {
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
      return;
    }

    if (inputRef.current) inputRef.current.value = "";
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);

    try {
      const chatData = await sendChatRequest(content);
      setChatMessages([...chatData.chats]);
    } catch (error) {
      toast.error("Send failed", {
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
    }
  };

  const toggleListening = () => {
    if (isListening) recognition.current?.stop();
    else recognition.current?.start();
    setIsListening(!isListening);
  };

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting...", {
        id: "deletechats",
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted successfully", {
        id: "deletechats",
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
    } catch (error) {
      toast.error("Delete failed", {
        id: "deletechats",
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
    }
  };

  return (
    <div className="flex h-[calc(100vh-60px)] bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-gray-800/95 backdrop-blur-lg p-5 shadow-2xl rounded-r-2xl border-r border-indigo-500/40">
        {chatMode === "normal" ? (
          <div className="flex flex-col flex-1">
            <div className="flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-2xl font-bold mb-4 shadow-xl flex items-center justify-center">
                {auth?.user?.name[0].toUpperCase()}
                {auth?.user?.name.split(" ")[1]?.[0]?.toUpperCase() || ""}
              </div>
              <p className="text-center text-indigo-200 font-semibold mb-2">
                AI Career Assistant
              </p>
              <p className="text-sm text-gray-400 text-center mb-6">
                Your personal career guide
              </p>
            </div>
            {/* Spacer to push button to bottom */}
            <div className="flex-1"></div>
            <button
              onClick={handleDeleteChats}
              className="mt-4 py-2 px-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-xl text-white font-semibold shadow-lg transition-all duration-200"
            >
              Clear {(chatMode as string) === "normal" ? "Chat" : "Interviews"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col flex-1">
            <FileUpload onUploadComplete={handleUploadComplete} />
            <div className="mt-6 flex-1 overflow-y-auto">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">
                Past Interviews
              </h3>
              <InterviewList
                interviews={interviews}
                onSelectInterview={loadInterview}
              />
            </div>
            <button
              onClick={handleDeleteChats}
              className="mt-4 py-2 px-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-xl text-white font-semibold shadow-lg transition-all duration-200"
            >
              Clear {(chatMode as string) === "normal" ? "Chat" : "Interviews"}
            </button>
          </div>
        )}
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between py-3 px-6 bg-gray-800/70 shadow-xl border-b border-indigo-500/30">
          <h2 className="text-2xl font-bold text-purple-300 tracking-tight">
            {chatMode === "normal" ? "General Chat" : "Interview Prep"}
          </h2>
          <button
            onClick={toggleChatMode}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-xl text-white font-semibold shadow-lg transition-all duration-200"
          >
            Switch to {chatMode === "normal" ? "Interview" : "Chat"}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-900/90 shadow-inner border-x border-indigo-500/20">
          {chatMessages.map((chat, index) => (
            <div key={index} className="mb-4 animate-fade-in-up">
              <ChatItem content={chat.content} role={chat.role} />
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 bg-gray-900/90 border-t border-indigo-500/20">
          <div className="flex items-center bg-gray-800/95 rounded-xl p-3 shadow-xl border border-indigo-500/30">
            <button
              onClick={toggleListening}
              className={`p-2.5 mr-3 rounded-full ${
                isListening
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              } shadow-md transition-all duration-200`}
            >
              {isListening ? (
                <FaMicrophoneSlash size={20} />
              ) : (
                <FaMicrophone size={20} />
              )}
            </button>
            <input
              ref={inputRef}
              type="text"
              placeholder="Type or speak your message..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 px-4 py-2 outline-none rounded-lg focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            />
            <button
              className="p-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-full shadow-md transition-all duration-200"
              onClick={handleSubmit}
            >
              <IoMdSend size={22} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
