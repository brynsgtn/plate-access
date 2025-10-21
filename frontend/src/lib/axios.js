import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.mode === "development" ? "http://localhost:5001/api" : "/api",
    withCredentials: true, // send cookies to the server
});


// Response interceptor for auto-logout on 401
axiosInstance.interceptors.response.use(
    (response) => response, // Pass successful responses through
    async (error) => {
        // If token expired (401 Unauthorized)
        if (error.response && error.response.status === 401) {
            // Dynamically import to avoid circular dependency
            const { useUserStore } = await import("../stores/useUserStore");
            const store = useUserStore.getState();

            // Disconnect socket and clear user state
            store.disconnectSocket();
            store.set({ user: null, checkingAuth: false });

            // Show error toast
            const { toast } = await import("react-hot-toast");
            toast.error("Session expired. Please login again.");

            // Redirect to login page
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;