import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { request } from '../api/requests';
import { Login } from "../pages/login";
import { getCurrentDate, getDates, sortSchedule } from "../utils/functions";
import {useMediaQuery} from '../hooks';

type Values = {
  localPREFIX: string,
  user: string,
  isDesktop: boolean,
  accounts: Account[],
  currentAccount: number,
  settings: Settings,
  setSettings: React.Dispatch<React.SetStateAction<Settings>>,
  datesLoad: Date[],
  logOut: () => void,
  logIn: (newAccount: Account, oldAccounts: Account[]) => Promise<void>
  addNewAccount: () => void;
  switchAccount: (i: number) => void;
  offset: number,
  setOffset: React.Dispatch<React.SetStateAction<number>>,
  scheduleLoad: Appointment[][],
  announcementsLoad: Announcement[],
  fetchLiveSchedule: (user: string, dates: Date[], signal: AbortSignal) => Promise<Appointment[][]>,
}

const defaultValues: Values = {
  localPREFIX: "zermelo",
  user: "",
  isDesktop: true,
  accounts: [],
  currentAccount: 0,
  logOut: () => {},
  logIn: async () => {},
  addNewAccount: () => {},
  switchAccount: () => {},
  settings: {
    lng: "nl",
    showChoices: false,
    theme: "light",
  },
  datesLoad: [],
  setSettings: () => {},
  offset: 0,
  setOffset: () => {},
  scheduleLoad: [],
  announcementsLoad: [],
  fetchLiveSchedule: () => {return Promise.resolve([])},
};

const AppContext = createContext(defaultValues);

export function useAppState() {
  return useContext(AppContext);
}

interface Props {
  children: ReactNode[] | ReactNode,
}

