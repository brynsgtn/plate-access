import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";


export const useVehicleStore = create((set, get) => ({
    vehicles: [],
    addLoading: false,

    addVehicle: async (vehicleData) => {
        set({ addLoading: true });
        try {
            const response = await axios.post("/vehicle/add-vehicle", vehicleData);
            set((prevState) => ({
                vehicles: [...prevState.vehicles, response.data],
                addLoading: false
            }));
            toast.success(response?.data?.message || "Vehicle added successfully!");
        } catch (error) {
            console.error("Error adding vehicle:", error);
            set({ addLoading: false });
            toast.error(error.response?.data?.message || "Failed to add vehicle.");
        }
    }
}));