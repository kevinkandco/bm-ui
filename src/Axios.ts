import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

type HttpMethod = 'get' | 'post' | 'head' | 'patch' | 'put' | 'delete';

function AxiosMiddleware(
    method: HttpMethod,
    url: string,
    data?: any,
    options?: AxiosRequestConfig
): Promise<AxiosResponse> {
    switch (method) {
        case 'get':
            return axios.get(url, options);
        case 'post':
            return axios.post(url, data, options);
        case 'head':
            return axios.head(url, options);
        case 'patch':
            return axios.patch(url, data, options);
        case 'put':
            return axios.put(url, data, options);
        case 'delete':
            return axios.delete(url, { ...options, data });
        default:
            console.error(`Unsupported HTTP method: ${method}`);
            return Promise.reject(new Error(`Unsupported HTTP method: ${method}`));
    }
}

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data?.message || error.message;
            const data = error.response?.data;

            const formattedError = {
                name: "AxiosError",
                message,
                status,
                data
            };

            throw formattedError; 
        }
        throw error;
    }
);

export function setBearerToken(token: string): void {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function callApi(
    method: HttpMethod,
    url: string,
    data: any = null,
    options: AxiosRequestConfig = {}
): Promise<AxiosResponse> {
    return AxiosMiddleware(method, url, data, {
        headers: {
            ...options?.headers,
            "ngrok-skip-browser-warning": "true"
        }
    });
}
