import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAccessToken, getUserData, getLiveSchedule, getAnnouncements } from '../api/Zermelo';
import { Login } from "../pages/login";
import { getCurrentDate, getDates } from "../utils/functions";

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
  perWeek: boolean,
  setPerWeek: React.Dispatch<React.SetStateAction<boolean>>
  offset: number,
  setOffset: React.Dispatch<React.SetStateAction<number>>,
  scheduleLoad: Appointment[][],
  announcementsLoad: Announcement[],
  group: string, 
  dates: Date[],
  fetchLiveSchedule: (user: string, abortController: AbortController) => Promise<Appointment[][]>,
  fetchAnnouncements: (abortController: AbortController) => Promise<Announcement[]>
}

const defaultValues: Values = {
  user: "",
  accounts: [],
  currentAccount: 0,
  logOut: () => {},
  lng: "nl",
  addNewAccount: () => {},
  switchAccount: () => {},
  setLng: () => {},
  theme: "light",
  setTheme: () => {},
  showChoices: "0",
  setShowChoices: () => {},
  perWeek: true,
  setPerWeek: () => {},
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
  
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<number>(0);
  const [user, setUser] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [lng, setLng] = useState("");
  const [theme, setTheme] = useState("");
  const [showChoices, setShowChoices] = useState("");

  const [perWeek, setPerWeek] = useState(true);
  const [offset, setOffset] = useState(0);
  const [group, setGroup] = useState("");
  const [dates, setDates] = useState<Date[]>([]);
  const [scheduleLoad, setScheduleLoad] = useState<Appointment[][]>([])
  const [announcementsLoad, setAnnouncementsLoad] = useState<Announcement[]>([])

  useEffect(() => {
    const accounts: Account[] = JSON.parse(localStorage.getItem(`${localPREFIX}-accounts`) || "[]");
    const current = localStorage.getItem(`${localPREFIX}-current`);
    const lng = localStorage.getItem(`${localPREFIX}-lng`) || Intl.DateTimeFormat().resolvedOptions().locale.slice(0,2);
    const theme = localStorage.getItem(`${localPREFIX}-theme`) || "light";
    const showChoices = localStorage.getItem(`${localPREFIX}-showchoices`) || "0";
    setLng(lng);
    setTheme(theme);
    setShowChoices(showChoices);

    if(!Array.isArray(accounts) || accounts.length === 0) {
      setLoggedIn(false)
      setLoading(false);
    } else {
      if(!current) {
        setCurrentAccount(0)
      } else {
        setCurrentAccount(Number(current))
      }
      setAccounts(accounts)
      setLoggedIn(true);
    }
  }, [])

  useEffect(() => {
    if(!loggedIn || !accounts[currentAccount]) return;
    let abortController = new AbortController()
    const fetchData = async () => {
        const res: Current = await getUserData(accounts[currentAccount].accessToken, accounts[currentAccount].school, abortController);
        const user = res.data[0].user;
        setUser(user);

        const schedule = await fetchLiveSchedule(user, abortController);
        const announcements = await fetchAnnouncements(abortController)
        
        setScheduleLoad(schedule);
        setAnnouncementsLoad(announcements)
        setLoading(false);
    }

    fetchData();

    return () => {
      abortController.abort();
    }
  }, [loggedIn, accounts[currentAccount]])

  useEffect(() => {
    if(!lng) return;
    localStorage.setItem(`${localPREFIX}-lng`, lng)
  }, [lng])

  useEffect(() => {
    if(!theme) return;
    document.body.classList.value = theme;
    localStorage.setItem(`${localPREFIX}-theme`, theme)
  }, [theme])

  useEffect(() => {
    if(!showChoices) return;
    localStorage.setItem(`${localPREFIX}-showchoices`, showChoices)
  }, [showChoices])

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
    setErrMessage("");
    getAccessToken(school, code)
    .then((accessToken: string) => {
      const localAccounts = localStorage.getItem(`${localPREFIX}-accounts`);
      const oldAccounts: Account[] = JSON.parse(localAccounts || "[]");
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
      setLoggedIn(true)
    }).catch((err: Error) => {
      setErrMessage(err.message);
    });
  }


  async function fetchLiveSchedule(user: string ,abortController: AbortController): Promise<Appointment[][]>  {
    const school = accounts[currentAccount].school, token = accounts[currentAccount].accessToken;
    const dates = await getDates(currentDay, perWeek, offset);
    const date = getCurrentDate(currentDay, perWeek, offset);
    const week = `${date.getFullYear()}${Math.ceil(Math.floor((Number(date) - Number(new Date(date.getFullYear(), 0, 1))) / (24 * 60 * 60 * 1000)) / 7)}`
    setDates(dates);

    const livescheduleRes: LiveSchedule = await getLiveSchedule(school, token, week, user, abortController);
         
    const day0 = livescheduleRes.data[0].appointments.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[0].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[0].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1)).filter((lesson) => showChoices !== "1" ? lesson.appointmentType !== "choice" : lesson);
    const day1 = livescheduleRes.data[0].appointments.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[1].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[1].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1)).filter((lesson) => showChoices !== "1" ? lesson.appointmentType !== "choice" : lesson);
    const day2 = livescheduleRes.data[0].appointments.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[2].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[2].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1)).filter((lesson) => showChoices !== "1" ? lesson.appointmentType !== "choice" : lesson);
    const day3 = livescheduleRes.data[0].appointments.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[3].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[3].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1)).filter((lesson) => showChoices !== "1" ? lesson.appointmentType !== "choice" : lesson);
    const day4 = livescheduleRes.data[0].appointments.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[4].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[4].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1)).filter((lesson) => showChoices !== "1" ? lesson.appointmentType !== "choice" : lesson);
    let schedule = [day0, day1, day2, day3, day4];

    if(!schedule.every((a) => a.length < 1)) {
      const newGroup = [...new Set(livescheduleRes.data[0].appointments.map((lesson) => lesson.groups ? lesson.groups[0] : "").filter((group) => group?.includes(".")))].map((item) => item.split("."))[0].filter(item => possibleGroups.some(group => item == group))[0];
      if(newGroup !== group && newGroup !== "") {
        setGroup(newGroup)
      }
    }

    return Promise.resolve(schedule);
  }

  async function fetchAnnouncements(abortController: AbortController): Promise<Announcement[]> {
    const school = accounts[currentAccount].school, token = accounts[currentAccount].accessToken
    const announcementsRes: Announcements = await getAnnouncements(school, token, abortController);

    if(!group) {
      return Promise.resolve(announcementsRes.data);
    };

    const announcements = announcementsRes.data.filter(announcement => (possibleGroups.some(element => announcement.title.toLowerCase().includes(element)) && announcement.title.toLowerCase().includes(group.slice(0,2))) || !possibleGroups.some(element => announcement.title.toLowerCase().includes(element)) || !group);
    return Promise.resolve(announcements);
  }
  
  return <AppContext.Provider value={{user, accounts, currentAccount, logOut, lng, setLng, addNewAccount, switchAccount, theme, setTheme, showChoices, setShowChoices, perWeek, setPerWeek, offset, setOffset, scheduleLoad, announcementsLoad, group, dates, fetchLiveSchedule, fetchAnnouncements}}>{loading ? (<div className="loader-div"><span className='loader'></span></div>) : (loggedIn ? children : <Login err={errMessage} onSubmit={onSubmit}/>)}</AppContext.Provider>;
}
