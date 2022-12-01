import { useContext, useState, useEffect, StateUpdater } from "preact/hooks";
import { ComponentChildren, createContext } from "preact";
import { request } from '../api/requests';
import { Login } from "../pages/Login";
import { getCurrentDate, getDates, getScheduleHours, getWeekNumber, sortSchedule } from "../utils/functions";
import {useMediaQuery} from '../hooks';

type Values = {
  localPREFIX: string,
  settings: Settings,
  setSettings: StateUpdater<Settings>,
  isDesktop: boolean,
  user: string,
  accounts: Account[],
  currentAccount: number,
  logOut: () => void,
  logIn: (newAccount: Account, oldAccounts: Account[]) => void,
  goBack: () => void,
  addNewAccount: () => void,
  switchAccount: (i: number) => void,
  scheduleHours: number[],
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
  logIn: () => {},
  goBack: () => {},
  addNewAccount: () => {},
  switchAccount: () => {},
  scheduleHours: [],
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
  children: ComponentChildren,
}

export function AppProvider({ children }: Props) {
  const localPREFIX = "zermelo"
  const scheduleLowMin = 8;
  const scheduleHighMin = 16;
  const currentDay = new Date(); 
  const isDesktop = useMediaQuery('(min-width: 1110px)');

  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [addAccount, setAddAccount] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<number>(Number(localStorage.getItem(`${localPREFIX}-current`) || 0));
  const [user, setUser] = useState("");
  const [accounts, setAccounts] = useState<Account[]>(JSON.parse(localStorage.getItem(`${localPREFIX}-accounts`) || "[]"));
  const [settings, setSettings] = useState<Settings>(JSON.parse(localStorage.getItem(`${localPREFIX}-settings`) || '{"lng": "nl", "theme": "light", "showChoices": false, "perWeek": true}'));

  const [group, setGroup] = useState("");
  const [scheduleHours, setScheduleHours] = useState<number[]>([])
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
    if(!loggedIn || !accounts[currentAccount].accessToken) return;
    setLoading(true);
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
        let userNew;
        const res = await fetchUserData(accounts, currentAccount, signal);
        if(res && res.data[0].code) {
          userNew = res.data[0].code;
        } else {
          setLoggedIn(false);
          setLoading(false);
          return;
        }

        const dates = await getDates(currentDay, 0);

        const responses = await Promise.all([
          fetchLiveSchedule(userNew, dates, 0, signal),
          fetchAnnouncements(signal),
        ])

        let schedule: Appointment[][] = responses[0];
        let announcements: Announcement[] = responses[1];
        
        if(!schedule.every((a) => a.length < 1)) {
          const newGroup = [...new Set(schedule.flat().map((lesson) => lesson.groups ? lesson.groups[0] : "").filter((group) => group?.includes(".")))].map((item) => item.split("."))[0][0];
          if(newGroup !== group && newGroup !== "") {
            const filteredAnnouncements = announcements.filter(announcement => announcement.title.toLowerCase().match(/\d+[A-z]/g)?.includes(newGroup) || !newGroup);
            setGroup(newGroup)
            setAnnouncementsLoad(filteredAnnouncements);
          } else {
            setAnnouncementsLoad(announcements)
          }
        }

        setUser(userNew)
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
    setLoading(true);
    const newAccounts = accounts;
    newAccounts.splice(currentAccount, 1);
    localStorage.setItem(`${localPREFIX}-accounts`, JSON.stringify(newAccounts));
    localStorage.setItem(`${localPREFIX}-current`, JSON.stringify(0));
    setAccounts(newAccounts)
    setCurrentAccount(0);
    if(newAccounts.length < 1) {
      setLoggedIn(false)
    };
  }
  
  const logIn = (newAccount: Account, oldAccounts: Account[]) => {
    setLoading(true);
    const newAccounts = [...oldAccounts, newAccount];
    const current = newAccounts.indexOf(newAccount);
    localStorage.setItem(`${localPREFIX}-accounts`, JSON.stringify(newAccounts));
    localStorage.setItem(`${localPREFIX}-current`, JSON.stringify(current));
    setAccounts(newAccounts);
    setCurrentAccount(current);
    setAddAccount(false);
    setLoggedIn(true);
  }

  async function fetchUserData(accounts: Account[], currentAccount: number, signal: AbortSignal): Promise<Current> {
    const res = await request('GET', '/api/v3/users/~me?fields=code,displayName', accounts[currentAccount].accessToken, accounts[currentAccount].school, signal);
    return res.response;
  }

  async function fetchLiveSchedule(user: string, dates: Date[], offset: number, signal: AbortSignal): Promise<Appointment[][]>  {
    const school = accounts[currentAccount].school, token = accounts[currentAccount].accessToken;
    const date = getCurrentDate(currentDay, offset);
    const week = getWeekNumber(date);

    const res = await request("GET", `/api/v3/liveschedule?student=${user}&week=${week}&fields=start,end,startTimeSlotName,endTimeSlotName,subjects,groups,locations,teachers,cancelled,changeDescription,schedulerRemark,content,appointmentType`, token, school, signal);
    const livescheduleRes: LiveSchedule = res.response;
    const scheduleHours = getScheduleHours(livescheduleRes.data[0].appointments, scheduleLowMin, scheduleHighMin);

    let schedule = sortSchedule(livescheduleRes, dates, settings.showChoices);

    setScheduleHours(scheduleHours);
    return Promise.resolve(schedule);
  }

  async function fetchAnnouncements(signal: AbortSignal): Promise<Announcement[]> {
    const school = accounts[currentAccount].school, token = accounts[currentAccount].accessToken
    const res = await request("GET", '/api/v3/announcements?user=~me&current=true&fields=text,title,id,read', token, school, signal);
    const announcementsRes: Announcements = res.response;

    return Promise.resolve(announcementsRes.data);
  }
  
  return <AppContext.Provider value={{localPREFIX, user, isDesktop, accounts, currentAccount, logOut, logIn, goBack, settings, setSettings, addNewAccount, switchAccount, scheduleHours, scheduleLoad, announcementsLoad, datesLoad, fetchLiveSchedule}}>{loading ? (<div className="loader-div"><span className='loader'></span></div>) : (loggedIn ? children : <Login addAccount={addAccount}/>)}</AppContext.Provider>;
}
