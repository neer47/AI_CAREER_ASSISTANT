import { FC, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import toast from "react-hot-toast";

interface MessageInputProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
}

const MessageInput: FC<MessageInputProps> = ({ onSubmit, placeholder = "Type or speak your message..." }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognition = useRef<SpeechRecognition | null>(null);

  useState(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;

      recognition.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        if (inputRef.current) inputRef.current.value = transcript;
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
        toast.error("Speech recognition error", {
          style: { background: "#2D3748", color: "#E2E8F0" },
        });
      };
    }
  });

  const toggleListening = () => {
    if (isListening) recognition.current?.stop();
    else recognition.current?.start();
    setIsListening(!isListening);
  };

  const handleSubmit = () => {
    const content = inputRef.current?.value.trim();
    if (!content) {
      toast.error("Message cannot be empty!", {
        style: { background: "#2D3748", color: "#E2E8F0" },
      });
      return;
    }
    onSubmit(content);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="px-6 py-4 bg-gray-900/90 border-t border-indigo-500/20">
      <div className="flex items-center bg-gray-800/95 rounded-xl p-3 shadow-xl border border-indigo-500/30">
        <button
          onClick={toggleListening}
          className={`p-2.5 mr-3 rounded-full ${
            isListening
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
          } shadow-md transition-all duration-200`}
        >
          {isListening ? <FaMicrophoneSlash size={20} /> : <FaMicrophone size={20} />}
        </button>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white placeholder-gray-400 px-4 py-2 outline-none rounded-lg focus:ring-2 focus:ring-purple-500 transition-all duration-200"
        />
        <button
          className="p-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-full shadow-md transition-all duration-200"
          onClick={handleSubmit}
        >
          <IoMdSend size={22} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;