import './App.css'
import { useAppState } from './context';
import { getSchedule, Schedule, getAnnouncements, Announcement, Announcements,Lesson } from './api/Zermelo';
import { useEffect, useLayoutEffect, useState } from 'react';
import { LessonBlock } from './components/LessonBlock'
import {useMediaQuery} from './hooks';

function App() {
  const { token, school, logOut } = useAppState();
  const [perWeek, setPerWeek] = useState<boolean>(true);
  const [schedule, setSchedule] = useState<Lesson[][]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dates, setDates] = useState<Date[] | undefined>()
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [lng, setLng] = useState(Intl.DateTimeFormat().resolvedOptions().locale.slice(0,2));
  const isDesktop = useMediaQuery('(min-width: 1110px)');
  const currentDay = new Date();

  const possibleGroups = ["1a","1b","1c","1d","1s","1k","1l","1m","1f","1g","2a","2b","2c","2d","2s","2k","2l","2m","2f","2g","3h","3v","4v","4h","5v","5h","6v"];

  function getDates() {
    const date = getCurrentDate()
    let week = [];
    date.setDate((date.getDate() - date.getDay() +1));
    for (let i = 0; i < 5; i++) {
        week.push(
            new Date(date)
        ); 
        date.setDate(date.getDate() +1);
    }
    return week; 
  }

  function getCurrentDate() {
    let newDate;
    if(perWeek) {
      newDate = getMonday(currentDay);
      newDate.setDate(newDate.getDate() + offset * 7);
    } else {
      newDate = new Date(currentDay);
      newDate.setDate(newDate.getDate() + offset);
      newDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    }
    return newDate;
  }

  function getMonday(fromDate: Date) {
    let dayLength = 24 * 60 * 60 * 1000;
    let currentDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    let currentWeekDayMillisecond = ((currentDate.getDay()) * dayLength);
    let monday = new Date(currentDate.getTime() - currentWeekDayMillisecond + dayLength);

    if (monday > currentDate) {
      monday = new Date(monday.getTime() - (dayLength * 7));
    }

    return monday;
  }

  useEffect(() => {
    setLoading(true);
    const dates = getDates()
    setDates(dates);
    const date = getCurrentDate();
    const abortControllerS = new AbortController();
    const abortControllerA = new AbortController();
    let fetchData;
    if(perWeek) {
      const start = Math.floor(getMonday(date).getTime() / 1000)
      const end = start + 604800;
      fetchData = async() => {
        const scheduleRes: Schedule = await getSchedule(school, token, start, end, abortControllerS);
        const announcementsRes: Announcements = await getAnnouncements(school, token, abortControllerA);
        
        const day0 = scheduleRes.data.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[0].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[0].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1))
        const day1 = scheduleRes.data.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[1].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[1].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1))
        const day2 = scheduleRes.data.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[2].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[2].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1))
        const day3 = scheduleRes.data.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[3].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[3].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1))
        const day4 = scheduleRes.data.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[4].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[4].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1))
        
        const schedule = [day0, day1, day2, day3, day4];
        setSchedule(schedule);

        if(!schedule.every((a) => a.length < 1)) {
          const group = [...new Set(scheduleRes.data.map((lesson) => lesson.groups ? lesson.groups[0] : "").filter((group) => !group?.includes(".")))][0];
          const announcements = announcementsRes.data.filter(announcement => (possibleGroups.some(element => announcement.title.toLowerCase().includes(element)) && announcement.title.toLowerCase().includes(group.slice(0,2))) || !possibleGroups.some(element => announcement.title.toLowerCase().includes(element)) || !group);
        
          setAnnouncements(announcements);
        } else {
          setAnnouncements(announcementsRes.data);
        };

        setLoading(false);
      }
    } else {
      const start = Math.floor(getCurrentDate().getTime() / 1000)
      const end = start + 86400;
      fetchData = async() => {
        const scheduleRes: Schedule = await getSchedule(school, token, start, end, abortControllerS);
        const announcementsRes: Announcements = await getAnnouncements(school, token, abortControllerA);
        
        const day = scheduleRes.data;
        
        const schedule = [day];
        setSchedule(schedule);

        if(!schedule.every((a) => a.length < 1)) {
          const group = [...new Set(scheduleRes.data.map((lesson) => lesson.groups ? lesson.groups[0] : "").filter((group) => !group?.includes(".")))][0];
          const announcements = announcementsRes.data.filter(announcement => (possibleGroups.some(element => announcement.title.toLowerCase().includes(element)) && announcement.title.toLowerCase().includes(group.slice(0,2))) || !possibleGroups.some(element => announcement.title.toLowerCase().includes(element)) || !group);
        
          setAnnouncements(announcements);
        } else {
          setAnnouncements(announcementsRes.data);
        };

        setLoading(false);
      }
    }
    fetchData();

    return () => {
      abortControllerS.abort(), abortControllerA.abort();
    };
  }, [token, offset])

  useLayoutEffect(() => {
    const schedule = document.querySelector('[class^="schedule-grid"]') as HTMLElement;
    const currentTime = document.querySelector('.current-time') as HTMLElement;
    if(!schedule || !currentTime) return;
    if(currentDay.getHours() > 17 || currentDay.getHours() < 8) {
      currentTime.classList.add('!hidden');
      return;
    } else {
      currentTime.classList.remove("!hidden");
    }

    let prevDate = new Date();

    function changeTimePosition() {
      const date = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate(), 8)
      let diff = (Number(currentDay) - Number(date));
      let diffMins = (Math.floor((diff % 86400000) / 3600000) * 60) + (Math.round(((diff % 86400000) % 3600000) / 60000));

      if(diffMins > 540 || diffMins < 0) {
          currentTime.classList.add("!hidden");
        } else {
          currentTime.classList.remove("!hidden");
          const percent = (diffMins / 550) * 100;
          const correction = schedule.offsetHeight / 111;
          currentTime.style.cssText = `top: calc(${percent}% + ${correction}px);`
        }
    }

    const interval = setInterval(() => {
      const currentDate = new Date();
      const timeBetween = Number(currentDate.getMinutes()) - Number(prevDate.getMinutes());
      if(timeBetween === 1) {
        prevDate = new Date();
        changeTimePosition();
      }
    }, 5000)

    changeTimePosition();

    return () => {
      clearInterval(interval);
    }
  }, [loading, perWeek])

  return (
    <div className="app">
      {isDesktop && (
        <nav className="navbar">
          <img draggable="false" className='logo' src={new URL('/favicon.png', import.meta.url).href} alt="logo" />
          <div className="separator"></div>
          <div className="accounts">
            {}
            <button className='add-account'>+</button>
          </div>
          <button aria-label='logout' className='logout' onClick={logOut}>
            <svg viewBox="0 0 490.3 490.3"><path d="M0,121.05v248.2c0,34.2,27.9,62.1,62.1,62.1h200.6c34.2,0,62.1-27.9,62.1-62.1v-40.2c0-6.8-5.5-12.3-12.3-12.3s-12.3,5.5-12.3,12.3v40.2c0,20.7-16.9,37.6-37.6,37.6H62.1c-20.7,0-37.6-16.9-37.6-37.6v-248.2c0-20.7,16.9-37.6,37.6-37.6h200.6c20.7,0,37.6,16.9,37.6,37.6v40.2c0,6.8,5.5,12.3,12.3,12.3s12.3-5.5,12.3-12.3v-40.2c0-34.2-27.9-62.1-62.1-62.1H62.1C27.9,58.95,0,86.75,0,121.05z" fill="currentColor"/><path d="M385.4,337.65c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l83.9-83.9c4.8-4.8,4.8-12.5,0-17.3l-83.9-83.9c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l63,63H218.6c-6.8,0-12.3,5.5-12.3,12.3c0,6.8,5.5,12.3,12.3,12.3h229.8l-63,63C380.6,325.15,380.6,332.95,385.4,337.65z" fill="currentColor"/></svg>
          </button>
        </nav>
      )}

{isDesktop && (
        <section aria-labelledby='sidebar-header' className="sidebar desktop">
          <div className="announcements">
            <h1 id='sidebar-header'>{lng === "nl" ? "Mededelingen" : lng === "en" ? "Announcements" : "Announcements"}</h1>
            <div>
              {announcements && announcements.map((announcement) => {
                return (
                <article key={announcement.id} className='announcement'>
                  <header>
                    <span>{announcement.title}</span>
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
              })}
            </div>
          </div>
        </section>
      )}

        <main className="schedule">
          {!isDesktop && (
            <div className={`menu ${menuOpen ? "show" : ""}`}>
              <button aria-label="schedule" className='schedule-btn' onClick={() => {setMenuOpen(false); setShowAnnouncements(false)}}><svg viewBox="0, 0, 400,446.80851063829783"><g><path d="M103.901 18.907 C 96.825 22.631,95.745 26.056,95.745 44.776 L 95.745 58.798 70.745 59.009 L 45.745 59.220 41.720 61.107 C 36.085 63.748,31.633 68.106,28.901 73.657 L 26.596 78.339 26.412 223.363 C 26.207 384.641,25.820 371.536,31.010 379.261 C 33.738 383.324,38.264 386.947,43.262 389.070 C 48.427 391.264,348.281 391.556,355.319 389.374 C 363.968 386.693,371.268 379.003,373.048 370.697 C 373.615 368.052,373.775 326.566,373.620 222.695 L 373.404 78.369 371.517 74.344 C 368.876 68.710,364.518 64.257,358.969 61.525 L 354.288 59.220 326.080 59.019 L 297.872 58.819 297.872 43.744 C 297.872 22.824,295.318 18.085,284.043 18.085 C 272.852 18.085,270.645 22.109,270.331 43.085 L 270.095 58.865 196.750 58.865 L 123.404 58.865 123.389 43.794 C 123.372 27.182,122.941 25.100,118.706 21.144 C 114.937 17.623,108.258 16.614,103.901 18.907 M128.500 83.333 C 135.891 97.108,124.507 114.274,108.612 113.325 C 91.504 112.303,82.415 92.709,93.065 79.807 L 95.390 76.990 95.748 86.545 C 96.252 99.998,99.540 105.237,108.084 106.200 C 118.627 107.388,123.391 100.830,123.404 85.106 L 123.411 76.241 125.195 78.369 C 126.175 79.539,127.663 81.773,128.500 83.333 M302.968 83.333 C 310.359 97.108,298.975 114.274,283.080 113.325 C 265.834 112.294,256.826 92.829,267.559 79.785 L 269.858 76.990 270.216 86.545 C 270.720 99.998,274.008 105.237,282.552 106.200 C 293.095 107.388,297.859 100.830,297.872 85.106 L 297.879 76.241 299.663 78.369 C 300.643 79.539,302.131 81.773,302.968 83.333 M353.188 257.624 C 353.185 325.340,352.943 358.670,352.440 360.480 C 351.508 363.834,348.124 367.747,344.599 369.545 C 340.952 371.406,62.917 371.745,58.488 369.894 C 54.435 368.201,51.412 365.469,49.228 361.528 L 47.163 357.801 46.976 257.624 L 46.789 157.447 199.990 157.447 L 353.191 157.447 353.188 257.624 M90.930 180.917 C 86.174 182.341,85.753 184.125,85.975 201.936 L 86.170 217.701 88.135 219.666 L 90.100 221.631 105.650 221.847 C 128.269 222.160,127.660 222.737,127.660 201.016 C 127.660 179.919,128.269 180.553,107.801 180.358 C 99.805 180.281,92.213 180.533,90.930 180.917 M153.342 180.942 C 148.695 182.282,148.233 184.157,148.230 201.667 L 148.227 217.163 150.638 219.574 L 153.050 221.986 168.415 221.986 C 190.550 221.986,189.324 223.191,189.346 201.399 C 189.363 183.653,189.219 183.027,184.682 181.131 C 181.905 179.970,157.227 179.822,153.342 180.942 M215.825 180.924 C 210.915 182.344,210.638 183.428,210.638 201.230 L 210.638 217.163 213.088 219.612 L 215.537 222.062 231.587 221.846 L 247.637 221.631 249.705 219.315 L 251.773 216.999 251.773 201.148 C 251.773 179.465,252.416 180.108,230.851 180.210 C 223.830 180.243,217.068 180.564,215.825 180.924 M277.305 181.384 C 272.873 183.598,272.343 185.728,272.342 201.311 C 272.340 222.637,271.827 222.159,294.350 221.847 L 309.900 221.631 311.865 219.666 L 313.830 217.701 314.025 201.936 C 314.304 179.528,314.908 180.152,292.908 180.147 C 281.832 180.144,279.400 180.337,277.305 181.384 M89.521 243.975 C 86.106 246.057,85.815 247.603,85.818 263.699 C 85.822 285.120,85.303 284.651,108.591 284.272 L 122.671 284.043 124.988 281.726 L 127.305 279.409 127.533 265.059 C 127.900 241.970,128.444 242.558,106.738 242.558 C 93.100 242.558,91.648 242.678,89.521 243.975 M151.851 243.543 C 148.541 245.377,148.279 246.822,148.252 263.369 L 148.227 278.865 150.676 281.314 L 153.124 283.763 169.533 283.548 L 185.941 283.333 187.651 281.343 C 189.352 279.365,189.362 279.260,189.362 263.026 L 189.362 246.699 187.289 244.626 L 185.215 242.553 169.381 242.578 C 157.602 242.597,153.112 242.844,151.851 243.543 M213.088 244.927 L 210.638 247.376 210.638 263.246 C 210.638 285.127,209.929 284.397,231.206 284.397 C 252.473 284.397,251.773 285.114,251.773 263.329 L 251.773 247.540 249.705 245.224 L 247.637 242.908 231.587 242.693 L 215.537 242.477 213.088 244.927 M276.767 243.473 C 273.007 245.609,272.712 246.858,272.460 261.702 C 272.077 284.235,271.838 283.951,291.453 284.272 C 314.933 284.656,314.307 285.257,314.025 262.603 L 313.830 246.838 311.865 244.873 L 309.900 242.908 294.134 242.735 C 282.342 242.606,277.965 242.792,276.767 243.473 M88.189 309.542 L 85.740 311.991 85.955 328.041 L 86.170 344.091 88.486 346.159 L 90.803 348.227 106.653 348.227 C 128.639 348.227,127.919 349.005,127.539 325.650 L 127.305 311.229 124.989 309.160 L 122.673 307.092 106.655 307.092 L 90.638 307.092 88.189 309.542 M151.324 308.349 C 148.453 310.675,148.227 312.109,148.227 328.038 L 148.227 343.404 150.638 345.816 L 153.050 348.227 168.404 348.227 C 190.637 348.227,189.362 349.501,189.362 327.297 L 189.362 311.238 187.289 309.165 L 185.215 307.092 169.026 307.108 C 154.759 307.122,152.657 307.269,151.324 308.349 M212.711 309.165 L 210.638 311.238 210.654 327.428 C 210.675 349.428,209.489 348.227,231.194 348.227 C 252.853 348.227,251.773 349.343,251.773 326.972 L 251.773 311.457 249.591 309.274 L 247.409 307.092 231.097 307.092 L 214.785 307.092 212.711 309.165 " stroke="none" fill="currentColor" fillRule="evenodd"></path></g></svg>{lng === "nl" ? "Rooster" : lng === "en" ? "Schedule" : "Schedule"}</button>
              <button aria-label="announcements" className='announcements-btn' onClick={() => {setMenuOpen(false); setShowAnnouncements(true)}}><svg viewBox="0 0 1024 1024"><path fill='currentColor' d="M853.333333 85.333333H170.666667C123.52 85.333333 85.76 123.52 85.76 170.666667L85.333333 938.666667l170.666667-170.666667h597.333333c47.146667 0 85.333333-38.186667 85.333334-85.333333V170.666667c0-47.146667-38.186667-85.333333-85.333334-85.333334zM554.666667 469.333333h-85.333334V213.333333h85.333334v256z m0 170.666667h-85.333334v-85.333333h85.333334v85.333333z"  /></svg>{lng === "nl" ? "Mededelingen" : lng === "en" ? "Announcements" : "Announcements"}</button>
              <button aria-label='logout' className='logout' onClick={logOut}>{lng === "nl" ? "Log uit" : lng === "en" ? "Log out" : "Log out"}</button>
            </div>
          )}
          <header className="header">
            {!isDesktop && (
              <>
                <button aria-label="menu" className='menu-hamburger' onClick={() => setMenuOpen(prev => !prev)}><svg viewBox="0 0 32 32"><path fill='currentColor' d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"/></svg></button>
              </>
            )}
            <div>
              <h1>{perWeek ? getMonday(getCurrentDate()).toLocaleString('default', { month: 'long', year: "numeric" }) : getCurrentDate().toLocaleString('default', { day: "2-digit", month: 'long', year: "numeric" })}</h1>
              <div className="line"></div>
              <h1>W{Math.ceil(Math.floor((Number(getCurrentDate()) - Number(new Date(getCurrentDate().getFullYear(), 0, 1))) / (24 * 60 * 60 * 1000)) / 7)}</h1>
            </div>
            <div className="right">
              {!showAnnouncements && <div>
                <button className='prev' aria-label='previous week' onClick={() => setOffset(prev => prev - 1)}><svg viewBox="0, 0, 400,400"><g><path id="path0" d="M133.594 60.920 C 129.853 62.938,1.851 191.233,0.820 193.996 C -0.234 196.823,-0.234 203.177,0.820 206.004 C 1.904 208.909,129.973 337.146,133.758 339.116 C 143.576 344.226,154.799 337.317,154.799 326.163 C 154.799 319.823,155.717 320.847,101.220 266.406 L 49.995 215.234 219.724 214.844 L 389.453 214.453 392.740 212.697 C 402.651 207.400,402.463 192.009,392.427 187.024 C 389.545 185.593,384.190 185.535,219.724 185.156 L 49.995 184.766 101.564 133.203 C 155.745 79.028,154.953 79.923,154.813 72.963 C 154.604 62.544,142.897 55.899,133.594 60.920 " stroke="none" fill="currentColor" fillRule="evenodd"></path></g></svg></button>
                <button className='next' aria-label='next week' onClick={() => setOffset(prev => prev + 1)}><svg viewBox="0, 0, 400,400"><g><path id="path0" d="M133.594 60.920 C 129.853 62.938,1.851 191.233,0.820 193.996 C -0.234 196.823,-0.234 203.177,0.820 206.004 C 1.904 208.909,129.973 337.146,133.758 339.116 C 143.576 344.226,154.799 337.317,154.799 326.163 C 154.799 319.823,155.717 320.847,101.220 266.406 L 49.995 215.234 219.724 214.844 L 389.453 214.453 392.740 212.697 C 402.651 207.400,402.463 192.009,392.427 187.024 C 389.545 185.593,384.190 185.535,219.724 185.156 L 49.995 184.766 101.564 133.203 C 155.745 79.028,154.953 79.923,154.813 72.963 C 154.604 62.544,142.897 55.899,133.594 60.920 " stroke="none" fill="currentColor" fillRule="evenodd"></path></g></svg></button>
              </div>}
              <button onClick={()=> setPerWeek(true)} className={`${perWeek ? "active": ""}`} aria-label="week view">Week</button>
              <button onClick={()=> setPerWeek(false)} className={`${!perWeek ? "active": ""}`} aria-label="day view">{lng === "nl" ? "Dag" : lng === "en" ? "Day" : "Day"}</button>
            </div>
          </header>

          {(!isDesktop && showAnnouncements) && (
            <div className="announcements-screen">
            <h1>{lng === "nl" ? "Mededelingen" : lng === "en" ? "Announcements" : "Announcements"}</h1>
            <div>
              {announcements && announcements.map((announcement) => {
                return (
                <article key={announcement.id} className='announcement'>
                  <header>
                    <span>{announcement.title}</span>
                    <div>
                      <span>{new Date(announcement.start * 1000).getDate() + '/' + (new Date(announcement.start * 1000).getMonth() + 1) + '/' + new Date(announcement.start * 1000).getFullYear()}</span>
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
              })}
            </div>
          </div>
          )}
          {perWeek ? (<>
            <div className="dates">
            <div className="space">00:00</div>
            <div>
              <div className={`date ${dates && currentDay.toDateString() === dates[0].toDateString() ? "current" : ""}`}>
              <span>{dates && dates[0].getDate().toString().padStart(2, '0')}</span>
              <span>{dates && dates[0].toLocaleDateString('default', {weekday: 'short'})}</span>
              <div></div>
            </div>
            <div className={`date ${dates && currentDay.toDateString() === dates[1].toDateString() ? "current" : ""}`}>
              <span>{dates && dates[1].getDate().toString().padStart(2, '0')}</span>
              <span>{dates && dates[1].toLocaleDateString('default', {weekday: 'short'})}</span>
              <div></div>
            </div>
            <div className={`date ${dates && currentDay.toDateString() === dates[2].toDateString() ? "current" : ""}`}>
              <span>{dates && dates[2].getDate().toString().padStart(2, '0')}</span>
              <span>{dates && dates[2].toLocaleDateString('default', {weekday: 'short'})}</span>
              <div></div>
            </div>
            <div className={`date ${dates && currentDay.toDateString() === dates[3].toDateString() ? "current" : ""}`}>
              <span>{dates && dates[3].getDate().toString().padStart(2, '0')}</span>
              <span>{dates && dates[3].toLocaleDateString('default', {weekday: 'short'})}</span>
              <div></div>
            </div>
            <div className={`date ${dates && currentDay.toDateString() === dates[4].toDateString() ? "current" : ""}`}>
              <span>{dates && dates[4].getDate().toString().padStart(2, '0')}</span>
              <span>{dates && dates[4].toLocaleDateString('default', {weekday: 'short'})}</span>
              <div></div>
            </div>
            </div>
            
            </div>
        
            {!loading ? <div className="scroller">
            <div className="schedule-grid-week">
              <div></div>
              <div>
                <span>8:00</span>
              </div>
              <span className="line">
                <div></div>
              </span>
              <div>
                <span>9:00</span>
              </div>
              <span className="line">
                <div></div>
              </span>
              <div>
                <span>10:00</span>
              </div>
              <span className="line">
                <div></div>
              </span>
              <div>
                <span>11:00</span>
              </div>
              <span className="line">
                <div></div>
              </span>
              <div>
                <span>12:00</span>
              </div>
              <span className="line">
                <div></div>
              </span>
              <div>
                <span>13:00</span>
              </div>
              <span className="line">
                <div></div>
              </span>
              <div>
                <span>14:00</span>
              </div>
              <span className="line">
                <div></div>
              </span>
              <div>
                <span>15:00</span>
              </div>
              <span className="line">
                <div></div>
              </span>
              <div>
                <span>16:00</span>
              </div>
              <span className="line">
                <div></div>
              </span>
              <div>
                <span>17:00</span>
              </div>
              <span className="line">
                <div></div>
              </span>


              {schedule[0] && schedule[0].length !== 0 ? schedule[0].map((lesson) => {
                let rowStart = (new Date(lesson.start * 1000).getHours() - 8) * 12 + new Date(lesson.start * 1000).getMinutes() / 5 + 3;
                let rowEnd = (new Date(lesson.end * 1000).getHours() - 8) * 12 + new Date(lesson.end * 1000).getMinutes() / 5 + 3

                return (
                  <LessonBlock
                    key={lesson.id}
                    lesson={lesson}
                    className={`${rowEnd - rowStart <= 5 ? "wrap" : ""}`}
                    isDesktop={isDesktop}
                    style={{
                      gridRow: `${rowStart} / ${rowEnd}`,
                      gridColumn: "2/3",
                    }}
                  />
                );
              }) : <div style={{gridRow: "1 / -1"}}></div>}

              {schedule[1] && schedule[1].length !== 0 ? schedule[1].map((lesson) => {
                let rowStart = (new Date(lesson.start * 1000).getHours() - 8) * 12 + new Date(lesson.start * 1000).getMinutes() / 5 + 3;
                let rowEnd = (new Date(lesson.end * 1000).getHours() - 8) * 12 + new Date(lesson.end * 1000).getMinutes() / 5 + 3

                return (
                  <LessonBlock
                    key={lesson.id}
                    lesson={lesson}
                    className={`${rowEnd - rowStart <= 5 ? "wrap" : ""}`}
                    isDesktop={isDesktop}
                    style={{
                      gridRow: `${rowStart} / ${rowEnd}`,
                      gridColumn: "3/4",
                    }}
                  />
                );
              }) : <div style={{gridRow: "1 / -1"}}></div>}

              {schedule[2] && schedule[2].length !== 0 ? schedule[2].map((lesson) => {
                let rowStart = (new Date(lesson.start * 1000).getHours() - 8) * 12 + new Date(lesson.start * 1000).getMinutes() / 5 + 3;
                let rowEnd = (new Date(lesson.end * 1000).getHours() - 8) * 12 + new Date(lesson.end * 1000).getMinutes() / 5 + 3

                return (
                  <LessonBlock
                    key={lesson.id}
                    lesson={lesson}
                    className={`${rowEnd - rowStart <= 5 ? "wrap" : ""}`}
                    isDesktop={isDesktop}
                    style={{
                      gridRow: `${rowStart} / ${rowEnd}`,
                      gridColumn: "4/5",
                    }}
                  />
                );
              }) : <div style={{gridRow: "1 / -1"}}></div>}

              {schedule[3] && schedule[3].length !== 0 ? schedule[3].map((lesson) => {
                let rowStart = (new Date(lesson.start * 1000).getHours() - 8) * 12 + new Date(lesson.start * 1000).getMinutes() / 5 + 3;
                let rowEnd = (new Date(lesson.end * 1000).getHours() - 8) * 12 + new Date(lesson.end * 1000).getMinutes() / 5 + 3

                return (
                  <LessonBlock
                    key={lesson.id}
                    lesson={lesson}
                    className={`${rowEnd - rowStart <= 5 ? "wrap" : ""}`}
                    isDesktop={isDesktop}
                    style={{
                      gridRow: `${rowStart} / ${rowEnd}`,
                      gridColumn: "5/6",
                    }}
                  />
                );
              }) : <div style={{gridRow: "1 / -1"}}></div>}


              {schedule[4] && schedule[4].length !== 0 ? schedule[4].map((lesson) => {
                let rowStart = (new Date(lesson.start * 1000).getHours() - 8) * 12 + new Date(lesson.start * 1000).getMinutes() / 5 + 3;
                let rowEnd = (new Date(lesson.end * 1000).getHours() - 8) * 12 + new Date(lesson.end * 1000).getMinutes() / 5 + 3

                return (
                  <LessonBlock
                    key={lesson.id}
                    lesson={lesson}
                    className={`${rowEnd - rowStart <= 5 ? "wrap" : ""}`}
                    isDesktop={isDesktop}
                    style={{
                      gridRow: `${rowStart} / ${rowEnd}`,
                      gridColumn: "6/7",
                    }}
                  />
                );
              }) : <div style={{gridRow: "1 / -1"}}></div>}

              <div className="current-time">
                <div></div>
                <div></div>
              </div>
            </div>
            </div> : <Spinner />}</>
          ) : (
            <>
            {!loading ? <div className='scroller'>
              <div className='schedule-grid-day'>
                <div></div>
                <div>
                  <span>8:00</span>
                </div>
                <span className="line">
                  <div></div>
                </span>
                <div>
                  <span>9:00</span>
                </div>
                <span className="line">
                  <div></div>
                </span>
                <div>
                  <span>10:00</span>
                </div>
                <span className="line">
                  <div></div>
                </span>
                <div>
                  <span>11:00</span>
                </div>
                <span className="line">
                  <div></div>
                </span>
                <div>
                  <span>12:00</span>
                </div>
                <span className="line">
                  <div></div>
                </span>
                <div>
                  <span>13:00</span>
                </div>
                <span className="line">
                  <div></div>
                </span>
                <div>
                  <span>14:00</span>
                </div>
                <span className="line">
                  <div></div>
                </span>
                <div>
                  <span>15:00</span>
                </div>
                <span className="line">
                  <div></div>
                </span>
                <div>
                  <span>16:00</span>
                </div>
                <span className="line">
                  <div></div>
                </span>
                <div>
                  <span>17:00</span>
                </div>
                <span className="line">
                  <div></div>
                </span>

                {schedule[0] && schedule[0].length !== 0 ? schedule[0].map((lesson) => {
                  let rowStart = (new Date(lesson.start * 1000).getHours() - 8) * 12 + new Date(lesson.start * 1000).getMinutes() / 5 + 3;
                  let rowEnd = (new Date(lesson.end * 1000).getHours() - 8) * 12 + new Date(lesson.end * 1000).getMinutes() / 5 + 3

                  return (
                    <LessonBlock
                      key={lesson.id}
                      lesson={lesson}
                      className={`${rowEnd - rowStart <= 5 ? "wrap" : ""}`}
                      isDesktop={isDesktop}
                      style={{
                        gridRow: `${rowStart} / ${rowEnd}`,
                        gridColumn: 2
                      }}
                    />
                  );
                }) : <div style={{gridRow: "1 / -1"}}></div>}

                <div className="current-time">
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div> : <Spinner />}
            </>
          )}
        </main>
    </div>
  );
}

function Spinner() {
  return (
    <span className="loader"></span>
  )
}


export default App
