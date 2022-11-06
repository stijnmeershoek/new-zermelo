import './App.css'
import { useAppState } from './context';
import { postEnroll } from './api/Zermelo';
import { getCurrentDate, getMonday } from './utils/functions';
import { useEffect, useLayoutEffect, useState, useRef, FormEvent } from 'react';
import { LessonBlock } from './components/LessonBlock'
import {useMediaQuery} from './hooks';

const App = () => {
  const { accounts, currentAccount, switchAccount, addNewAccount, logOut, lng, setLng, theme, setTheme, showChoices, setShowChoices, perWeek, setPerWeek, offset, setOffset, announcementsLoad } = useAppState();
  const [announcements, setAnnouncements] = useState<Announcement[]>(announcementsLoad);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [choiceModalOpen, setChoiceModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Appointment | null>();
  const isDesktop = useMediaQuery('(min-width: 1110px)');
  const currentDay = new Date();

  const GetCurrentDate = () => {
    return getCurrentDate(currentDay, perWeek, offset);
  }

  const GetMonday = (fromDate: Date) => {
    return getMonday(fromDate);
  }

  const openLessonModal = (lesson: Appointment) => {
    setSelectedLesson(lesson);
    setLessonModalOpen(true);
  }

  const closeLessonModal = () => {
    setLessonModalOpen(false);
    setTimeout(() => {
      setSelectedLesson(null);
    }, 150)
  }

  const openChoiceModal = (lesson: Appointment) => {
    setSelectedLesson(lesson);
    setChoiceModalOpen(true);
  }

  const closeChoiceModal = () => {
    setChoiceModalOpen(false);
    setTimeout(() => {
      setSelectedLesson(null);
    }, 150)
  }

  return (
    <div className={`${menuOpen ? "show-menu " : ""}app`}>
        <nav className="navbar" aria-label='primary'>
          <img draggable="false" width={56} className='logo' src={new URL('/favicon.png', import.meta.url).href} alt="logo"/>
          <div className="separator"></div>
          <div className="accounts">
            {accounts && accounts.map((acc, i) => {
              return <button aria-label='switch to account' key={i}  onClick={() => {setMenuOpen(false); switchAccount(i); setShowSettings(false); setShowAnnouncements(false)}}>
                {acc.accountName.substring(0,2)}

                <span>{acc.accountName}</span>
              </button>
            })}
            {accounts.length <= 5 && <button aria-label='add account' className='add-account' onClick={() => {addNewAccount(); setShowSettings(false); setShowAnnouncements(false)}}>
              <svg viewBox="0 0 1024 1024"><path d="M960 448H576V64a64 64 0 0 0-128 0v384H64a64 64 0 0 0 0 128h384v384a64 64 0 0 0 128 0V576h384a64 64 0 0 0 0-128z" fill="currentColor" /></svg>
              
              <span>{lng === "nl" ? "Account Toevoegen" : lng === "en" ? "Add Account" : "Add Account"}</span>
            </button>}
            {!isDesktop && <button aria-label='announcements' className='announcements-btn' onClick={() => {setMenuOpen(false); setShowSettings(false); setShowAnnouncements(prev => !prev)}}>
              <svg viewBox="0 0 1024 1024"><path d="M853.333333 85.333333H170.666667C123.52 85.333333 85.76 123.52 85.76 170.666667L85.333333 938.666667l170.666667-170.666667h597.333333c47.146667 0 85.333333-38.186667 85.333334-85.333333V170.666667c0-47.146667-38.186667-85.333333-85.333334-85.333334zM554.666667 469.333333h-85.333334V213.333333h85.333334v256z m0 170.666667h-85.333334v-85.333333h85.333334v85.333333z"  fill="currentColor"/></svg>
              
              <span>{lng === "nl" ? "Mededelingen" : lng === "en" ? "Announcements" : "Announcements"}</span>
            </button>}
            <button aria-label='settings' className='settings-btn' onClick={() => {setMenuOpen(false); setShowSettings(prev => !prev); setShowAnnouncements(false)}}>
            <svg viewBox="0 0 48 48">
              <path d="M0 0h48v48h-48z" fill="none"/>
              <path d="M38.86 25.95c.08-.64.14-1.29.14-1.95s-.06-1.31-.14-1.95l4.23-3.31c.38-.3.49-.84.24-1.28l-4-6.93c-.25-.43-.77-.61-1.22-.43l-4.98 2.01c-1.03-.79-2.16-1.46-3.38-1.97l-.75-5.3c-.09-.47-.5-.84-1-.84h-8c-.5 0-.91.37-.99.84l-.75 5.3c-1.22.51-2.35 1.17-3.38 1.97l-4.98-2.01c-.45-.17-.97 0-1.22.43l-4 6.93c-.25.43-.14.97.24 1.28l4.22 3.31c-.08.64-.14 1.29-.14 1.95s.06 1.31.14 1.95l-4.22 3.31c-.38.3-.49.84-.24 1.28l4 6.93c.25.43.77.61 1.22.43l4.98-2.01c1.03.79 2.16 1.46 3.38 1.97l.75 5.3c.08.47.49.84.99.84h8c.5 0 .91-.37.99-.84l.75-5.3c1.22-.51 2.35-1.17 3.38-1.97l4.98 2.01c.45.17.97 0 1.22-.43l4-6.93c.25-.43.14-.97-.24-1.28l-4.22-3.31zm-14.86 5.05c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" fill="currentColor"/>
            </svg>
              
              <span>{lng === "nl" ? "Instellingen" : lng === "en" ? "Settings" : "Settings"}</span>
            </button>
          </div>
          <button aria-label='logout' className='logout' onClick={logOut}>
            <svg viewBox="0 0 490.3 490.3"><path d="M0,121.05v248.2c0,34.2,27.9,62.1,62.1,62.1h200.6c34.2,0,62.1-27.9,62.1-62.1v-40.2c0-6.8-5.5-12.3-12.3-12.3s-12.3,5.5-12.3,12.3v40.2c0,20.7-16.9,37.6-37.6,37.6H62.1c-20.7,0-37.6-16.9-37.6-37.6v-248.2c0-20.7,16.9-37.6,37.6-37.6h200.6c20.7,0,37.6,16.9,37.6,37.6v40.2c0,6.8,5.5,12.3,12.3,12.3s12.3-5.5,12.3-12.3v-40.2c0-34.2-27.9-62.1-62.1-62.1H62.1C27.9,58.95,0,86.75,0,121.05z" fill="currentColor"/><path d="M385.4,337.65c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l83.9-83.9c4.8-4.8,4.8-12.5,0-17.3l-83.9-83.9c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l63,63H218.6c-6.8,0-12.3,5.5-12.3,12.3c0,6.8,5.5,12.3,12.3,12.3h229.8l-63,63C380.6,325.15,380.6,332.95,385.4,337.65z" fill="currentColor"/></svg>
          </button>
        </nav>

          {(isDesktop || showAnnouncements) && <section aria-labelledby='announcements-header' className={`${!isDesktop ? "mobile " : ""}announcements`}>
          <h1 id='announcements-header'>{lng === "nl" ? "Mededelingen" : lng === "en" ? "Announcements" : "Announcements"}</h1>
            {announcements.length !== 0 ? announcements.map((announcement) => {
              return (
              <article key={announcement.id} className='announcement'>
                <header>
                  <h1>{announcement.title}</h1>
                  <div>
                    <div className='plusminus'>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </header>
                <div>
                  {announcement.text}
                </div>
              </article>)
            }) : <h2>{lng === "nl" ? "Geen actuele mededelingen" : lng === "en" ? "No current announcements" : "No current announcements"}</h2>}
        </section>}

        {showSettings && <section className='settings' aria-labelledby='settings-header'>
          <h1 id='settings-header'>{lng === "nl" ? "Instellingen" : lng === "en" ? "Settings" : "Settings"}</h1>
          <div>
            <label htmlFor="lng">{lng === "nl" ? "Taal" : lng === "en" ? "Language" : "Language"}:</label>
            <select id="lng" value={lng} onChange={(e) => {setLng(e.target.value)}}>
              <option value="nl">NL</option>
              <option value="en">EN</option>
            </select>
          </div>
          <div>
            <label htmlFor="theme">{lng === "nl" ? "Thema" : lng === "en" ? "Theme" : "Theme"}:</label>
            <select id="theme" value={theme} onChange={(e) => {setTheme(e.target.value)}}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          {isDesktop && <div>
            <label htmlFor="choices">{lng === "nl" ? "Toon Inschrijvingen" : lng === "en" ? "Show Enrollments" : "Show Enrollments"}:</label>
            <select id="choices" value={showChoices} onChange={(e) => {setShowChoices(e.target.value)}}>
              <option value="0">{lng === "nl" ? "Nee" : lng === "en" ? "No" : "No"}</option>
              <option value="1">{lng === "nl" ? "Ja" : lng === "en" ? "Yes" : "Yes"}</option>
            </select>
          </div>}
        </section>}

        <main className="schedule">
          <header className="header">
            {!isDesktop && (
              <>
                <button aria-label="menu" className='menu-hamburger' onClick={() => setMenuOpen(prev => !prev)}><svg viewBox="0 0 32 32"><path fill='currentColor' d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"/></svg></button>
              </>
            )}
            <section aria-label='date'>
              <time dateTime={`${new Date()}`}>{perWeek ? <><span>{GetMonday(GetCurrentDate()).toLocaleString((lng !== "en" && lng !== "nl") ? "default" : lng, { month: 'long'})}</span><span>{GetMonday(GetCurrentDate()).toLocaleString((lng !== "en" && lng !== "nl") ? "default" : lng, { year: 'numeric'})}</span></> : <span>{GetCurrentDate().toLocaleString((lng !== "en" && lng !== "nl") ? "default" : lng, { day: "2-digit", month: 'long', year: "numeric" })}</span>}</time>
              <div className="line"></div>
              <h1>W{Math.ceil(Math.floor((Number(GetCurrentDate()) - Number(new Date(GetCurrentDate().getFullYear(), 0, 1))) / (24 * 60 * 60 * 1000)) / 7)}</h1>
            </section>
            {((!showAnnouncements && !showSettings) || isDesktop) && <nav aria-label='change view' className="right">
              <div>
                <button className='prev' aria-label='previous week' onClick={() => setOffset(prev => prev - 1)}><svg viewBox="0, 0, 400,400"><g><path id="path0" d="M133.594 60.920 C 129.853 62.938,1.851 191.233,0.820 193.996 C -0.234 196.823,-0.234 203.177,0.820 206.004 C 1.904 208.909,129.973 337.146,133.758 339.116 C 143.576 344.226,154.799 337.317,154.799 326.163 C 154.799 319.823,155.717 320.847,101.220 266.406 L 49.995 215.234 219.724 214.844 L 389.453 214.453 392.740 212.697 C 402.651 207.400,402.463 192.009,392.427 187.024 C 389.545 185.593,384.190 185.535,219.724 185.156 L 49.995 184.766 101.564 133.203 C 155.745 79.028,154.953 79.923,154.813 72.963 C 154.604 62.544,142.897 55.899,133.594 60.920 " stroke="none" fill="currentColor" fillRule="evenodd"></path></g></svg></button>
                <button className='next' aria-label='next week' onClick={() => setOffset(prev => prev + 1)}><svg viewBox="0, 0, 400,400"><g><path id="path0" d="M133.594 60.920 C 129.853 62.938,1.851 191.233,0.820 193.996 C -0.234 196.823,-0.234 203.177,0.820 206.004 C 1.904 208.909,129.973 337.146,133.758 339.116 C 143.576 344.226,154.799 337.317,154.799 326.163 C 154.799 319.823,155.717 320.847,101.220 266.406 L 49.995 215.234 219.724 214.844 L 389.453 214.453 392.740 212.697 C 402.651 207.400,402.463 192.009,392.427 187.024 C 389.545 185.593,384.190 185.535,219.724 185.156 L 49.995 184.766 101.564 133.203 C 155.745 79.028,154.953 79.923,154.813 72.963 C 154.604 62.544,142.897 55.899,133.594 60.920 " stroke="none" fill="currentColor" fillRule="evenodd"></path></g></svg></button>
              </div>
              <button onClick={()=> {setPerWeek(true); setOffset(prev => Math.floor(prev / 7))}} className={`${perWeek ? "active": ""}`} aria-label="week view">Week</button>
              <button onClick={()=> {setPerWeek(false); setOffset(prev => Math.floor(prev * 7))}} className={`${!perWeek ? "active": ""}`} aria-label="day view">{lng === "nl" ? "Dag" : lng === "en" ? "Day" : "Day"}</button>
            </nav>}
          </header>

          <Schedule currentDay={currentDay} isDesktop={isDesktop} setAnnouncements={setAnnouncements} choiceModalOpen={choiceModalOpen} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal} />

          <dialog onClick={closeLessonModal} aria-modal="true" open={lessonModalOpen} className={`${(lessonModalOpen && selectedLesson) ? "open " : ""}lesson-modal`} aria-label='lesson info'>
            <div className={`${selectedLesson ? (selectedLesson.appointmentType + " ") : ""}${selectedLesson?.cancelled ? "cancelled " : ""}content`}>
              {selectedLesson && (
                <>
                  <span>{selectedLesson.appointmentType}</span>
                  <div><span>{lng === "nl" ? "Vak" : lng === "en" ? "Subject" : "Subject"}</span>: <span>{selectedLesson.subjects.length <= 1 ? selectedLesson!.subjects[0] : `${selectedLesson.subjects[0]}, ${selectedLesson.subjects[1]}${selectedLesson!.subjects.length > 2 ? "+" : ""}`}<span className='change'>{selectedLesson.status?.some((status) => status.code === 3014)}</span></span></div>
                  <div><span>{lng === "nl" ? "Docent" : lng === "en" ? "Teacher" : "Teacher"}</span>: {selectedLesson.teachers!.length > 0 && <span aria-label='teacher'>{selectedLesson.teachers!.length <= 1 ? selectedLesson.teachers![0].toUpperCase() : `${selectedLesson.teachers![0].toUpperCase()}, ${selectedLesson.teachers![1].toUpperCase()}${selectedLesson.teachers!.length > 2 ? "+" : ""}`}<span className='change'>{selectedLesson.status?.some((status) => status.code === 3011)}</span></span>}</div>
                  <div><span>{lng === "nl" ? "Lokaal" : lng === "en" ? "Classroom" : "Classroom"}</span>: {selectedLesson.locations!.length > 0 && <span aria-label='location'>{selectedLesson.locations!.length <= 1 ? selectedLesson.locations![0] : `${selectedLesson.locations![0]}, ${selectedLesson.locations![1]}${selectedLesson.locations!.length > 2 ? "+" : ""}`}<span className='change'>{selectedLesson.status?.some((status) => status.code === 3012)}</span></span>}</div>
                  <div><span>{lng === "nl" ? "Tijden" : lng === "en" ? "Times" : "Times"}</span>: <span className='times'><time aria-label='lesson start' dateTime={`${new Date(selectedLesson.start * 1000)}`}>{String(new Date(selectedLesson.start * 1000).getHours())}:{String(new Date(selectedLesson.start * 1000).getMinutes()).padStart(2,'0')}</time>-<time aria-label='lesson end' dateTime={`${new Date(selectedLesson.end * 1000)}`}>{String(new Date(selectedLesson.end * 1000).getHours())}:{String(new Date(selectedLesson.end * 1000).getMinutes()).padStart(2,'0')}</time><span className='change'>{selectedLesson.status?.some((status) => status.code === 3015)}</span></span></div>
                  {(selectedLesson.changeDescription || selectedLesson.schedulerRemark) &&<div className='remarks'>
                  <span className='title'>{lng === "nl" ? "Opmerking" : lng === "en" ? "Remark" : "Remark"}:</span>
                  {selectedLesson.changeDescription && <span>{selectedLesson.changeDescription}</span>}
                  {selectedLesson.schedulerRemark && <span>{selectedLesson.schedulerRemark}</span>}
                  </div>}
                </>
              )}
            </div>
          </dialog>

          <ChoiceModal currentAccount={accounts[currentAccount]} choiceModalOpen={choiceModalOpen} lng={lng} closeChoiceModal={closeChoiceModal} isDesktop={isDesktop} selectedLesson={selectedLesson}/>
        </main>
    </div>
  );
}

