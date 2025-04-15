import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { checkAuthStatus, loginUser, logoutUser, signupUser } from "../helpers/api-communicator"

type User = {
    name:string
    email: string
}
type UserAuth = {
    isLoggedIn: boolean
    user: User | null
    login:(email: string, password: string) => Promise<void>
    signup:(name:string, email: string, password: string) => Promise<void>
    logout:() => Promise<void>
}
const AuthContext = createContext<UserAuth | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode })=>{
    
    const [user, setUser] = useState<User | null>(null);  
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(()=>{
        // fetch if user's cookies are valid then skip login
        async function checkStatus(){
            const data = await checkAuthStatus();            
            if(data){
                setUser({email: data.email, name: data.name});
                setIsLoggedIn(true);
            }
        }
          checkStatus();
    }, []);

    const login = async (email: string, password: string) => {
        // login logic here
        try {
          console.log("Email and password are: ", email, password);
          const data  = await loginUser(email, password);
          console.log("The data is: ", data);
          if(data){
              setUser({email: data.user.email, name: data.user.name});
              setIsLoggedIn(true);            
          }
        } catch (error) {
          console.log("Error occured in the loginUser: ", error);
          
        }
      };
      
      const signup = async (name: string, email: string, password: string) => {
        // signup logic here
        const data  = await signupUser(name, email, password);
        if(data){
            setUser({email: data.user.email, name: data.user.name});
            setIsLoggedIn(true);
        }
      };
      
      const logout = async () => {
        // logout logic here
        await logoutUser();
        setIsLoggedIn(false);
        setUser(null);
        window.location.reload();
      };

      const value = {
        user,
        isLoggedIn,
        login,
        logout,
        signup,
      };
      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);