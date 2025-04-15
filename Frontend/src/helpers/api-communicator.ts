import axios from "axios";

export type Message = { role: "user" | "assistant"; content: string };

export type Question = {
  _id: string;
  question: string;
  userAnswer: string;
  expectedAnswer: string;
  rating: number | null;
};

export type Interview = {
  id: string;
  date: string;
  preview: string;
  questions?: Question[];
};

export const signupUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await axios.post("/user/signup", { name, email, password });
  if (res.status !== 200) {
    throw new Error("Unable to signup");
  }
  const data = await res.data;
  return data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post("/user/login", { email, password });
  if (res.status !== 200) {
    throw new Error("Unable to login");
  }
  const data = await res.data;
  return data;
};

export const checkAuthStatus = async () => {
  const res = await axios.get("/user/auth-status");
  if (res.status !== 200) {
    throw new Error("Unable to authenticate");
  }
  const data = await res.data;
  return data;
};

export const sendChatRequest = async (message: string) => {
  const res = await axios.post("/chat/new", { message });
  if (res.status !== 200) {
    throw new Error("Unable to send chats");
  }
  const data = await res.data;
  return data;
};

export const getUserChats = async () => {
  const res = await axios.get("/chat/all-chats");
  if (res.status !== 200) {
    throw new Error("Unable to send chats");
  }
  const data = await res.data;
  return data;
};

export const deleteUserChats = async () => {
  const res = await axios.delete("/chat/delete");
  if (res.status !== 200) {
    throw new Error("Unable to delete chats");
  }
  const data = await res.data;
  return data;
};

export const logoutUser = async () => {
  const res = await axios.get("/user/logout");
  if (res.status !== 200) {
    throw new Error("Unable to logout");
  }
  const data = await res.data;
  return data;
};

export const getInterviews = async (): Promise<{ interviews: Interview[] }> => {
  const res = await axios.get("/interview/all", { withCredentials: true });
  if (res.status !== 200) throw new Error("Unable to get interviews");
  const interviews = res.data.map((interview: any) => ({
    id: interview._id.toString(),
    date: interview.createdAt || new Date().toISOString(),
    preview: interview.questions[0]?.question.slice(0, 50) || "Interview",
    questions: interview.questions.map((q: any) => ({
      _id: q._id.toString(),
      question: q.question,
      userAnswer: q.userAnswer,
      expectedAnswer: q.expectedAnswer,
      rating: q.rating,
    })),
  }));
  return { interviews };
};

export const startNewInterview = async (
  resumeFile?: File
): Promise<{ interviewId: string; questions: Question[] }> => {
  const formData = new FormData();
  if (resumeFile) formData.append("pdfFile", resumeFile);
  const res = await axios.post("/interview/start", resumeFile ? formData : {}, {
    headers: resumeFile ? { "Content-Type": "multipart/form-data" } : {},
    withCredentials: true,
  });
  if (res.status !== 200) throw new Error("Unable to start interview");

  // Ensure the response matches the expected type
  const { interviewId, questions } = res.data;
  return { interviewId, questions }; // No transformation needed
};

export const submitInterviewAnswer = async (
  interviewId: string,
  questionId: string,
  userAnswer: string
): Promise<{
  message: string;
  updatedQuestion: {
    userAnswer: string;
    expectedAnswer: string;
    rating: number | null;
  };
}> => {
  const res = await axios.post(
    "/interview/submit",
    { interviewId, questionId, userAnswer },
    { withCredentials: true }
  );
  if (res.status !== 200) throw new Error("Unable to submit answer");
  return res.data;
};

export const deleteInterview = async (interviewId: string): Promise<void> => {
  const res = await axios.delete(`/interview/delete/${interviewId}`, {
    withCredentials: true,
  });
  if (res.status !== 200) throw new Error("Unable to delete interview");
};
