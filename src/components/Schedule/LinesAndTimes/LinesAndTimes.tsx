import { Accessor, Index } from "solid-js"

interface Props {
    scheduleHours: Accessor<number[]>
}

export const LinesAndTimes = ({scheduleHours}: Props) => {
    return (
        <>
            <Index each={scheduleHours()}>{(hour, i) =>
                <>
                    <div class='time' style={{ "grid-row": `${i * 12 + 2}/${i * 12 + 4}` }}>
                        <time dateTime={`${hour}:00`}>{hour}:00</time>
                    </div>
                    <span class="line" style={{ "grid-row": `${i * 12 + 2}/${i * 12 + 4}` }}>
                        <hr></hr>
                    </span>
                </>
            }</Index>
        </>
    )
}