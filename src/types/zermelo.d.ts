/* 
    //* SETTINGS
*/
type Settings = {
    lng:          string,
    theme:        string,
    showChoices:  string,
    enableCustom: string
}

/* 
    //* ACCOUNT
*/
declare type Account = {
    accountName: string,
    school:      string,
    accessToken: string
  }

/* 
    //* ANNOUNCEMENTS
    //* ALL DATA
*/
declare type Announcements = {
    data:       Announcement[],
    details?:   string,
    endRow?:    number,
    eventId?:   number,
    message?:   string,
    startRow?:  number,
    status?:    number,
    totalRows?: number,
}

declare type Announcement = {
    branchesOfSchools: number[],
    end:               number,
    id:                number,
    read:              boolean,
    start:             number,
    text:              string,
    title:             string,
}

/* 
    //* CURRENT USER
    //* ALL DATA
*/
declare type Current = {
    status:    number;
    message:   string;
    details:   string;
    eventId:   number;
    startRow:  number;
    endRow:    number;
    totalRows: number;
    data:      CurrentUserData[];
}

type CurrentUserData = {
    code:        string,
    displayName: string
}

/* 
    //* CUSTOM APPOINTMENTS
    //* ALL DATA
*/

type CustomAppointments = {
    [userId: string]: Appointment[]
}

/* 
    //* LIVESCHEDULE 
    //* ALL DATA
*/
declare type LiveSchedule = {
    status:    number;
    message:   string;
    details:   string;
    eventId:   number;
    startRow:  number;
    endRow:    number;
    totalRows: number;
    data:      Data[];
}

declare type Appointment = {
    start:                       number;
    end:                         number;
    cancelled:                   boolean;
    appointmentType:             string;
    online:                      boolean;
    optional:                    boolean;  
    subjects:                    string[];
    groups:                      string[];
    locations:                   string[];
    teachers:                    string[];
    id?:                         number;
    onlineTeachers?:             string[];
    onlineLocationUrl?:          str;
    appointmentInstance?:        number;
    startTimeSlotName?:          string;
    endTimeSlotName?:            string;
    capacity?:                   number;
    expectedStudentCount?:       number;
    expectedStudentCountOnline?: number;
    changeDescription?:          string;
    schedulerRemark?:            string;
    content?:                    string;
    plannedAttendance?:          boolean;
    studentEnrolled?:            boolean;
    allowedActions?:             string;
    attendanceOverruled?:        boolean;
    availableSpace?:             number;
    status?:                     Status[];
    actions?:                    Action[];
}

type Data =  {
    week:         string;
    user:         string;
    appointments: Appointment[];
    status:       Status[];
    replacements: any[];
}

type Action = {
    appointment: Appointment;
    status:      any[];
    allowed:     boolean;
    post:        string;
}

type Status = {
    code: number;
    nl:   string;
    en:   string;
}