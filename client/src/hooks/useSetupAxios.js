import { logout } from "@/features/auth/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function useSetupAxios(instance) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Optional: Add request interceptor to log URLs (helpful for debugging)
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (err) => Promise.reject(err)
    );

    instance.interceptors.response.use(
      (value) => value,
      (err) => {
        console.log(
          "Axios error response interceptor =>",
          err.response,
          err.response?.status,
          err.response?.data?.detail.message
        );
        if (
          err.response?.status === 401 &&
          err.response?.data?.detail.message === "Token has expired"
        ) {
          return dispatch(logout());
        }
        return Promise.reject(err);
      }
    );

    return () => {
      instance.interceptors.request.clear();
      instance.interceptors.response.clear();
    };
  }, []);
}
