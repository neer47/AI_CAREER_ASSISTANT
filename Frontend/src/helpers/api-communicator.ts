import axios from "axios";

type Message = {
    role: "user" | "assistant";
    content: string;
  };
  
  type Interview = {
    id: string;
    date: string;
    preview: string;
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

export const getAnswerFeedback = async (question: string, answer: string) => {
  const response = await fetch("/get-feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, answer }),
  });
  return response.json();
};

export const generateResumeQuestions = async (resumeText: string) => {
  const response = await axios.post("/interview/generate-questions", {
    resumeText,
  });
  return response.data;
};

export const submitInterviewAnswer = async (
  questionId: string,
  answer: string
) => {
  const response = await axios.post("/interview/answer", {
    questionId,
    answer,
  });
  return response.data;
};

// Add these to your existing API functions
export const getInterviews = async (): Promise<{ interviews: Interview[] }> => {
  const response = await axios.get("/interview", { withCredentials: true });
  return response.data;
};

export const deleteInterviews = async (): Promise<void> => {
  await axios.delete("/interview", { withCredentials: true });
};

export const getInterviewMessages = async (
  interviewId: string
): Promise<{ messages: Message[] }> => {
  const response = await axios.get(`/interview/${interviewId}`, {
    withCredentials: true,
  });
  return response.data;
};
