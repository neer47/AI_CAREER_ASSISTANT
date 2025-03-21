import Logo from "./shared/Logo";
import { useAuth } from "../context/AuthContext";
import NavigationLink from "./shared/NavigationLink";

function Header() {
  const auth = useAuth();

  return (
    <header className="flex items-center justify-between px-4 py-3 from-gray-900 to-indigo-950">
      {/* Logo */}
      <div className="flex items-center transform hover:scale-105 transition-transform duration-200">
        <Logo />
      </div>

      {/* Navigation Links */}
      <nav className="flex space-x-4">
        {auth?.isLoggedIn ? (
          <>  
            <NavigationLink
              bg="bg-gradient-to-r from-cyan-500 to-cyan-600"
              to="/chat"
              text="Chat"
              textColor="text-white"
            />
            <NavigationLink
              bg="bg-gradient-to-r from-indigo-600 to-indigo-800"
              textColor="text-white"
              to="/"
              text="Logout"
              onClick={auth.logout}
            />
          </>
        ) : (
          <>
            <NavigationLink
              bg="bg-gradient-to-r from-cyan-500 to-cyan-600"
              to="/login"
              text="Login"
              textColor="text-white"
            />
            <NavigationLink
              bg="bg-gradient-to-r from-indigo-600 to-indigo-800"
              textColor="text-white"
              to="/signup"
              text="Signup"
            />
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;