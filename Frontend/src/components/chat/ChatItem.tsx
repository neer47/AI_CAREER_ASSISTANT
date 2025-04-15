import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// Clean up unwanted characters
function cleanUpMessage(message: string) {
  return message.replace(/\*\*/g, "").trim();
}

// Extract code blocks and text
function extractCodeFromString(message: string) {
  const cleanedMessage = cleanUpMessage(message);
  const blocks = [];
  const regex = /```(.*?)```/gs;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(cleanedMessage)) !== null) {
    const codeStartIndex = match.index;
    const codeEndIndex = regex.lastIndex;

    if (codeStartIndex > lastIndex) {
      blocks.push({
        type: "text",
        content: cleanedMessage.slice(lastIndex, codeStartIndex).trim(),
      });
    }
    blocks.push({ type: "code", content: match[1].trim() });
    lastIndex = codeEndIndex;
  }

  if (lastIndex < cleanedMessage.length) {
    blocks.push({
      type: "text",
      content: cleanedMessage.slice(lastIndex).trim(),
    });
  }
  return blocks;
}

const copyToClipboard = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success("Copied!", { style: { background: '#2D3748', color: '#E2E8F0' } }))
    .catch(() => toast.error("Copy failed!", { style: { background: '#2D3748', color: '#E2E8F0' } }));
};

const speakText = (text: string) => {
  if ("speechSynthesis" in window) {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  } else {
    console.warn("Text-to-speech not supported.");
  }
};

const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant";
}) => {
  const messageBlocks = extractCodeFromString(content);
  const auth = useAuth();

  return (
    <div
      className={`flex gap-3 my-3 ${role === "user" ? "justify-end" : "justify-start"}`}
    >
      {/* Assistant Avatar */}
      {role === "assistant" && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
          <img
            src="openai.png"
            alt="assistant"
            className="w-7 h-7 rounded-full"
          />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-[80%] p-4 rounded-xl shadow-lg transition-all duration-200 ${
          role === "user"
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            : "bg-gray-800/90 text-gray-100"
        } hover:shadow-xl`}
      >
        {messageBlocks.map((block, index) =>
          block.type === "code" ? (
            <div key={index} className="relative my-2">
              <button
                onClick={() => copyToClipboard(block.content)}
                className="absolute top-2 right-2 px-3 py-1 text-xs bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-all duration-200"
              >
                Copy
              </button>
              <SyntaxHighlighter
                style={oneDark}
                language="javascript"
                className="rounded-lg border border-gray-700/50"
              >
                {block.content}
              </SyntaxHighlighter>
            </div>
          ) : (
            <p key={index} className="whitespace-pre-wrap text-sm leading-relaxed">
              {block.content}
            </p>
          )
        )}
        {/* Text-to-Speech Button */}
        {role === "assistant" && (
          <button
            onClick={() => speakText(content)}
            className="mt-2 text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center gap-1 text-sm"
          >
            <span>🔊</span> Listen
          </button>
        )}
      </div>

      {/* User Avatar */}
      {role === "user" && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center font-semibold shadow-lg">
          {auth?.user?.name[0].toUpperCase()}
          {auth?.user?.name.split(" ")[1]?.[0]?.toUpperCase() || ""}
        </div>
      )}
    </div>
  );
};

export default ChatItem;