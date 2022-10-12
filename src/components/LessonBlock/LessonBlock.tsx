import {Lesson} from '../../api/Zermelo'
import './LessonBlock.css'

interface Props {
    lesson: Lesson
    style?: React.CSSProperties,
    className?: string
}

export function LessonBlock({lesson, style, className}: Props) {
  return (
    <div className={`block ${lesson.type} ${className ? className : ""}`} style={style}>
      <div className="content-left">
        <div>
            <div>{lesson.subjects.length <= 1 ? lesson.subjects[0] : `${lesson.subjects[0]},${lesson.subjects[1]}${lesson.subjects.length > 2 ? "+" : ""}`}</div>
            {lesson.teachers && lesson.teachers.length > 0 && <div>{lesson.teachers.length <= 1 ? lesson.teachers[0].toUpperCase() : `${lesson.teachers[0].toUpperCase()},${lesson.teachers[1].toUpperCase()}${lesson.teachers.length > 2 ? "+" : ""}`}</div>}
            {lesson.locations &&  lesson.locations.length > 0 && <div>{lesson.locations.length <= 1 ? lesson.locations[0] : `${lesson.locations[0]},${lesson.locations[1]}${lesson.locations.length > 2 ? "+" : ""}`}</div>}
        </div>
        <div>{String(new Date(lesson.start * 1000).getHours())}:{String(new Date(lesson.start * 1000).getMinutes()).padStart(2,'0')}-{String(new Date(lesson.end * 1000).getHours())}:{String(new Date(lesson.end * 1000).getMinutes()).padStart(2,'0')}</div>
      </div>
      <div className="content-right">{lesson.startTimeSlotName}</div>
    </div>
  )
}
