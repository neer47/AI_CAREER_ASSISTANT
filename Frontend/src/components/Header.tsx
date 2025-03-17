import Logo from "./shared/Logo";
import {useAuth} from "../context/AuthContext";
import NavigationLink from "./shared/NavigationLink";

function Header() {
  const auth = useAuth();
  return (
      <header className="flex p-4">
        <Logo />
        <div className="flex space-x-4">
          {auth?.isLoggedIn ? (
            <>
              <NavigationLink
                bg="bg-cyan-400"
                to="/chat"
                text="Go To Chat"
                textColor="text-black"
              />
              <NavigationLink
                bg="bg-indigo-700"
                textColor="text-white"
                to="/"
                text="Logout"
                onClick={auth.logout}
              />
            </>
          ) : (
            <>
              <NavigationLink
                bg="bg-cyan-400"
                to="/login"
                text="Login"
                textColor="text-black"
              />
              <NavigationLink
                bg="bg-indigo-700"
                textColor="text-white"
                to="/signup"
                text="Signup"
              />
            </>
          )}
        </div>
      </header>
  );
}

export default Header;
