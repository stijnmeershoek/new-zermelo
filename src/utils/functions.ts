export const getMonday = (fromDate: Date) => {
    let dayLength = 24 * 60 * 60 * 1000;
    let currentDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    let currentWeekDayMillisecond = ((currentDate.getDay()) * dayLength);
    let monday = new Date(currentDate.getTime() - currentWeekDayMillisecond + dayLength);

    if (monday > currentDate) {
        monday = new Date(monday.getTime() - (dayLength * 7));
    }

    return monday;
}

export const getCurrentDate = (currentDay: Date, offset: number) => {
    let newDate;
    newDate = getMonday(currentDay);
    newDate.setDate(newDate.getDate() + offset * 7);
    return newDate;
}

export const getDates = async (currentDay: Date, offset: number) => {
    const date = getCurrentDate(currentDay, offset)
    let week = [];
    date.setDate((date.getDate() - date.getDay() +1));
    for (let i = 0; i < 5; i++) {
        week.push(
            new Date(date)
        ); 
        date.setDate(date.getDate() +1);
    }
    return Promise.resolve(week); 
}

export const getWeekNumber = (date: Date) => {
    return `${date.getFullYear()}` + `${Math.ceil(Math.floor((Number(date) - Number(new Date(date.getFullYear(), 0, 1))) / (24 * 60 * 60 * 1000)) / 7)}`.padStart(2, "0")
}

export function getScheduleHours(appointments: Appointment[], min: number, max: number) {
    if(appointments.length < 1) return [];
    let highest = new Date(appointments.reduce(
        (previous, current) => current.end > previous ? current.end : previous,
        appointments[0].end
    ) * 1000).getHours() + 1;
    let lowest = new Date(appointments.reduce(
        (previous, current) => current.start < previous ? current.start : previous,
        appointments[0].start
    ) * 1000).getHours();

    if(lowest > min) lowest = min;
    if(highest < max) highest = max;

    let hours = [];
    for (var i = lowest; i <= highest; i++) {
        hours.push(i);
    }
    
    return hours;
}

export const sortSchedule = (appointments: Appointment[], dates: Date[], showChoices: string) => {
    if(appointments.length < 1) return [];
    const day0 = appointments.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[0].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[0].toDateString());
    const day1 = appointments.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[1].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[1].toDateString());
    const day2 = appointments.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[2].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[2].toDateString());
    const day3 = appointments.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[3].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[3].toDateString());
    const day4 = appointments.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[4].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[4].toDateString());
    let schedule = [day0, day1, day2, day3, day4];
    let filtered = schedule;
    if(showChoices === "false") {
        filtered = schedule.map(day => (day.filter(lesson => lesson.appointmentType !== "choice")))
    }
    return filtered;
}