import { FC, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  children?: React.ReactNode;
  onClear?: () => void;
  clearLabel?: string;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const Sidebar: FC<SidebarProps> = ({ children, onClear, clearLabel, isOpen = false, setIsOpen }) => {
  const auth = useAuth();

  // Close sidebar when clicking outside on small screens
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && setIsOpen && !(event.target as HTMLElement).closest(".sidebar")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  return (
    <aside
      className={`flex flex-col w-72 bg-gray-800/95 backdrop-blur-lg p-5 shadow-2xl rounded-r-2xl border-r border-indigo-500/40 transition-all duration-300 ${
        isOpen ? "fixed left-0 top-0 h-full z-40" : "fixed -left-full top-0 h-[calc(100vh-64px)] z-40 md:static md:left-0 md:h-auto"
      }`}
    >
      <div className="flex flex-col flex-1">
        <div className="flex flex-col items-center">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-2xl font-bold mb-4 shadow-xl flex items-center justify-center">
            {auth?.user?.name[0].toUpperCase()}
            {auth?.user?.name.split(" ")[1]?.[0]?.toUpperCase() || ""}
          </div>
          <p className="text-center text-indigo-200 font-semibold mb-2">AI Career Assistant</p>
          <p className="text-sm text-gray-400 text-center mb-6">Your personal career guide</p>
        </div>
        {children}
        <div className="flex-1"></div>
        {onClear && clearLabel && (
          <button
            onClick={onClear}
            className="mt-4 py-2 px-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-xl text-white font-semibold shadow-lg transition-all duration-200"
          >
            {clearLabel}
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;