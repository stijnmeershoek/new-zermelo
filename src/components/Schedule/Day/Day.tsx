import { LessonBlock } from '../../LessonBlock';
import { useAppState } from '../../../context'

interface Props {
    dayNumber: number,
    schedule: Appointment[][], 
    scheduleMin: number,
    openLessonModal: (lesson: Appointment) => void, 
    openChoiceModal: (lesson: Appointment) => void
}

export const Day = ({dayNumber, schedule, scheduleMin, openLessonModal, openChoiceModal}: Props) => {
    const {isDesktop} = useAppState();

    return (
        <>
            {schedule[dayNumber]?.length !== 0 ? schedule[dayNumber].map((lesson) => {
            let rowStart = (new Date(lesson.start * 1000).getHours() - scheduleMin) * 12 + new Date(lesson.start * 1000).getMinutes() / 5 + 3;
            let rowEnd = (new Date(lesson.end * 1000).getHours() - scheduleMin) * 12 + new Date(lesson.end * 1000).getMinutes() / 5 + 3

            const onClick = lesson.actions?.length !== 0 ? () => {openChoiceModal(lesson)} : () => {openLessonModal(lesson)};

            return (
                <LessonBlock
                key={lesson.id ? lesson.id : `choice-${lesson.endTimeSlotName}`}
                isDesktop={isDesktop}
                lesson={lesson}
                className={`${rowEnd - rowStart <= 5 ? "wrap" : ""}`}
                onClick={onClick}
                style={{
                    gridRow: `${rowStart} / ${rowEnd}`,
                    gridColumn: `${dayNumber+2}/${dayNumber+3}`,
                }}
                />
            );
            }) : <div style={{gridRow: "1 / -1"}}></div>}
        </>
    )
}