export function AppProvider({ children }: Props) {
  const localPREFIX = "zermelo"
  const currentDay = new Date(); 
  const possibleGroups = ["1a","1b","1c","1d","1s","1k","1l","1m","1f","1g","2a","2b","2c","2d","2s","2k","2l","2m","2f","2g","3h","3v","4v","4h","5v","5h","6v"];
  const isDesktop = useMediaQuery('(min-width: 1110px)');

  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<number>(Number(localStorage.getItem(`${localPREFIX}-current`) || 0));
  const [user, setUser] = useState("");
  const [accounts, setAccounts] = useState<Account[]>(JSON.parse(localStorage.getItem(`${localPREFIX}-accounts`) || "[]"));
  const [settings, setSettings] = useState<Settings>(JSON.parse(localStorage.getItem(`${localPREFIX}-settings`) || '{"lng": "nl", "theme": "light", "showChoices": false, "perWeek": true}'));

  const [offset, setOffset] = useState(0);
  const [group, setGroup] = useState("");
  const [scheduleLoad, setScheduleLoad] = useState<Appointment[][]>([])
  const [announcementsLoad, setAnnouncementsLoad] = useState<Announcement[]>([])
  const [datesLoad, setDatesLoad] = useState<Date[]>([]);

  useEffect(() => {
    if(!Array.isArray(accounts) || accounts.length === 0) {
      setLoggedIn(false)
      setLoading(false);
    } else {
      setLoggedIn(true);
    }
  }, [])

  useEffect(() => {
    if(!loggedIn || !accounts[currentAccount]) return;
    setLoading(true);
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
        let userNew = user;
        if(!userNew) {
          userNew = (await fetchUserData(accounts, currentAccount, signal)).data[0].user;
          if(userNew) {
            setUser(userNew);
          } else {
            setLoggedIn(false);
            setLoading(false);
          }
        }

        const dates = await getDates(currentDay, offset);
        const schedule = await fetchLiveSchedule(userNew, dates, signal);
        
        if(!schedule.every((a) => a.length < 1)) {
          const newGroup = [...new Set(schedule.flat().map((lesson) => lesson.groups ? lesson.groups[0] : "").filter((group) => group?.includes(".")))].map((item) => item.split("."))[0].filter(item => possibleGroups.some(group => item == group))[0];
          if(newGroup !== group && newGroup !== "") {
            const announcements = await fetchAnnouncements(newGroup, signal);
            setGroup(newGroup)
            setAnnouncementsLoad(announcements);
          }
        }

        setDatesLoad(dates);
        setScheduleLoad(schedule);
        setLoading(false)
    }

    fetchData();

    return () => {
      abortController.abort();
    }
  }, [loggedIn, accounts[currentAccount]])

  useEffect(() => {
    if(!settings) return;
    localStorage.setItem(`${localPREFIX}-settings`, JSON.stringify(settings));
  }, [settings])

  useEffect(() => {
    if(!settings) return;
    document.body.classList.value = settings.theme;
  }, [settings.theme])

  const addNewAccount = () => {
    setLoggedIn(false);
  }

  const switchAccount = (i: number) => {
    if(i < -1 || i > accounts.length) return;
    localStorage.setItem(`${localPREFIX}-current`, JSON.stringify(i));
    setCurrentAccount(i);
  }

  const logOut = () => {
    const newAccounts = accounts;
    newAccounts.splice(currentAccount, 1);
    localStorage.setItem(`${localPREFIX}-accounts`, JSON.stringify(newAccounts));
    localStorage.setItem(`${localPREFIX}-current`, JSON.stringify(0));
    setAccounts(newAccounts)
    setCurrentAccount(0);
    if(newAccounts.length !== 0) return;
    setLoggedIn(false)
  }
  
  const logIn = async (newAccount: Account, oldAccounts: Account[]) => {
    const abortController = new AbortController();
    const newAccounts = [...oldAccounts, newAccount];
    const current = newAccounts.indexOf(newAccount);
    localStorage.setItem(`${localPREFIX}-accounts`, JSON.stringify(newAccounts));
    localStorage.setItem(`${localPREFIX}-current`, JSON.stringify(current));
    setAccounts(newAccounts);
    setCurrentAccount(current);

    const res = await fetchUserData(newAccounts, current, abortController.signal);
    if(res) {
      const user = res.data[0].user;
      setUser(user);
      setLoggedIn(true);
    }
  }

  async function fetchUserData(accounts: Account[], currentAccount: number, signal: AbortSignal): Promise<Current> {
    const res = await request('GET', '/api/v3/tokens/~current', accounts[currentAccount].accessToken, accounts[currentAccount].school, signal);
    return res.response;
  }

  async function fetchLiveSchedule(user: string, dates: Date[], signal: AbortSignal): Promise<Appointment[][]>  {
    const school = accounts[currentAccount].school, token = accounts[currentAccount].accessToken;
    const date = getCurrentDate(currentDay, offset);
    const week = `${date.getFullYear()}${Math.ceil(Math.floor((Number(date) - Number(new Date(date.getFullYear(), 0, 1))) / (24 * 60 * 60 * 1000)) / 7)}`

    const res = await request("GET", `/api/v3/liveschedule?student=${user}&week=${week}&fields=appointmentInstance,start,end,startTimeSlotName,endTimeSlotName,subjects,groups,locations,teachers,cancelled,changeDescription,schedulerRemark,content,appointmentType`, token, school, signal);
    const livescheduleRes: LiveSchedule = res.response;     

    let schedule = sortSchedule(livescheduleRes, dates, settings.showChoices);

    return Promise.resolve(schedule);
  }

  async function fetchAnnouncements(group: string, signal: AbortSignal): Promise<Announcement[]> {
    const school = accounts[currentAccount].school, token = accounts[currentAccount].accessToken
    const res = await request("GET", '/api/v3/announcements?user=~me&current=true', token, school, signal);
    const announcementsRes: Announcements = res.response;

    if(!group) {
      return Promise.resolve(announcementsRes.data);
    };

    const announcements = announcementsRes.data.filter(announcement => (possibleGroups.some(element => announcement.title.toLowerCase().includes(element)) && announcement.title.toLowerCase().includes(group.slice(0,2))) || !possibleGroups.some(element => announcement.title.toLowerCase().includes(element)) || !group);
    return Promise.resolve(announcements);
  }
  
  return <AppContext.Provider value={{localPREFIX, user, isDesktop, accounts, currentAccount, logOut, logIn, settings, setSettings, addNewAccount, switchAccount, offset, setOffset, scheduleLoad, announcementsLoad, datesLoad, fetchLiveSchedule}}>{loading ? (<div className="loader-div"><span className='loader'></span></div>) : (loggedIn ? children : <Login />)}</AppContext.Provider>;
}
