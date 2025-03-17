import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// Clean up unwanted characters like `**` or `----`
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
    .then(() => {
      toast.success("Code copied to clipboard!");
    })
    .catch(() => {
      toast.error("Failed to copy text!");
    });
};

const speakText = (text: string) => {
  if ("speechSynthesis" in window) {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  } else {
    console.warn("Your browser does not support text-to-speech.");
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
      className={`flex gap-4 my-4 ${
        role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar for Assistant */}
      {role === "assistant" && (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <img
            src="openai.png"
            alt="assistant"
            className="w-8 h-8 rounded-full"
          />
        </div>
      )}

      {/* Message Content */}
      <div
        className={`max-w-[75%] p-4 rounded-lg shadow-md ${
          role === "user"
            ? "bg-blue-100 text-gray-800 self-end"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {messageBlocks.map((block, index) =>
          block.type === "code" ? (
            <div key={index} className="relative my-2">
              <button
                onClick={() => copyToClipboard(block.content)}
                className="absolute top-2 right-2 px-2 py-1 text-sm bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
              >
                Copy
              </button>
              <SyntaxHighlighter
                style={coldarkDark}
                language="javascript"
                className="rounded-md"
              >
                {block.content}
              </SyntaxHighlighter>
            </div>
          ) : (
            <p key={index} className="whitespace-pre-wrap text-sm">
              {block.content}
            </p>
          )
        )}
        {/* Text-to-Speech Button for Assistant */}
        {role === "assistant" && (
          <button
            onClick={() => speakText(content)}
            className="text-blue-500 mt-2 hover:text-blue-700"
          >
            🔊 Listen
          </button>
        )}
      </div>

      {/* Avatar for User */}
      {role === "user" && (
        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
          {auth?.user?.name[0].toUpperCase()}
          {auth?.user?.name.split(" ")[1]?.[0]?.toUpperCase() || ""}
        </div>
      )}
    </div>
  );
};

export default ChatItem;
