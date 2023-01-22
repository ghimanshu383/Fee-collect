function handleResponse(response) {
    return response.text().then(async (text) => {
        const data = text && JSON.parse(text);
        const status = response.status;
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                localStorage.removeItem("username");
            }
            return Promise.reject({ ...data, status });
        }
        return Promise.resolve({ ...data, status });
    });
};

let objectToQueryFormat = (requestObject = {}, res = "") => {
    const allKeys = Object.keys(requestObject);
    allKeys.forEach((key, i) => {
        if (requestObject[key]) {
            if (i === allKeys.length - 1) {
                //Do not pass & on last key
                res += `${key}=${requestObject[key]}`;
            } else {
                res += `${key}=${requestObject[key]}&`;
            }
        }

    });
    return res;
};

let generateRequestOptions = ({url, method, data=null, header={}, authToken='' }) => {

    let options = {
        url,
        method,
        headers: {
            "device-type":"web",
            'Authorization':`Bearer ${authToken}`,
            ...header
        },
        credentials:"include",
    }

    if ((method === "PUT" || method === "POST") && !data) {
        throw Error("Data is required in put and post");
    }

    if (data) {
        options["body"] = data;
    }

    return options;
};

export {
    handleResponse,
    objectToQueryFormat,
    generateRequestOptions
};