import { IoIosLogIn } from "react-icons/io";
import CustomizedInput from "../components/shared/CustomizedInput";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      toast.loading("Signing In", {
        id: "login",
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
      await auth?.login(email, password);
      toast.success("Login Successful", {
        id: "login",
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
    } catch (error) {
      console.log(error);
      toast.error("Signing In Failed", {
        id: "login",
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
    }
  };

  useEffect(() => {
    console.log("User state changed:", auth?.user);
    if (auth?.user) {
      navigate("/chat");
    }
  }, [auth?.user]);

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-4 sm:px-6 sm:py-6">
      <div className="w-full max-w-md px-4 py-6 sm:px-6 sm:py-8 bg-gray-800/90 backdrop-blur-md rounded-xl shadow-2xl border border-indigo-500/30">
        <h1 className="text-center text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-purple-300 tracking-tight">
          Welcome Back!
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-gray-300 mb-1 text-xs sm:text-sm"
            >
              Email Address
            </label>
            <CustomizedInput type="email" name="email" label="" />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-gray-300 mb-1 text-xs sm:text-sm"
            >
              Password
            </label>
            <CustomizedInput type="password" name="password" label="" />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-2 sm:py-2.5 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            Login
            <IoIosLogIn size={18}/>
          </button>
        </form>
        <div className="my-3 sm:my-4 flex items-center justify-center">
          <hr className="border-t border-indigo-500/50 w-full" />
          <span className="mx-2 sm:mx-4 text-gray-400 text-xs sm:text-sm">
            OR
          </span>
          <hr className="border-t border-indigo-500/50 w-full" />
        </div>
        <p className="text-center text-gray-400 text-xs sm:text-sm">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
