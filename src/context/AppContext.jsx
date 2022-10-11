import { createContext, useContext, useState, useEffect } from "react";
import { getAccessToken } from '../api/Zermelo';
import { Login } from "../pages/login";

const AppContext = createContext();

export function useAppState() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [school, setSchool] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('zermelo-token');
    const school = localStorage.getItem('zermelo-school');
    if(!token || !school) {
      setLoggedIn(false)
      setLoading(false)
    } else {
      setToken(token);
      setSchool(school)
      setLoggedIn(true);
      setLoading(false);
    }
  }, [])
  
  const onSubmit = async (school, code) => {
    const accessToken = await getAccessToken(school, code);
    localStorage.setItem('zermelo-token', accessToken);
    localStorage.setItem('zermelo-school', school);
    setSchool(school);
    setToken(accessToken)
    setLoggedIn(true)
  }
  

  return <AppContext.Provider value={{token, school}}>{loading ? <></> : loggedIn ? children : <Login onSubmit={onSubmit}/>}</AppContext.Provider>;
}
