import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";


export const useGuestVehicleStore = create((set, get) => ({
    guestVehicles: [],
    loadingGuestVehicles: false,
    blacklistLoading: false,
    addLoading: false,
    extendingLoading: false,

    addGuestVehicle: async (guestVehicleData) => {
        set({ addLoading: true });
        try {
            const response = await axios.post("/guest-vehicle/add-guest-vehicle", guestVehicleData);
            set((prevState) => ({
                guestVehicles: [...prevState.guestVehicles, response.data.guestVehicle],
                addLoading: false
            }));
            toast.success(response?.data?.message || "Guest vehicle added successfully!");
             return { success: true }
        } catch (error) {
            console.error("Error adding guest vehicle:", error);
            set({ addLoading: false });
            toast.error(error.response?.data?.message || "Failed to add guest vehicle.");
        }
    },

    fetchGuestVehicles: async () => {
        set({ loadingGuestVehicles: true });
        try {
            const response = await axios.get("/guest-vehicle/view-guest-vehicles");
            set({ guestVehicles: response.data, loadingGuestVehicles: false });
        } catch (error) {
            console.error("Error fetching guest vehicles:", error);
            set({ loadingGuestVehicles: false });
        }
    },

    blacklistOrUnblacklistGuestVehicle: async (guestVehicleId, reason) => {
        set({ blacklistLoading: true });
        try {
            const response = await axios.patch(`/guest-vehicle/blacklist-or-unblacklist-guest-vehicle`, { id: guestVehicleId, reason: reason });
            console.log("Guest vehicle blacklisted:", response.data);
            set((prevState) => ({
                guestVehicles: prevState.guestVehicles.map((guestVehicle) =>
                    guestVehicle._id === guestVehicleId ? response.data.guestVehicle : guestVehicle
                )
            }));
            set({ blacklistLoading: false });
            toast.success(response?.data?.message || `Guest vehicle ${response.data.guestVehicle.isBlacklisted ? "blacklisted" : "unblacklisted"} successfully!`);
        } catch (error) {
            console.error("Error in blacklistOrUnblacklistGuestVehicle:", error);
            toast.error(error.response?.data?.message || `Failed to ${response.data.guestVehicle.isBlacklisted ? "blacklist" : "unblacklist"} guest vehicle.`);
            set({ blacklistLoading: false });
        }
    },

    banGuestVehicle: async (guestVehicleId, reason) => {
        set({ blacklistLoading: true });
        try {
            const response = await axios.patch(`/guest-vehicle/ban-guest-vehicle`, { id: guestVehicleId, reason: reason });
            console.log("Guest vehicle banned:", response.data);
            set((prevState) => ({
                guestVehicles: prevState.guestVehicles.map((guestVehicle) =>
                    guestVehicle._id === guestVehicleId ? response.data.guestVehicle : guestVehicle
                )
            }));
            set({ blacklistLoading: false });
            toast.success(response?.data?.message || "Guest vehicle banned successfully!");
        } catch (error) {
            console.error("Error in banGuestVehicle:", error);
            toast.error(error.response?.data?.message || "Failed to ban guest vehicle.");
            set({ blacklistLoading: false });
        }
    },

    extendGuestVehicleAccess: async (guestVehicleId) => {
        set({ extendingLoading: true });
        try {
            const response = await axios.patch(`/guest-vehicle/extend-guest-vehicle-access`, { id: guestVehicleId });
            console.log("Guest vehicle access extended:", response.data);
            set((prevState) => ({
                guestVehicles: prevState.guestVehicles.map((guestVehicle) =>
                    guestVehicle._id === guestVehicleId ? response.data.guestVehicle : guestVehicle
                )
            }));
            set({ extendingLoading: false });
            toast.success(response?.data?.message || "Guest vehicle access extended successfully!");
        } catch (error) {
            console.error("Error extending guest vehicle access:", error);
            toast.error(error.response?.data?.message || "Failed to extend guest vehicle access.");
            set({ extendingLoading: false });
        }
    },

    archiveUnarchiveGuestVehicle: async (guestVehicleId) => {
        try {
            const response = await axios.patch(`/guest-vehicle/archive/unarchive-guest-vehicle`, { id: guestVehicleId });
            console.log("Guest vehicle archived/unarchived:", response.data);
            set((prevState) => ({
                guestVehicles: prevState.guestVehicles.map((guestVehicle) =>
                    guestVehicle._id === guestVehicleId ? response.data.guestVehicle : guestVehicle
                )
            }));
            toast.success(response?.data?.message || "Guest vehicle archived/unarchived successfully!");
        } catch (error) {
            console.error("Error archiving/unarchiving guest vehicle:", error);
            toast.error(error.response?.data?.message || "Failed to archive/unarchive guest vehicle.");
        }
    }
}));
          