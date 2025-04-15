import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ChatItem from "../components/chat/ChatItem";
import Sidebar from "../components/shared/Sidebar";
import MessageInput from "../components/shared/MessageInput";
import { deleteUserChats, getUserChats, sendChatRequest } from "../helpers/api-communicator";
import toast from "react-hot-toast";
import { FaBars } from "react-icons/fa"; // Hamburger icon

type Message = { role: "user" | "assistant"; content: string };

const Chat = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      if (auth?.isLoggedIn && auth.user) {
        try {
          toast.loading("Loading chats...", {
            id: "loadchats",
            style: { background: "#2D3748", color: "#E2E8F0" },
          });
          const data = await getUserChats();
          setChatMessages(data.chats);
          toast.success("Chats loaded successfully", {
            id: "loadchats",
            style: { background: "#2D3748", color: "#E2E8F0" },
          });
        } catch (error) {
          toast.error("Failed to load chats", {
            id: "loadchats",
            style: { background: "#2D3748", color: "#E2E8F0" },
          });
        }
      }
    };
    fetchChats();
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) navigate("/login");
  }, [auth, navigate]);

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [chatMessages]);

  const handleSubmit = async (content: string) => {
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);
    try {
      const chatData = await sendChatRequest(content);
      setChatMessages(chatData.chats);
    } catch (error) {
      toast.error("Failed to send message", {
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
    }
  };

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting chats...", {
        id: "deletechats",
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Chats deleted successfully", {
        id: "deletechats",
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
    } catch (error) {
      toast.error("Failed to delete chats", {
        id: "deletechats",
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white overflow-hidden">
      {/* Toggle Button for Small Screens */}
      <button
        className="md:hidden p-4 text-white bg-gray-800/70 z-50 fixed top-0 left-0"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars size={24} />
      </button>

      {/* Sidebar */}
      <Sidebar
        onClear={handleDeleteChats}
        clearLabel="Clear Chat"
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <main className="flex-1 flex flex-col transition-all duration-300">
        <div className="flex items-center justify-between py-3 px-6 bg-gray-800/70 shadow-xl border-b border-indigo-500/30">
          <h2 className="text-2xl font-bold text-purple-300 tracking-tight">General Chat</h2>
          <button
            onClick={() => navigate("/interviews")}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-xl text-white font-semibold shadow-lg transition-all duration-200"
          >
            Go to Interviews
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-900/90 shadow-inner border-x border-indigo-500/20">
          {chatMessages.map((chat, index) => (
            <div key={index} className="mb-4 animate-fade-in-up">
              <ChatItem content={chat.content} role={chat.role} />
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
        <MessageInput onSubmit={handleSubmit} />
      </main>
    </div>
  );
};

export default Chat;