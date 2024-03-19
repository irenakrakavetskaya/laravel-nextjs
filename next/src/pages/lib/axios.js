import Axios from 'axios'

export const token = process.env.NEXT_PUBLIC_TOKEN;

export const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
    withXSRFToken: true
})
