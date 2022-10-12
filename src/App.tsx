import './App.css'
import { useAppState } from './context';
import { getSchedule, Schedule, getAnnouncements, Announcements, Lesson } from './api/Zermelo';
import { useEffect, useLayoutEffect, useState } from 'react';
import { LessonBlock } from './components/LessonBlock'

function App() {
  const { token, school } = useAppState();
  const [perWeek, setPerWeek] = useState<boolean>(true);
  const [schedule, setSchedule] = useState<Lesson[][]>([]);
  const [announcements, setAnnouncements] = useState<Announcements>({data: []});
  const [dates, setDates] = useState<Date[] | undefined>()
  const [numberOfWeeks, setNumberOfWeeks] = useState(0);
  const [loading, setLoading] = useState(false);
  const currentDay = new Date();

  function getDates() {
    const date = getCurrentDate()
    var week = new Array(); 
    date.setDate((date.getDate() - date.getDay() +1));
    for (var i = 0; i < 5; i++) {
        week.push(
            new Date(date)
        ); 
        date.setDate(date.getDate() +1);
    }
    return week; 
  }

  function getCurrentDate() {
    const newDate = getMonday(currentDay);
    newDate.setDate(newDate.getDate() + numberOfWeeks * 7);
    return newDate;
  }

  function getMonday(fromDate: Date) {
    var dayLength = 24 * 60 * 60 * 1000;
    var currentDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    var currentWeekDayMillisecond = ((currentDate.getDay()) * dayLength);
    var monday = new Date(currentDate.getTime() - currentWeekDayMillisecond + dayLength);

    if (monday > currentDate) {
      monday = new Date(monday.getTime() - (dayLength * 7));
    }

    return monday;
  }

  useEffect(() => {
    setLoading(true);
    const dates = getDates()
    setDates(dates);
    const date = getCurrentDate()
    const start = Math.floor(getMonday(date).getTime() / 1000)
    const end = start + 604800;
    const fetchData = async() => {
      const scheduleRes: Schedule = await getSchedule(school, token, start, end);
      const announcementsRes = await getAnnouncements(school, token);
      setAnnouncements(announcementsRes);

      const day0 = scheduleRes.data.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[0].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[0].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1))
      const day1 = scheduleRes.data.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[1].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[1].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1))
      const day2 = scheduleRes.data.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[2].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[2].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1))
      const day3 = scheduleRes.data.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[3].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[3].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1))
      const day4 = scheduleRes.data.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[4].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[4].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1))

      const schedule = [day0, day1, day2, day3, day4];

      setSchedule(schedule);
      setLoading(false);
    }
    fetchData();
  }, [token, numberOfWeeks])

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
        var diff = (Number(currentDay) - Number(date));
        var diffMins = (Math.floor((diff % 86400000) / 3600000) * 60) + (Math.round(((diff % 86400000) % 3600000) / 60000));
        
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
      <div className="sidebar">
        <div className="announcements">
          <h1>Announcements</h1>
          <div>
            {announcements.data && announcements.data.map((announcement) => {
              return (
              <div key={announcement.id} className='announcement'>
                <div>
                  <span>{announcement.title}</span>
                  <div>
                    <span>{new Date(announcement.start * 1000).getDate() + '/' + (new Date(announcement.start * 1000).getMonth() + 1) + '/' + new Date(announcement.start * 1000).getFullYear()}</span>
                    <span><svg viewBox="0 0 512 298.04"><path fillRule="nonzero" d="M12.08 70.78c-16.17-16.24-16.09-42.54.15-58.7 16.25-16.17 42.54-16.09 58.71.15L256 197.76 441.06 12.23c16.17-16.24 42.46-16.32 58.71-.15 16.24 16.16 16.32 42.46.15 58.7L285.27 285.96c-16.24 16.17-42.54 16.09-58.7-.15L12.08 70.78z"/></svg></span>
                  </div>
                </div>
                <div>
                  {announcement.text}
                </div>
              </div>)
            })}
          </div>
        </div>
      </div>

        <div className="schedule week">
          <div className="header">
            <h1>{getMonday(getCurrentDate()).toLocaleString('default', { month: 'long', year: "numeric" })}</h1>
            <span>/</span>
            <h1>W{Math.ceil(Math.floor((Number(getCurrentDate()) - Number(new Date(getCurrentDate().getFullYear(), 0, 1))) / (24 * 60 * 60 * 1000)) / 7)}</h1>
            <button className='prev' aria-label='previous week' onClick={() => setNumberOfWeeks(prev => prev - 1)}><svg viewBox="0, 0, 400,400"><g><path id="path0" d="M133.594 60.920 C 129.853 62.938,1.851 191.233,0.820 193.996 C -0.234 196.823,-0.234 203.177,0.820 206.004 C 1.904 208.909,129.973 337.146,133.758 339.116 C 143.576 344.226,154.799 337.317,154.799 326.163 C 154.799 319.823,155.717 320.847,101.220 266.406 L 49.995 215.234 219.724 214.844 L 389.453 214.453 392.740 212.697 C 402.651 207.400,402.463 192.009,392.427 187.024 C 389.545 185.593,384.190 185.535,219.724 185.156 L 49.995 184.766 101.564 133.203 C 155.745 79.028,154.953 79.923,154.813 72.963 C 154.604 62.544,142.897 55.899,133.594 60.920 " stroke="none" fill="#000000" fillRule="evenodd"></path></g></svg></button>
            <button className='next' aria-label='next week' onClick={() => setNumberOfWeeks(prev => prev + 1)}><svg viewBox="0, 0, 400,400"><g><path id="path0" d="M133.594 60.920 C 129.853 62.938,1.851 191.233,0.820 193.996 C -0.234 196.823,-0.234 203.177,0.820 206.004 C 1.904 208.909,129.973 337.146,133.758 339.116 C 143.576 344.226,154.799 337.317,154.799 326.163 C 154.799 319.823,155.717 320.847,101.220 266.406 L 49.995 215.234 219.724 214.844 L 389.453 214.453 392.740 212.697 C 402.651 207.400,402.463 192.009,392.427 187.024 C 389.545 185.593,384.190 185.535,219.724 185.156 L 49.995 184.766 101.564 133.203 C 155.745 79.028,154.953 79.923,154.813 72.963 C 154.604 62.544,142.897 55.899,133.594 60.920 " stroke="none" fill="#000000" fillRule="evenodd"></path></g></svg></button>
            <div className="right">
              <button onClick={()=> setPerWeek(true)} className={`${perWeek ? "active": ""}`} aria-label="week view">Week</button>
              <button onClick={()=> setPerWeek(false)} className={`${!perWeek ? "active": ""}`} aria-label="day view">Day</button>
            </div>
          </div>

          {perWeek ? (<>
            <div className="dates">
            <div className="space">10:00</div>
            <div>
              <div className={`date ${dates && currentDay.toDateString() === dates[0].toDateString() ? "current" : ""}`}>
              <span>{dates && dates[0].getDate()}</span>
              <span>maa</span>
              <div></div>
            </div>
            <div className={`date ${dates && currentDay.toDateString() === dates[1].toDateString() ? "current" : ""}`}>
              <span>{dates && dates[1].getDate()}</span>
              <span>din</span>
              <div></div>
            </div>
            <div className={`date ${dates && currentDay.toDateString() === dates[2].toDateString() ? "current" : ""}`}>
              <span>{dates && dates[2].getDate()}</span>
              <span>woe</span>
              <div></div>
            </div>
            <div className={`date ${dates && currentDay.toDateString() === dates[3].toDateString() ? "current" : ""}`}>
              <span>{dates && dates[3].getDate()}</span>
              <span>don</span>
              <div></div>
            </div>
            <div className={`date ${dates && currentDay.toDateString() === dates[4].toDateString() ? "current" : ""}`}>
              <span>{dates && dates[4].getDate()}</span>
              <span>vri</span>
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


              {schedule[0] && schedule[0].length !== 0 ? schedule[0].map((lesson, i) => {
                return (
                  <LessonBlock
                    key={lesson.id}
                    lesson={lesson}
                    className={`${schedule[0][i+1] && (schedule[0][i + 1].start === lesson.end && schedule[0][i+1].type === lesson.type && (schedule[0][i+1].subjects === lesson.subjects || schedule[0][i+1].subjects[0] === "" || lesson.subjects[0] === "")) ? "bottom-flat" : ""}${schedule[0][i-1] && (schedule[0][i-1].end === lesson.start && schedule[0][i-1].type === lesson.type && (schedule[0][i-1].subjects === lesson.subjects || schedule[0][i-1].subjects.length[0]  === "" || lesson.subjects[0] === "")) ? "top-flat" : ""}`}
                    style={{
                      gridRow: `${
                        (new Date(lesson.start * 1000).getHours() - 8) * 12 +
                        new Date(lesson.start * 1000).getMinutes() / 5 +
                        3
                      } / ${
                        (new Date(lesson.end * 1000).getHours() - 8) * 12 +
                        new Date(lesson.end * 1000).getMinutes() / 5 +
                        3
                      }`,
                      gridColumn: "2/3",
                    }}
                  />
                );
              }) : <div style={{gridRow: "1 / -1"}}></div>}

              {schedule[1] && schedule[1].length !== 0 ? schedule[1].map((lesson, i) => {
                return (
                  <LessonBlock
                    key={lesson.id}
                    lesson={lesson}
                    className={`${schedule[1][i+1] && (schedule[1][i + 1].start === lesson.end && schedule[1][i+1].type === lesson.type && (schedule[1][i+1].subjects === lesson.subjects || schedule[1][i+1].subjects[0] === "" || lesson.subjects[0] === "")) ? "bottom-flat" : ""}${schedule[1][i-1] && (schedule[1][i-1].end === lesson.start && schedule[1][i-1].type === lesson.type && (schedule[1][i-1].subjects === lesson.subjects || schedule[1][i-1].subjects.length[0]  === "" || lesson.subjects[0] === "")) ? "top-flat" : ""}`}
                    style={{
                      gridRow: `${
                        (new Date(lesson.start * 1000).getHours() - 8) * 12 +
                        new Date(lesson.start * 1000).getMinutes() / 5 +
                        3
                      } / ${
                        (new Date(lesson.end * 1000).getHours() - 8) * 12 +
                        new Date(lesson.end * 1000).getMinutes() / 5 +
                        3
                      }`,
                      gridColumn: "3/4",
                    }}
                  />
                );
              }) : <div style={{gridRow: "1 / -1"}}></div>}

              {schedule[2] && schedule[2].length !== 0 ? schedule[2].map((lesson, i) => {
                return (
                  <LessonBlock
                    key={lesson.id}
                    lesson={lesson}
                    className={`${schedule[2][i+1] && (schedule[2][i + 1].start === lesson.end && schedule[2][i+1].type === lesson.type && (schedule[2][i+1].subjects === lesson.subjects || schedule[2][i+1].subjects[0] === "" || lesson.subjects[0] === "")) ? "bottom-flat" : ""}${schedule[2][i-1] && (schedule[2][i-1].end === lesson.start && schedule[2][i-1].type === lesson.type && (schedule[2][i-1].subjects === lesson.subjects || schedule[2][i-1].subjects.length[0]  === "" || lesson.subjects[0] === "")) ? "top-flat" : ""}`}
                    style={{
                      gridRow: `${
                        (new Date(lesson.start * 1000).getHours() - 8) * 12 +
                        new Date(lesson.start * 1000).getMinutes() / 5 +
                        3
                      } / ${
                        (new Date(lesson.end * 1000).getHours() - 8) * 12 +
                        new Date(lesson.end * 1000).getMinutes() / 5 +
                        3
                      }`,
                      gridColumn: "4/5",
                    }}
                  />
                );
              }) : <div style={{gridRow: "1 / -1"}}></div>}

              {schedule[3] && schedule[3].length !== 0 ? schedule[3].map((lesson, i) => {
                return (
                  <LessonBlock
                    key={lesson.id}
                    lesson={lesson}
                    className={`${schedule[3][i+1] && (schedule[3][i + 1].start === lesson.end && schedule[3][i+1].type === lesson.type && (schedule[3][i+1].subjects === lesson.subjects || schedule[3][i+1].subjects[0] === "" || lesson.subjects[0] === "")) ? "bottom-flat" : ""}${schedule[3][i-1] && (schedule[3][i-1].end === lesson.start && schedule[3][i-1].type === lesson.type && (schedule[3][i-1].subjects === lesson.subjects || schedule[3][i-1].subjects.length[0]  === "" || lesson.subjects[0] === "")) ? "top-flat" : ""}`}
                    style={{
                      gridRow: `${
                        (new Date(lesson.start * 1000).getHours() - 8) * 12 +
                        new Date(lesson.start * 1000).getMinutes() / 5 +
                        3
                      } / ${
                        (new Date(lesson.end * 1000).getHours() - 8) * 12 +
                        new Date(lesson.end * 1000).getMinutes() / 5 +
                        3
                      }`,
                      gridColumn: "5/6",
                    }}
                  />
                );
              }) : <div style={{gridRow: "1 / -1"}}></div>}


              {schedule[4] && schedule[4].length !== 0 ? schedule[4].map((lesson, i) => {
                return (
                  <LessonBlock
                    key={lesson.id}
                    lesson={lesson}
                    className={`${schedule[4][i+1] && (schedule[4][i + 1].start === lesson.end && schedule[4][i+1].type === lesson.type && (schedule[4][i+1].subjects === lesson.subjects || schedule[4][i+1].subjects[0] === "" || lesson.subjects[0] === "")) ? "bottom-flat" : ""}${schedule[4][i-1] && (schedule[4][i-1].end === lesson.start && schedule[4][i-1].type === lesson.type && (schedule[4][i-1].subjects === lesson.subjects || schedule[4][i-1].subjects.length[0]  === "" || lesson.subjects[0] === "")) ? "top-flat" : ""}`}
                    style={{
                      gridRow: `${
                        (new Date(lesson.start * 1000).getHours() - 8) * 12 +
                        new Date(lesson.start * 1000).getMinutes() / 5 +
                        3
                      } / ${
                        (new Date(lesson.end * 1000).getHours() - 8) * 12 +
                        new Date(lesson.end * 1000).getMinutes() / 5 +
                        3
                      }`,
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
              <div className='schedule-grid-day'></div>
            </div> : <Spinner />}
            </>
            
          )}
        </div>
    </div>
  );
}

function Spinner() {
  return (
    <span className="loader"></span>
  )
}


export default App
