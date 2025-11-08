import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { io as clientIO } from "socket.io-client";


const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : window.location.origin;

const socket = clientIO(BASE_URL, {
    transports: ["websocket", "polling"]
});

export const useLogStore = create((set) => ({
    logs: [],
    loading: false,
    archivedLogs: [],
    archivedLogsLoading: false,

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

    manualEntryLogAttempt: async ({ plateNumber, notes }) => {
        set({ loading: true });
        try {
            const response = await axios.post("/log/entry-log-manual", { plateNumber, notes });
            set({ loading: false });
            toast.success(response.data.message || "Log created successfully!");
            return { success: true, data: response.data }; // return result
        } catch (error) {
            set({ loading: false });
            console.error("Create log failed:", error);
            toast.error(error.response?.data?.message || "Failed to create log.");
            return { success: false, error: error.response?.data }; // return failure
        }
    },

    manualExitLogAttempt: async ({ plateNumber, notes }) => {
        set({ loading: true });
        try {
            const response = await axios.post("/log/exit-log-manual", { plateNumber, notes });
            set({ loading: false });
            toast.success(response.data.message || "Log created successfully!");
            return { success: true, data: response.data }; // return result
        } catch (error) {
            set({ loading: false });
            console.error("Create log failed:", error);
            toast.error(error.response?.data?.message || "Failed to create log.");
            return { success: false, error: error.response?.data }; // return failure
        }
    },

    lprEntryLogAttempt: async ({ plateNumber }) => {
        set({ loading: true });
        try {
            const response = await axios.post("/log/entry-log-lpr", { plateNumber });
            set({ loading: false });
            toast.success(response.data.message || "Log created successfully!");
            return { success: true, data: response.data }; // return result
        } catch (error) {
            set({ loading: false });
            console.error("Create log failed:", error);
            toast.error(error.response?.data?.message || "Failed to create log.");
            return { success: false, error: error.response?.data }; // return failure
        }
    },

    lprExitLogAttempt: async ({ plateNumber }) => {
        set({ loading: true });
        try {
            const response = await axios.post("/log/exit-log-lpr", { plateNumber });
            set({ loading: false });
            toast.success(response.data.message || "Log created successfully!");
            return { success: true, data: response.data }; // return result
        } catch (error) {
            set({ loading: false });
            console.error("Create log failed:", error);
            toast.error(error.response?.data?.message || "Failed to create log.");
            return { success: false, error: error.response?.data }; // return failure
        }
    },
    archiveOldLogs: async () => {
        set({ archivedLogsLoading: true });

        try {
            const response = await axios.post("/log/archive-old-logs");
            set({
                archivedLogsLoading: false,
                archivedLogs: response.data?.archivedLogs || []
            });
            toast.success(response.data.message || "Logs archived successfully!");
            return { success: true, data: response.data };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to archive logs.");
            console.error("Archive logs failed:", error);
            set({ archivedLogsLoading: false, archivedLogs: [] });
            return { success: false, error: error.response?.data };
        }
    },

    getArchivedLogs: async () => {
        set({ archivedLogsLoading: true });
        try {
            const response = await axios.get("/log/get-old-logs");
            const logs = response.data?.archiveLogs || [];
            set({
                archivedLogsLoading: false,
                archivedLogs: logs
            });
            console.log("Archived logs fetched:", logs);
            return { success: true, data: logs };
        } catch (error) {
            set({ archivedLogsLoading: false, archivedLogs: [] });
            console.error("Get archived logs failed:", error);
            toast.error("Failed to fetch archived logs");
            return { success: false, error: error.response?.data };
        }
    },

    logLiveUpdate: () => {
        socket.off("newLog"); // Ensures no duplicate
        socket.on("newLog", (log) => {
            set((state) => ({ logs: [log, ...state.logs] }));
        });
    }
}))