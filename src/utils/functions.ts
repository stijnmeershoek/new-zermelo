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

export const sortSchedule = (liveschedule: LiveSchedule, dates: Date[], showChoices: boolean) => {
    const day0 = liveschedule.data[0].appointments.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[0].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[0].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1));
    const day1 = liveschedule.data[0].appointments.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[1].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[1].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1));
    const day2 = liveschedule.data[0].appointments.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[2].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[2].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1));
    const day3 = liveschedule.data[0].appointments.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[3].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[3].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1));
    const day4 = liveschedule.data[0].appointments.filter((lesson) =>new Date(lesson.start * 1000).toDateString() === dates[4].toDateString() && new Date(lesson.end * 1000).toDateString() === dates[4].toDateString()).sort((a, b) => (a.start > b.start ? 1 : -1));
    let schedule = [day0, day1, day2, day3, day4];
    if(!showChoices) {
        schedule = schedule.map((lesson) => lesson.filter((lesson) => lesson.appointmentType !== "choice"));
    }
    return schedule;
}