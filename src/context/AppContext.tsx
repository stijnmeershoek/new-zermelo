import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAccessToken } from '../api/Zermelo';
import { Login } from "../pages/login";

type Values = {
  token: string,
  school: string,
  logOut: () => void,
}


const defaultValues: Values = {token: "", school: "", logOut: () => {}};
const AppContext = createContext(defaultValues);

export function useAppState() {
  return useContext(AppContext);
}

interface Props {
  children: ReactNode[]
}

export function AppProvider({ children }: Props) {
  const [errMessage, setErrMessage] = useState("");
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

  const logOut = () => {
    setToken("")
    setSchool("")
    localStorage.setItem('zermelo-token', "");
    localStorage.setItem('zermelo-school', "");
    setLoggedIn(false)
  }
  
  const onSubmit = (school: string, code: string) => {
    setErrMessage("");
    getAccessToken(school, code).then((accessToken: string) => {
      localStorage.setItem('zermelo-token', accessToken);
      localStorage.setItem('zermelo-school', school);
      setSchool(school);
      setToken(accessToken)
      setLoggedIn(true)
    }).catch((err: Error) => {
      setErrMessage(err.message);
    });
  }
  

  return <AppContext.Provider value={{token, school, logOut}}>{loading ? <></> : loggedIn ? children : <Login err={errMessage} onSubmit={onSubmit}/>}</AppContext.Provider>;
}
