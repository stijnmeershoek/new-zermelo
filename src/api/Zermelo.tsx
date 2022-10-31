function getApiURL(school: string) {
    return `https://${school}.zportal.nl/api/v3`
}

export async function getAccessToken(school: string, code: string) {
    const url = getApiURL(school);
    const res = await fetch(`${url}/oauth/token?grant_type=authorization_code&code=${code}`, { method: "POST"});

    if (!res.ok) {
        return await Promise.reject(Error(`Server returned an error. you probably entered an invalid code.`));
    }

    const json = await res.json();
    if (json.access_token) {
        return await Promise.resolve(json.access_token)
    } else {
        return await Promise.reject(Error(`No access token could be retrieved from server.`))
    };
}

export async function getSchedule(school: string, access_token: string, start: number, end:number, abortController: AbortController) {
    const url = getApiURL(school)
    const res = await fetch(`${url}/appointments?valid=true&start=${start}&end=${end}&user=~me`, { 
        method: "GET", 
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        signal: abortController.signal
    });

    if (!res.ok) {
        return Promise.reject(Error(`Server returned with an error (${res.status})`))
    }

    const json = await res.json();
    return Promise.resolve(json.response);
}

export async function getAnnouncements(school: string, access_token:string, abortController: AbortController) {
    const url = getApiURL(school)
    const res = await fetch(`${url}/announcements?user=~me&current=true`, { 
        method: "GET", 
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        signal: abortController.signal
    });

    if (!res.ok) {
        return Promise.reject(Error(`Server returned with an error (${res.status})`))
    }

    const json = await res.json();
    return Promise.resolve(json.response);
}

export type Schedule = {
    data: Lesson[],
    details?: string,
    endRow?: number,
    eventId?: number,
    message?: string,
    startRow?: number,
    status?: number,
    totalRows?: number,
}

export type Announcements = {
    data: Announcement[],
    details?: string,
    endRow?: number,
    eventId?: number,
    message?: string,
    startRow?: number,
    status?: number,
    totalRows?: number,
}

export type Announcement = {
    branchesOfSchools: number[],
    end: number,
    id: number,
    read: boolean,
    start: number,
    text: string,
    title: string,
}
  
export type Lesson = {
    id: number;
    start: number;
    end: number;
    startTimeSlot: number;
    endTimeSlot: number;
    startTimeSlotName: string;
    endTimeSlotName: string;
    optional?: boolean;
    teacherChanged: boolean;
    groupChanged: boolean;
    locationChanged: boolean;
    timeChanged: boolean;
    valid: boolean;
    cancelled: boolean;
    modified: boolean;
    moved: boolean;
    hidden: boolean;
    new: boolean;
    content?: any;
    extraStudentSource?: any;
    onlineLocationUrl?: any;
    schedulerRemark?: string;
    remark?: string;
    changeDescription: string;
    branch?: string;
    branchOfSchool?: number;
    created: number;
    appointmentInstance?: number;
    type: string;
    lastModified: number;
    appointmentLastModified?: number;
    subjects: string[];
    choosableInDepartmentCodes: string[];
    teachers?: string[];
    onlineTeachers?: any[];
    groupsInDepartments?: number[];
    groups?: string[];
    locationsOfBranch?: number[];
    locations?: string[];
}