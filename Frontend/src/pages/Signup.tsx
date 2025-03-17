import { IoIosLogIn } from "react-icons/io";
import CustomizedInput from "../components/shared/CustomizedInput";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Signup = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Check if the name contains at least two words
    if (!name || name.trim().split(" ").length < 2) {
      toast.error("Please enter your full name (first and last name).");
      return; // Stop execution if validation fails
    }

    try {
      toast.loading("Signing Up...", { id: "signup" });
      await auth?.signup(name, email, password);
      toast.success("Sign Up Successful!", { id: "signup" });
    } catch (error) {
      console.error(error);
      toast.error("Signing Up Failed", { id: "signup" });
    }
  };

  useEffect(() => {
    if (auth?.user) {
      navigate("/chat");
    }
  }, [auth?.user, navigate]);

  return (
    <div className="flex items-center justify-center ">
      {/* Container */}
      <div className="w-full max-w-md px-8 py-10 bg-[#0a1a2e] text-white rounded-lg shadow-2xl">
        {/* Header */}
        <h1 className="text-center text-3xl font-bold mb-8 text-cyan-400">
          Create Your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-300 mb-2 text-sm">
              Full Name
            </label>
            <CustomizedInput
              type="text"
              name="name"
              label=""
            />
          </div>

          {/* Email Input */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-300 mb-2 text-sm">
              Email Address
            </label>
            <CustomizedInput
              type="email"
              name="email"
              label=""
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-300 mb-2 text-sm">
              Password
            </label>
            <CustomizedInput
              type="password"
              name="password"
              label=""
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg transition duration-300 flex items-center justify-center"
          >
            Signup
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
          Already have an account?{" "}
          <a href="/login" className="text-cyan-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
