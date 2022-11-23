import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { request } from '../api/requests';
import { Login } from "../pages/login";
import { getCurrentDate, getDates, sortSchedule } from "../utils/functions";
import {useMediaQuery} from '../hooks';

type Values = {
  localPREFIX: string,
  settings: Settings,
  setSettings: React.Dispatch<React.SetStateAction<Settings>>,
  isDesktop: boolean,
  user: string,
  accounts: Account[],
  currentAccount: number,
  logOut: () => void,
  logIn: (newAccount: Account, oldAccounts: Account[]) => Promise<void>,
  goBack: () => void,
  addNewAccount: () => void,
  switchAccount: (i: number) => void,
  datesLoad: Date[],
  scheduleLoad: Appointment[][],
  announcementsLoad: Announcement[],
  fetchLiveSchedule: (user: string, dates: Date[], offset: number, signal: AbortSignal) => Promise<Appointment[][]>,
}

const defaultValues: Values = {
  localPREFIX: "zermelo",
  settings: {
    lng: "nl",
    showChoices: false,
    theme: "light",
  },
  setSettings: () => {},
  isDesktop: true,
  user: "",
  accounts: [],
  currentAccount: 0,
  logOut: () => {},
  logIn: async () => {},
  goBack: () => {},
  addNewAccount: () => {},
  switchAccount: () => {},
  datesLoad: [],
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
  const [addAccount, setAddAccount] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<number>(Number(localStorage.getItem(`${localPREFIX}-current`) || 0));
  const [user, setUser] = useState("");
  const [accounts, setAccounts] = useState<Account[]>(JSON.parse(localStorage.getItem(`${localPREFIX}-accounts`) || "[]"));
  const [settings, setSettings] = useState<Settings>(JSON.parse(localStorage.getItem(`${localPREFIX}-settings`) || '{"lng": "nl", "theme": "light", "showChoices": false, "perWeek": true}'));

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

        const dates = await getDates(currentDay, 0);

        const responses = await Promise.all([
          fetchLiveSchedule(userNew, dates, 0, signal),
          fetchAnnouncements(signal),
        ])

        // !TODO || Make sure appointments with conflict get handled properly.
        let schedule: Appointment[][] = responses[0];
        let announcements: Announcement[] = responses[1];
        
        if(!schedule.every((a) => a.length < 1)) {
          const newGroup = [...new Set(schedule.flat().map((lesson) => lesson.groups ? lesson.groups[0] : "").filter((group) => group?.includes(".")))].map((item) => item.split("."))[0].filter(item => possibleGroups.some(group => item == group))[0];
          if(newGroup !== group && newGroup !== "") {
            const filteredAnnouncements = announcements.filter(announcement => (possibleGroups.some(element => announcement.title.toLowerCase().includes(element)) && announcement.title.toLowerCase().includes(group.slice(0,2))) || !possibleGroups.some(element => announcement.title.toLowerCase().includes(element)) || !group);
            setGroup(newGroup)
            setAnnouncementsLoad(filteredAnnouncements);
          } else {
            setAnnouncementsLoad(announcements)
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
    setAddAccount(true);
    setLoggedIn(false);
  }

  const goBack = () => {
    setLoading(true)
    setAddAccount(false);
    setLoggedIn(true);
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
    setLoading(true);
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
      setAddAccount(false);
      setLoggedIn(true);
    }
  }

  async function fetchUserData(accounts: Account[], currentAccount: number, signal: AbortSignal): Promise<Current> {
    const res = await request('GET', '/api/v3/tokens/~current', accounts[currentAccount].accessToken, accounts[currentAccount].school, signal);
    return res.response;
  }

  async function fetchLiveSchedule(user: string, dates: Date[], offset: number, signal: AbortSignal): Promise<Appointment[][]>  {
    const school = accounts[currentAccount].school, token = accounts[currentAccount].accessToken;
    const date = getCurrentDate(currentDay, offset);
    const week = `${date.getFullYear()}${Math.ceil(Math.floor((Number(date) - Number(new Date(date.getFullYear(), 0, 1))) / (24 * 60 * 60 * 1000)) / 7)}`

    const res = await request("GET", `/api/v3/liveschedule?student=${user}&week=${week}&fields=appointmentInstance,start,end,startTimeSlotName,endTimeSlotName,subjects,groups,locations,teachers,cancelled,changeDescription,schedulerRemark,content,appointmentType`, token, school, signal);
    const livescheduleRes: LiveSchedule = res.response;     

    let schedule = sortSchedule(livescheduleRes, dates, settings.showChoices);

    return Promise.resolve(schedule);
  }

  async function fetchAnnouncements(signal: AbortSignal): Promise<Announcement[]> {
    const school = accounts[currentAccount].school, token = accounts[currentAccount].accessToken
    const res = await request("GET", '/api/v3/announcements?user=~me&current=true', token, school, signal);
    const announcementsRes: Announcements = res.response;

    return Promise.resolve(announcementsRes.data);
  }
  
  return <AppContext.Provider value={{localPREFIX, user, isDesktop, accounts, currentAccount, logOut, logIn, goBack, settings, setSettings, addNewAccount, switchAccount, scheduleLoad, announcementsLoad, datesLoad, fetchLiveSchedule}}>{loading ? (<div className="loader-div"><span className='loader'></span></div>) : (loggedIn ? children : <Login addAccount={addAccount}/>)}</AppContext.Provider>;
}
