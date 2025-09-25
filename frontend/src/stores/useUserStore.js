import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";



export const useUserStore = create((set, get) => ({
    user: null,
    users: null,
    loading: false,
    usersLoading: false,
    checkingAuth: true,

    login: async (usernameOrEmail, password) => {
        set({ loading: true });
        try {
            const response = await axios.post("/auth/login", { usernameOrEmail, password });
            set({ user: response.data, loading: false });
            toast.success("Login successful!");
        } catch (error) {
            set({ loading: false });
            console.error("Login failed:", error);
            toast.error(error.response.data.message);
        }
    },
    createUser: async (userData) => {
        set({ loading: true });
        try {
            await axios.post("/user/register", userData);
            set({ loading: false });
            toast.success("User created successfully!");
        } catch (error) {
            set({ loading: false });
            console.error("Create user failed:", error);
            toast.error(error.response?.data?.message || "Failed to create user.");
        }
    },
    logout: async () => {
        set({ loading: true });
        try {
            await axios.post("/auth/logout");
            set({ user: null, loading: false });
            toast.success("Logout successful!");
        } catch (error) {
            set({ loading: false });
            console.error("Logout failed:", error);
            toast.error(error.response.data.message);
        }
    },
    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axios.get("/auth/check-auth");
            set({ user: response.data, checkingAuth: false });
        } catch (error) {
            set({ user: null, checkingAuth: false });
            console.error("Authentication check failed:", error);
            toast.error("Session expired. Please log in again.");
        }
    },
    fetchAllUsers: async () => {
        set({ usersLoading: true });
        try {
            const response = await axios.get("/user/get-users");
            set({ users: response.data, usersLoading: false });
        } catch (error) {
            set({ usersloading: false });
            console.error("Fetch users failed:", error);
        }
    },
    updateUser: async (id) => {
        set({ loading: true });
        try {
            const response = await axios.patch(`/user/update`, {id});
            set({ loading: false });
            toast.success(response?.data?.message);
        } catch (error) {
            set({ loading: false });
            console.error("Update user failed:", error);
            toast.error(error.response?.data?.message || "Failed to update user.");
        }
    },
    deleteUser: async (id) => {
        set({ loading: true });
        try {
            const response = await axios.delete(`/user/delete`, { data: { id } });
            set({ loading: false });
            toast.success(response?.data?.message);
        } catch (error) {
            set({ loading: false });
            console.error("Delete user failed:", error);
            toast.error(error.response?.data?.message || "Failed to delete user.");
        }
    },
}));

