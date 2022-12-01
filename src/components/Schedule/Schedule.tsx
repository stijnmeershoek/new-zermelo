import { useState, useEffect, useRef, useLayoutEffect } from 'preact/hooks';
import { Day } from './Day';
import { LinesAndTimes } from './LinesAndTimes';
import { useAppState } from '../../context';
import { getDates } from '../../utils/functions';
import './Schedule.css'

interface Props {
  offset: number,
  currentDay: Date, 
  openChoiceModal: (lesson: Appointment) => void, 
  openLessonModal: (lesson: Appointment) => void, 
  choiceModalOpen: boolean, 
}

export const Schedule = ({offset, currentDay, openChoiceModal, openLessonModal, choiceModalOpen}: Props) => {
    const {user, settings, fetchLiveSchedule, scheduleLoad, datesLoad, scheduleHours} = useAppState()
    const [loading, setLoading] = useState(false);
    const [schedule, setSchedule] = useState<Appointment[][]>(scheduleLoad);
    const [dates, setDates] = useState<Date[]>(datesLoad);
    const currentDayNumber = dates.findIndex(date => date.toDateString() === currentDay.toDateString());
    const scheduleRef = useRef(null);
    const timeIndicatorRef = useRef(null);
    const showChoicesRef = useRef(settings.showChoices);
    const choiceModalOpenRef = useRef(choiceModalOpen);
  
    useEffect(() => {
      if(choiceModalOpen !== false) return;

      if(offset === 0 && showChoicesRef.current === settings.showChoices && choiceModalOpenRef.current === choiceModalOpen) {
        setDates(datesLoad);
        setSchedule(scheduleLoad);
        return;
      }

      setLoading(true)
      
      const abortController = new AbortController();
      const signal = abortController.signal;
  
      const fetchData = async () => {
        const dates = await getDates(currentDay, offset);
        fetchLiveSchedule(user, dates, offset, signal).then((res) => {
          setDates(dates)
          setSchedule(res);
          setLoading(false);
        })
      }
  
      fetchData();
  
      return () => {
        abortController.abort();
      };
    }, [offset, settings.showChoices, choiceModalOpen])
  
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
    }, [loading])
  
    return (
      <section aria-label='schedule container' className='schedule-container'>
      {dates && (
        <section aria-label='dates' className="dates">
            <>
                <div className="space">10:00</div>
                <div>
                    {dates && dates.map((date, i) => (
                        <time dateTime={`${date}`} key={i} className={`date ${i === currentDayNumber ? "current" : ""}`}>
                            <span>{date.getDate().toString().padStart(2, '0')}</span>
                            <span>{date.toLocaleDateString((settings.lng !== "en" && settings.lng !== "nl") ? "default" : settings.lng, {weekday: 'short'})}</span>
                            <div></div>
                        </time>
                    ))}
                </div>
            </>
        </section>
      )}
    
        {!loading ? <section  aria-label='schedule' className="scroller">
        <div ref={scheduleRef} aria-label='schedule grid' className="schedule-grid" style={{"gridTemplateRows": ` auto repeat(${(scheduleHours[scheduleHours.length - 1] - scheduleHours[0]) * 12 + 2},minmax(0,1fr))`}}>
          <LinesAndTimes scheduleHours={scheduleHours}/>
          <div class="highlight" style={currentDayNumber !== -1 ? {gridRow: "1 / -1", gridColumn: `${currentDayNumber + 2}/${currentDayNumber + 3}`} : {display: "none"}}></div>
  
          <Day schedule={schedule} scheduleMin={scheduleHours[0]} dayNumber={0} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>
  
          <Day schedule={schedule} scheduleMin={scheduleHours[0]} dayNumber={1} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>
  
          <Day schedule={schedule} scheduleMin={scheduleHours[0]} dayNumber={2} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>
  
          <Day schedule={schedule} scheduleMin={scheduleHours[0]} dayNumber={3} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>
  
          <Day schedule={schedule} scheduleMin={scheduleHours[0]} dayNumber={4} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>
  
          <div ref={timeIndicatorRef} className="time-indicator">
            <div></div>
            <div></div>
          </div>
        </div>
        </section> : <span className="loader"></span>}
    </section>
    )
  }