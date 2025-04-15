import { TypeAnimation } from "react-type-animation";

const TypingAnim = () => {
  return (
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
      style={{
        fontSize: "4rem",
        fontWeight: "bold",
        color: "transparent",
        background: "linear-gradient(to right, #c084fc, #4f46e5)", // Purple to indigo gradient
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        display: "inline-block",
        textShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)",
        letterSpacing: "-0.025em",
      }}
      repeat={Infinity}
    />
  );
};

export default TypingAnim;