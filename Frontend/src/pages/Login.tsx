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
      toast.loading("Signing In", { id: "login" });
      await auth?.login(email, password);
      toast.success("Login Successful", { id: "login" });
    } catch (error) {
      console.log(error);
      toast.error("Signing In Failed", { id: "login" });
    }
  };

  useEffect(() => {
    console.log("User state changed:", auth?.user);
    if (auth?.user) {
      navigate("/chat");
    }
  }, [auth?.user]);

  return (
    <div className="flex items-center justify-center py-10">
      {/* Container */}
      <div className="w-full max-w-md px-8 py-10 bg-[#0a1a2e] text-white rounded-lg shadow-2xl">
        {/* Header */}
        <h1 className="text-center text-3xl font-bold mb-8 text-cyan-400">
          Welcome Back!
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-300 mb-2 text-sm">
              Email Address
            </label>
            <CustomizedInput type="email" name="email" label="" />
          </div>

          {/* Password Input */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-300 mb-2 text-sm">
              Password
            </label>
            <CustomizedInput type="password" name="password" label="" />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg transition duration-300 flex items-center justify-center"
          >
            Login
            <IoIosLogIn className="ml-2" />
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center justify-center">
          <hr className="border-t border-gray-600 w-full" />
          <span className="mx-4 text-gray-400 text-sm">OR</span>
          <hr className="border-t border-gray-600 w-full" />
        </div>

        {/* Bottom Section */}
        <p className="text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-cyan-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
