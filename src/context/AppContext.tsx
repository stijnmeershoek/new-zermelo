import { useContext, createSignal, createEffect, createContext, JSX, Show, Accessor, on, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { request } from "../api/requests";
import { useMediaQuery } from "../hooks";
import { Login } from "../pages/Login";
import { getCurrentDate, getDates, getScheduleHours, getWeekNumber, sortSchedule } from "../utils/functions";


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
    goBack: () => void,
    addNewAccount: () => void,
    switchAccount: (i: number) => void,
    scheduleHours: Accessor<number[]>,
    datesLoad: Accessor<Date[]>,
    scheduleLoad: Accessor<Appointment[][]>,
    announcementsLoad: Accessor<Announcement[]>,
    fetchLiveSchedule: (user: string, dates: Date[], offset: number, signal: AbortSignal) => Promise<Appointment[][]>,
  }
  
  const initialState: State = {
    localPREFIX: "zermelo",
    settings: {lng: "nl",showChoices: "false",theme: "light"},
    updateSettings: () => () => {},
    isDesktop: () => true,
    user: () => "",
    accounts: () => [],
    currentAccount: () => 0,
    logOut: () => {},
    logIn: () => {},
    goBack: () => {},
    addNewAccount: () => {},
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
    const scheduleLowMin = 8;
    const scheduleHighMin = 16;
    const currentDay = new Date();
    const isDesktop = useMediaQuery({query: '(min-width: 1110px)'})
    const [loading, setLoading] = createSignal(true);

    const [loggedIn, setLoggedIn] = createSignal(false);
    const [accounts, setAccounts] = createSignal<Account[]>(JSON.parse(localStorage.getItem(`${localPREFIX}-accounts`) || "[]"));
    const [currentAccount, setCurrentAccount] = createSignal(Number(localStorage.getItem(`${localPREFIX}-current`) || 0));
    const [addAccount, setAddAccount] = createSignal(false);
    const [user, setUser] = createSignal("");

    const [settings, setSettings] = createStore<Settings>(JSON.parse(localStorage.getItem(`${localPREFIX}-settings`) || '{"lng": "nl", "theme": "light", "showChoices": "false"}'));

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
            setLoggedIn(true);
          }
    })

    createEffect(
        on(() => [accounts(), currentAccount()], () => {
            const current = accounts()[currentAccount()];
            if(!loggedIn() || !current.accessToken) return;
            setLoading(true);
            const abortController = new AbortController();
            const signal = abortController.signal;
        
            const fetchData = async () => {
                let userNew;
                const res = await fetchUserData(accounts(), currentAccount(), signal);
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

      createEffect(on(() => [settings.showChoices, settings.lng, settings.theme], () => {
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

    const addNewAccount = () => {
        setAddAccount(true);
        setLoggedIn(false);
      }
    
      const goBack = () => {
        setAddAccount(false);
        setLoggedIn(true);
      }
    
      const switchAccount = (i: number) => {
        if(i < -1 || i > accounts().length) return;
        localStorage.setItem(`${localPREFIX}-current`, JSON.stringify(i));
        setCurrentAccount(i);
      }

      async function fetchUserData(accounts: Account[], currentAccount: number, signal: AbortSignal): Promise<Current> {
        const res = await request('GET', '/api/v3/users/~me?fields=code,displayName', accounts[currentAccount].accessToken, accounts[currentAccount].school, signal);
        return res.response;
      }
    
      async function fetchLiveSchedule(user: string, dates: Date[], offset: number, signal: AbortSignal): Promise<Appointment[][]>  {
        const current = accounts()[currentAccount()];
        const school = current.school, token = current.accessToken;
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
        const current = accounts()[currentAccount()];
        const school = current.school, token = current.accessToken
        const res = await request("GET", '/api/v3/announcements?user=~me&current=true&fields=text,title,id,read', token, school, signal);
        const announcementsRes: Announcements = res.response;
    
        return Promise.resolve(announcementsRes.data);
      }

    return (
        <AppContext.Provider value={{localPREFIX, user, isDesktop, accounts, currentAccount, logOut, logIn, goBack, settings, updateSettings, addNewAccount, switchAccount, scheduleHours, scheduleLoad, announcementsLoad, datesLoad, fetchLiveSchedule}}>
            <Show when={!loading()} fallback={<div class="loader-div"><span class='loader'></span></div>}>
                <Show when={loggedIn() && accounts()} fallback={<Login addAccount={addAccount}/>}>
                    {props.children}
                </Show>
            </Show>
        </AppContext.Provider>
    );
}