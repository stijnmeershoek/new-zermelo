/* 
    //* SETTINGS
*/
type Settings = {
    lng:         string,
    theme:       string,
    showChoices: boolean,
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
    token:                string;
    user:                 string;
    permissions:          { [key: string]: number };
    created:              number;
    expires:              number;
    timeout:              number;
    comment:              string;
    human:                boolean;
    staffing:             number;
    subjectSelection:     number;
    schedule:             number;
    global:               number;
    effectivePermissions: { [key: string]: number };
    authcode:             any;
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
    status?:                    Status[];
    actions?:                   Action[];
    start:                      number;
    end:                        number;
    cancelled:                  boolean;
    appointmentType:            string;
    online:                     boolean;
    optional:                   boolean;
    appointmentInstance:        number | null;
    startTimeSlotName:          string;
    endTimeSlotName:            string;
    subjects:                   string[];
    groups:                     string[];
    locations:                  string[];
    teachers:                   string[];
    onlineTeachers:             any[];
    onlineLocationUrl:          null;
    capacity:                   null;
    expectedStudentCount:       null;
    expectedStudentCountOnline: null;
    changeDescription:          null | string;
    schedulerRemark:            null | string;
    content:                    null;
    id:                         number | null;
    plannedAttendance?:         boolean;
    studentEnrolled?:           boolean;
    allowedActions?:            string;
    attendanceOverruled?:       boolean;
    availableSpace?:            number;
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