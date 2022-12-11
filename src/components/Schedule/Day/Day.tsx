import { LessonBlock } from '../../LessonBlock';
import { useAppState } from '../../../context'
import { Accessor, For, Show } from 'solid-js';

interface Props {
    dayNumber: number,
    schedule: Accessor<Appointment[][]>,
    scheduleMin: number,
    openLessonModal: (lesson: Appointment) => void, 
    openChoiceModal: (lesson: Appointment) => void
}

export const Day = (props: Props) => {
    const {isDesktop} = useAppState();

    return (
        <>
            <Show when={props.schedule()[props.dayNumber]?.length !== 0}>
                <For each={props.schedule()[props.dayNumber]}>{(lesson) => {
                    let rowStart = (new Date(lesson.start * 1000).getHours() - props.scheduleMin) * 12 + new Date(lesson.start * 1000).getMinutes() / 5 + 3;
                    let rowEnd = (new Date(lesson.end * 1000).getHours() - props.scheduleMin) * 12 + new Date(lesson.end * 1000).getMinutes() / 5 + 3

                    const onClick = (lesson.actions && lesson.actions.length !== 0) ? () => {props.openChoiceModal(lesson)} : () => {props.openLessonModal(lesson)};

                    return (
                        <LessonBlock
                        isDesktop={isDesktop}
                        lesson={lesson}
                        className={`${rowEnd - rowStart <= 5 ? "wrap" : ""}`}
                        onClick={onClick}
                        style={{
                            'grid-row': `${rowStart} / ${rowEnd}`,
                            'grid-column': `${props.dayNumber+2}/${props.dayNumber+3}`,
                        }}
                        />
                    );
                }}</For>
            </Show>
        </>
    )
}