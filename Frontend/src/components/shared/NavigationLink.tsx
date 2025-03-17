import { Link } from "react-router-dom";

type Props = {
  to: string;
  bg: string;
  text: string;
  textColor: string;
  onClick?: () => Promise<void>;
};

const NavigationLink = ({ to, bg, text, textColor, onClick }: Props) => {
  return (
    <Link
      onClick={onClick}
      to={to}
      className={`${bg} ${textColor} px-4 py-2 rounded-lg hover:opacity-80 transition-opacity duration-200`}
    >
      {text}
    </Link>
  );
};

export default NavigationLink;
