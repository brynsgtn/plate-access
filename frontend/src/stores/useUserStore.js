import { create } from "zustand";
import axios from "../lib/axios";

export const useUserStore = create((set, get) => ({
    user: null,
    loading:false,
    checkingAuth: true,

    login: async (usernameOrEmail, password) => {
        set({ loading: true });
        try {
            const response = await axios.post("/auth/login", { usernameOrEmail, password });
            set({ user: response.data, loading: false });
        } catch (error) {
            set({ loading: false });
            console.error("Login failed:", error);
        }
    },
}));

// TODO - toast notifications, logout, check auth.
// Implement user state in navbar, homepage