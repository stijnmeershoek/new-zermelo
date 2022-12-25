import { Accessor, For } from "solid-js"

type Props = {
    scheduleHours: Accessor<number[]>
}

export const LinesAndTimes = ({scheduleHours}: Props) => {
    return (
        <>
            <For each={scheduleHours()}>{(hour, i) =>
                <>
                    <div class='time' style={{ "grid-row": `${i() * 12 + 2}/${i() * 12 + 4}` }}>
                        <time dateTime={`${hour}:00`}>{hour}:00</time>
                    </div>
                    <span class="line" style={{ "grid-row": `${i() * 12 + 2}/${i() * 12 + 4}` }}>
                        <hr></hr>
                    </span>
                </>
            }</For>
        </>
    )
}