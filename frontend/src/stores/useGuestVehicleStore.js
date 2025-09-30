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

    blacklistOrUnblacklistGuestVehicle: async (guestVehicleId) => {
        set({ blacklistLoading: true });
        try {
            const response = await axios.patch(`/guest-vehicle/blacklist-or-unblacklist-guest-vehicle`, { id: guestVehicleId });
            console.log("Guest vehicle blacklisted:", response.data);
            set((prevState) => ({
                guestVehicles: prevState.guestVehicles.map((guestVehicle) =>
                    guestVehicle._id === guestVehicleId ? response.data.guestVehicle : guestVehicle
                )
            }));
            set({ blacklistLoading: false });
            toast.success(response?.data?.message || "Guest vehicle blacklisted successfully!");
        } catch (error) {
            console.error("Error blacklisting guest vehicle:", error);
            toast.error(error.response?.data?.message || "Failed to blacklist guest vehicle.");
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

    deleteGuestVehicle: async (guestVehicleId) => {
        try {
            const response = await axios.delete(`/guest-vehicle/delete-guest-vehicle`, { data: { id: guestVehicleId } });
            console.log("Guest vehicle deleted:", response.data);
            set((prevState) => ({
                guestVehicles: prevState.guestVehicles.filter((guestVehicle) => guestVehicle._id !== guestVehicleId)
            }));
            toast.success(response?.data?.message || "Guest vehicle deleted successfully!");
        } catch (error) {
            console.error("Error deleting guest vehicle:", error);
            toast.error(error.response?.data?.message || "Failed to delete guest vehicle.");
        }
    }
}));