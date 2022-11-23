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

export const request = async (method: string, url: string, access_token:string, school: string, signal: AbortSignal) => {
    if(method !== "GET" && method !== "POST") return;
    const schoolURL = getApiURL(school);
    const res = await fetch(`${schoolURL}${url}`, {
        method: method, 
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        signal: signal
    })

    if (!res.ok) {
        const error = new Error(`Server returned with an error (${res.status})`)
        throw error
    }

    const json = await res.json();
    if(json) {
        return json;
    } else {
        const error = new Error(`Server returned with an error`)
        throw error
    }
}