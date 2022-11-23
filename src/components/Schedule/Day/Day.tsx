import { LessonBlock } from '../../LessonBlock';

interface Props {
    dayNumber: number, 
    schedule: Appointment[][], 
    openLessonModal: (lesson: Appointment) => void, 
    openChoiceModal: (lesson: Appointment) => void
}

export const Day = ({dayNumber, schedule, openLessonModal, openChoiceModal}: Props) => {
    return (
        <>
            {schedule[dayNumber] && schedule[dayNumber].length !== 0 ? schedule[dayNumber].map((lesson) => {
            let rowStart = (new Date(lesson.start * 1000).getHours() - 8) * 12 + new Date(lesson.start * 1000).getMinutes() / 5 + 3;
            let rowEnd = (new Date(lesson.end * 1000).getHours() - 8) * 12 + new Date(lesson.end * 1000).getMinutes() / 5 + 3

            const onClick = lesson.appointmentType === "choice" ? () => {openChoiceModal(lesson)} : () => {openLessonModal(lesson)};

            return (
                <LessonBlock
                key={lesson.id ? lesson.id : `choice-${lesson.endTimeSlotName}`}
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