import { TypeAnimation } from "react-type-animation";

const TypingAnim = () => {
  return (
    <div className="h-[4.5rem] sm:h-[5rem] md:h-[6rem] overflow-hidden text-center">
      <TypeAnimation
        sequence={[
          "Crush Interviews Like a Pro 🌟",
          1500,
          "Talk to AI Anytime, Anywhere 🗣️",
          1500,
          "Your Job Prep Sidekick 💪",
          1500,
          "Converse with Confidence 🎙️",
          1500,
        ]}
        speed={50}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-600 bg-clip-text text-transparent"
        style={{
          whiteSpace: "nowrap",
          textShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)",
          letterSpacing: "-0.025em",
        }}
        repeat={Infinity}
      />
    </div>
  );
};

export default TypingAnim;
