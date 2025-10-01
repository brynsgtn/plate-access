import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useLogStore = create((set) => ({
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
    },

    manualEntryLogAttempt: async ({ plateNumber }) => {
        set({ loading: true });
        try {
            const response = await axios.post("/log/entry-log-manual", { plateNumber });
            set({ loading: false });
            toast.success(response.data.message || "Log created successfully!");
            return { success: true, data: response.data }; // return result
        } catch (error) {
            set({ loading: false });
            console.error("Create log failed:", error);
            toast.error(error.response?.data?.message || "Failed to create log.");
            return { success: false, error: error.response?.data }; // return failure
        }
    }
}))