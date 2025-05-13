import axios from 'axios'

function AxiosMiddleware(method, url, data, options) {
    switch (method) {
        case 'get':
            return axios.get(url, data, options);
        case 'post':
            return axios.post(url, data, options);
        case 'head':
            return axios.head(url, data, options);
        case 'patch':
            return axios.patch(url, data, options);
        case 'put':
            return axios.put(url, data, options);
        case 'delete':
            return axios.delete(url, { data: data, headers: options });
        default:
            console.log(method);
            break;
    }
}

axios.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        console.log(error);
        return false;
    }
)


export function setBearerToken(token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}


export function callApi(method, url, data = [], options = {}) {
    return AxiosMiddleware(method, url, data, options)
}
