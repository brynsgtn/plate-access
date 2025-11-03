import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";




export const useVehicleStore = create((set, get) => ({
    vehicles: [],
    loadingVehicles: false,
    addLoading: false,
    editLoading: false,
    approveAddLoading: false,
    requestBlacklistLoading: false,

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
                branch: updatedData.branch,
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
    archiveVehicle: async (vehicleId) => {
        try {
            const response = await axios.patch(`/vehicle/archive-vehicle`, { id: vehicleId });
            console.log("Vehicle archived:", response.data);
            set((prevState) => ({
                vehicles: prevState.vehicles.map((vehicle) =>
                    vehicle._id === vehicleId ? response.data.vehicle : vehicle
                )
            }));
            toast.success(response?.data?.message || "Vehicle archived successfully!");
        } catch (error) {
            console.error("Error archiving vehicle:", error);
            toast.error(error.response?.data?.message || "Failed to archive vehicle.");
        }
    },
    blacklistOrUnblacklistVehicle: async (vehicleId) => {
        try {
            const response = await axios.patch(`/vehicle/blacklist-unblacklist-vehicle`, { id: vehicleId });
            console.log("Vehicle blacklisted:", response.data);
            set((prevState) => ({
                vehicles: prevState.vehicles.map((vehicle) =>
                    vehicle._id === vehicleId ? response.data.vehicle : vehicle
                )
            }));
            toast.success(response?.data?.message || "Vehicle blacklisted successfully!");
        } catch (error) {
            console.error("Error blacklisting vehicle:", error);
            toast.error(error.response?.data?.message || "Failed to blacklist vehicle.");
        }
    },
    approveVehicleRequest: async (vehicleId) => {
        set({ requestBlacklistLoading: true });
        try {
            const response = await axios.patch(`/vehicle/approve-add-vehicle-request`, { id: vehicleId });
            console.log("Vehicle request approved:", response.data);
            set((prevState) => ({
                vehicles: prevState.vehicles.map((vehicle) =>
                    vehicle._id === vehicleId ? response.data.vehicle : vehicle
                )
            }));
            set({ requestBlacklistLoading: false });
            toast.success(response?.data?.message || "Vehicle request approved successfully!");
        } catch (error) {
            console.error("Error approving vehicle request:", error);
            toast.error(error.response?.data?.message || "Failed to approve vehicle request.");
            set({ requestBlacklistLoading: false });
        }
    },
    approveUpdateVehicleRequest: async (vehicleId) => {
        try {
            const response = await axios.patch(`/vehicle/approve-update-vehicle-request`, { id: vehicleId });
            console.log("Vehicle request approved:", response.data);
            set((prevState) => ({
                vehicles: prevState.vehicles.map((vehicle) =>
                    vehicle._id === vehicleId ? response.data.vehicle : vehicle
                )
            }));
            toast.success(response?.data?.message || "Vehicle request approved successfully!");
        } catch (error) {
            console.error("Error approving vehicle request:", error);
            toast.error(error.response?.data?.message || "Failed to approve vehicle request.");
        }
    },
    approveDeleteVehicleRequest: async (vehicleId) => {
        try {
            const response = await axios.delete(`/vehicle/approve-delete-vehicle-request`, { data: { id: vehicleId } });
            console.log("Vehicle request approved:", response.data);
            set((prevState) => ({
                vehicles: prevState.vehicles.filter((vehicle) => vehicle._id !== vehicleId)
            }));
            toast.success(response?.data?.message || "Vehicle request approved successfully!");
        } catch (error) {
            console.error("Error approving vehicle request:", error);
            toast.error(error.response?.data?.message || "Failed to approve vehicle request.");
        }
    },
    denyVehicleRequest: async (vehicleId) => {
        try {
            const response = await axios.delete(`/vehicle/deny-vehicle-request`, { data: { id: vehicleId } });
            console.log("Vehicle request denied:", response.data);
            set((prevState) => ({
                vehicles: prevState.vehicles.filter((vehicle) => vehicle._id !== vehicleId)
            }));
            toast.success(response?.data?.message || "Vehicle request denied successfully!");
        } catch (error) {
            console.error("Error denying vehicle request:", error);
            toast.error(error.response?.data?.message || "Failed to deny vehicle request.");
        }
    },
    rejectUpdateVehicleRequest: async (vehicleId) => {
        try {
            const response = await axios.patch(`/vehicle/reject-update-vehicle-request`, { id: vehicleId });
            console.log("Vehicle request rejected:", response.data);
            set((prevState) => ({
                vehicles: prevState.vehicles.map((vehicle) =>
                    vehicle._id === vehicleId ? response.data.vehicle : vehicle
                )
            }));
            toast.success(response?.data?.message || "Vehicle request rejected successfully!");
        } catch (error) {
            console.error("Error rejecting vehicle request:", error);
            toast.error(error.response?.data?.message || "Failed to reject vehicle request.");
        }
    },
    rejectDeleteVehicleRequest: async (vehicleId) => {
        try {
            const response = await axios.patch(`/vehicle/reject-delete-vehicle-request`, { id: vehicleId });
            console.log("Vehicle request rejected:", response.data);
            set((prevState) => ({
                vehicles: prevState.vehicles.map((vehicle) =>
                    vehicle._id === vehicleId ? response.data.vehicle : vehicle
                )
            }));
            toast.success(response?.data?.message || "Vehicle request rejected successfully!");
        } catch (error) {
            console.error("Error rejecting vehicle request:", error);
            toast.error(error.response?.data?.message || "Failed to reject vehicle request.");
        }
    },
    requestUpdateVehicle: async (vehicleId, updateRequestData) => {
        try {
            const response = await axios.put(`/vehicle/request-update-vehicle`, { id: vehicleId, ...updateRequestData });
            console.log("Vehicle update request sent:", response.data);
            set((prevState) => ({
                vehicles: prevState.vehicles.map((vehicle) =>
                    vehicle._id === vehicleId ? response.data.vehicle : vehicle
                )
            }));
            toast.success(response?.data?.message || "Vehicle update request sent successfully!");
        } catch (error) {
            console.error("Error sending vehicle update request:", error);
            toast.error(error.response?.data?.message || "Failed to send vehicle update request.");
        }
    },
    requestDeleteVehicle: async (vehicleId, reason) => {
        try {
            const response = await axios.put(`/vehicle/request-delete-vehicle`, {
                id: vehicleId,
                reason
            });
            console.log("Vehicle delete request sent:", response.data);
            set((prevState) => ({
                vehicles: prevState.vehicles.map((vehicle) =>
                    vehicle._id === vehicleId ? response.data.vehicle : vehicle
                )
            }));
            toast.success(response?.data?.message || "Vehicle delete request sent successfully!");
        } catch (error) {
            console.error("Error sending vehicle delete request:", error);
            toast.error(error.response?.data?.message || "Failed to send vehicle delete request.");
        }
    },

}));