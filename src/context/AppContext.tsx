import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAccessToken, getUserData, Current } from '../api/Zermelo';
import { Login } from "../pages/login";

type Values = {
  user: string,
  accounts: Account[],
  currentAccount: number,
  logOut: () => void,
  lng: string,
  setLng: React.Dispatch<React.SetStateAction<string>>,
  addNewAccount: () => void;
  switchAccount: (i: number) => void;
  theme: string,
  setTheme: React.Dispatch<React.SetStateAction<string>>
  showChoices: string,
  setShowChoices: React.Dispatch<React.SetStateAction<string>>
}

type Account = {
  accountName: string,
  school: string,
  accessToken: string
}

const defaultValues: Values = {user: "", accounts: [], currentAccount: 0, logOut: () => {}, lng: "nl", addNewAccount: () => {}, switchAccount: () => {}, setLng: () => {}, theme: "light", setTheme: () => {}, showChoices: "0", setShowChoices: () => {}};
const AppContext = createContext(defaultValues);

export function useAppState() {
  return useContext(AppContext);
}

interface Props {
  children: ReactNode[] | ReactNode,
}

export function AppProvider({ children }: Props) {
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<number>(0);
  const [user, setUser] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [lng, setLng] = useState("");
  const [theme, setTheme] = useState("");
  const [showChoices, setShowChoices] = useState("");

  useEffect(() => {
    const accounts: Account[] = JSON.parse(localStorage.getItem('zermelo-accounts') || "[]");
    const current = localStorage.getItem('zermelo-current');
    if(!Array.isArray(accounts) || accounts.length === 0) {
      setLoggedIn(false)
    } else {
      if(!current) {
        setCurrentAccount(0)
      } else {
        setCurrentAccount(Number(current))
      }
      setAccounts(accounts)
      setLoggedIn(true);
    }

    const lng = localStorage.getItem('zermelo-lng') || Intl.DateTimeFormat().resolvedOptions().locale.slice(0,2);
    const theme = localStorage.getItem('zermelo-theme') || "light";
    const showChoices = localStorage.getItem('zermelo-showchoices') || "0";
    setLng(lng);
    setTheme(theme);
    setShowChoices(showChoices);
    setLoading(false)
  }, [])

  useEffect(() => {
    if(!loggedIn || !accounts[currentAccount]) return;
    let abortController = new AbortController()
    const fetchData = async () => {
        const res: Current = await getUserData(accounts[currentAccount].accessToken, accounts[currentAccount].school, abortController);
        setUser(res.data[0].user);
    }

    fetchData();

    return () => {
      abortController.abort();
    }
  }, [loggedIn, currentAccount, accounts])

  useEffect(() => {
    if(!lng) return;
    localStorage.setItem('zermelo-lng', lng)
  }, [lng])

  useEffect(() => {
    if(!theme) return;
    localStorage.setItem('zermelo-theme', theme)
  }, [theme])

  useEffect(() => {
    if(!showChoices) return;
    localStorage.setItem('zermelo-showchoices', showChoices)
  }, [showChoices])

  const addNewAccount = () => {
    setLoggedIn(false);
  }

  const switchAccount = (i: number) => {
    if(i < -1 || i > accounts.length) return;
    localStorage.setItem('zermelo-current', JSON.stringify(i));
    setCurrentAccount(i);
  }

  const logOut = () => {
    const newAccounts = accounts;
    newAccounts.splice(currentAccount, 1);
    localStorage.setItem('zermelo-accounts', JSON.stringify(newAccounts));
    localStorage.setItem('zermelo-current', JSON.stringify(0));
    setAccounts(newAccounts)
    setCurrentAccount(0);
    if(newAccounts.length !== 0) return;
    setLoggedIn(false)
  }
  
  const onSubmit = (school: string, code: string, name: string) => {
    setErrMessage("");
    getAccessToken(school, code)
    .then((accessToken: string) => {
      const localAccounts = localStorage.getItem('zermelo-accounts');
      const oldAccounts: Account[] = JSON.parse(localAccounts || "[]");
      const newAccount = {
        accountName: name,
        school: school,
        accessToken: accessToken
      }
      const newAccounts = [...oldAccounts, newAccount];
      const current = newAccounts.indexOf(newAccount);
      localStorage.setItem('zermelo-accounts', JSON.stringify(newAccounts));
      localStorage.setItem('zermelo-current', JSON.stringify(current));
      setAccounts(newAccounts);
      setCurrentAccount(current);
      setLoggedIn(true)
    }).catch((err: Error) => {
      setErrMessage(err.message);
    });
  }
  

  return <AppContext.Provider value={{user, accounts, currentAccount, logOut, lng, setLng, addNewAccount, switchAccount, theme, setTheme, showChoices, setShowChoices}}>{loading ? <></> : loggedIn ? children : <Login err={errMessage} onSubmit={onSubmit}/>}</AppContext.Provider>;
}
