// import { create } from 'zustand'
// import { toast } from 'react-hot-toast'
// import axiosInstance from '../lib/axios';


// export const useUserStore = create((set, get) => ({
//     user: null,
//     loading: false,
//     checkingAuth: true,
//     signup: async ({ name, email, password, confirmPassword }) => {
//         set({ loading: true })
//         if (password !== confirmPassword) {
//             set({ loading: false })
//             return toast.error('passwords dont match')
//         }
//         try {
//             const res = await axios.post('/auth/signup', { name, email, password })
//             set({ user: res.data.user, loading: false })
//         } catch (error) {
//             set({ loadin: false })
//             toast.error(error.response.data.message || 'an error occurred')
//         }
//     }



// export const useUserStore = create((set, get) => ({
//     user: null,
//     loading: false,
//     checkingAuth: true,

//     signup: async ({ name, email, password, confirmPassword }) => {
//         set({ loading: true });

//         if (password !== confirmPassword) {
//             set({ loading: false });
//             return toast.error("Passwords do not match");
//         }

//         try {
//             // const res = await axiosInstance.post("/auth/signup", { name, email, password });
//             const res = await axiosInstance.post("/auth/signup", { name, email, password, withCredentials: true })
//             console.log(res)
//             set({ user: res.data, loading: false });
//         } catch (error) {
//             set({ loading: false });
//             toast.error(error?.response?.data.message || "An error occurred");
//             console.log(error)
//         }
//     },
//     login: async (email, password) => {
//         set({ loading: true });
//         try {
//             const res = await axiosInstance.post("/auth/login", {
//                 withCredentials: true, email, password
//             });
//             console.log('user is here ', res.data)
//             set({ user: res.data, loading: false });
//         } catch (error) {
//             set({ loading: false });
//             toast.error(error.response.data.message || "An error occurred");
//         }
//     },
//     // checkAuth: async () => {
//     //     set({ checkingAuth: true })
//     //     try {
//     //         const response = await axios.get('http://localhost:5000/api/auth/profile')
//     //         set({ user: response.data, checkingAuth: false })
//     //     } catch (error) {
//     //         set({ checkingAuth: false, user: null })

//     //     }
//     // }
//     checkAuth: async () => {
//         set({ checkingAuth: true });
//         try {
//             const response = await axiosInstance.get("/api/auth/profile", {
//                 withCredentials: true
//             });
//             set({ user: response.data, checkingAuth: false });
//         } catch (error) {
//             console.log(error.message);
//             set({ checkingAuth: false, user: null });
//         }
//     },
// }))







import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";


export const useUserStore = create((set) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });

        if (password !== confirmPassword) {
            set({ loading: false });
            return toast.error("Passwords do not match");
        }

        try {
            const res = await axiosInstance.post("/auth/signup", {
                name,
                email,
                password,
            });

            set({
                user: res.data,
                loading: false,
            });

        } catch (error) {
            set({ loading: false });

            toast.error(
                error?.response?.data?.message || "An error occurred"
            );
        }
    },

    login: async (email, password) => {
        set({ loading: true });

        try {
            const res = await axiosInstance.post("/auth/login", {
                email,
                password,
            });

            set({
                user: res.data,
                loading: false,
            });

        } catch (error) {
            set({ loading: false });

            toast.error(
                error?.response?.data?.message || "An error occurred"
            );
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout')
            set({ user: null })
        } catch (error) {
            toast.error(error.response?.data?.message || 'error occured during slogout')
        }
    },
    checkAuth: async () => {
        set({ checkingAuth: true });

        try {
            const response = await axiosInstance.get("/auth/profile");

            set({
                user: response.data,
                checkingAuth: false,
            });

        } catch (error) {
            set({
                user: null,
                checkingAuth: false,
            });
        }
    },
    refreshToken: async () => {
        if (get().checkingAuth) return
        set({ checkingAuth: true })
        try {
            const response = await axiosInstance.post('/auth/refresh-token')
            set({ checkingAuth: false })
            return response.data
        } catch (error) {
            set({ user: null, checkingAuth: false })
            throw error
        }
    }
}));


let refreshPromise = null
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                if (refreshPromise) {
                    await refreshPromise
                    return axiosInstance(originalRequest)
                }
                refreshPromise = useUserStore.getState().refreshToken()
                await refreshPromise
                refreshPromise = null
                return axios(originalRequest)
            } catch (refreshError) {
                useUserStore.getState().logout()
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)