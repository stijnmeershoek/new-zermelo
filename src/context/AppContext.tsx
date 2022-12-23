import { useContext, createSignal, createEffect, createContext, JSX, Show, Accessor, on, onCleanup, lazy } from "solid-js";
import { createStore } from "solid-js/store";
import { getCurrentDate, getDates, getScheduleHours, getWeekNumber, sortSchedule } from "../utils/functions";
import { request } from "../api/requests";
import { useMediaQuery } from "../hooks";
const Login = lazy(() => import("../pages/Login/Login"));


type State = {
    localPREFIX: string,
    settings: Settings,
    updateSettings: (fieldName: string) => (event: Event) => void,
    isDesktop: Accessor<boolean>,
    user: Accessor<string>,
    accounts: Accessor<Account[]>
    currentAccount: Accessor<number>,
    logOut: () => void,
    logIn: (newAccount: Account, oldAccounts: Account[]) => void,
    toggleAddAccount: () => void,
    switchAccount: (i: number) => void,
    scheduleHours: Accessor<number[]>,
    datesLoad: Accessor<Date[]>,
    scheduleLoad: Accessor<Appointment[][]>,
    announcementsLoad: Accessor<Announcement[]>,
    fetchLiveSchedule: (user: string, dates: Date[], offset: number, signal: AbortSignal) => Promise<Appointment[][]>,
  }
  
  const initialState: State = {
    localPREFIX: "zermelo",
    settings: {lng: "nl",showChoices: "false",theme: "light", enableCustom: "false"},
    updateSettings: () => () => {},
    isDesktop: () => true,
    user: () => "",
    accounts: () => [],
    currentAccount: () => 0,
    logOut: () => {},
    logIn: () => {},
    toggleAddAccount: () => {},
    switchAccount: () => {},
    scheduleHours: () => [],
    datesLoad: () => [],
    scheduleLoad: () => [],
    announcementsLoad: () => [],
    fetchLiveSchedule: () => {return Promise.resolve([])},
  };

const AppContext = createContext(initialState);

export function useAppState() {
    return useContext(AppContext);
}

interface Props {
    children: JSX.Element | JSX.Element[]
}

