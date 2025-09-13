import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { deleteVehicle } from "../../../backend/controllers/vehicle.controller";


export const useVehicleStore = create((set, get) => ({
    vehicles: [],
    loadingVehicles: false,
    addLoading: false,
    editLoading: false,

    addVehicle: async (vehicleData) => {
        set({ addLoading: true });
        try {
            const response = await axios.post("/vehicle/add-vehicle", vehicleData);
            set((prevState) => ({
                vehicles: [...prevState.vehicles, response.data.vehicle],
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
        set({ loadingVehicles: true });
        try {
            const response = await axios.get("/vehicle/view-vehicle");
            console.log("Vehicles:", response.data);
            set({ vehicles: response.data.vehicles, loadingVehicles: false });
        } catch (error) {
            console.error("Error viewing vehicles:", error);
            set({ loadingVehicles: false });
        }
    },
    updateVehicle: async (vehicleId, updatedData) => {
        set({ editLoading: true });
        try {
            const response = await axios.put(`/vehicle/update-vehicle`, {

                plateNumber: updatedData.plateNumber,
                makeModel: updatedData.makeModel,
                ownerName: updatedData.ownerName,
                id: vehicleId,
            });
            console.log("Vehicle updated:", response.data);
            set((prevState) => ({
                vehicles: prevState.vehicles.map((vehicle) =>
                    vehicle._id === vehicleId ? response.data.vehicle : vehicle
                ),
                editLoading: false
            }));
            toast.success(response?.data?.message || "Vehicle updated successfully!");
        } catch (error) {
            console.error("Error updating vehicle:", error);
            set({ editLoading: false });
            toast.error(error.response?.data?.message || "Failed to update vehicle.");
        }
    },
    deleteVehicle: async (vehicleId) => {
        try {
            const response = await axios.delete(`/vehicle/delete-vehicle`, { data: { id: vehicleId } });
            console.log("Vehicle deleted:", response.data);
            set((prevState) => ({
                vehicles: prevState.vehicles.filter((vehicle) => vehicle._id !== vehicleId)
            }));
            toast.success(response?.data?.message || "Vehicle deleted successfully!");
        } catch (error) {
            console.error("Error deleting vehicle:", error);
            toast.error(error.response?.data?.message || "Failed to delete vehicle.");
        }
    },
}));