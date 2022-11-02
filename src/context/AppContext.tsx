import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAccessToken } from '../api/Zermelo';
import { Login } from "../pages/login";

type Values = {
  accounts: Account[],
  currentAccount: number,
  logOut: () => void,
  lng: string,
  setLng?: React.Dispatch<React.SetStateAction<string>>,
  addNewAccount: () => void;
  switchAccount: (i: number) => void;
}

type Account = {
  accountName: string,
  school: string,
  accessToken: string
}

const defaultValues: Values = {accounts: [], currentAccount: 0, logOut: () => {}, lng: "nl", addNewAccount: () => {}, switchAccount: () => {}};
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
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [lng, setLng] = useState(Intl.DateTimeFormat().resolvedOptions().locale.slice(0,2));

  useEffect(() => {
    const accounts: Account[] = JSON.parse(localStorage.getItem('zermelo-accounts') || "[]");
    const current = localStorage.getItem('zermelo-current');
    if(!Array.isArray(accounts) || accounts.length === 0) {
      setLoggedIn(false)
      setLoading(false)
    } else {
      if(!current) {
        setCurrentAccount(0)
      } else {
        setCurrentAccount(Number(current))
      }
      setAccounts(accounts)
      setLoggedIn(true);
      setLoading(false);
    }
  }, [])

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
  

  return <AppContext.Provider value={{accounts, currentAccount, logOut, lng, setLng, addNewAccount, switchAccount}}>{loading ? <></> : loggedIn ? children : <Login err={errMessage} onSubmit={onSubmit}/>}</AppContext.Provider>;
}
