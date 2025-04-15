import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ChatItem from "../components/chat/ChatItem";
import Sidebar from "../components/shared/Sidebar";
import MessageInput from "../components/shared/MessageInput";
import FileUpload from "../components/interview/FileUpload";
import InterviewList from "../components/interview/InterviewList";
import {
  getInterviews,
  submitInterviewAnswer,
  deleteInterview,
  Question,
  Interview,
} from "../helpers/api-communicator";
import toast from "react-hot-toast";
import { FaBars } from "react-icons/fa"; // Hamburger icon

type Message = {
  role: "user" | "assistant";
  content: string;
  questionId?: string;
};

type CompletedQuestion = {
  question: Message;
  userAnswer?: Message;
  expectedAnswer?: Message;
  rating?: number | null;
};

const Interviews = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [currentInterview, setCurrentInterview] = useState<Interview | null>(
    null
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [completedQuestions, setCompletedQuestions] = useState<
    CompletedQuestion[]
  >([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchInterviews = async () => {
      if (auth?.isLoggedIn && auth.user) {
        try {
          toast.loading("Loading interviews...", {
            id: "loadinterviews",
            style: { background: "#2D3748", color: "#E2E8F0" },
          });
          const data = await getInterviews();
          setInterviews(data.interviews);
          toast.success("Interviews loaded successfully", {
            id: "loadinterviews",
            style: { background: "#2D3748", color: "#E2E8F0" },
          });
        } catch (error) {
          console.error("Error fetching interviews:", error);
          toast.error("Failed to load interviews", {
            id: "loadinterviews",
            style: { background: "#2D3748", color: "#E2E8F0" },
          });
        }
      }
    };
    fetchInterviews();
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) navigate("/login");
  }, [auth, navigate]);

  useEffect(() => {
    if (messagesEndRef.current && currentInterview?.questions) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [completedQuestions, currentInterview]);

  const handleUploadComplete = (response: {
    interviewId: string;
    questions: Question[];
  }) => {
    console.log("handleUploadComplete called with:", response);
    try {
      toast.loading("Starting interview...", {
        id: "startinterview",
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
      const newInterview: Interview = {
        id: response.interviewId,
        date: new Date().toISOString(),
        preview:
          response.questions[0]?.question.slice(0, 50) || "New Interview",
        questions: response.questions,
      };
      console.log("New interview created:", newInterview);
      setInterviews((prev) => [newInterview, ...prev]);
      setCurrentInterview(newInterview);
      setCurrentQuestionIndex(0);
      setCompletedQuestions([]);
      console.log(
        "State updated - currentInterview:",
        newInterview,
        "currentQuestionIndex:",
        0
      );
      toast.success("Interview started", {
        id: "startinterview",
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
    } catch (error) {
      console.error("Error in handleUploadComplete:", error);
      toast.error("Failed to start interview", {
        id: "startinterview",
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
    }
  };

  const handleSelectInterview = (id: string) => {
    const interview = interviews.find((i) => i.id === id);
    if (interview) {
      const completed =
        interview.questions
          ?.filter((q) => q.userAnswer || q.expectedAnswer)
          .map((q) => ({
            question: {
              role: "assistant" as const,
              content: q.question,
              questionId: q._id,
            },
            userAnswer: q.userAnswer
              ? { role: "user" as const, content: q.userAnswer }
              : undefined,
            expectedAnswer: q.expectedAnswer
              ? {
                  role: "assistant" as const,
                  content: `Expected: ${q.expectedAnswer}`,
                }
              : undefined,
            rating: q.rating || null,
          })) || [];

      setCurrentInterview(interview);
      setCompletedQuestions(completed);
      setCurrentQuestionIndex(completed.length);
    }
  };

  const handleDeleteInterview = async (id: string) => {
    try {
      toast.loading("Deleting interview...", {
        id: "deleteinterview",
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
      await deleteInterview(id);
      setInterviews((prev) => prev.filter((i) => i.id !== id));
      if (currentInterview?.id === id) {
        setCurrentInterview(null);
        setCompletedQuestions([]);
        setCurrentQuestionIndex(0);
      }
      toast.success("Interview deleted", {
        id: "deleteinterview",
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
    } catch (error) {
      console.error("Error deleting interview:", error);
      toast.error("Failed to delete interview", {
        id: "deleteinterview",
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
    }
  };

  const handleSubmit = async (content: string) => {
    if (
      !currentInterview ||
      !currentInterview.questions ||
      currentQuestionIndex >= currentInterview.questions.length
    ) {
      toast.error("No active question to answer", {
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
      return;
    }

    const currentQuestion = currentInterview.questions[currentQuestionIndex];
    const userAnswer: Message = { role: "user", content };
    const questionId = currentQuestion._id;

    if (!questionId) {
      toast.error("Question ID not found", {
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
      return;
    }

    try {
      console.log("The content: ", content);
      console.log("The currentInterview: ", currentInterview.id);
      console.log("The questionId: ", questionId);
      const response = await submitInterviewAnswer(
        currentInterview.id,
        questionId,
        content
      );
      console.log("Submit response:", response);

      const { updatedQuestion } = response;
      const expectedAnswer: Message = updatedQuestion.expectedAnswer
        ? {
            role: "assistant",
            content: `Expected: ${updatedQuestion.expectedAnswer}`,
          }
        : { role: "assistant", content: "Expected answer not provided" };
      const rating =
        updatedQuestion.rating !== undefined ? updatedQuestion.rating : null;

      setCompletedQuestions((prev) => [
        ...prev,
        {
          question: {
            role: "assistant",
            content: currentQuestion.question,
            questionId,
          },
          userAnswer,
          expectedAnswer,
          rating,
        },
      ]);
      setCurrentQuestionIndex((prev) => prev + 1);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit answer", {
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
    }
  };

  const handleSkip = () => {
    if (
      !currentInterview ||
      !currentInterview.questions ||
      currentQuestionIndex >= currentInterview.questions.length
    ) {
      toast.error("No active question to skip", {
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
      return;
    }

    const currentQuestion = currentInterview.questions[currentQuestionIndex];
    setCompletedQuestions((prev) => [
      ...prev,
      {
        question: {
          role: "assistant",
          content: currentQuestion.question,
          questionId: currentQuestion._id,
        },
        expectedAnswer: {
          role: "assistant",
          content: "Skipped - No expected answer provided",
        },
      },
    ]);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const currentQuestion =
    currentInterview?.questions &&
    currentQuestionIndex < currentInterview.questions.length
      ? {
          role: "assistant" as const,
          content: currentInterview.questions[currentQuestionIndex].question,
          questionId: currentInterview.questions[currentQuestionIndex]._id,
        }
      : null;

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
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
        <FileUpload onUploadComplete={handleUploadComplete} />
        <div
          className="mt-6 flex-1 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 64px - 5rem)" }}
        >
          <h3 className="text-lg font-semibold text-purple-300 mb-3">
            Past Interviews
          </h3>
          <InterviewList
            interviews={interviews || []}
            onSelectInterview={handleSelectInterview}
            onDeleteInterview={handleDeleteInterview}
          />
        </div>
      </Sidebar>
      <main className="flex-1 flex flex-col transition-all duration-300">
        <div className="flex items-center justify-between py-3 px-6 bg-gray-800/70 shadow-xl border-b border-indigo-500/30 shrink-0">
          <h2 className="text-2xl font-bold text-purple-300 tracking-tight">
            Interview Prep
          </h2>
          <button
            onClick={() => navigate("/chat")}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-xl text-white font-semibold shadow-lg transition-all duration-200"
          >
            Go to Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-900/90 shadow-inner border-x border-indigo-500/20 min-h-0">
          {completedQuestions.map((item, index) => (
            <div key={index} className="mb-4">
              <ChatItem
                content={item.question.content}
                role={item.question.role}
              />
              {item.userAnswer && (
                <ChatItem
                  content={item.userAnswer.content}
                  role={item.userAnswer.role}
                />
              )}
              {item.expectedAnswer && (
                <ChatItem
                  content={`${item.expectedAnswer.content} (Rating: ${
                    item.rating ?? "N/A"
                  })`}
                  role={item.expectedAnswer.role}
                />
              )}
            </div>
          ))}
          {currentQuestion &&
          currentQuestionIndex < currentInterview!.questions!.length ? (
            <div className="mb-4 animate-fade-in-up">
              <ChatItem
                content={currentQuestion.content}
                role={currentQuestion.role}
              />
            </div>
          ) : currentInterview &&
            currentQuestionIndex >= currentInterview.questions!.length ? (
            <p className="text-center text-gray-400 mt-4">
              Interview completed!
            </p>
          ) : (
            <>
              <p className="hidden md:block text-center text-gray-400 mt-4">
                Upload a resume to start an interview
              </p>
              <p className="md:hidden text-center text-gray-400 mt-4">
                Open the drawer (sidebar) to upload your resume and start an interview
              </p>
            </>
          )}
          <div ref={messagesEndRef}></div>
        </div>
        <div className="px-6 py-4 bg-gray-900/90 border-t border-indigo-500/20 shrink-0">
          {currentQuestion && (
            <>
              <MessageInput
                onSubmit={handleSubmit}
                placeholder="Type or speak your answer..."
              />
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-xl text-white font-semibold shadow-lg transition-all duration-200"
                >
                  Skip
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Interviews;
