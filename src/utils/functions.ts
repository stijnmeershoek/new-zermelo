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

export const getCurrentDate = (currentDay: Date, perWeek: boolean, offset: number) => {
    let newDate;
    if(perWeek) {
        newDate = getMonday(currentDay);
        newDate.setDate(newDate.getDate() + offset * 7);
    } else {
        newDate = new Date(currentDay);
        newDate.setDate(newDate.getDate() + offset);
        newDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    }
    return newDate;
}

export const getDates = async (currentDay: Date, perWeek: boolean, offset: number) => {
    const date = getCurrentDate(currentDay, perWeek, offset)
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