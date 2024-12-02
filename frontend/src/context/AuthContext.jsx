import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  ); // if  authTokens exists get the access and refresh tokens
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  ); // if authTokens exists get the decoded user object
  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Login in user
  const loginUser = async (e) => {
    try {
        e.preventDefault();
        let response = await fetch("http://127.0.0.1:8000/api/token/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: e.target.username.value,
            password: e.target.password.value,
          }),
        });
        let data = await response.json();
    
        if (response.status === 200) {
          setAuthTokens(data);
          setUser(jwtDecode(data.access));
          localStorage.setItem("authTokens", JSON.stringify(data));
          navigate("/");
        } else {
          alert("something went wrong!");
        }
    } catch (error) {
        console.log(error);
    }
  };

  // Log out user
  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Send refresh tokens to get new access tokens
  let updateToken = async () => {
    console.log("refreshed");
    try {
      let response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
	   "Authorization": `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify({ refresh: authTokens.refresh }),
      });
      let data = await response.json();
      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
      } else {
        logoutUser();
      }
    } catch {
      logoutUser();
    } finally {
      setLoading(false);
    }
  };

  // context data to be used by the whole app
  const contextData = {
    user: user,
    loginUser: loginUser,
    logoutUser: logoutUser,
    authTokens: authTokens,
  };

  useEffect(() => {
        //If a user does not exist, redirect to the login page
        if(!user){
            navigate('/login/')
            setLoading(false);
        }
        if(loading){
            if(authTokens){ 
                updateToken(); 
            } 
        }
    
    let timeMinutes = 1000 * 60 * 30; // set time that sends refresh token to get access tokens
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, timeMinutes);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  if(loading){
    return <h1>Loading...</h1>
  }

  
  // data passed through context provider
  return (
    <AuthContext.Provider value={contextData}> 
      {loading ? null : children}
    </AuthContext.Provider>
  );
}
