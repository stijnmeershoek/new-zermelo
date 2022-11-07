import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAccessToken, getUserData, getLiveSchedule, getAnnouncements } from '../api/Zermelo';
import { Login } from "../pages/login";
import { getCurrentDate, getDates } from "../utils/functions";
import {useMediaQuery} from '../hooks';

type Values = {
  user: string,
  isDesktop: boolean,
  accounts: Account[],
  currentAccount: number,
  settings: Settings,
  setSettings: React.Dispatch<React.SetStateAction<Settings>>,
  logOut: () => void,
  addNewAccount: () => void;
  switchAccount: (i: number) => void;
  offset: number,
  setOffset: React.Dispatch<React.SetStateAction<number>>,
  scheduleLoad: Appointment[][],
  announcementsLoad: Announcement[],
  group: string, 
  dates: Date[],
  fetchLiveSchedule: (user: string, signal: AbortSignal) => Promise<Appointment[][]>,
  fetchAnnouncements: (signal: AbortSignal) => Promise<Announcement[]>
}

type Settings = {
  lng: string,
  theme: string,
  showChoices: boolean,
  perWeek: boolean,
}

const defaultValues: Values = {
  user: "",
  isDesktop: true,
  accounts: [],
  currentAccount: 0,
  logOut: () => {},
  addNewAccount: () => {},
  switchAccount: () => {},
  settings: {
    lng: "nl",
    showChoices: false,
    theme: "light",
    perWeek: true,
  },
  setSettings: () => {},
  offset: 0,
  setOffset: () => {},
  scheduleLoad: [],
  announcementsLoad: [],
  group: "",
  dates: [],
  fetchLiveSchedule: () => {return Promise.resolve([])},
  fetchAnnouncements: () => {return Promise.resolve([])}
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

  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<number>(Number(localStorage.getItem(`${localPREFIX}-current`) || 0));
  const [user, setUser] = useState("");
  const [accounts, setAccounts] = useState<Account[]>(JSON.parse(localStorage.getItem(`${localPREFIX}-accounts`) || "[]"));
  const [settings, setSettings] = useState<Settings>(JSON.parse(localStorage.getItem(`${localPREFIX}-settings`) || '{"lng": "nl", "theme": "light", "showChoices": false, "perWeek": true}'));

  const [offset, setOffset] = useState(0);
  const [group, setGroup] = useState("");
  const [dates, setDates] = useState<Date[]>([]);
  const [scheduleLoad, setScheduleLoad] = useState<Appointment[][]>([])
  const [announcementsLoad, setAnnouncementsLoad] = useState<Announcement[]>([])

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
          setUser(userNew);
        }

        const schedule = await fetchLiveSchedule(userNew, signal);
        const announcements = await fetchAnnouncements(signal);
        
        setScheduleLoad(schedule);
        setAnnouncementsLoad(announcements);
        setLoggedIn(true);
        setLoading(false);
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
  
  const onSubmit = (school: string, code: string, name: string) => {
    const abortController = new AbortController();
    setErrMessage("");
    const oldAccounts: Account[] = JSON.parse(localStorage.getItem(`${localPREFIX}-accounts`) || "[]");
    if(oldAccounts.some(account => account.accountName === name)) {
      setErrMessage(`${settings.lng === "nl" ? "Er bestaat al een account met deze naam." : settings.lng === "en" ? "An account with this name already exists." : "An account with this name already exists."}`);
      return;
    }
    getAccessToken(school, code)
    .then(async (accessToken: string) => {
      const newAccount = {
        accountName: name,
        school: school,
        accessToken: accessToken
      }
      const newAccounts = [...oldAccounts, newAccount];
      const current = newAccounts.indexOf(newAccount);
      localStorage.setItem(`${localPREFIX}-accounts`, JSON.stringify(newAccounts));
      localStorage.setItem(`${localPREFIX}-current`, JSON.stringify(current));
      setAccounts(newAccounts);
      setCurrentAccount(current);

      const res = await fetchUserData(newAccounts, current, abortController.signal);
      const user = res.data[0].user;
      setUser(user);
      setLoggedIn(true);
    }).catch((err: Error) => {
      setErrMessage(err.message);
    });
  }

  async function fetchUserData(accounts: Account[], currentAccount: number, signal: AbortSignal): Promise<Current> {
    const res: Current = await getUserData(accounts[currentAccount].accessToken, accounts[currentAccount].school, signal);
    return Promise.resolve(res);
  }

  async function fetchLiveSchedule(user: string, signal: AbortSignal): Promise<Appointment[][]>  {
    const school = accounts[currentAccount].school, token = accounts[currentAccount].accessToken;
    const dates = await getDates(currentDay, settings.perWeek, offset);
    const date = getCurrentDate(currentDay, settings.perWeek, offset);
    const week = `${date.getFullYear()}${Math.ceil(Math.floor((Number(date) - Number(new Date(date.getFullYear(), 0, 1))) / (24 * 60 * 60 * 1000)) / 7)}`
    setDates(dates);

    const livescheduleRes: LiveSchedule = await getLiveSchedule(school, token, week, user, signal);
         
    const day0 = livescheduleRes.data[0].appointments.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[0].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[0].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1)).filter((lesson) => !settings.showChoices ? lesson.appointmentType !== "choice" : lesson);
    const day1 = livescheduleRes.data[0].appointments.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[1].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[1].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1)).filter((lesson) => !settings.showChoices ? lesson.appointmentType !== "choice" : lesson);
    const day2 = livescheduleRes.data[0].appointments.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[2].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[2].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1)).filter((lesson) => !settings.showChoices ? lesson.appointmentType !== "choice" : lesson);
    const day3 = livescheduleRes.data[0].appointments.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[3].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[3].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1)).filter((lesson) => !settings.showChoices ? lesson.appointmentType !== "choice" : lesson);
    const day4 = livescheduleRes.data[0].appointments.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[4].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[4].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1)).filter((lesson) => !settings.showChoices ? lesson.appointmentType !== "choice" : lesson);
    let schedule = [day0, day1, day2, day3, day4];

    if(!schedule.every((a) => a.length < 1)) {
      const newGroup = [...new Set(livescheduleRes.data[0].appointments.map((lesson) => lesson.groups ? lesson.groups[0] : "").filter((group) => group?.includes(".")))].map((item) => item.split("."))[0].filter(item => possibleGroups.some(group => item == group))[0];
      if(newGroup !== group && newGroup !== "") {
        setGroup(newGroup)
      }
    }

    return Promise.resolve(schedule);
  }

  async function fetchAnnouncements(signal: AbortSignal): Promise<Announcement[]> {
    const school = accounts[currentAccount].school, token = accounts[currentAccount].accessToken
    const announcementsRes: Announcements = await getAnnouncements(school, token, signal);

    if(!group) {
      return Promise.resolve(announcementsRes.data);
    };

    const announcements = announcementsRes.data.filter(announcement => (possibleGroups.some(element => announcement.title.toLowerCase().includes(element)) && announcement.title.toLowerCase().includes(group.slice(0,2))) || !possibleGroups.some(element => announcement.title.toLowerCase().includes(element)) || !group);
    return Promise.resolve(announcements);
  }
  
  return <AppContext.Provider value={{user, isDesktop, accounts, currentAccount, logOut, settings, setSettings, addNewAccount, switchAccount, offset, setOffset, scheduleLoad, announcementsLoad, group, dates, fetchLiveSchedule, fetchAnnouncements}}>{loading ? (<div className="loader-div"><span className='loader'></span></div>) : (loggedIn ? children : <Login lng={settings.lng} err={errMessage} onSubmit={onSubmit}/>)}</AppContext.Provider>;
}
