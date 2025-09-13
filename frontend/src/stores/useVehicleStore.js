import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";


export const useVehicleStore = create((set, get) => ({
    vehicles: [],
    totalVehicles: 0,
    loading: false,
    addLoading: false,

    addVehicle: async (vehicleData) => {
        set({ addLoading: true });
        try {
            const response = await axios.post("/vehicle/add-vehicle", vehicleData);
            set((prevState) => ({
                vehicles: [...prevState.vehicles, response.data.vehicle],
                totalVehicles: prevState.totalVehicles + 1,
                addLoading: false
            }));
            toast.success(response?.data?.message || "Vehicle added successfully!");
        } catch (error) {
            console.error("Error adding vehicle:", error);
            set({ addLoading: false });
            toast.error(error.response?.data?.message || "Failed to add vehicle.");
        }
    },
    viewVehicles: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/vehicle/view-vehicle");
            console.log("Vehicles:", response.data.vehicles);
            set({ vehicles: response.data.vehicles, totalVehicles: response.data.totalVehicles,loading: false });
        } catch (error) {
            console.error("Error viewing vehicles:", error);
            set({ loading: false });
        }
    }
}));