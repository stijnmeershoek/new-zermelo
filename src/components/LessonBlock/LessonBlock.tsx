import {Lesson} from '../../api/Zermelo'
import './LessonBlock.css'

interface Props {
    lesson: Lesson
    style?: React.CSSProperties,
    className?: string,
    isDesktop: boolean
}

export function LessonBlock({lesson, style, className, isDesktop}: Props) {
  return (
    <div className={`block ${lesson.type} ${className ? className : ""}`} style={style}>
      <div className="content-left">
        <div>{lesson.subjects.length <= 1 ? lesson.subjects[0] : `${lesson.subjects[0]}, ${lesson.subjects[1]}${lesson.subjects.length > 2 ? "+" : ""}`}</div>
        {isDesktop && lesson.teachers && lesson.teachers.length > 0 && <div>{lesson.teachers.length <= 1 ? lesson.teachers[0].toUpperCase() : `${lesson.teachers[0].toUpperCase()}, ${lesson.teachers[1].toUpperCase()}${lesson.teachers.length > 2 ? "+" : ""}`}<span className='change'>{lesson.teacherChanged && "!"}</span></div>}
        {lesson.locations &&  lesson.locations.length > 0 && <div>{lesson.locations.length <= 1 ? lesson.locations[0] : `${lesson.locations[0]}, ${lesson.locations[1]}${lesson.locations.length > 2 ? "+" : ""}`}<span className='change'>{lesson.locationChanged && "!"}</span></div>}
        {isDesktop && <div className='times'>{String(new Date(lesson.start * 1000).getHours())}:{String(new Date(lesson.start * 1000).getMinutes()).padStart(2,'0')}-{String(new Date(lesson.end * 1000).getHours())}:{String(new Date(lesson.end * 1000).getMinutes()).padStart(2,'0')}<span className='change'>{lesson.timeChanged && "!"}</span></div>}
      </div>
      <div className="content-right">
        {isDesktop && lesson.startTimeSlotName}
        {(lesson.timeChanged || lesson.teacherChanged || lesson.locationChanged) && (
          <svg viewBox="0 0 123.996 123.996">
          <g>
            <path d="M9.821,118.048h104.4c7.3,0,12-7.7,8.7-14.2l-52.2-92.5c-3.601-7.199-13.9-7.199-17.5,0l-52.2,92.5
              C-2.179,110.348,2.521,118.048,9.821,118.048z M70.222,96.548c0,4.8-3.5,8.5-8.5,8.5s-8.5-3.7-8.5-8.5v-0.2c0-4.8,3.5-8.5,8.5-8.5
              s8.5,3.7,8.5,8.5V96.548z M57.121,34.048h9.801c2.699,0,4.3,2.3,4,5.2l-4.301,37.6c-0.3,2.7-2.1,4.4-4.6,4.4s-4.3-1.7-4.6-4.4
              l-4.301-37.6C52.821,36.348,54.422,34.048,57.121,34.048z" fill='currentColor'/>
          </g>
          </svg>
        )}
        </div>
    </div>
  )
}
