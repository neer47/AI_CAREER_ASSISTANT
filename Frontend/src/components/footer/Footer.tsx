import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-t from-gray-900 to-indigo-950 text-gray-300 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Brand & Description */}
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-purple-300 mb-2">AI ChatPrep</h3>
          <p className="text-sm text-gray-400 max-w-sm">
            Your go-to AI companion for acing interviews and enjoying smart conversations. Prepare with confidence, chat with ease.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row gap-6 text-center">
          <a
            href="/chat"
            className="text-indigo-200 hover:text-indigo-400 transition-colors duration-200"
          >
            Chat Now
          </a>
          <a
            href="/about"
            className="text-indigo-200 hover:text-indigo-400 transition-colors duration-200"
          >
            About Us
          </a>
          <a
            href="/contact"
            className="text-indigo-200 hover:text-indigo-400 transition-colors duration-200"
          >
            Contact
          </a>
          <a
            href="/privacy"
            className="text-indigo-200 hover:text-indigo-400 transition-colors duration-200"
          >
            Privacy Policy
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex gap-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
          >
            <FaLinkedin size={24} />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center border-t border-indigo-500/30 pt-4">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} AI ChatPrep. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;