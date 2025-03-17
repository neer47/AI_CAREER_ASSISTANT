//chat.tsx

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { IoMdSend } from "react-icons/io";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import FileUpload from "../components/interview/FileUpload";
import ChatItem from "../components/chat/ChatItem";
import {
  deleteUserChats,
  generateResumeQuestions,
  getUserChats,
  sendChatRequest,
  submitInterviewAnswer,
} from "../helpers/api-communicator";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type InterviewQuestion = {
  id: string;
  question: string;
  answer?: string;
  feedback?: string;
  rating?: number;
};

const Chat = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  // const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInterviewMode, setIsInterviewMode] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState<
    InterviewQuestion[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
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
        if (inputRef.current) {
          inputRef.current.value = transcript;
        }
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
        toast.error("Error occurred in speech recognition");
      };
    }
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      if (auth?.isLoggedIn && auth.user) {
        try {
          toast.loading("Loading Conversations", { id: "loadchats" });
          const data = await getUserChats();
          setChatMessages([...data.chats]);
          toast.success("Chats loaded successfully", { id: "loadchats" });
        } catch (error) {
          toast.error("Failed to load chats", { id: "loadchats" });
        }
      }
    };
    fetchChats();
  }, [auth]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth, navigate]);

  const handleSubmit = async () => {
    if (isInterviewMode) {
      // Handle interview answer submission
      const currentQuestion = interviewQuestions[currentQuestionIndex];
      try {
        setIsLoading(true);
        const { feedback } = await submitInterviewAnswer(
          currentQuestion.id,
          userAnswer
        );

        setInterviewQuestions((prev) =>
          prev.map((q) =>
            q.id === currentQuestion.id
              ? { ...q, feedback, answer: userAnswer }
              : q
          )
        );

        if (currentQuestionIndex < interviewQuestions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
        }
        setUserAnswer("");
      } finally {
        setIsLoading(false);
      }
    } else {
      const content = inputRef.current?.value.trim();
      if (!content) {
        toast.error("Message cannot be empty!");
        return;
      }

      if (inputRef.current) inputRef.current.value = "";
      const newMessage: Message = { role: "user", content };
      setChatMessages((prev) => [...prev, newMessage]);

      try {
        const chatData = await sendChatRequest(content);
        setChatMessages([...chatData.chats]);
      } catch (error) {
        console.error(error);
        toast.error("Failed to send message");
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.current?.stop();
    } else {
      recognition.current?.start();
    }
    setIsListening(!isListening);
  };

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting chats...", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Chats deleted successfully", { id: "deletechats" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete chats", { id: "deletechats" });
    }
  };

  const handleUploadComplete = async (resumeText: string) => {
    try {
      setIsInterviewMode(true);
      setIsLoading(true);
      const { questions } = await generateResumeQuestions(resumeText);
      setInterviewQuestions(questions.slice(0, 10));
    } catch (error) {
      toast.error("Failed to generate questions");
    }
  };

  return (
    <div className="flex h-[90vh] bg-gray-900 text-white">
      <aside className="hidden md:flex flex-col w-64 bg-gray-800 p-6 shadow-lg">
        <div className="flex items-center justify-center h-16 rounded-full bg-cyan-500 text-2xl font-semibold mb-4">
          {auth?.user?.name[0].toUpperCase()}
          {auth?.user?.name[1].toUpperCase()}
        </div>
        <p className="text-center text-gray-300 mb-4">
          You are talking to **AI Career Assistant**
        </p>
        <p className="text-sm text-gray-400 mb-6 text-center">
          Ask questions or get resume feedback.
        </p>
        {isLoading && (
          <div className="w-full bg-blue-500 text-white text-center py-2">
            Loading...
          </div>
        )}
        <FileUpload onUploadComplete={handleUploadComplete} />
        <button
          onClick={handleDeleteChats}
          className="mt-auto py-2 px-4 bg-red-500 hover:bg-red-600 rounded-lg text-white"
        >
          Clear Conversation
        </button>
      </aside>

      <main className="flex-1 flex flex-col px-4">
        <h2 className="text-2xl font-bold text-center py-4 border-b border-gray-700">
          Model - GPT-4o
        </h2>
        <div className="flex-1 overflow-y-auto px-2 py-4">
          {isInterviewMode
            ? interviewQuestions.map((q, index) => (
                <div
                  key={q.id}
                  className={`${
                    index === currentQuestionIndex ? "bg-gray-700" : ""
                  }`}
                >
                  <ChatItem content={q.question} role="assistant" />
                  {q.answer && (
                    <ChatItem
                      content={`Answer: ${q.answer}\nFeedback: ${q.feedback}`}
                      role="user"
                    />
                  )}
                </div>
              ))
            : chatMessages.map((chat, index) => (
                <ChatItem content={chat.content} role={chat.role} key={index} />
              ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex items-center bg-gray-800 rounded-lg p-2 shadow-md mb-4">
          <button
            onClick={toggleListening}
            className={`p-2 mr-2 rounded-lg ${
              isListening ? "bg-red-500" : "bg-gray-600"
            }`}
          >
            {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type or speak your message..."
            className="flex-1 bg-transparent text-white placeholder-gray-400 px-4 py-2 outline-none"
          />
          <button
            className="p-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg"
            onClick={handleSubmit}
          >
            <IoMdSend size={24} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Chat;
