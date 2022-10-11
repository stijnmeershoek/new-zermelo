import {Lesson} from '../../api/Zermelo'
import './LessonBlock.css'

interface Props {
    lesson: Lesson
}

export function LessonBlock({lesson}: Props) {
  return (
    <div className='lesson'>
      <div className="content-left">
        <div>
            <div>{lesson.subjects.length <= 1 ? lesson.subjects[0] : `${lesson.subjects[0]},${lesson.subjects[1]}${lesson.subjects.length > 2 ? "+" : ""}`}</div>
            <div>{lesson.teachers.length <= 1 ? lesson.teachers[0].toUpperCase() : `${lesson.teachers[0].toUpperCase()},${lesson.teachers[1].toUpperCase()}${lesson.teachers.length > 2 ? "+" : ""}`}</div>
            <div>{lesson.locations.length <= 1 ? lesson.locations[0] : `${lesson.locations[0]},${lesson.locations[1]}${lesson.locations.length > 2 ? "+" : ""}`}</div>
        </div>
        <div>{String(new Date(lesson.start * 1000).getHours())}:{String(new Date(lesson.start * 1000).getMinutes()).padStart(2,'0')}-{String(new Date(lesson.end * 1000).getHours())}:{String(new Date(lesson.end * 1000).getMinutes()).padStart(2,'0')}</div>
      </div>
      <div className="content-right">{lesson.startTimeSlotName}</div>
    </div>
  )
}
