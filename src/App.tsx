import './App.css'
import { useAppState } from './context';
import { getSchedule, Schedule } from './api/Zermelo';
import { useEffect, useState } from 'react';
import { LessonBlock } from './components/LessonBlock'

function App() {
  const { token, school } = useAppState();
  const [schedule, setSchedule] = useState<Schedule>({data: []});
  const currentDay = new Date();

  useEffect(() => {
    const fetchSchedule = async() => {
      const schedule = await getSchedule(school, token);
      setSchedule(schedule);
    }
    fetchSchedule();
  }, [token])

  useEffect(() => {
    console.log(schedule)
    }, [schedule])

  return (
    <div className="app">
      {schedule && schedule.data.filter((lesson) => (new Date(lesson.start * 1000).toDateString() === currentDay.toDateString()) && (new Date(lesson.end * 1000).toDateString() === currentDay.toDateString())).sort((a, b) => (a.startTimeSlot > b.startTimeSlot) ? 1 : -1).map((lesson) => {
        return <LessonBlock key={lesson.id} lesson={lesson} />
      })}
    </div>
  )
}

export default App
