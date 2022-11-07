import {useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Day } from './Day';
import { LinesAndTimes } from './LinesAndTimes';
import { useAppState } from '../../context';
import { getCurrentDate } from '../../utils/functions';

export const Schedule = ({currentDay, isDesktop, openChoiceModal, openLessonModal, choiceModalOpen, setAnnouncements}: {currentDay: Date, isDesktop: boolean, openChoiceModal: (lesson: Appointment) => void, openLessonModal: (lesson: Appointment) => void, choiceModalOpen: boolean, setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>}) => {
    const {user, settings, dates, fetchLiveSchedule, fetchAnnouncements, scheduleLoad, group, offset} = useAppState()
    const [loading, setLoading] = useState(false);
    const [schedule, setSchedule] = useState<Appointment[][]>(scheduleLoad);
    const scheduleRef = useRef(null);
    const timeIndicatorRef = useRef(null);
    const showChoicesRef = useRef(settings.showChoices);
    const choiceModalOpenRef = useRef(choiceModalOpen);
  
    // !
    // !TODO!
    // !Make it so that it doesn't refetch if offset changes if perWeek is false unless offset gets bigger than 7 days;
    // !
    useEffect(() => {
      if(choiceModalOpen !== false) return;

      if(offset === 0 && showChoicesRef.current === settings.showChoices && choiceModalOpenRef.current === choiceModalOpen) {
        setSchedule(scheduleLoad);
        return;
      }
      
      setLoading(true);
      const abortController = new AbortController();
      const signal = abortController.signal;
  
      const fetchData = async () => {
        fetchLiveSchedule(user, signal).then((res) => {
          setSchedule(res);
          setLoading(false);
        })
      }
  
      fetchData();
  
      return () => {
        abortController.abort();
      };
    }, [offset, settings.perWeek, settings.showChoices, choiceModalOpen])
  
    useEffect(() => {
      if(!group || schedule === scheduleLoad) return;
      const abortController = new AbortController();
      const signal = abortController.signal;
  
  
      const fetchData = async () => {
        fetchAnnouncements(signal).then((res) => {
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
    }, [loading, settings.perWeek])
  
    return (
      <section aria-label='schedule container' className={`schedule-container ${settings.perWeek ? "perWeek" : "perDay"}`}>
      {settings.perWeek ? (<>
      {dates && (
        <section aria-label='dates' className="dates">
            <>
                <div className="space">10:00</div>
                <div>
                    {dates && dates.map((date, i) => (
                        <div key={i} className={`date ${currentDay.toDateString() === date.toDateString() ? "current" : ""}`}>
                            <span>{date.getDate().toString().padStart(2, '0')}</span>
                            <span>{date.toLocaleDateString((settings.lng !== "en" && settings.lng !== "nl") ? "default" : settings.lng, {weekday: 'short'})}</span>
                            <div></div>
                        </div>
                    ))}
                </div>
            </>
        </section>
      )}
    
        {!loading ? <section  aria-label='schedule' className="scroller">
        <div ref={scheduleRef} aria-label='schedule grid' className="schedule-grid-week">
          <LinesAndTimes />
  
          <Day lng={settings.lng} schedule={schedule} dayNumber={0} isDesktop={isDesktop} perWeek={settings.perWeek} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>
  
          <Day lng={settings.lng} schedule={schedule} dayNumber={1} isDesktop={isDesktop} perWeek={settings.perWeek} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>
  
          <Day lng={settings.lng} schedule={schedule} dayNumber={2} isDesktop={isDesktop} perWeek={settings.perWeek} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>
  
          <Day lng={settings.lng} schedule={schedule} dayNumber={3} isDesktop={isDesktop} perWeek={settings.perWeek} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>
  
          <Day lng={settings.lng} schedule={schedule} dayNumber={4} isDesktop={isDesktop} perWeek={settings.perWeek} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>
  
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
            <Day lng={settings.lng} schedule={schedule} dayNumber={(getCurrentDate(currentDay, settings.perWeek, offset).getDay() || 6) - 1} isDesktop={true} perWeek={settings.perWeek} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>
  
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