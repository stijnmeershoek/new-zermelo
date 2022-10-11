function getApiURL(school: string) {
    return `https://${school}.zportal.nl/api/v3`
}

export async function getAccessToken(school: string, code: string) {
    const url = getApiURL(school);
    const res = await fetch(`${url}/oauth/token?grant_type=authorization_code&code=${code}`, { method: "POST"})
        if (!res.ok) {
            const message = `Server returned with an error (${res.status})`;
            console.error(message)
            return
        }
        const json = await res.json();
        if (json.access_token) return json.access_token;
}

export async function getSchedule(school: string, access_token: string) {
    const url = getApiURL(school)
    const res = await fetch(`${url}/appointments?valid=true&start=1665352800&end=1665957599&user=~me`, { 
        method: "GET", 
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
        });
        if (!res.ok) {
            const message = `Server returned with an error (${res.status})`;
            console.error(message)
            return
        }
        const json = await res.json();
        return json.response;
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
  
  export type Lesson = {
    id: number;
    start: number;
    end: number;
    startTimeSlot: number;
    endTimeSlot: number;
    startTimeSlotName: string;
    endTimeSlotName: string;
    optional: boolean;
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
    schedulerRemark: string;
    remark: string;
    changeDescription: string;
    branch: string;
    branchOfSchool: number;
    created: number;
    appointmentInstance: number;
    type: string;
    lastModified: number;
    appointmentLastModified: number;
    subjects: string[];
    choosableInDepartmentCodes: string[];
    teachers: string[];
    onlineTeachers: any[];
    groupsInDepartments: number[];
    groups: string[];
    locationsOfBranch: number[];
    locations: string[];
  }