const Schedule = ({currentDay, isDesktop, openChoiceModal, openLessonModal, choiceModalOpen, setAnnouncements}: {currentDay: Date, isDesktop: boolean, openChoiceModal: (lesson: Appointment) => void, openLessonModal: (lesson: Appointment) => void, choiceModalOpen: boolean, setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>}) => {
  const {user, lng, dates, fetchLiveSchedule, fetchAnnouncements, scheduleLoad, group, offset, showChoices, perWeek} = useAppState()
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<Appointment[][]>(scheduleLoad);
  const scheduleRef = useRef(null);
  const timeIndicatorRef = useRef(null);

  // !TODO: Fix not re-fetching on settings change!!
  useEffect(() => {
    if(choiceModalOpen !== false) return;

    if(offset === 0) {
      setSchedule(scheduleLoad);
      return;
    }

    setLoading(true);
    const abortController = new AbortController();
    const fetchData = async () => {
      fetchLiveSchedule(user, abortController).then((res) => {
        setSchedule(res);
        setLoading(false);
      })
    }

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [offset, perWeek, showChoices, choiceModalOpen])

  useEffect(() => {
    if(!group || schedule === scheduleLoad) return;
    const abortController = new AbortController();
    const fetchData = async () => {
      fetchAnnouncements(abortController).then((res) => {
        setAnnouncements(res);
      })
    }

    fetchData();

    return () => {
      abortController.abort();
    }
  }, [group])

  useLayoutEffect(() => {
    const schedule = scheduleRef.current as unknown as HTMLDivElement;
    const currentTime = timeIndicatorRef.current as unknown as HTMLDivElement;

    if(!schedule || !currentTime) return;

    if(currentDay.getHours() > 17 || currentDay.getHours() < 8) {
      currentTime.classList.add('!hidden');
      return;
    } else {
      currentTime.classList.remove("!hidden");
    }

    const changeTimePosition = () => {
      const date = new Date(new Date(currentDay.toDateString()).setHours(8));
      let diff = (currentDay.getTime() - date.getTime());
      let diffMins = Math.floor((diff/1000/60) << 0);

      if(diffMins > 540 || diffMins < 0) {
          currentTime.classList.add("!hidden");
        } else {
          currentTime.classList.remove("!hidden");
          const percent = (diffMins / 550) * 100;
          const correction = schedule.offsetHeight / 111;
          currentTime.style.cssText = `top: calc(${percent}% + ${correction}px);`
        }
    }

    changeTimePosition();

    const interval = setInterval(() => {
        changeTimePosition();
    }, 1000 * 60)


    return () => {
      clearInterval(interval);
    }
  }, [loading, perWeek])

  return (
    <section aria-label='schedule container' className='schedule-container'>
    {perWeek ? (<>
    {dates && (
      <section aria-label='dates' className="dates">
      <div className="space">10:00</div>
      <div>
        <div className={`date ${currentDay.toDateString() === dates[0]?.toDateString() ? "current" : ""}`}>
        <span>{dates[0]?.getDate().toString().padStart(2, '0')}</span>
        <span>{dates[0]?.toLocaleDateString((lng !== "en" && lng !== "nl") ? "default" : lng, {weekday: 'short'})}</span>
        <div></div>
      </div>
      <div className={`date ${currentDay.toDateString() === dates[1]?.toDateString() ? "current" : ""}`}>
        <span>{dates[1]?.getDate().toString().padStart(2, '0')}</span>
        <span>{dates[1]?.toLocaleDateString((lng !== "en" && lng !== "nl") ? "default" : lng, {weekday: 'short'})}</span>
        <div></div>
      </div>
      <div className={`date ${currentDay.toDateString() === dates[2]?.toDateString() ? "current" : ""}`}>
        <span>{dates[2]?.getDate().toString().padStart(2, '0')}</span>
        <span>{dates[2]?.toLocaleDateString((lng !== "en" && lng !== "nl") ? "default" : lng, {weekday: 'short'})}</span>
        <div></div>
      </div>
      <div className={`date ${currentDay.toDateString() === dates[3]?.toDateString() ? "current" : ""}`}>
        <span>{dates[3]?.getDate().toString().padStart(2, '0')}</span>
        <span>{dates[3]?.toLocaleDateString((lng !== "en" && lng !== "nl") ? "default" : lng, {weekday: 'short'})}</span>
        <div></div>
      </div>
      <div className={`date ${currentDay.toDateString() === dates[4]?.toDateString() ? "current" : ""}`}>
        <span>{dates[4]?.getDate().toString().padStart(2, '0')}</span>
        <span>{dates[4]?.toLocaleDateString((lng !== "en" && lng !== "nl") ? "default" : lng, {weekday: 'short'})}</span>
        <div></div>
      </div>
      </div>
      
      </section>
    )}
  
      {!loading ? <section  aria-label='schedule' className="scroller">
      <div ref={scheduleRef} aria-label='schedule grid' className="schedule-grid-week">
        <LinesAndTimes />

        <Day schedule={schedule} dayNumber={0} isDesktop={isDesktop} perWeek={perWeek} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>

        <Day schedule={schedule} dayNumber={1} isDesktop={isDesktop} perWeek={perWeek} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>

        <Day schedule={schedule} dayNumber={2} isDesktop={isDesktop} perWeek={perWeek} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>

        <Day schedule={schedule} dayNumber={3} isDesktop={isDesktop} perWeek={perWeek} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>

        <Day schedule={schedule} dayNumber={4} isDesktop={isDesktop} perWeek={perWeek} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>

        <div ref={timeIndicatorRef} className="time-indicator">
          <div></div>
          <div></div>
        </div>
      </div>
      </section> : <span className="loader"></span>}</>
    ) : (
      <>
      {!loading ? <div className='scroller'>
        <div ref={scheduleRef} aria-label='schedule grid' className='schedule-grid-day'>
          <LinesAndTimes />
          <Day schedule={schedule} dayNumber={(getCurrentDate(currentDay, perWeek, offset).getDay() || 6) - 1} isDesktop={isDesktop} perWeek={perWeek} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>

          <div ref={timeIndicatorRef} className="time-indicator">
            <div></div>
            <div></div>
          </div>
        </div>
      </div> : <span className="loader"></span>}
      </>
    )}
  </section>
  )
}

const ChoiceModal = ({currentAccount, closeChoiceModal, choiceModalOpen, isDesktop, lng, selectedLesson}: {currentAccount: {accountName: string,school: string,accessToken: string}, closeChoiceModal: () => void, choiceModalOpen: boolean, isDesktop: boolean, lng: string, selectedLesson: Appointment | null | undefined}) => {
  const [currentValue, setCurrentValue] = useState<string>();
  const school = currentAccount.school, token = currentAccount.accessToken;

  const enrollInChoice = async (e: FormEvent) => {
    e.preventDefault();
    if(!currentValue) return;
    const abortController = new AbortController();
    await postEnroll(token, school, currentValue, abortController);
    closeChoiceModal();
  }

  return ( <>
    <dialog onClick={(e) => {(e.target as HTMLElement).classList.contains("choice-modal") && closeChoiceModal()}} aria-modal="true" open={choiceModalOpen} className={`${(choiceModalOpen && selectedLesson) ? "open " : ""}choice-modal`} aria-label='choice info'>
      <form onSubmit={enrollInChoice} className={`${selectedLesson ? (selectedLesson.appointmentType + " ") : ""}${selectedLesson?.cancelled ? "cancelled " : ""}content`}>
        {selectedLesson && <><div className='form-scroller'>{(selectedLesson && selectedLesson.actions && selectedLesson.actions.length !== 0) && (
          selectedLesson.actions.map((action) => {
            return <div key={action.appointment.id}>
              <input type="radio" name="enroll" id="enroll" value={action.post} checked={currentValue === action.post} onChange={() => {setCurrentValue(action.post)}}/>
              <LessonBlock lesson={action.appointment} onClick={() => {}} isDesktop={isDesktop}/>
            </div>
          })
        )}</div>
        <button type='submit' aria-label='enroll'>{lng === "nl" ? "Inschrijven" : lng === "en" ? "Enroll" : "Enroll"}</button></>}
      </form>
    </dialog>
    </>
  )
}

const LinesAndTimes = () => {
  return (
    <>
      <div></div>
      <div className='time'>
        <time dateTime={"8:00"}>8:00</time>
      </div>
      <span className="line">
        <div></div>
      </span>
      <div className='time'>
        <time dateTime={"9:00"}>9:00</time>
      </div>
      <span className="line">
        <div></div>
      </span>
      <div className='time'>
        <time dateTime={"10:00"}>10:00</time>
      </div>
      <span className="line">
        <div></div>
      </span>
      <div className='time'>
        <time dateTime={"11:00"}>11:00</time>
      </div>
      <span className="line">
        <div></div>
      </span>
      <div className='time'>
        <time dateTime={"12:00"}>12:00</time>
      </div>
      <span className="line">
        <div></div>
      </span>
      <div className='time'>
        <time dateTime={"13:00"}>13:00</time>
      </div>
      <span className="line">
        <div></div>
      </span>
      <div className='time'>
        <time dateTime={"14:00"}>14:00</time>
      </div>
      <span className="line">
        <div></div>
      </span>
      <div className='time'>
        <time dateTime={"15:00"}>15:00</time>
      </div>
      <span className="line">
        <div></div>
      </span>
      <div className='time'>
        <time dateTime={"16:00"}>16:00</time>
      </div>
      <span className="line">
        <div></div>
      </span>
      <div className='time'>
        <time dateTime={"17:00"}>17:00</time>
      </div>
      <span className="line">
        <div></div>
      </span>
    </>
  )
}

const Day = ({dayNumber, schedule, isDesktop, perWeek, openLessonModal, openChoiceModal}: {dayNumber: number, schedule: Appointment[][], isDesktop: boolean, perWeek: boolean, openLessonModal: (lesson: Appointment) => void, openChoiceModal: (lesson: Appointment) => void}) => {
  return (
  <>
    {schedule[dayNumber] && schedule[dayNumber].length !== 0 ? schedule[dayNumber].map((lesson) => {
      let rowStart = (new Date(lesson.start * 1000).getHours() - 8) * 12 + new Date(lesson.start * 1000).getMinutes() / 5 + 3;
      let rowEnd = (new Date(lesson.end * 1000).getHours() - 8) * 12 + new Date(lesson.end * 1000).getMinutes() / 5 + 3

      const onClick = lesson.appointmentType === "choice" ? () => {openChoiceModal(lesson)} : () => {openLessonModal(lesson)};

      return (
        <LessonBlock
          key={lesson.id ? lesson.id : `choice-${lesson.endTimeSlotName}`}
          lesson={lesson}
          className={`${rowEnd - rowStart <= 5 ? "wrap" : ""}`}
          isDesktop={isDesktop}
          onClick={onClick}
          style={{
            gridRow: `${rowStart} / ${rowEnd}`,
            gridColumn: `${perWeek ? `${dayNumber+2}/${dayNumber+3}` : `2/3`}`,
          }}
        />
      );
    }) : <div style={{gridRow: "1 / -1"}}></div>}
    </>
  )
}

export default App
