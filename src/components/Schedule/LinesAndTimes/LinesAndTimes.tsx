interface Props {
    scheduleHours: number[]
}

export const LinesAndTimes = ({scheduleHours}: Props) => {
    return (
        <>
            {scheduleHours.map((hour, i) => (
                <>
                    <div className='time' style={{ "gridRow": `${i * 12 + 2}/${i * 12 + 4}` }}>
                        <time dateTime={`${hour}:00`}>{hour}:00</time>
                    </div>
                    <span className="line" style={{ "gridRow": `${i * 12 + 2}/${i * 12 + 4}` }}>
                        <hr></hr>
                    </span>
                </>
            ))}
        </>
    )
}