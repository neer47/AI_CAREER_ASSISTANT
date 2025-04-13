import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFoundPage from "./pages/NotFoundPage";
import { useAuth } from "./context/AuthContext";
import Interviews from "./pages/Interviews";

function App() {  
  const auth = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br  from-gray-900 via-indigo-950 to-purple-950">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />   
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {auth?.isLoggedIn && auth.user && (
            <Route path="/chat" element={<Chat />} />
          )}
          {auth?.isLoggedIn && auth.user && (
            <Route path="/interviews" element={<Interviews />} />
          )}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;