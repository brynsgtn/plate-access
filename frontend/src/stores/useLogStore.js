import { create } from "zustand";
import axios from "../lib/axios";

export const useLogStore = create ((set) => ({
    logs: [],
    loading: false,

    fetchLogs: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/log/view-logs");
            set({ logs: response.data, loading: false });
        } catch (error) {
            console.error("Error fetching logs:", error);
            set({ loading: false });
        }
    }
}))