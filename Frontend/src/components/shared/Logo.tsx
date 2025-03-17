import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div className="flex items-center gap-4 mr-auto">
      <Link to="/">
        <img
          src="openai.png"
          alt="openai"
          width="30px"
          height="30px"
          className="image-inverted"
        />
      </Link>
      <div className="hidden md:block font-extrabold text-white" style={{ textShadow: "2px 2px 20px #000" }}>
        <span className="text-2xl">AURA</span>-GPT
      </div>
    </div>
  );
};

export default Logo;
