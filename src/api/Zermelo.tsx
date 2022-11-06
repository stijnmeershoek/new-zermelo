function getApiURL(school: string) {
    return `https://${school}.zportal.nl`
}

export async function getAccessToken(school: string, code: string) {
    const url = getApiURL(school);
    const res = await fetch(`${url}/api/v3/oauth/token?grant_type=authorization_code&code=${code}`, { method: "POST"});

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
    const url = getApiURL(school);
    let response;
    await fetch(`${url}/api/v3/appointments?valid=true&start=${start}&end=${end}&user=~me`, { 
        method: "GET", 
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        signal: abortController.signal
    }).then(async (res) => {
        if (!res.ok) {
            return Promise.reject(Error(`Server returned with an error (${res.status})`))
        }

        const json = await res.json();
        response = json.response;
    }).catch(() => {
        if(abortController.signal.aborted) {
            return Promise.reject(`The user aborted the request`);
        }
    })

    if(response) {
        return Promise.resolve(response);
    }

    return Promise.reject(Error(`Server returned with an error`))
}

export async function getLiveSchedule(school: string, access_token: string, week: string, student: string, abortController: AbortController) {
    const url = getApiURL(school);
    let response;
    await fetch(`${url}/api/v3/liveschedule?student=${student}&week=${week}&fields=appointmentInstance,start,end,startTimeSlotName,endTimeSlotName,subjects,groups,locations,teachers,cancelled,changeDescription,schedulerRemark,content,appointmentType`, { 
        method: "GET", 
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        signal: abortController.signal
    }).then(async (res) => {
        if (!res.ok) {
            return Promise.reject(Error(`Server returned with an error (${res.status})`))
        }

        const json = await res.json();
        response = json.response;
    }).catch(() => {
        if(abortController.signal.aborted) {
            return Promise.reject(`The user aborted the request`);
        }
    })

    if(response) {
        return Promise.resolve(response);
    }

    return Promise.reject(Error(`Server returned with an error`))
}

export async function getAnnouncements(school: string, access_token:string, abortController: AbortController) {
    const url = getApiURL(school)
    let response;
    await fetch(`${url}/api/v3/announcements?user=~me&current=true`, { 
        method: "GET", 
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        signal: abortController.signal
    }).then(async (res) => {
        if (!res.ok) {
            return Promise.reject(Error(`Server returned with an error (${res.status})`))
        }

        const json = await res.json();
        response = json.response;
    }).catch(() => {
        if(abortController.signal.aborted) {
            return Promise.reject(`The user aborted the request`);
        }
    })

    if(response) {
        return Promise.resolve(response);
    }

    return Promise.reject(Error(`Server returned with an error`))
}

export async function getUserData(access_token:string, school: string, abortController: AbortController) {
    const url = getApiURL(school)
    let response;
    await fetch(`${url}/api/v3/tokens/~current`, {
        method: "GET", 
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        signal: abortController.signal
    }).then(async (res) => {
        if (!res.ok) {
            return Promise.reject(Error(`Server returned with an error (${res.status})`))
        }

        const json = await res.json();
        response = json.response;
    }).catch(() => {
        if(abortController.signal.aborted) {
            return Promise.reject(`The user aborted the request`);
        }
    });

    if(response) {
        return Promise.resolve(response);
    }

    return Promise.reject(Error(`Server returned with an error`))
}

export async function postEnroll(access_token:string, school: string, post: string, abortController: AbortController) {
    const url = getApiURL(school)
    let response;
    await fetch(`${url}${post}`, {
        method: "POST", 
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        signal: abortController.signal
    }).then(async (res) => {
        if (!res.ok) {
            return Promise.reject(Error(`Server returned with an error (${res.status})`))
        }

        const json = await res.json();
        response = json.response;
    }).catch(() => {
        if(abortController.signal.aborted) {
            return Promise.reject(`The user aborted the request`);
        }
    });

    if(response) {
        return Promise.resolve(response);
    }

    return Promise.reject(Error(`Server returned with an error`))
}