import { JSXInternal } from "preact/src/jsx";
import { useAppState } from "../../context";
import './LessonBlock.css';

interface Props {
    isDesktop: boolean,
    lesson: Appointment
    style?: JSXInternal.CSSProperties,
    className?: string,
    onClick: () => void,
}

export const LessonBlock = ({isDesktop, lesson, style, className = "", onClick}: Props) => {
  const { settings } = useAppState();
  const classes = `lesson-block ${lesson.appointmentType} ${className} ${lesson.cancelled ? "cancelled" : ""} ${lesson.appointmentType === "choice" ? lesson.actions?.some((appointment) => appointment.allowed === true) ? "allowed" : "locked" : ""}`;
  const lessonInfo = (lesson.appointmentType === "conflict" && lesson.actions) ? lesson.actions[0].appointment : lesson;

  return (
    <article onClick={onClick} className={classes.replace(/\s+/g,' ').trim()} style={style}>
      {lesson.appointmentType !== "choice" ? (<><section className="content-left">
        <h1 aria-label='subject'>{lessonInfo.appointmentType === "choice" ? `${settings.lng === "nl" ? "keuze" : settings.lng === "en" ? "choice" : "choice"}`:""}{lessonInfo.subjects.length <= 1 ? lessonInfo.subjects[0] : `${lessonInfo.subjects[0]}, ${lessonInfo.subjects[1]}${lessonInfo.subjects.length > 2 ? "+" : ""}`}</h1>
        {isDesktop && lessonInfo.teachers && lessonInfo.teachers.length > 0 && <div aria-label='teacher'>{lessonInfo.teachers.length <= 1 ? lessonInfo.teachers[0].toUpperCase() : `${lessonInfo.teachers[0].toUpperCase()}, ${lessonInfo.teachers[1].toUpperCase()}${lessonInfo.teachers.length > 2 ? "+" : ""}`}<span className='change'>{lessonInfo.status?.some((status) => status.code === 3011)}</span></div>}
        {lessonInfo.locations && lessonInfo.locations.length > 0 && <div aria-label='location'>{lessonInfo.locations.length <= 1 ? lessonInfo.locations[0] : `${lessonInfo.locations[0]}, ${lessonInfo.locations[1]}${lessonInfo.locations.length > 2 ? "+" : ""}`}<span className='change'>{lessonInfo.status?.some((status) => status.code === 3012)}</span></div>}
        {isDesktop && <div className='times'><time aria-label='lesson start' dateTime={`${new Date(lesson.start * 1000)}`}>{String(new Date(lesson.start * 1000).getHours())}:{String(new Date(lesson.start * 1000).getMinutes()).padStart(2,'0')}</time>-<time aria-label='lesson end' dateTime={`${new Date(lesson.end * 1000)}`}>{String(new Date(lesson.end * 1000).getHours())}:{String(new Date(lesson.end * 1000).getMinutes()).padStart(2,'0')}</time><span className='change'>{lesson.status?.some((status) => status.code === 3015)}</span></div>}
      </section>
      <section className="content-right">
        {isDesktop && <span>{lesson.startTimeSlotName}</span>}
        {(lessonInfo.changeDescription || lessonInfo.cancelled || lessonInfo.schedulerRemark || lessonInfo.status?.some((item) => (item.code.toString().startsWith("4") && item.code !== 4009) || item.code.toString().startsWith("3"))) && (
          <svg viewBox="0 0 123.996 123.996">
          <g>
            <path d="M9.821,118.048h104.4c7.3,0,12-7.7,8.7-14.2l-52.2-92.5c-3.601-7.199-13.9-7.199-17.5,0l-52.2,92.5
              C-2.179,110.348,2.521,118.048,9.821,118.048z M70.222,96.548c0,4.8-3.5,8.5-8.5,8.5s-8.5-3.7-8.5-8.5v-0.2c0-4.8,3.5-8.5,8.5-8.5
              s8.5,3.7,8.5,8.5V96.548z M57.121,34.048h9.801c2.699,0,4.3,2.3,4,5.2l-4.301,37.6c-0.3,2.7-2.1,4.4-4.6,4.4s-4.3-1.7-4.6-4.4
              l-4.301-37.6C52.821,36.348,54.422,34.048,57.121,34.048z" fill='currentColor'/>
          </g>
          </svg>
        )}
        {(lesson.actions?.length !== 0) && (
          <svg className="options" viewBox="0 0 1024 1024"><path d="M960 448H576V64a64 64 0 0 0-128 0v384H64a64 64 0 0 0 0 128h384v384a64 64 0 0 0 128 0V576h384a64 64 0 0 0 0-128z" fill="currentColor" /></svg>
        )}
        </section></>) : (
          <>
            <section className="choice-content">
              <h1>{lesson.actions?.length || 0}</h1>
            </section>
            <section className="content-right">
            {(lesson.actions && lesson.actions.some((appointment) => appointment.allowed !== false)) ? (
              <svg className="unlocked" viewBox="0 0 1024 1024"><path d="M960 448H576V64a64 64 0 0 0-128 0v384H64a64 64 0 0 0 0 128h384v384a64 64 0 0 0 128 0V576h384a64 64 0 0 0 0-128z" fill="currentColor" /></svg>
            ) : (
              <svg className="locked" viewBox="0, 0, 400,400"><g><path d="M179.388 1.194 C 136.339 8.424,100.785 37.404,84.474 78.560 C 77.373 96.477,75.781 107.250,75.781 137.380 L 75.781 160.714 69.541 161.142 C 59.010 161.864,52.177 166.780,48.268 176.448 L 46.484 180.859 46.266 279.297 C 46.049 377.177,46.057 377.763,47.674 382.813 C 49.833 389.553,53.705 394.717,58.782 397.629 L 62.891 399.985 200.000 399.985 L 337.109 399.985 341.218 397.629 C 346.226 394.757,350.123 389.609,352.297 382.991 C 354.795 375.386,354.829 186.670,352.333 178.793 C 348.532 166.798,340.574 160.938,328.087 160.938 L 324.219 160.938 324.219 137.492 C 324.219 107.239,322.634 96.495,315.526 78.560 C 293.788 23.708,237.112 -8.499,179.388 1.194 M218.614 54.625 C 243.456 61.846,262.851 81.282,269.515 105.634 C 271.799 113.981,272.627 124.022,272.643 143.555 L 272.656 160.938 200.000 160.938 L 127.344 160.938 127.357 143.555 C 127.373 124.022,128.201 113.981,130.485 105.634 C 140.852 67.751,181.945 43.966,218.614 54.625 M210.991 225.479 C 231.204 231.481,240.187 256.417,228.638 274.470 C 227.138 276.815,225.530 278.969,225.065 279.257 C 224.482 279.617,224.218 288.937,224.216 309.226 C 224.212 348.899,225.517 346.869,200.000 346.869 C 174.483 346.869,175.788 348.899,175.784 309.226 C 175.782 288.937,175.518 279.617,174.935 279.257 C 170.903 276.765,166.268 264.888,166.268 257.045 C 166.268 234.137,188.146 218.695,210.991 225.479 " fill="currentColor"></path></g></svg>
            )}
            </section>
          </>
        )}
    </article>
  )
}
