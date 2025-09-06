import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
    user: null,
    loading:false,
    checkingAuth: true,

    login: async (usernameOrEmail, password) => {
        set({ loading: true });
        try {
            const response = await axios.post("/auth/login", { usernameOrEmail, password });
            set({ user: response.data, loading: false });
            console.log(response);
            toast.success("Login successful!");
        } catch (error) {
            set({ loading: false });
            console.error("Login failed:", error);
            toast.error(error.response.data.message);
        }
    },
}));

// TODO - toast notifications, logout, check auth.
// Implement user state in navbar, homepage