export function AppProvider(props: Props) {
    const localPREFIX = "zermelo"
    const [scheduleStartMin, setScheduleStartMin] = createSignal(8);
    const [scheduleEndMin, setScheduleEndMin] = createSignal(17);
    const isDesktop = useMediaQuery({query: '(min-width: 1110px)'})
    const [loading, setLoading] = createSignal(true);

    const [loggedIn, setLoggedIn] = createSignal(false);
    const [accounts, setAccounts] = createSignal<Account[]>(JSON.parse(localStorage.getItem(`${localPREFIX}-accounts`) || "[]"));
    const [currentAccount, setCurrentAccount] = createSignal(Number(localStorage.getItem(`${localPREFIX}-current`) || 0));
    const [addAccount, setAddAccount] = createSignal(false);
    const [user, setUser] = createSignal("");

    const [settings, setSettings] = createStore<Settings>(JSON.parse(localStorage.getItem(`${localPREFIX}-settings`) || '{"lng": "nl", "theme": "light", "showChoices": "false", "enableCustom": "false"}'));

    const [group, setGroup] = createSignal("");
    const [scheduleHours, setScheduleHours] = createSignal<number[]>([])
    const [scheduleLoad, setScheduleLoad] = createSignal<Appointment[][]>([])
    const [announcementsLoad, setAnnouncementsLoad] = createSignal<Announcement[]>([])
    const [datesLoad, setDatesLoad] = createSignal<Date[]>([]);

    const updateSettings = (fieldName: string) => (event: Event) => {
      const inputElement = event.currentTarget as HTMLInputElement;
      setSettings({
        [fieldName]: inputElement.value
      });
    };

    createEffect(() => {
        if(!Array.isArray(accounts()) || accounts().length === 0) {
            setLoggedIn(false)
            setLoading(false);
          } else {
            if(currentAccount() > accounts().length - 1) setCurrentAccount(accounts().length - 1);
            setLoggedIn(true);
          }
    })

    createEffect(
        on(() => [accounts(), currentAccount()], () => {
            const current = accounts()[currentAccount()];
            if(!loggedIn() || !current.accessToken) return;
            setLoading(true);
            const defaultOffset = (new Date().getDay() === 6 || new Date().getDay() === 0) ? 1 : 0;
            const abortController = new AbortController();
            const signal = abortController.signal;
        
            const fetchData = async () => {
                let userNew;
                const res = await fetchUserData(signal);
                if(res && res.data[0].code) {
                  userNew = res.data[0].code;
                } else {
                  setLoggedIn(false);
                  setLoading(false);
                  return;
                }
        
                const dates = await getDates(new Date(), defaultOffset);
        
                const responses = await Promise.all([
                  fetchLiveSchedule(userNew, dates, defaultOffset, signal),
                  fetchAnnouncements(signal),
                ])
        
                let schedule: Appointment[][] = responses[0];
                let announcements: Announcement[] = responses[1];
                
                if(!schedule.every((a) => a.length < 1)) {
                  const newGroup = [...new Set(schedule.flat().map((lesson) => lesson.groups ? lesson.groups[0] : "").filter((group) => group?.includes(".")))].map((item) => item.split("."))[0][0];
                  if(newGroup !== group() && newGroup !== "") {
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

            onCleanup(() => abortController.abort())
        })
      );

      createEffect(on(() => [settings.enableCustom, settings.showChoices, settings.lng, settings.theme], () => {
        if(!settings) return;
        localStorage.setItem(`${localPREFIX}-settings`, JSON.stringify(settings));
        document.body.classList.value = settings.theme;
      }))

      const logOut = () => {
        setLoading(true);
        const newAccounts = accounts();
        newAccounts.splice(currentAccount(), 1);
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
    
    const toggleAddAccount = () => {
      setAddAccount(!addAccount());
      setLoggedIn(!loggedIn())
    }
  
    const switchAccount = (i: number) => {
      if(i < -1 || i > accounts().length) return;
      localStorage.setItem(`${localPREFIX}-current`, JSON.stringify(i));
      setCurrentAccount(i);
    }

    async function fetchUserData(signal: AbortSignal): Promise<Current> {
      const current = accounts()[currentAccount()];
      const school = current.school, token = current.accessToken;
      
      const res = await request('GET', '/api/v3/users/~me?fields=code,displayName', token, school, signal);
      return res.response;
    }

    async function fetchCustomAppointments(user: string): Promise<Appointment[]> {
      const res = localStorage.getItem(`${localPREFIX}-customappointments`)
      if(!res) return [];
      const appointmentsRes = JSON.parse(res);
      const appointments = appointmentsRes[user] || []
      return Promise.resolve(appointments);
    }
  
    async function fetchLiveSchedule(user: string, dates: Date[], offset: number, signal: AbortSignal): Promise<Appointment[][]>  {
      const current = accounts()[currentAccount()];
      const school = current.school, token = current.accessToken;
      const date = getCurrentDate(new Date(), offset);
      const week = getWeekNumber(date);
  
      const res = await request("GET", `/api/v3/liveschedule?student=${user}&week=${week}&fields=start,end,startTimeSlotName,endTimeSlotName,subjects,groups,locations,teachers,cancelled,changeDescription,schedulerRemark,content,appointmentType`, token, school, signal);
      const livescheduleRes: LiveSchedule = res.response;
      let merged = livescheduleRes.data[0].appointments;
      
      if(settings.enableCustom === "true") {
        const customAppointments = await fetchCustomAppointments(user);
        merged = livescheduleRes.data[0].appointments.concat(customAppointments);
      }

      let schedule: Appointment[][] = [];
      if(merged.length > 1) {
        schedule = sortSchedule(merged, dates, settings.showChoices);
        const scheduleHours = getScheduleHours(merged, scheduleStartMin(), scheduleEndMin());
        setScheduleHours(scheduleHours);
      }

      return Promise.resolve(schedule);
    }
  
    async function fetchAnnouncements(signal: AbortSignal): Promise<Announcement[]> {
      const current = accounts()[currentAccount()];
      const school = current.school, token = current.accessToken
      const res = await request("GET", '/api/v3/announcements?user=~me&current=true&fields=text,title,id,read', token, school, signal);
      const announcementsRes: Announcements = res.response;
  
      return Promise.resolve(announcementsRes.data);
    }

  return (
      <AppContext.Provider value={{localPREFIX, user, isDesktop, accounts, currentAccount, logOut, logIn, toggleAddAccount, settings, updateSettings, switchAccount, scheduleHours, scheduleLoad, announcementsLoad, datesLoad, fetchLiveSchedule}}>
          <Show when={!loading()} fallback={<div class="loader-div"><span class='loader'></span></div>}>
              <Show when={loggedIn() && accounts()} fallback={<Login addAccount={addAccount}/>}>
                  {props.children}
              </Show>
          </Show>
      </AppContext.Provider>
  );
}