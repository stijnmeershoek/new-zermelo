import {Lesson} from '../../api/Zermelo'
import './Lesson.css'

interface Props {
    lesson: Lesson
}

export function Lesson({lesson}: Props) {
  return (
    <div className='lesson'>
      <div className='border'></div>
      <div className="content-left">
        <div>
            <div>{lesson.subjects[0]}</div>
            <div>{lesson.teachers[0]}</div>
            <div>{lesson.locations[0]}</div> 
        </div>
        <div>{lesson.start}-{lesson.end}</div>
      </div>
      <div className="content-right">{lesson.startTimeSlot}</div>
    </div>
  )
}
